# 🚀 Step-by-Step Implementation Guide

## Week 1-2: Foundation & Architecture

### Day 1-2: Project Restructuring

**Tasks:**
1. Create new folder structure
2. Move existing files
3. Update import paths
4. Clean up test folders

**Steps:**
```bash
# 1. Create new directories
mkdir -p features/{course-generation,quiz-system,progress-tracking,gamification}
mkdir -p hooks
mkdir -p types
mkdir -p lib/{api,ai,pdf,utils}
mkdir -p config
mkdir -p docs

# 2. Move components to new structure
# Move course-related components
mv components/CourseCard.tsx components/course/
mv components/ModuleQuiz.tsx components/quiz/

# 3. Delete test folders
rm -rf app/test-*
rm -rf app/debug-*
rm -rf app/examples

# 4. Run tests
npm run build
npm run dev
```

**Checklist:**
- [ ] New folder structure created
- [ ] All imports updated
- [ ] Build passes without errors
- [ ] All routes still work
- [ ] Test folders removed

### Day 3-4: Database Schema Migration

**Tasks:**
1. Update schema with new tables
2. Create migration files
3. Seed initial data
4. Test queries

**Implementation:**
```typescript
// 1. Update lib/db/schema.ts with enhanced schema
// (Use content from DATABASE_ENHANCEMENTS.md)

// 2. Generate migration
npm run drizzle-kit generate:pg

// 3. Run migration
npm run drizzle-kit push:pg

// 4. Seed data
node -e "require('./lib/db/seed').seedAchievements()"
```

**Verification:**
```sql
-- Check tables created
\dt

-- Verify indexes
\di

-- Test query
SELECT * FROM users LIMIT 1;
SELECT * FROM achievements;
```

### Day 5-7: Core API Routes

**Tasks:**
1. Create progress tracking API
2. Create notes API
3. Create quiz analytics API
4. Add error handling

**Example Implementation:**

```typescript
// app/api/progress/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { courseProgress } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 });
    }
    
    const progress = await db
      .select()
      .from(courseProgress)
      .where(and(
        eq(courseProgress.userId, userId),
        eq(courseProgress.courseId, courseId)
      ))
      .limit(1);
    
    return NextResponse.json({ 
      success: true,
      progress: progress[0] || null 
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { courseId, moduleIndex, completed } = body;
    
    // Validation
    if (!courseId || moduleIndex === undefined) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }
    
    // Update or create progress
    const existing = await db
      .select()
      .from(courseProgress)
      .where(and(
        eq(courseProgress.userId, userId),
        eq(courseProgress.courseId, courseId)
      ))
      .limit(1);
    
    if (existing.length > 0) {
      // Update logic here
      const completedModules = existing[0].completedModules as number[];
      if (completed && !completedModules.includes(moduleIndex)) {
        completedModules.push(moduleIndex);
      }
      
      await db
        .update(courseProgress)
        .set({
          currentModuleIndex: moduleIndex,
          completedModules: JSON.stringify(completedModules),
          lastVisitedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(courseProgress.id, existing[0].id));
    } else {
      // Create new
      await db.insert(courseProgress).values({
        userId,
        courseId,
        currentModuleIndex: moduleIndex,
        completedModules: completed ? JSON.stringify([moduleIndex]) : '[]',
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
```

**Testing:**
```bash
# Test with curl
curl -X GET "http://localhost:3000/api/progress?courseId=abc123" \
  -H "Authorization: Bearer YOUR_TOKEN"

curl -X POST "http://localhost:3000/api/progress" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"courseId": "abc123", "moduleIndex": 0, "completed": true}'
```

## Week 2-3: Core Features

### Day 8-10: Progress Tracking UI

**Tasks:**
1. Create progress hooks
2. Build progress components
3. Integrate with course pages

**Implementation:**

```typescript
// hooks/useProgress.ts
import { useState, useEffect } from 'react';

export function useProgress(courseId: string) {
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!courseId) return;
    
    fetch(`/api/progress?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        setProgress(data.progress);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching progress:', err);
        setIsLoading(false);
      });
  }, [courseId]);
  
  const updateProgress = async (moduleIndex: number, completed: boolean) => {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, moduleIndex, completed }),
    });
    
    if (response.ok) {
      // Refresh progress
      const data = await fetch(`/api/progress?courseId=${courseId}`)
        .then(res => res.json());
      setProgress(data.progress);
    }
  };
  
  return { progress, isLoading, updateProgress };
}
```

```typescript
// components/course/CourseProgress.tsx
import { useProgress } from '@/hooks/useProgress';
import { motion } from 'framer-motion';

export function CourseProgress({ courseId, totalModules }) {
  const { progress, isLoading } = useProgress(courseId);
  
  if (isLoading) return <SkeletonLoader />;
  if (!progress) return null;
  
  const percentage = progress.completionPercentage || 0;
  
  return (
    <div className="space-y-3 p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border border-purple-500/20">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Your Progress</h3>
        <span className="text-2xl font-bold text-white">{percentage}%</span>
      </div>
      
      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-white/70">
        <span>{progress.completedModules?.length || 0}/{totalModules} modules</span>
        <span>
          {progress.completedAt 
            ? `Completed ${formatDate(progress.completedAt)}`
            : 'In progress'}
        </span>
      </div>
    </div>
  );
}
```

### Day 11-14: Notes System

**Implementation:**

```typescript
// app/api/notes/route.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { moduleNotes } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const moduleId = searchParams.get('moduleId');
    
    const query = db.select().from(moduleNotes).where(eq(moduleNotes.userId, userId));
    
    if (courseId) {
      query.where(eq(moduleNotes.courseId, courseId));
    }
    if (moduleId) {
      query.where(eq(moduleNotes.moduleId, moduleId));
    }
    
    const notes = await query;
    
    return NextResponse.json({ success: true, notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { courseId, moduleId, content, isPinned, noteId } = await request.json();
    
    if (!courseId || !moduleId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    if (noteId) {
      // Update existing note
      await db
        .update(moduleNotes)
        .set({ content, isPinned, updatedAt: new Date() })
        .where(and(
          eq(moduleNotes.id, noteId),
          eq(moduleNotes.userId, userId)
        ));
    } else {
      // Create new note
      await db.insert(moduleNotes).values({
        userId,
        courseId,
        moduleId,
        content,
        isPinned: isPinned || false,
      });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

## Week 3-4: UX Enhancements

### Day 15-17: Loading States & Animations

**Tasks:**
1. Create skeleton loaders
2. Add page transitions
3. Implement shimmer effects

**Implementation:**

```typescript
// components/shared/SkeletonLoader.tsx
export function CourseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-800"></div>
      <div className="p-6 bg-gray-800 space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-gray-700 rounded w-24"></div>
          <div className="h-8 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="h-32 bg-gray-800 rounded-2xl animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-gray-800 rounded-xl animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
```

### Day 18-21: Dark Mode & Responsiveness

**Implementation:**

```typescript
// app/layout.tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

```typescript
// components/ThemeToggle.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-500" />
      )}
    </button>
  );
}
```

## Week 4-5: Advanced Features

### Day 22-25: Certificate Generation

See FEATURE_SPECS.md for full implementation

**Quick Start:**
```bash
npm install pdfkit
mkdir public/certificates
```

### Day 26-28: Gamification

See FEATURE_SPECS.md for full implementation

**Quick Start:**
```typescript
// Seed achievements
node -e "require('./lib/db/seed').seedAchievements()"

// Test XP award
import { awardXP } from '@/lib/gamification/xpSystem';
await awardXP(userId, 'COMPLETE_MODULE');
```

### Day 29-31: AI Tutor

See FEATURE_SPECS.md for full implementation

**Environment Setup:**
```env
GROQ_API_KEY=your_groq_api_key
```

## Week 5-6: Polish & Production

### Day 32-35: Performance Optimization

**Tasks:**
1. Add React.lazy for code splitting
2. Optimize images
3. Add caching headers
4. Implement ISR

**Implementation:**

```typescript
// app/(dashboard)/courses/[id]/page.tsx
import dynamic from 'next/dynamic';

const AITutor = dynamic(() => import('@/components/ai/AITutor'), {
  loading: () => <SkeletonLoader />,
  ssr: false
});

const CertificatePreview = dynamic(() => import('@/components/certificates/CertificatePreview'), {
  loading: () => <SkeletonLoader />
});
```

```typescript
// next.config.mjs
export default {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### Day 36-38: Testing & QA

**Setup:**
```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

**Example Test:**
```typescript
// __tests__/components/CourseCard.test.tsx
import { render, screen } from '@testing-library/react';
import CourseCard from '@/components/course/CourseCard';

describe('CourseCard', () => {
  it('renders course title', () => {
    render(<CourseCard course={{ title: 'Test Course' }} />);
    expect(screen.getByText('Test Course')).toBeInTheDocument();
  });
});
```

### Day 39-42: Production Deploy

**Checklist:**
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] API rate limits configured
- [ ] Error tracking (Sentry) setup
- [ ] Analytics (Vercel/Plausible) setup
- [ ] SSL certificates configured
- [ ] Custom domain connected

**Deploy:**
```bash
# Build check
npm run build

# Deploy to Vercel
vercel --prod
```

## Post-Launch

### Monitoring
- Set up error tracking
- Monitor API usage
- Track user metrics
- Review performance

### Iteration
- Gather user feedback
- Fix bugs
- Add requested features
- Optimize based on analytics
