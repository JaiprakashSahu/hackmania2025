# 🎯 Feature Specifications

## 1. Course Progress Tracking

### Database Schema Addition
```typescript
// lib/db/schema.ts
export const courseProgress = pgTable('course_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  currentModuleIndex: integer('current_module_index').default(0),
  completedModules: jsonb('completed_modules').default('[]'), // Array of module IDs
  lastVisitedAt: timestamp('last_visited_at').defaultNow(),
  completionPercentage: integer('completion_percentage').default(0),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### API Endpoints
```typescript
// app/api/progress/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get('courseId');
  const { userId } = getAuth(request);
  
  const progress = await db
    .select()
    .from(courseProgress)
    .where(and(
      eq(courseProgress.userId, userId),
      eq(courseProgress.courseId, courseId)
    ))
    .limit(1);
  
  return NextResponse.json({ progress: progress[0] || null });
}

export async function POST(request: Request) {
  const { userId } = getAuth(request);
  const { courseId, moduleIndex, completed } = await request.json();
  
  // Update or create progress
  const existing = await db.select().from(courseProgress)
    .where(and(
      eq(courseProgress.userId, userId),
      eq(courseProgress.courseId, courseId)
    )).limit(1);
  
  if (existing.length > 0) {
    // Update existing
    const completedModules = existing[0].completedModules as number[];
    if (completed && !completedModules.includes(moduleIndex)) {
      completedModules.push(moduleIndex);
    }
    
    const totalModules = await getTotalModules(courseId);
    const percentage = Math.round((completedModules.length / totalModules) * 100);
    
    await db.update(courseProgress)
      .set({
        currentModuleIndex: moduleIndex,
        completedModules: JSON.stringify(completedModules),
        completionPercentage: percentage,
        lastVisitedAt: new Date(),
        completedAt: percentage === 100 ? new Date() : null,
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
      completionPercentage: completed ? Math.round((1 / totalModules) * 100) : 0,
    });
  }
  
  return NextResponse.json({ success: true });
}
```

---

## 2. User Notes System

### Database Schema
```typescript
export const moduleNotes = pgTable('module_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  moduleId: text('module_id').notNull(),
  content: text('content').notNull(),
  isPinned: boolean('is_pinned').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

### Component Implementation
```typescript
// components/notes/NoteEditor.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Save, Pin } from 'lucide-react';

export function NoteEditor({ courseId, moduleId, initialNote = null }) {
  const [content, setContent] = useState(initialNote?.content || '');
  const [isPinned, setIsPinned] = useState(initialNote?.isPinned || false);
  const [isSaving, setIsSaving] = useState(false);
  
  const saveNote = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          moduleId,
          content,
          isPinned,
          noteId: initialNote?.id,
        }),
      });
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Your Notes</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPinned(!isPinned)}
          className={isPinned ? 'text-yellow-500' : 'text-gray-400'}
        >
          <Pin className="w-4 h-4" />
        </Button>
      </div>
      
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your notes here..."
        className="min-h-[200px] bg-black/20 border-white/10 text-white"
      />
      
      <Button onClick={saveNote} disabled={isSaving || !content.trim()}>
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Note'}
      </Button>
    </div>
  );
}
```

---

## 3. Quiz Analytics Dashboard

### Enhanced Quiz Schema
```typescript
export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  moduleId: text('module_id').notNull(),
  score: integer('score').notNull(), // Percentage 0-100
  correctAnswers: integer('correct_answers').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  timeSpent: integer('time_spent'), // Seconds
  answers: jsonb('answers').notNull(), // Array of { questionId, userAnswer, correct }
  attemptNumber: integer('attempt_number').default(1),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### Analytics Component
```typescript
// components/analytics/QuizAnalytics.tsx
import { Line, Bar } from 'react-chartjs-2';

export function QuizAnalytics({ courseId, userId }) {
  const [analytics, setAnalytics] = useState(null);
  
  useEffect(() => {
    fetch(`/api/quiz/analytics?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, [courseId]);
  
  if (!analytics) return <SkeletonLoader />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Overall Stats */}
      <StatsCard
        title="Average Score"
        value={`${analytics.averageScore}%`}
        icon={<Trophy />}
        trend={analytics.scoreTrend}
      />
      
      <StatsCard
        title="Total Attempts"
        value={analytics.totalAttempts}
        icon={<Target />}
      />
      
      <StatsCard
        title="Time Spent"
        value={formatTime(analytics.totalTimeSpent)}
        icon={<Clock />}
      />
      
      <StatsCard
        title="Improvement Rate"
        value={`+${analytics.improvement}%`}
        icon={<TrendingUp />}
      />
      
      {/* Score Progress Chart */}
      <Card className="col-span-2 p-6">
        <h3 className="text-lg font-semibold mb-4">Score Over Time</h3>
        <Line
          data={{
            labels: analytics.attempts.map(a => formatDate(a.date)),
            datasets: [{
              label: 'Score',
              data: analytics.attempts.map(a => a.score),
              borderColor: 'rgb(59, 130, 246)',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { min: 0, max: 100 }
            }
          }}
        />
      </Card>
      
      {/* Question Difficulty Distribution */}
      <Card className="col-span-2 p-6">
        <h3 className="text-lg font-semibold mb-4">Performance by Topic</h3>
        <Bar
          data={{
            labels: analytics.topics.map(t => t.name),
            datasets: [{
              label: 'Accuracy %',
              data: analytics.topics.map(t => t.accuracy),
              backgroundColor: analytics.topics.map(t => 
                t.accuracy >= 80 ? 'rgb(34, 197, 94)' :
                t.accuracy >= 60 ? 'rgb(234, 179, 8)' :
                'rgb(239, 68, 68)'
              ),
            }]
          }}
        />
      </Card>
    </div>
  );
}
```

---

## 4. Certificate Generation

### Certificate Schema
```typescript
export const certificates = pgTable('certificates', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }).notNull(),
  certificateNumber: text('certificate_number').notNull().unique(),
  issuedAt: timestamp('issued_at').defaultNow().notNull(),
  pdfUrl: text('pdf_url'),
  verificationCode: text('verification_code').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

### PDF Generation
```typescript
// lib/pdf/certificateGenerator.ts
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

export async function generateCertificate({
  userName,
  courseName,
  completionDate,
  certificateNumber,
}) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });
    
    const filename = `certificate-${certificateNumber}.pdf`;
    const stream = createWriteStream(`public/certificates/${filename}`);
    
    doc.pipe(stream);
    
    // Background gradient (simulated with rectangles)
    doc.rect(0, 0, 842, 595).fillColor('#f0f9ff').fill();
    
    // Border
    doc.rect(30, 30, 782, 535)
      .lineWidth(3)
      .strokeColor('#3b82f6')
      .stroke();
    
    // Certificate title
    doc.fontSize(48)
      .fillColor('#1e3a8a')
      .font('Helvetica-Bold')
      .text('Certificate of Completion', 0, 100, { align: 'center' });
    
    // Presented to
    doc.fontSize(18)
      .fillColor('#64748b')
      .font('Helvetica')
      .text('This certificate is proudly presented to', 0, 200, { align: 'center' });
    
    // User name
    doc.fontSize(36)
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .text(userName, 0, 250, { align: 'center' });
    
    // Course completion text
    doc.fontSize(16)
      .fillColor('#64748b')
      .font('Helvetica')
      .text('for successfully completing the course', 0, 320, { align: 'center' });
    
    // Course name
    doc.fontSize(24)
      .fillColor('#3b82f6')
      .font('Helvetica-Bold')
      .text(courseName, 0, 360, { align: 'center' });
    
    // Date and certificate number
    doc.fontSize(12)
      .fillColor('#94a3b8')
      .font('Helvetica')
      .text(`Date: ${completionDate}`, 60, 480)
      .text(`Certificate #: ${certificateNumber}`, 0, 480, { align: 'right', width: 782 });
    
    doc.end();
    
    stream.on('finish', () => {
      resolve(`/certificates/${filename}`);
    });
    
    stream.on('error', reject);
  });
}
```

### Auto-generation Trigger
```typescript
// app/api/progress/route.ts (add to existing)
if (percentage === 100) {
  // Generate certificate
  const certificateNumber = `CERT-${Date.now()}-${userId.slice(0, 8)}`;
  const verificationCode = generateVerificationCode();
  
  const pdfUrl = await generateCertificate({
    userName: user.firstName + ' ' + user.lastName,
    courseName: course.title,
    completionDate: new Date().toLocaleDateString(),
    certificateNumber,
  });
  
  await db.insert(certificates).values({
    userId,
    courseId,
    certificateNumber,
    verificationCode,
    pdfUrl,
  });
  
  // Send email notification
  await sendCertificateEmail(user.email, pdfUrl);
}
```

---

## 5. Gamification System

### XP & Levels Schema
```typescript
export const userXP = pgTable('user_xp', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  totalXP: integer('total_xp').default(0),
  level: integer('level').default(1),
  rank: text('rank').default('Beginner'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const achievements = pgTable('achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon').notNull(),
  xpReward: integer('xp_reward').default(0),
  condition: jsonb('condition').notNull(), // { type: 'complete_course', count: 5 }
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userAchievements = pgTable('user_achievements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  achievementId: uuid('achievement_id').references(() => achievements.id).notNull(),
  unlockedAt: timestamp('unlocked_at').defaultNow().notNull(),
});
```

### XP System Logic
```typescript
// lib/gamification/xpSystem.ts
const XP_REWARDS = {
  COMPLETE_MODULE: 50,
  COMPLETE_COURSE: 500,
  PERFECT_QUIZ: 100,
  PASS_QUIZ: 50,
  CREATE_COURSE: 100,
  DAILY_STREAK: 25,
};

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, rank: 'Beginner' },
  { level: 2, xp: 100, rank: 'Learner' },
  { level: 3, xp: 300, rank: 'Student' },
  { level: 4, xp: 600, rank: 'Scholar' },
  { level: 5, xp: 1000, rank: 'Expert' },
  { level: 6, xp: 1500, rank: 'Master' },
  { level: 7, xp: 2500, rank: 'Guru' },
  { level: 8, xp: 4000, rank: 'Legend' },
];

export async function awardXP(userId: string, action: string, amount?: number) {
  const xpToAdd = amount || XP_REWARDS[action] || 0;
  
  const [userXPData] = await db.select().from(userXP).where(eq(userXP.userId, userId));
  
  if (!userXPData) {
    await db.insert(userXP).values({ userId, totalXP: xpToAdd });
    return { xpAdded: xpToAdd, levelUp: false };
  }
  
  const newTotalXP = userXPData.totalXP + xpToAdd;
  const newLevel = LEVEL_THRESHOLDS.findLast(t => t.xp <= newTotalXP);
  const levelUp = newLevel.level > userXPData.level;
  
  await db.update(userXP)
    .set({
      totalXP: newTotalXP,
      level: newLevel.level,
      rank: newLevel.rank,
      updatedAt: new Date(),
    })
    .where(eq(userXP.id, userXPData.id));
  
  return { xpAdded: xpToAdd, levelUp, newLevel: newLevel.level };
}
```

---

## 6. AI Tutor Chat

### Chat Interface
```typescript
// components/ai/AITutor.tsx
import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

export function AITutor({ courseId, moduleId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          moduleId,
          message: input,
          history: messages,
        }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-6 h-[600px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
        <Bot className="w-6 h-6 text-purple-400" />
        <h3 className="font-semibold text-lg text-white">AI Tutor</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && <Bot className="w-6 h-6 text-purple-400 flex-shrink-0" />}
            <div
              className={`rounded-xl p-4 max-w-[80%] ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && <User className="w-6 h-6 text-blue-400 flex-shrink-0" />}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <Bot className="w-6 h-6 text-purple-400" />
            <div className="bg-white/10 rounded-xl p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask a question about this module..."
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/50"
        />
        <Button onClick={sendMessage} disabled={isLoading || !input.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
```

This covers the major feature specifications. Each feature includes database schema, API implementation, and React components with full TypeScript support.
