# 📁 Recommended Project Structure

## Current Issues
- Too many test folders in `/app`
- Components not organized by feature
- Utils scattered across project
- No clear separation of concerns

## ✅ New Structure

```
mindcourse/
├── app/                          # Next.js app directory
│   ├── (auth)/                   # Auth-related pages
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── onboarding/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx           # Shared layout with sidebar
│   │   ├── page.tsx             # Main dashboard
│   │   ├── courses/
│   │   │   ├── page.tsx         # Course list
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx     # Course detail
│   │   │   │   ├── quiz/page.tsx
│   │   │   │   ├── notes/page.tsx
│   │   │   │   └── analytics/page.tsx
│   │   ├── generate/
│   │   │   └── page.tsx         # AI generation page
│   │   ├── analytics/
│   │   │   └── page.tsx         # User analytics
│   │   ├── certificates/
│   │   │   └── page.tsx         # Certificates page
│   │   └── settings/
│   │       └── page.tsx
│   ├── api/                      # API routes
│   │   ├── courses/
│   │   │   ├── route.ts         # List courses
│   │   │   ├── [id]/route.ts    # CRUD operations
│   │   │   └── generate/route.ts
│   │   ├── quiz/
│   │   │   ├── submit/route.ts
│   │   │   └── analytics/route.ts
│   │   ├── progress/
│   │   │   ├── route.ts
│   │   │   └── [courseId]/route.ts
│   │   ├── notes/
│   │   │   └── route.ts
│   │   ├── certificates/
│   │   │   ├── generate/route.ts
│   │   │   └── [id]/route.ts
│   │   ├── ai/
│   │   │   ├── tutor/route.ts   # AI chat tutor
│   │   │   └── summary/route.ts
│   │   └── webhooks/
│   │       └── clerk/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
│
├── components/                   # Organized by type
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── DashboardLayout.tsx
│   ├── course/
│   │   ├── CourseCard.tsx
│   │   ├── CourseList.tsx
│   │   ├── CourseDetail.tsx
│   │   ├── CourseProgress.tsx
│   │   ├── ModuleList.tsx
│   │   └── ModuleQuiz.tsx
│   ├── quiz/
│   │   ├── QuizInterface.tsx
│   │   ├── QuizResults.tsx
│   │   ├── QuizAnalytics.tsx
│   │   └── QuizQuestion.tsx
│   ├── notes/
│   │   ├── NoteEditor.tsx
│   │   ├── NoteList.tsx
│   │   └── NoteCard.tsx
│   ├── analytics/
│   │   ├── ProgressChart.tsx
│   │   ├── StatsCard.tsx
│   │   └── LeaderboardCard.tsx
│   ├── certificates/
│   │   ├── CertificatePreview.tsx
│   │   └── CertificateDownload.tsx
│   ├── ai/
│   │   ├── AITutor.tsx
│   │   ├── ChatInterface.tsx
│   │   └── SummaryGenerator.tsx
│   ├── shared/
│   │   ├── LoadingState.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── AnimatedCard.tsx
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       └── ... (other shadcn components)
│
├── features/                     # Feature-based modules
│   ├── course-generation/
│   │   ├── hooks/
│   │   │   ├── useGenerateCourse.ts
│   │   │   └── useCourseForm.ts
│   │   ├── components/
│   │   │   ├── GenerationForm.tsx
│   │   │   └── GenerationProgress.tsx
│   │   ├── utils/
│   │   │   └── courseValidation.ts
│   │   └── types.ts
│   ├── quiz-system/
│   │   ├── hooks/
│   │   │   ├── useQuizState.ts
│   │   │   └── useQuizAnalytics.ts
│   │   ├── components/
│   │   │   └── QuizContainer.tsx
│   │   └── types.ts
│   ├── progress-tracking/
│   │   ├── hooks/
│   │   │   └── useProgress.ts
│   │   ├── services/
│   │   │   └── progressService.ts
│   │   └── types.ts
│   └── gamification/
│       ├── hooks/
│       │   ├── useXP.ts
│       │   └── useAchievements.ts
│       ├── components/
│       │   ├── XPBar.tsx
│       │   ├── AchievementBadge.tsx
│       │   └── Leaderboard.tsx
│       └── types.ts
│
├── hooks/                        # Global custom hooks
│   ├── useTheme.ts
│   ├── useToast.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useMediaQuery.ts
│
├── lib/                          # Core utilities
│   ├── db/
│   │   ├── schema.ts            # Enhanced schema
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── api/
│   │   ├── client.ts            # API client setup
│   │   ├── errorHandling.ts
│   │   └── rateLimiting.ts
│   ├── ai/
│   │   ├── groq.ts              # GROQ client
│   │   ├── prompts.ts           # AI prompts
│   │   └── cache.ts             # AI response caching
│   ├── youtube/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── pdf/
│   │   ├── certificateGenerator.ts
│   │   └── exportUtils.ts
│   ├── utils/
│   │   ├── cn.ts                # className utility
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   └── constants.ts              # App constants
│
├── contexts/                     # React contexts
│   ├── ThemeContext.tsx
│   ├── UserProgressContext.tsx
│   ├── CourseContext.tsx
│   └── NotificationContext.tsx
│
├── types/                        # TypeScript types
│   ├── course.ts
│   ├── quiz.ts
│   ├── user.ts
│   ├── progress.ts
│   └── api.ts
│
├── styles/                       # Global styles
│   ├── globals.css
│   ├── animations.css
│   └── components.css
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── certificates/
│   └── animations/
│
├── config/
│   ├── site.ts                  # Site metadata
│   ├── navigation.ts            # Nav structure
│   └── features.ts              # Feature flags
│
└── middleware.ts                 # Next.js middleware

```

## 🎯 Benefits of New Structure

1. **Feature-Based Organization**: Related code stays together
2. **Clear Separation**: UI, logic, and data layers separated
3. **Scalability**: Easy to add new features
4. **Maintainability**: Easier to find and update code
5. **Type Safety**: Centralized type definitions
6. **Testing**: Easier to test isolated features

## 🚀 Migration Steps

1. Create new folder structure
2. Move existing files to new locations
3. Update import paths
4. Remove test/debug folders
5. Test all routes and components
6. Update documentation
