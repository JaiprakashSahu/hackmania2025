import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db, safeQuery } from '@/lib/db';
import { users, courses, fileImports, quizAttempts, activityLog, moduleProgress } from '@/lib/db/schema';
import { eq, sql, and, gte, lt, desc } from 'drizzle-orm';
import { getCached, setCached, CACHE_TTL } from '@/lib/cache/apiCache';

export async function GET(request) {
    return safeQuery(async () => {
        try {
            const { userId } = await auth();

            if (!userId) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }

            // Check cache first (30 second TTL)
            const cached = await getCached('analytics', { userId }, CACHE_TTL.ANALYTICS);
            if (cached) {
                return NextResponse.json({ ...cached, cached: true });
            }

            // Step 1: Get the database user by clerkId
            const dbUser = await db.select()
                .from(users)
                .where(eq(users.clerkId, userId))
                .limit(1);

            if (dbUser.length === 0) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const internalUserId = dbUser[0].id;

            // Step 2: Get all courses for this user
            const userCourses = await db.select()
                .from(courses)
                .where(eq(courses.userId, internalUserId));

            // Calculate core metrics
            const totalCourses = userCourses.length;
            const totalChapters = userCourses.reduce((acc, c) => acc + (c.chapterCount || 0), 0);

            // Calculate total words generated
            let totalWordsGenerated = 0;
            userCourses.forEach(course => {
                if (course.modules && Array.isArray(course.modules)) {
                    course.modules.forEach(mod => {
                        if (mod.content) {
                            const contentStr = typeof mod.content === 'string'
                                ? mod.content
                                : JSON.stringify(mod.content);
                            totalWordsGenerated += contentStr.split(/\s+/).length;
                        }
                        if (mod.objectives && Array.isArray(mod.objectives)) {
                            mod.objectives.forEach(obj => {
                                totalWordsGenerated += String(obj).split(/\s+/).length;
                            });
                        }
                    });
                }
                if (course.description) {
                    totalWordsGenerated += course.description.split(/\s+/).length;
                }
            });

            // Category distribution
            const categoryStats = {};
            userCourses.forEach(course => {
                const cat = course.category || 'General';
                categoryStats[cat] = (categoryStats[cat] || 0) + 1;
            });

            const totalForPercent = Math.max(totalCourses, 1);
            const categoryDistribution = Object.entries(categoryStats).map(([name, count], i) => ({
                name,
                count,
                percentage: Math.round((count / totalForPercent) * 100),
                color: ['#FF9D5C', '#836FFF', '#FF7AD9', '#5CE7D6', '#4ADE80'][i % 5],
            }));

            // Get file imports count
            let fileImportsCount = 0;
            try {
                const imports = await db.select({ count: sql`count(*)` })
                    .from(fileImports)
                    .where(eq(fileImports.userId, userId));
                fileImportsCount = parseInt(imports[0]?.count || '0');
            } catch (e) {
                console.log('File imports query error:', e.message);
            }

            // Get quiz attempts count and average score
            let quizAttemptsCount = 0;
            let averageQuizScore = 0;
            try {
                const attempts = await db.select({
                    count: sql`count(*)`,
                    avgScore: sql`COALESCE(AVG(score), 0)`
                })
                    .from(quizAttempts)
                    .where(eq(quizAttempts.userId, internalUserId));
                quizAttemptsCount = parseInt(attempts[0]?.count || '0');
                averageQuizScore = Math.round(parseFloat(attempts[0]?.avgScore || '0'));
            } catch (e) {
                console.log('Quiz attempts query error:', e.message);
            }

            // Calculate completion rate
            let overallCompletionRate = 0;
            let totalModulesCount = 0;
            let completedModulesCount = 0;
            try {
                userCourses.forEach(course => {
                    if (course.modules && Array.isArray(course.modules)) {
                        totalModulesCount += course.modules.length;
                    }
                });

                const completedProgress = await db.select({ count: sql`count(*)` })
                    .from(moduleProgress)
                    .where(and(
                        eq(moduleProgress.userId, internalUserId),
                        eq(moduleProgress.isCompleted, true)
                    ));
                completedModulesCount = parseInt(completedProgress[0]?.count || '0');

                if (totalModulesCount > 0) {
                    overallCompletionRate = Math.round((completedModulesCount / totalModulesCount) * 100);
                }
            } catch (e) {
                console.log('Completion rate query error:', e.message);
            }

            // Week-over-week activity growth
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

            let weeklyGrowth = 0;
            let thisWeekActivity = 0;
            let lastWeekActivity = 0;
            try {
                const thisWeekResult = await db.select({ count: sql`count(*)` })
                    .from(activityLog)
                    .where(and(
                        eq(activityLog.userId, userId),
                        gte(activityLog.createdAt, oneWeekAgo)
                    ));
                thisWeekActivity = parseInt(thisWeekResult[0]?.count || '0');

                const lastWeekResult = await db.select({ count: sql`count(*)` })
                    .from(activityLog)
                    .where(and(
                        eq(activityLog.userId, userId),
                        gte(activityLog.createdAt, twoWeeksAgo),
                        lt(activityLog.createdAt, oneWeekAgo)
                    ));
                lastWeekActivity = parseInt(lastWeekResult[0]?.count || '0');

                weeklyGrowth = thisWeekActivity - lastWeekActivity;
            } catch (e) {
                console.log('Weekly growth query error:', e.message);
                const thisWeekCourses = userCourses.filter(c => new Date(c.createdAt) >= oneWeekAgo).length;
                const lastWeekCourses = userCourses.filter(c =>
                    new Date(c.createdAt) >= twoWeeksAgo && new Date(c.createdAt) < oneWeekAgo
                ).length;
                weeklyGrowth = thisWeekCourses - lastWeekCourses;
            }

            // Most viewed course
            let mostViewedCourse = null;
            try {
                const viewCounts = await db.select({
                    courseId: sql`meta->>'courseId'`,
                    views: sql`count(*)`
                })
                    .from(activityLog)
                    .where(and(
                        eq(activityLog.userId, userId),
                        eq(activityLog.type, 'COURSE_VIEW')
                    ))
                    .groupBy(sql`meta->>'courseId'`)
                    .orderBy(desc(sql`count(*)`))
                    .limit(1);

                if (viewCounts.length > 0 && viewCounts[0].courseId) {
                    const viewedCourse = userCourses.find(c => c.id === viewCounts[0].courseId);
                    if (viewedCourse) {
                        const courseModulesCount = viewedCourse.modules?.length || 0;
                        const courseCompletedResult = await db.select({ count: sql`count(*)` })
                            .from(moduleProgress)
                            .where(and(
                                eq(moduleProgress.userId, internalUserId),
                                eq(moduleProgress.courseId, viewedCourse.id),
                                eq(moduleProgress.isCompleted, true)
                            ));
                        const courseCompleted = parseInt(courseCompletedResult[0]?.count || '0');

                        mostViewedCourse = {
                            id: viewedCourse.id,
                            title: viewedCourse.title,
                            views: parseInt(viewCounts[0].views || '0'),
                            completion: courseModulesCount > 0 ? Math.round((courseCompleted / courseModulesCount) * 100) : 0,
                        };
                    }
                }

                if (!mostViewedCourse && userCourses.length > 0) {
                    const recentCourse = userCourses[0];
                    mostViewedCourse = {
                        id: recentCourse.id,
                        title: recentCourse.title,
                        views: 0,
                        completion: 0,
                    };
                }
            } catch (e) {
                console.log('Most viewed course query error:', e.message);
                if (userCourses.length > 0) {
                    mostViewedCourse = {
                        id: userCourses[0].id,
                        title: userCourses[0].title,
                        views: 0,
                        completion: 0,
                    };
                }
            }

            // Most active category
            const sortedCategories = Object.entries(categoryStats).sort((a, b) => b[1] - a[1]);
            let mostActiveCategory = null;
            if (sortedCategories.length > 0) {
                const categoryName = sortedCategories[0][0];
                const categoryCourseCount = sortedCategories[0][1];
                let categoryEngagement = Math.round((categoryCourseCount / totalCourses) * 100);

                mostActiveCategory = {
                    name: categoryName,
                    courseCount: categoryCourseCount,
                    engagement: categoryEngagement,
                };
            }

            // Trending topic
            let trendingTopic = null;
            if (sortedCategories.length > 0) {
                const categoryName = sortedCategories[0][0];
                const thisWeekCategoryCourses = userCourses.filter(c =>
                    (c.category || 'General') === categoryName &&
                    new Date(c.createdAt) >= oneWeekAgo
                ).length;
                const lastWeekCategoryCourses = userCourses.filter(c =>
                    (c.category || 'General') === categoryName &&
                    new Date(c.createdAt) >= twoWeeksAgo &&
                    new Date(c.createdAt) < oneWeekAgo
                ).length;

                let growthPercent = 0;
                if (lastWeekCategoryCourses > 0) {
                    growthPercent = Math.round(((thisWeekCategoryCourses - lastWeekCategoryCourses) / lastWeekCategoryCourses) * 100);
                } else if (thisWeekCategoryCourses > 0) {
                    growthPercent = 100;
                }

                trendingTopic = {
                    name: categoryName,
                    growth: `${growthPercent >= 0 ? '+' : ''}${growthPercent}%`,
                };
            }

            // Recent activity
            let recentActivity = [];
            try {
                const activities = await db.select()
                    .from(activityLog)
                    .where(eq(activityLog.userId, userId))
                    .orderBy(desc(activityLog.createdAt))
                    .limit(10);
                recentActivity = activities;
            } catch (e) {
                console.log('Recent activity query error:', e.message);
            }

            const response = {
                totalCourses,
                totalChapters,
                totalWordsGenerated,
                fileImportsCount,
                quizAttemptsCount,
                averageQuizScore,
                overallCompletionRate,
                totalModulesCount,
                completedModulesCount,
                weeklyGrowth,
                thisWeekActivity,
                lastWeekActivity,
                categoryDistribution,
                mostViewedCourse,
                mostActiveCategory,
                trendingTopic,
                recentActivity,
                recentCourses: userCourses.slice(0, 5),
                lastUpdated: new Date().toISOString(),
                dataSource: ['activity_log', 'module_progress', 'quiz_attempts', 'courses'],
            };

            await setCached('analytics', { userId }, response);
            return NextResponse.json(response);

        } catch (error) {
            console.error('Analytics overview error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch analytics', details: error.message },
                { status: 500 }
            );
        }
    }); // End safeQuery
}
