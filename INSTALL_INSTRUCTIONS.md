# 🚀 Quick Installation Instructions

Follow these steps to install and configure all 5 improvements.

---

## Step 1: Install Dependencies

```bash
npm install youtube-transcript cheerio pdf-parse formidable googleapis
```

---

## Step 2: Set Up Environment Variables

Add to your `.env.local` file:

```env
# GROQ API (AI Generation)
GROQ_API_KEY=your_groq_api_key_here

# YouTube Data API v3 (Video Curation)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Your existing variables
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

---

## Step 3: Get API Keys

### GROQ API Key
1. Visit: https://console.groq.com
2. Sign up or log in
3. Create a new API key
4. Copy and paste into `.env.local`

### YouTube Data API Key
1. Visit: https://console.cloud.google.com
2. Create a new project or select existing
3. Go to "APIs & Services" → "Library"
4. Search for "YouTube Data API v3"
5. Click "Enable"
6. Go to "Credentials" → "Create Credentials" → "API Key"
7. Copy and paste into `.env.local`

---

## Step 4: Update Database Schema

Run this migration (using Drizzle or raw SQL):

```sql
-- Add new columns to courses table
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) DEFAULT 'intermediate',
ADD COLUMN IF NOT EXISTS persona VARCHAR(20),
ADD COLUMN IF NOT EXISTS source_type VARCHAR(20) DEFAULT 'topic',
ADD COLUMN IF NOT EXISTS source_metadata JSONB,
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft';

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_module_id ON quizzes(module_id);
```

Or update your Drizzle schema file (`lib/db/schema.js`):

```javascript
import { pgTable, serial, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  topic: text('topic').notNull(),
  difficulty: text('difficulty').default('intermediate'),
  persona: text('persona'),
  sourceType: text('source_type').default('topic'),
  sourceMetadata: jsonb('source_metadata'),
  status: text('status').default('draft'),
  // ... your existing fields
});

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').references(() => modules.id, { onDelete: 'cascade' }),
  questions: jsonb('questions').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
```

Then run:

```bash
npm run db:push
# or
npx drizzle-kit push:pg
```

---

## Step 5: Install Missing UI Components

If you don't have these shadcn components:

```bash
# Radio Group (for quiz)
npx shadcn-ui@latest add radio-group

# Label
npx shadcn-ui@latest add label
```

---

## Step 6: Verify File Structure

Make sure these files exist:

```
✅ app/api/generate/from-source/route.js
✅ app/api/generate/chain/route.js
✅ components/forms/DifficultySelector.jsx
✅ components/quiz/Quiz.jsx
✅ lib/prompts/difficulty-prompts.js
✅ lib/services/video-curation.js
```

---

## Step 7: Test Each Feature

### Test 1: Source Ingestion

```bash
# Test with curl or Postman
curl -X POST http://localhost:3000/api/generate/from-source \
  -H "Content-Type: application/json" \
  -d '{"youtubeUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
```

Expected: JSON with `extractedText` field

### Test 2: Chain Generation

```bash
curl -X POST http://localhost:3000/api/generate/chain \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "topic": "Introduction to React",
    "difficulty": "beginner",
    "includeQuiz": true
  }'
```

Expected: JSON with `courseId` and success message

### Test 3: Video Curation (Backend Test)

Create a test file `test-video.js`:

```javascript
import { findBestVideo } from './lib/services/video-curation.js';

const testContent = "React Hooks allow you to use state in functional components. The useState hook is the most common.";
const testTitle = "Introduction to React Hooks";

findBestVideo(testContent, testTitle)
  .then(video => console.log('✅ Video found:', video))
  .catch(err => console.error('❌ Error:', err));
```

Run: `node test-video.js`

---

## Step 8: Integrate into Your UI

### Update Create Course Page

In `app/create-course/page.js`:

```javascript
// Add imports
import DifficultySelector from '@/components/forms/DifficultySelector';

// Add state
const [difficulty, setDifficulty] = useState('intermediate');
const [persona, setPersona] = useState(null);

// Add in your form (Step 2 or 3)
<DifficultySelector
  difficulty={difficulty}
  onDifficultyChange={setDifficulty}
  persona={persona}
  onPersonaChange={setPersona}
/>

// Update generate function to use new chain route
const response = await fetch('/api/generate/chain', {
  method: 'POST',
  body: JSON.stringify({
    topic: courseData.topic,
    difficulty,
    persona,
    includeQuiz: true,
    includeVideos: true
  })
});
```

### Update Course Viewer Page

In `app/course/[id]/page.js`:

```javascript
// Add import
import Quiz from '@/components/quiz/Quiz';

// Fetch quiz data with module
const moduleWithQuiz = await db
  .select()
  .from(modules)
  .leftJoin(quizzes, eq(modules.id, quizzes.moduleId))
  .where(eq(modules.id, moduleId));

// Render quiz after content
{module.quiz?.questions && (
  <Quiz 
    questions={module.quiz.questions}
    moduleTitle={module.title}
  />
)}
```

---

## Step 9: Run and Test

```bash
npm run dev
```

Visit: http://localhost:3000

1. Go to "Create Course"
2. Select difficulty level
3. Choose a persona (optional)
4. Enter a topic
5. Click "Generate"
6. Wait for generation (60-90 seconds)
7. View the generated course
8. Complete a quiz
9. Watch embedded videos

---

## Step 10: Monitor Console Logs

Watch your terminal for:

```
🚀 Starting Chain-of-Thought generation for: [topic]
📋 Step 1: Generating course outline...
✅ Outline generated: [title] with [N] modules
💾 Step 2: Creating database records...
✅ Course created with ID: [id]
🎨 Step 3: Generating module content and quizzes in parallel...
  📝 Generating content for module 1: [title]
  ✅ Module 1 completed with quiz (4 questions)
🎥 Finding best video for: [module title]
  📝 Step 1: Generating search queries...
  🔍 Step 2: Searching YouTube...
  ✅ Selected video: [title]
🎉 Course generation complete!
```

---

## 🎉 You're Done!

All 5 improvements are now installed and ready to use.

---

## 🐛 Troubleshooting

### Error: "GROQ_API_KEY is not defined"
**Fix**: Check your `.env.local` file and restart the dev server

### Error: "youtube-transcript not found"
**Fix**: Run `npm install youtube-transcript`

### Error: "Failed to extract YouTube transcript"
**Fix**: Some videos don't have transcripts. Try a different video or add fallback

### Error: "YouTube API quota exceeded"
**Fix**: YouTube API has daily quotas. Wait 24 hours or request quota increase

### Database migration fails
**Fix**: Make sure your `DATABASE_URL` is correct and database is running

### Quiz not showing
**Fix**: Check browser console for errors. Ensure `questions` field exists in database

---

## 📚 Next Steps

1. Read `IMPLEMENTATION_GUIDE.md` for detailed integration
2. Check `GROQ_PROMPTS_REFERENCE.md` for prompt customization
3. Deploy to production (Vercel, Railway, etc.)
4. Monitor API usage and costs
5. Collect user feedback and iterate

---

## 💡 Pro Tips

- **Cache responses**: Store generated content to avoid re-generating
- **Add progress indicators**: Show users where in the chain they are
- **Implement retry logic**: AI calls can fail, have fallbacks
- **Log everything**: Track which prompts work best
- **A/B test prompts**: Try different variations

---

**Happy Building! 🚀**

Need help? Check the console logs for detailed error messages.
