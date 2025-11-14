# 🗄️ Database Schema Enhancements

## Complete Enhanced Schema

```typescript
// lib/db/schema.ts
import { pgTable, text, timestamp, uuid, integer, boolean, jsonb, index, unique } from 'drizzle-orm/pg-core';

// ==================== USERS ====================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  avatar: text('avatar'),
  bio: text('bio'),
  totalXP: integer('total_xp').default(0),
  level: integer('level').default(1),
  rank: text('rank').default('Beginner'),
  preferences: jsonb('preferences').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    clerkIdIdx: index('users_clerk_id_idx').on(table.clerkId),
    emailIdx: index('users_email_idx').on(table.email),
  };
});

// ==================== COURSES ====================
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  course_title: text('course_title'),
  description: text('description'),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  duration: text('duration').notNull(),
  chapterCount: integer('chapter_count').notNull(),
  modules: jsonb('modules').default('[]'),
  include_quiz: boolean('include_quiz').default(false),
  include_videos: boolean('include_videos').default(false),
  topic: text('topic'),
  thumbnail: text('thumbnail'),
  userDescription: text('user_description'),
  isPublic: boolean('is_public').default(false),
  publicSlug: text('public_slug'),
  viewCount: integer('view_count').default(0),
  likeCount: integer('like_count').default(0),
  shareCount: integer('share_count').default(0),
  averageRating: integer('average_rating').default(0), // 0-5 stars * 100
  totalRatings: integer('total_ratings').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  publishedAt: timestamp('published_at'),
}, (table) => {
  return {
    userIdIdx: index('courses_user_id_idx').on(table.userId),
    categoryIdx: index('courses_category_idx').on(table.category),
    difficultyIdx: index('courses_difficulty_idx').on(table.difficulty),
    publicSlugIdx: index('courses_public_slug_idx').on(table.publicSlug),
    publicSlugUniq: unique('courses_public_slug_uniq').on(table.publicSlug),
  };
});

// ==================== CHAPTERS ====================
export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  duration: text('duration').notNull(),
  content: text('content'),
  videoUrls: jsonb('video_urls'),
  videoUrl: text('video_url'),
  quiz: jsonb('quiz'),
  orderIndex: integer('order_index').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    courseIdIdx: index('chapters_course_id_idx').on(table.courseId),
    orderIdx: index('chapters_order_idx').on(table.courseId, table.orderIndex),
  };
});

// ==================== COURSE PROGRESS ====================
export const courseProgress = pgTable('course_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  currentModuleIndex: integer('current_module_index').default(0),
  completedModules: jsonb('completed_modules').default('[]'),
  lastVisitedAt: timestamp('last_visited_at').defaultNow(),
  completionPercentage: integer('completion_percentage').default(0),
  totalTimeSpent: integer('total_time_spent').default(0), // in seconds
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userCourseIdx: index('progress_user_course_idx').on(table.userId, table.courseId),
    userCourseUniq: unique('progress_user_course_uniq').on(table.userId, table.courseId),
  };
});

// ==================== MODULE NOTES ====================
export const moduleNotes = pgTable('module_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  moduleId: text('module_id').notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').default(false),
  tags: jsonb('tags').default('[]'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userCourseModuleIdx: index('notes_user_course_module_idx').on(table.userId, table.courseId, table.moduleId),
  };
});

// ==================== QUIZ ATTEMPTS ====================
export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  moduleId: text('module_id').notNull(),
  score: integer('score').notNull(),
  correctAnswers: integer('correct_answers').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  timeSpent: integer('time_spent'),
  answers: jsonb('answers').notNull(),
  attemptNumber: integer('attempt_number').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userCourseModuleIdx: index('quiz_user_course_module_idx').on(table.userId, table.courseId, table.moduleId),
    createdAtIdx: index('quiz_created_at_idx').on(table.createdAt),
  };
});

// ==================== CERTIFICATES ====================
export const certificates = pgTable('certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  certificateNumber: text('certificate_number').notNull().unique(),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  pdfUrl: text('pdf_url'),
  verificationCode: text('verification_code').notNull().unique(),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('certificates_user_id_idx').on(table.userId),
    courseIdIdx: index('certificates_course_id_idx').on(table.courseId),
    verificationCodeIdx: index('certificates_verification_code_idx').on(table.verificationCode),
  };
});

// ==================== ACHIEVEMENTS ====================
export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  category: text('category').notNull(), // course, quiz, streak, social
  xpReward: integer('xp_reward').default(0),
  rarity: text('rarity').default('common'), // common, rare, epic, legendary
  condition: jsonb('condition').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  achievementId: uuid('achievement_id').references(() => achievements.id).notNull(),
  progress: integer('progress').default(0),
  isUnlocked: boolean('is_unlocked').default(false),
  unlockedAt: timestamp('unlocked_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userAchievementIdx: index('user_achievements_user_achievement_idx').on(table.userId, table.achievementId),
    userAchievementUniq: unique('user_achievements_user_achievement_uniq').on(table.userId, table.achievementId),
  };
});

// ==================== BOOKMARKS ====================
export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  folderId: uuid('folder_id'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userCourseIdx: index('bookmarks_user_course_idx').on(table.userId, table.courseId),
    userCourseUniq: unique('bookmarks_user_course_uniq').on(table.userId, table.courseId),
  };
});

// ==================== COURSE RATINGS ====================
export const courseRatings = pgTable('course_ratings', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  rating: integer('rating').notNull(), // 1-5
  review: text('review'),
  likes: integer('likes').default(0),
  isHelpful: boolean('is_helpful').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userCourseIdx: index('ratings_user_course_idx').on(table.userId, table.courseId),
    userCourseUniq: unique('ratings_user_course_uniq').on(table.userId, table.courseId),
    courseIdIdx: index('ratings_course_id_idx').on(table.courseId),
  };
});

// ==================== ACTIVITY LOG ====================
export const activityLog = pgTable('activity_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  action: text('action').notNull(), // COURSE_CREATED, MODULE_COMPLETED, QUIZ_TAKEN, etc.
  entityType: text('entity_type'), // course, module, quiz
  entityId: text('entity_id'),
  metadata: jsonb('metadata').default('{}'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => {
  return {
    userIdIdx: index('activity_user_id_idx').on(table.userId),
    createdAtIdx: index('activity_created_at_idx').on(table.createdAt),
  };
});

// ==================== DAILY STREAKS ====================
export const dailyStreaks = pgTable('daily_streaks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastActiveDate: timestamp('last_active_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ==================== AI CHAT HISTORY ====================
export const aiChatHistory = pgTable('ai_chat_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  moduleId: text('module_id'),
  messages: jsonb('messages').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => {
  return {
    userCourseIdx: index('chat_user_course_idx').on(table.userId, table.courseId),
  };
});
```

## Migration Scripts

### Create Migration
```bash
npm run drizzle-kit generate:pg
```

### Sample Migration File
```typescript
// drizzle/0003_add_gamification_and_progress.sql
-- Create course_progress table
CREATE TABLE IF NOT EXISTS "course_progress" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "course_id" uuid NOT NULL REFERENCES "courses"("id") ON DELETE CASCADE,
  "current_module_index" integer DEFAULT 0,
  "completed_modules" jsonb DEFAULT '[]',
  "last_visited_at" timestamp DEFAULT now(),
  "completion_percentage" integer DEFAULT 0,
  "total_time_spent" integer DEFAULT 0,
  "started_at" timestamp DEFAULT now(),
  "completed_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "progress_user_course_uniq" UNIQUE("user_id", "course_id")
);

CREATE INDEX "progress_user_course_idx" ON "course_progress" ("user_id", "course_id");

-- Add XP fields to users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "total_xp" integer DEFAULT 0;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "rank" text DEFAULT 'Beginner';

-- Create achievements table
CREATE TABLE IF NOT EXISTS "achievements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "name" text NOT NULL UNIQUE,
  "description" text NOT NULL,
  "icon" text NOT NULL,
  "category" text NOT NULL,
  "xp_reward" integer DEFAULT 0,
  "rarity" text DEFAULT 'common',
  "condition" jsonb NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS "user_achievements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "achievement_id" uuid NOT NULL REFERENCES "achievements"("id"),
  "progress" integer DEFAULT 0,
  "is_unlocked" boolean DEFAULT false,
  "unlocked_at" timestamp,
  "created_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "user_achievements_user_achievement_uniq" UNIQUE("user_id", "achievement_id")
);

CREATE INDEX "user_achievements_user_achievement_idx" ON "user_achievements" ("user_id", "achievement_id");
```

### Seed Initial Data
```typescript
// lib/db/seed.ts
import { db } from './index';
import { achievements } from './schema';

export async function seedAchievements() {
  const achievementsData = [
    {
      name: 'First Steps',
      description: 'Complete your first module',
      icon: '🎯',
      category: 'course',
      xpReward: 50,
      rarity: 'common',
      condition: { type: 'modules_completed', count: 1 },
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 5 courses',
      icon: '📚',
      category: 'course',
      xpReward: 500,
      rarity: 'rare',
      condition: { type: 'courses_completed', count: 5 },
    },
    {
      name: 'Quiz Master',
      description: 'Get 100% on 10 quizzes',
      icon: '🏆',
      category: 'quiz',
      xpReward: 300,
      rarity: 'epic',
      condition: { type: 'perfect_quizzes', count: 10 },
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'streak',
      xpReward: 200,
      rarity: 'rare',
      condition: { type: 'daily_streak', count: 7 },
    },
    {
      name: 'Speedster',
      description: 'Complete a course in under 2 hours',
      icon: '⚡',
      category: 'course',
      xpReward: 250,
      rarity: 'epic',
      condition: { type: 'course_completion_time', maxSeconds: 7200 },
    },
  ];
  
  await db.insert(achievements).values(achievementsData);
  console.log('✅ Seeded achievements');
}
```

## Indexes Strategy

### Performance Considerations
1. **User lookups**: Index on `clerkId`, `email`
2. **Course queries**: Index on `userId`, `category`, `difficulty`
3. **Progress tracking**: Composite index on `userId + courseId`
4. **Quiz analytics**: Index on `createdAt` for time-based queries
5. **Activity feed**: Index on `userId + createdAt`

### Example Query Optimization
```typescript
// Before: Slow query
const courses = await db.select().from(courses).where(eq(courses.userId, userId));

// After: Fast with index
const courses = await db
  .select()
  .from(courses)
  .where(eq(courses.userId, userId))
  .orderBy(desc(courses.createdAt))
  .limit(20);
// Uses: courses_user_id_idx
```

## Backup Strategy
```bash
# Daily backups
pg_dump -h localhost -U postgres -d mindcourse > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U postgres -d mindcourse < backup_20250109.sql
```
