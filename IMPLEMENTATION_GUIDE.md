# 🚀 AI Course Generator - 5 Major Improvements Implementation Guide

This guide will help you implement all 5 improvements to your AI course generation system.

---

## 📦 Required NPM Packages

Install these packages first:

```bash
npm install youtube-transcript cheerio pdf-parse formidable googleapis
```

### Package Purposes:
- **youtube-transcript**: Extract transcripts from YouTube videos
- **cheerio**: Parse and scrape HTML from article URLs
- **pdf-parse**: Extract text from PDF files
- **formidable**: Handle multipart/form-data file uploads
- **googleapis**: Access YouTube Data API for video search

---

## 🔧 Environment Variables

Add these to your `.env.local` file:

```env
# GROQ API (for AI generation)
GROQ_API_KEY=your_groq_api_key_here

# YouTube Data API v3
YOUTUBE_API_KEY=your_youtube_api_key_here

# Database (if not already set)
DATABASE_URL=your_database_url_here
```

### How to Get API Keys:

1. **GROQ API Key**: 
   - Visit https://console.groq.com
   - Sign up/Login
   - Create a new API key

2. **YouTube Data API Key**:
   - Go to https://console.cloud.google.com
   - Create a new project or select existing
   - Enable "YouTube Data API v3"
   - Create credentials (API Key)
   - Copy the API key

---

## 📁 File Structure

Here's what was created:

```
mindcourse/
├── app/
│   └── api/
│       └── generate/
│           ├── from-source/
│           │   └── route.js          # ✅ Multi-modal source ingestion
│           └── chain/
│               └── route.js          # ✅ Chain-of-Thought pipeline
├── components/
│   ├── forms/
│   │   └── DifficultySelector.jsx   # ✅ Difficulty & persona selector
│   └── quiz/
│       └── Quiz.jsx                  # ✅ Diverse quiz component
└── lib/
    ├── prompts/
    │   └── difficulty-prompts.js    # ✅ Adaptive prompts
    └── services/
        └── video-curation.js        # ✅ AI video curation
```

---

## 🎯 Implementation Steps

### 1️⃣ Multi-Modal Source Ingestion

**What it does**: Allows course generation from YouTube videos, articles, or PDF files.

**API Endpoint**: `/api/generate/from-source`

**Usage Examples**:

```javascript
// From YouTube
const response = await fetch('/api/generate/from-source', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    youtubeUrl: 'https://www.youtube.com/watch?v=VIDEO_ID'
  })
});

// From Article URL
const response = await fetch('/api/generate/from-source', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    articleUrl: 'https://example.com/article'
  })
});

// From PDF File
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('/api/generate/from-source', {
  method: 'POST',
  body: formData
});
```

**Integration with Existing Create Course**:

Update your `app/create-course/page.js`:

```javascript
import { useState } from 'react';

// Add new state
const [sourceType, setSourceType] = useState('topic'); // 'topic', 'youtube', 'article', 'pdf'
const [sourceUrl, setSourceUrl] = useState('');
const [sourceFile, setSourceFile] = useState(null);

// In your form, add source selection
<Select value={sourceType} onValueChange={setSourceType}>
  <SelectItem value="topic">Topic (Text Input)</SelectItem>
  <SelectItem value="youtube">YouTube Video</SelectItem>
  <SelectItem value="article">Article URL</SelectItem>
  <SelectItem value="pdf">PDF Upload</SelectItem>
</Select>

// Conditional rendering based on sourceType
{sourceType === 'youtube' && (
  <Input 
    placeholder="https://youtube.com/watch?v=..."
    value={sourceUrl}
    onChange={(e) => setSourceUrl(e.target.value)}
  />
)}

{sourceType === 'pdf' && (
  <input 
    type="file" 
    accept="application/pdf"
    onChange={(e) => setSourceFile(e.target.files[0])}
  />
)}
```

---

### 2️⃣ Adaptive Difficulty & Persona-Based Generation

**What it does**: Adjusts AI prompts based on learner level and persona.

**Component**: `<DifficultySelector />`

**Usage in Create Course Form**:

```javascript
import DifficultySelector from '@/components/forms/DifficultySelector';

// Add state
const [difficulty, setDifficulty] = useState('intermediate');
const [persona, setPersona] = useState(null);

// In your form (Step 2)
<DifficultySelector
  difficulty={difficulty}
  onDifficultyChange={setDifficulty}
  persona={persona}
  onPersonaChange={setPersona}
  showPersona={true}
/>

// When generating course
const response = await fetch('/api/generate/chain', {
  method: 'POST',
  body: JSON.stringify({
    topic: courseData.topic,
    difficulty: difficulty,      // 👈 Pass difficulty
    persona: persona,            // 👈 Pass persona
    includeQuiz: true
  })
});
```

**Difficulty Levels**:
- **Beginner**: Simple, no assumptions, everyday examples
- **Intermediate**: Balanced technical depth
- **Expert**: Advanced, dense, technical

**Personas**:
- **Developer**: Code-focused, practical implementation
- **Student**: Academic structure, learning objectives
- **Business**: Business value, minimal jargon
- **Researcher**: Theoretical, cutting-edge

---

### 3️⃣ Chain-of-Thought Generation Pipeline

**What it does**: Generates courses in multiple AI calls (outline → content → quizzes) for better quality.

**API Endpoint**: `/api/generate/chain`

**How it works**:
1. **Call 1**: Generate course outline (title + module titles)
2. **Database Write**: Create course and empty module records
3. **Parallel Calls**: For each module:
   - Generate detailed content
   - Generate quiz questions
4. **Database Update**: Save content and quizzes
5. **Complete**: Mark course as ready

**Usage**:

```javascript
const response = await fetch('/api/generate/chain', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'Advanced TypeScript',
    difficulty: 'expert',
    persona: 'developer',
    includeQuiz: true
  })
});

const data = await response.json();
console.log('Course ID:', data.courseId);
```

**Replace Your Current `/api/generate` Route**:

This new chain route is **better** than your current one because:
- ✅ Higher quality (multiple focused AI calls)
- ✅ Parallel processing (faster)
- ✅ Progress tracking (can show status)
- ✅ Better error handling

---

### 4️⃣ Diverse Assessment Generation

**What it does**: Creates multiple question types (MCQ, True/False, Fill-in-blank) with interactive UI.

**Component**: `<Quiz />`

**Question Types Supported**:
1. **Multiple Choice**: 4 options, select one
2. **True/False**: Binary choice
3. **Fill in the Blank**: Text input

**Usage in Course Viewer**:

Update your `app/course/[id]/page.js`:

```javascript
import Quiz from '@/components/quiz/Quiz';

// After module content
{module.quiz && module.quiz.questions && (
  <Quiz 
    questions={module.quiz.questions}
    moduleTitle={module.title}
  />
)}
```

**Quiz JSON Format** (already generated by chain route):

```json
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "answer": "A"
    },
    {
      "type": "true_false",
      "question": "Statement here.",
      "answer": true
    },
    {
      "type": "fill_in_the_blank",
      "question": "The key is ______.",
      "answer": "useState"
    }
  ]
}
```

---

### 5️⃣ Intelligent Video Curation & Validation

**What it does**: Uses AI to search YouTube and select the best educational video for each module.

**Service**: `findBestVideo()` and `findVideosForModules()`

**How it works**:
1. **AI generates** 3 targeted YouTube search queries
2. **Search YouTube** for each query (top 3 results each)
3. **Get statistics** (views, likes, duration)
4. **AI validates** and selects the single best video
5. **Return** video metadata (embed URL, title, etc.)

**Integration with Chain Route**:

Update `app/api/generate/chain/route.js`:

```javascript
import { findBestVideo } from '@/lib/services/video-curation';

// After generating module content (inside the loop)
const [content, quizData, videoData] = await Promise.all([
  generateModuleContent(...),
  includeQuiz ? generateModuleQuiz(...) : null,
  includeVideos ? findBestVideo(content, module.title) : null  // 👈 Add this
]);

// Update module with video
await db.update(modules)
  .set({ 
    content,
    videoUrls: videoData ? [videoData.embedUrl] : []  // 👈 Store embed URL
  })
  .where(eq(modules.id, module.id));
```

**Manual Usage**:

```javascript
import { findBestVideo } from '@/lib/services/video-curation';

const video = await findBestVideo(
  moduleContent, 
  'Introduction to React Hooks'
);

console.log('Selected video:', video);
// Output:
// {
//   videoId: 'abc123',
//   url: 'https://youtube.com/watch?v=abc123',
//   embedUrl: 'https://youtube.com/embed/abc123',
//   title: 'React Hooks Explained',
//   description: '...',
//   channelTitle: 'Tech Channel',
//   thumbnailUrl: 'https://...',
//   viewCount: 150000,
//   duration: 'PT12M34S'
// }
```

---

## 🔗 Frontend Integration Example

Here's a complete example of integrating everything into your create course flow:

```javascript
'use client';

import { useState } from 'react';
import DifficultySelector from '@/components/forms/DifficultySelector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateCourse() {
  const [step, setStep] = useState(1);
  const [courseData, setCourseData] = useState({
    sourceType: 'topic',
    topic: '',
    youtubeUrl: '',
    articleUrl: '',
    pdfFile: null,
    difficulty: 'intermediate',
    persona: null,
    includeVideos: true,
    includeQuiz: true
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      let extractedText = null;
      
      // Step 1: Extract text from source if needed
      if (courseData.sourceType !== 'topic') {
        const sourceResponse = await fetch('/api/generate/from-source', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            youtubeUrl: courseData.youtubeUrl || undefined,
            articleUrl: courseData.articleUrl || undefined
          })
        });
        
        const sourceData = await sourceResponse.json();
        extractedText = sourceData.extractedText;
        
        toast.success('Source processed successfully!');
      }
      
      // Step 2: Generate course using chain-of-thought
      const response = await fetch('/api/generate/chain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: courseData.topic,
          sourceText: extractedText,
          difficulty: courseData.difficulty,
          persona: courseData.persona,
          includeQuiz: courseData.includeQuiz,
          includeVideos: courseData.includeVideos
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Course generated successfully!');
        // Redirect to course page
        window.location.href = `/course/${result.courseId}`;
      }
    } catch (error) {
      toast.error('Failed to generate course');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Select source type and difficulty */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Source selection UI */}
          <DifficultySelector
            difficulty={courseData.difficulty}
            onDifficultyChange={(val) => setCourseData(prev => ({...prev, difficulty: val}))}
            persona={courseData.persona}
            onPersonaChange={(val) => setCourseData(prev => ({...prev, persona: val}))}
          />
          
          <Button onClick={() => setStep(2)}>Next</Button>
        </div>
      )}
      
      {/* Step 2: Configure and generate */}
      {step === 2 && (
        <div>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Course with AI'}
          </Button>
        </div>
      )}
    </div>
  );
}
```

---

## 🎨 UI Components Needed

### Missing UI Components (if not already present):

```bash
# RadioGroup (for quiz)
npx shadcn-ui@latest add radio-group

# Label
npx shadcn-ui@latest add label
```

---

## 🗄️ Database Schema Updates

Add these fields to your existing tables:

```sql
-- Add to courses table
ALTER TABLE courses 
ADD COLUMN difficulty VARCHAR(20) DEFAULT 'intermediate',
ADD COLUMN persona VARCHAR(20),
ADD COLUMN source_type VARCHAR(20) DEFAULT 'topic',
ADD COLUMN source_metadata JSONB;

-- Create quizzes table (if not exists)
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  questions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Drizzle Schema** (`lib/db/schema.js`):

```javascript
import { pgTable, serial, text, integer, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  topic: text('topic').notNull(),
  difficulty: text('difficulty').default('intermediate'),
  persona: text('persona'),
  sourceType: text('source_type').default('topic'),
  sourceMetadata: jsonb('source_metadata'),
  // ... existing fields
});

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  moduleId: integer('module_id').references(() => modules.id, { onDelete: 'cascade' }),
  questions: jsonb('questions').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
```

---

## ✅ Testing Checklist

### Test Each Feature:

- [ ] **YouTube Extraction**: Try `/api/generate/from-source` with a YouTube URL
- [ ] **PDF Upload**: Upload a PDF and verify text extraction
- [ ] **Article Scraping**: Test with a news article or blog post
- [ ] **Difficulty Prompts**: Generate beginner vs expert courses, compare output
- [ ] **Persona**: Test developer vs business persona
- [ ] **Chain Generation**: Create a course and verify modules are generated in sequence
- [ ] **Quiz Component**: View a generated quiz and answer questions
- [ ] **Video Curation**: Check if videos are automatically selected and embedded

---

## 🐛 Common Issues & Solutions

### Issue: YouTube transcript not found
**Solution**: Not all videos have transcripts. Add error handling and fallback to manual topic input.

### Issue: PDF text is garbled
**Solution**: Some PDFs are image-based (scanned). Consider adding OCR support or require text-based PDFs.

### Issue: GROQ API rate limiting
**Solution**: Add delays between calls or implement a queue system.

### Issue: Video curation takes too long
**Solution**: Make video curation optional or run it async after course generation.

---

## 🚀 Deployment Notes

1. **Environment Variables**: Ensure all keys are set in production
2. **Rate Limits**: GROQ and YouTube APIs have rate limits - implement caching
3. **Error Handling**: All improvements include try-catch blocks
4. **Monitoring**: Log all AI calls for debugging
5. **Costs**: GROQ API usage may incur costs - monitor usage

---

## 📈 Performance Tips

1. **Parallel Processing**: Chain route already uses `Promise.all` for modules
2. **Caching**: Cache video search results for same queries
3. **Background Jobs**: Consider moving heavy tasks to a queue (e.g., BullMQ)
4. **Streaming**: For real-time updates, consider Server-Sent Events (SSE)

---

## 🎓 Next Steps

1. Install all dependencies
2. Set up environment variables
3. Test each API endpoint individually
4. Integrate into your UI step by step
5. Deploy and monitor

---

## 💡 Future Enhancements

- **Audio transcription**: Support for audio file uploads
- **Multi-language**: Generate courses in different languages
- **Custom AI models**: Allow users to select different AI models
- **Collaborative editing**: Let multiple users edit course content
- **Export**: Export courses as PDF, Markdown, or SCORM packages

---

## 📞 Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify all environment variables are set
3. Test each API endpoint with Postman or curl
4. Review the GROQ and YouTube API documentation

---

**Happy Coding! 🚀**
