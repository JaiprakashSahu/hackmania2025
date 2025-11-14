import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { quizAttempts, moduleProgress, users } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function POST(request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      courseId,
      moduleId,
      moduleIndex,
      answers,
      score,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedAnswers = 0,
      timeSpent
    } = body;

    if (!courseId || !moduleId || moduleIndex === undefined || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get attempt number
    const previousAttempts = await db
      .select()
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.userId, user.id),
          eq(quizAttempts.courseId, courseId),
          eq(quizAttempts.moduleId, moduleId)
        )
      )
      .orderBy(desc(quizAttempts.attemptNumber));

    const attemptNumber = previousAttempts.length > 0 
      ? previousAttempts[0].attemptNumber + 1 
      : 1;

    // Save quiz attempt
    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        userId: user.id,
        courseId,
        moduleId,
        moduleIndex,
        score,
        totalQuestions,
        correctAnswers,
        wrongAnswers,
        skippedAnswers,
        timeSpent,
        answers,
        isPassed: score >= 70,
        attemptNumber
      })
      .returning();

    // Update module progress with quiz score
    const [existingProgress] = await db
      .select()
      .from(moduleProgress)
      .where(
        and(
          eq(moduleProgress.userId, user.id),
          eq(moduleProgress.courseId, courseId),
          eq(moduleProgress.moduleId, moduleId)
        )
      )
      .limit(1);

    if (existingProgress) {
      await db
        .update(moduleProgress)
        .set({
          quizScore: score,
          quizAttempts: (existingProgress.quizAttempts || 0) + 1,
          bestQuizScore: Math.max(existingProgress.bestQuizScore || 0, score),
          updatedAt: new Date()
        })
        .where(eq(moduleProgress.id, existingProgress.id));
    }

    return NextResponse.json({
      success: true,
      attempt,
      attemptNumber,
      bestScore: existingProgress 
        ? Math.max(existingProgress.bestQuizScore || 0, score)
        : score
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}

// GET - Fetch quiz attempts
export async function GET(request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const moduleId = searchParams.get('moduleId');

    if (!courseId || !moduleId) {
      return NextResponse.json(
        { error: 'Course ID and Module ID required' },
        { status: 400 }
      );
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all attempts for this module
    const attempts = await db
      .select()
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.userId, user.id),
          eq(quizAttempts.courseId, courseId),
          eq(quizAttempts.moduleId, moduleId)
        )
      )
      .orderBy(desc(quizAttempts.createdAt));

    const bestScore = attempts.length > 0
      ? Math.max(...attempts.map(a => a.score))
      : 0;

    return NextResponse.json({
      attempts,
      totalAttempts: attempts.length,
      bestScore
    });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempts' },
      { status: 500 }
    );
  }
}
