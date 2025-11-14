# 🚀 AI Chat Tutor - Quick Integration Example

## Integration in Course Viewer Page

### Method 1: Simple Integration (Recommended)

Update your `app/course/[id]/page.js`:

```javascript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ChatTutor from '@/components/chat/ChatTutor';
// ... your other imports

export default function CoursePage() {
  const params = useParams();
  const courseId = params.id;
  const [course, setCourse] = useState(null);

  // Your existing code...
  useEffect(() => {
    // Fetch course data
    fetchCourse();
  }, [courseId]);

  return (
    <div className="min-h-screen">
      {/* Your existing course content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1>{course?.title}</h1>
        {/* Modules, chapters, etc. */}
      </div>

      {/* 👇 Add Chat Tutor - It's a floating widget */}
      {course && (
        <ChatTutor 
          courseId={courseId} 
          courseTitle={course.title}
        />
      )}
    </div>
  );
}
```

That's it! The chat button will appear in the bottom-right corner.

---

## Method 2: Conditional Display

Only show chat for certain courses:

```javascript
{course && course.includeChat && (
  <ChatTutor 
    courseId={courseId} 
    courseTitle={course.title}
  />
)}
```

---

## Method 3: Module-Specific Chat

Show chat only when viewing a specific module:

```javascript
{currentModule && (
  <ChatTutor 
    courseId={courseId} 
    moduleId={currentModule.id}
    courseTitle={`${course.title} - ${currentModule.title}`}
  />
)}
```

---

## Testing Steps

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Course
Go to: `http://localhost:3000/course/[courseId]`

### 3. Click Chat Button
Look for the purple floating button in bottom-right corner

### 4. Ask Questions
Try these:
- "What is this course about?"
- "Can you summarize module 1?"
- "Explain [concept] in simpler terms"

---

## Expected Behavior

### ✅ Correct Responses
- **Welcome message** appears automatically
- AI responds with **course-specific** information
- **Markdown formatting** works (bold, lists, code)
- **Timestamps** show on each message
- **Smooth animations** on open/close

### ❌ Issues to Check
- If no response → Check GROQ_API_KEY in `.env.local`
- If "Course not found" → Verify courseId is correct
- If slow → Course might have large content (optimize context)
- If wrong answers → AI might be hallucinating (improve prompt)

---

## Quick Customization

### Change Button Position
In `ChatTutor.jsx`, line ~115:
```javascript
// Bottom-right (default)
className="fixed bottom-6 right-6 z-50"

// Bottom-left
className="fixed bottom-6 left-6 z-50"

// Top-right  
className="fixed top-20 right-6 z-50"
```

### Change Button Color
Line ~120:
```javascript
className="... from-purple-600 to-blue-600"

// Change to green
className="... from-green-600 to-emerald-600"

// Change to orange
className="... from-orange-600 to-red-600"
```

### Add Custom Welcome Message
In `ChatTutor.jsx`, line ~70:
```javascript
setMessages([{
  role: 'assistant',
  content: `👋 Hi! I'm your AI tutor for **${data.course.title}**. 
  
  I've read all ${data.course.moduleCount} modules and I'm here to help you understand the material. 
  
  Ask me anything! 🚀`,
  timestamp: new Date()
}]);
```

---

## Advanced: Multiple Chat Modes

### Global Course Chat
```javascript
<ChatTutor 
  courseId={courseId} 
  courseTitle={course.title}
  mode="global" // All modules
/>
```

### Module-Specific Chat
```javascript
<ChatTutor 
  courseId={courseId} 
  moduleId={currentModule.id}
  courseTitle={currentModule.title}
  mode="module" // Only current module
/>
```

### Quick Help Chat
```javascript
<ChatTutor 
  courseId={courseId} 
  courseTitle="Quick Help"
  mode="quick" // Shorter responses
/>
```

Implement in `app/api/chat/tutor/route.js`:
```javascript
const { mode = 'global' } = body;

if (mode === 'module') {
  // Load only one module
  context = await getModuleContext(moduleId);
} else if (mode === 'quick') {
  // Use shorter prompts
  systemPrompt = "Be very concise. Max 2 paragraphs per response.";
}
```

---

## Debugging

### Enable Console Logs
In `ChatTutor.jsx`, add:
```javascript
const sendMessage = async () => {
  console.log('Sending message:', inputMessage);
  // ... existing code
  console.log('Received response:', data);
};
```

### Check API Response
Open browser console (F12) and watch Network tab:
- Request to `/api/chat/tutor` should be 200 OK
- Response should have `success: true`
- Check response time (should be < 5 seconds)

### Verify Course Context
Test the GET endpoint:
```bash
curl http://localhost:3000/api/chat/tutor?courseId=1
```

Should return:
```json
{
  "success": true,
  "course": { "title": "...", "moduleCount": 5 },
  "modules": [...]
}
```

---

## Performance Monitoring

### Track Response Times
Add to `ChatTutor.jsx`:
```javascript
const sendMessage = async () => {
  const startTime = Date.now();
  
  // ... send message ...
  
  const endTime = Date.now();
  console.log(`Response time: ${endTime - startTime}ms`);
};
```

### Optimize Slow Chats
If response time > 5 seconds:
1. Reduce context size (limit modules)
2. Use lighter model (`llama3-8b-8192`)
3. Cache course content
4. Implement streaming responses

---

## Mobile Testing

Test on mobile devices:
1. Open Chrome DevTools (F12)
2. Click device toolbar icon
3. Select "iPhone 12 Pro" or "Pixel 5"
4. Test chat button visibility
5. Test input on mobile keyboard
6. Verify scroll behavior

---

## Production Checklist

Before deploying:
- [ ] GROQ_API_KEY set in production environment
- [ ] Test with real course data
- [ ] Verify user authentication works
- [ ] Check mobile responsiveness
- [ ] Test error states (no internet, API down)
- [ ] Monitor API usage costs
- [ ] Add rate limiting (optional)
- [ ] Test with multiple concurrent users

---

## Cost Estimation

### GROQ API Usage
- **Per message**: ~3,000 tokens (course context + message)
- **Cost**: ~$0.01 per 10 messages
- **100 active students**: ~1,000 messages/day = $1/day
- **Monthly**: ~$30 for moderate usage

### Optimization
- Cache course context (save 80% tokens)
- Limit conversation history (save 30% tokens)
- Use smaller model for simple questions (save 50% tokens)

**Optimized cost**: ~$10/month for 100 active students

---

## Success Metrics

Track these:
- **Engagement**: % of students using chat
- **Questions/student**: Average messages per user
- **Response quality**: User satisfaction ratings
- **Topics**: Most asked questions
- **Performance**: Average response time

Add analytics:
```javascript
// In sendMessage function
await logChatMetric({
  courseId,
  userId,
  question: inputMessage,
  responseTime: Date.now() - startTime,
  satisfied: null // Set after user rates
});
```

---

## 🎉 You're Ready!

The AI Chat Tutor is now integrated and ready to help students learn more effectively!

**Questions?** Check the full guide: `AI_CHAT_TUTOR_GUIDE.md`
