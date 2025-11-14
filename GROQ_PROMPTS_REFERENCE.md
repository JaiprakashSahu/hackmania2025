# 🤖 GROQ API Prompts Reference

Complete collection of all GROQ API prompts used in the 5 improvements.

---

## 1. Multi-Modal Source Ingestion Prompt

### Purpose: Generate course from extracted text (YouTube/PDF/Article)

```javascript
{
  "model": "llama3-70b-8192",
  "messages": [
    {
      "role": "system",
      "content": "You are an expert instructional designer. Your task is to generate a complete, multi-module course based *exclusively* on the source text provided by the user. Do not add any information that is not present in the text. The course must be structured, engaging, and easy to understand."
    },
    {
      "role": "user",
      "content": `Please generate a 5-module course (including course title, module titles, and detailed content for each module) based *only* on the following source text. Output must be in a valid JSON object format.

SOURCE TEXT:
"""
${extractedText}
"""

Output format:
{
  "title": "Course Title",
  "modules": [
    {
      "title": "Module Title",
      "content": "Detailed markdown content..."
    }
  ]
}`
    }
  ]
}
```

---

## 2. Adaptive Difficulty Prompts

### Beginner Level

```javascript
{
  "role": "system",
  "content": "You are a friendly, patient teacher. Your primary goal is to make complex topics simple. You must assume no prior knowledge. Explain all technical terms and use simple analogies. Your tone should be encouraging and supportive."
}
```

### Intermediate Level

```javascript
{
  "role": "system",
  "content": "You are an experienced educator speaking to students with some foundational knowledge. Assume they understand basic concepts but need guidance on more advanced topics. Use precise technical language when appropriate, but still explain complex ideas clearly. Balance theory with practical examples. Your tone is professional yet approachable."
}
```

### Expert Level

```javascript
{
  "role": "system",
  "content": "You are a senior staff engineer speaking to a colleague. Be concise, dense, and direct. Skip all basics. Focus on advanced patterns, performance trade-offs, edge cases, and architectural best practices. Use precise technical language. Your tone is professional and highly technical."
}
```

---

## 3. Chain-of-Thought Prompts

### Step 1: Generate Outline

```javascript
{
  "messages": [
    {
      "role": "system",
      "content": "You are an instructional designer who creates logical course outlines. You only output valid JSON."
    },
    {
      "role": "user",
      "content": `Generate a course outline for the topic '${topic}'. Give me a course title and an array of 5-7 module titles and a 1-sentence description for each.

Output *only* a valid JSON object in this format:
{
  "title": "Course Title",
  "modules": [
    {
      "title": "Module 1 Title",
      "description": "One sentence description"
    }
  ]
}`
    }
  ]
}
```

### Step 2: Generate Module Content

```javascript
{
  "messages": [
    {
      "role": "system",
      "content": "You are a subject-matter expert who writes detailed, engaging educational content. Format your output as clean Markdown."
    },
    {
      "role": "user",
      "content": `Write the detailed course content for the module: "${moduleTitle}: ${moduleDescription}".

The overall course is about '${courseTopic}'.

Ensure the content is comprehensive, well-structured with headings, and includes code examples if relevant. Output *only* the raw Markdown text.`
    }
  ]
}
```

### Step 3: Generate Quiz

```javascript
{
  "messages": [
    {
      "role": "system",
      "content": "You are a quiz creator. You will be given text and must create questions based *only* on that text. You must output *only* valid JSON."
    },
    {
      "role": "user",
      "content": `Based *only* on the following module text, generate 3 quiz questions in the specified JSON format.

MODULE TEXT:
"""
${moduleContent}
"""

JSON FORMAT:
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "...",
      "options": ["...", "...", "...", "..."],
      "answer": "..."
    },
    {
      "type": "true_false",
      "question": "...",
      "answer": true
    }
  ]
}`
    }
  ]
}
```

---

## 4. Diverse Assessment Prompts

### Comprehensive Quiz Generation

```javascript
{
  "messages": [
    {
      "role": "system",
      "content": "You are a strict quiz creator. You must generate questions based *only* on the provided text. You must output *only* a valid JSON object in the exact format requested."
    },
    {
      "role": "user",
      "content": `Based *only* on the following module text, generate 4 quiz questions.

MODULE TEXT:
"""
${moduleContent}
"""

Generate a mix of question types. Give me:
- 2 multiple_choice
- 1 true_false
- 1 fill_in_the_blank

Output *only* a valid JSON object in this *exact* format:
{
  "questions": [
    {
      "type": "multiple_choice",
      "question": "What is the main benefit of X?",
      "options": ["Benefit A", "Benefit B", "Benefit C"],
      "answer": "Benefit A"
    },
    {
      "type": "true_false",
      "question": "X is a subset of Y.",
      "answer": true
    },
    {
      "type": "fill_in_the_blank",
      "question": "The function to create state is called ______.",
      "answer": "useState"
    }
  ]
}`
    }
  ]
}
```

---

## 5. Intelligent Video Curation Prompts

### Step 1: Generate Search Queries

```javascript
{
  "messages": [
    {
      "role": "system",
      "content": "You are a research assistant who is an expert at finding the perfect educational YouTube video. You only output JSON."
    },
    {
      "role": "user",
      "content": `Based on the following module text, generate 3 highly specific, effective YouTube search queries that would find a short (5-15 min) video supplement for this content.

MODULE TEXT:
"""
${moduleContent.substring(0, 1000)}
"""

Output *only* a valid JSON object:
{"queries": ["query 1", "query 2", "query 3"]}`
    }
  ]
}
```

### Step 2: Validate & Select Best Video

```javascript
{
  "messages": [
    {
      "role": "system",
      "content": "You are a content curator. Your job is to select the *single best* video from a list that matches the provided module text. You must output *only* the videoId of your choice."
    },
    {
      "role": "user",
      "content": `I need to find the *best* supplementary video for this module:

MODULE TEXT:
"""
${moduleContent}
"""

Here is a list of candidate videos (with their titles and descriptions):

CANDIDATES (as JSON):
[
  {
    "videoId": "abc1234",
    "title": "React Hooks Tutorial for Beginners",
    "description": "..."
  },
  {
    "videoId": "xyz5678",
    "title": "Advanced React Patterns with Hooks",
    "description": "..."
  }
]

Review the list and return the videoId of the *single best* match for the module text. Output *only* the chosen videoId as a plain string.`
    }
  ]
}
```

---

## 🎯 Prompt Engineering Best Practices

### 1. System Message Guidelines
- **Be specific** about the role (e.g., "instructional designer", "senior engineer")
- **Set expectations** for output format (JSON, Markdown, plain text)
- **Define tone** (friendly, professional, technical)
- **Limit scope** ("based *only* on provided text")

### 2. User Message Guidelines
- **Provide context** (module title, course topic)
- **Be explicit** about requirements
- **Show examples** of expected format
- **Use delimiters** (""" for text blocks)
- **Repeat key instructions** at the end

### 3. Temperature Settings
- **0.3-0.5**: For factual, consistent tasks (quiz validation, video selection)
- **0.6-0.7**: For educational content (module generation)
- **0.7-0.9**: For creative tasks (course outlines, titles)

### 4. Token Management
- **max_tokens: 1024**: For short responses (outlines, queries)
- **max_tokens: 2048**: For medium content (quiz generation)
- **max_tokens: 4096**: For long content (module content)

---

## 🔧 Dynamic Prompt Building

### Combine Difficulty + Persona

```javascript
function buildSystemPrompt(difficulty, persona) {
  let prompt = DIFFICULTY_PROMPTS[difficulty].system;
  
  if (persona) {
    prompt += `\n\n${PERSONA_PROMPTS[persona].modifier}`;
  }
  
  return prompt;
}

// Example usage
const systemPrompt = buildSystemPrompt('expert', 'developer');
// Result: Expert technical content focused on code and implementation
```

---

## 📊 Expected Response Times

- **Outline Generation**: 3-5 seconds
- **Module Content**: 5-10 seconds per module
- **Quiz Generation**: 3-5 seconds per quiz
- **Video Query Generation**: 2-3 seconds
- **Video Selection**: 3-4 seconds

**Total Chain-of-Thought Course**: ~60-90 seconds for 5 modules with quizzes

---

## 🐛 Common Response Issues & Fixes

### Issue: JSON wrapped in markdown code blocks

```javascript
// Response: ```json\n{...}\n```
// Fix:
let jsonStr = response.trim();
if (jsonStr.startsWith('```json')) {
  jsonStr = jsonStr.replace(/```json\n?/g, '').replace(/```\n?/g, '');
}
const data = JSON.parse(jsonStr);
```

### Issue: Extra text before/after JSON

```javascript
// Response: "Here's the JSON:\n{...}\nHope this helps!"
// Fix:
const jsonMatch = response.match(/\{[\s\S]*\}/);
if (jsonMatch) {
  const data = JSON.parse(jsonMatch[0]);
}
```

### Issue: Escaped quotes in JSON

```javascript
// Response has: \"answer\"
// Fix: Usually auto-handled by JSON.parse, but if not:
const cleanedJson = jsonStr.replace(/\\"/g, '"');
```

---

## 💡 Advanced Prompt Techniques

### 1. Few-Shot Learning

Add examples in the prompt:

```javascript
{
  "role": "user",
  "content": `Generate quiz questions.

EXAMPLE INPUT:
"React hooks allow functional components to use state."

EXAMPLE OUTPUT:
{
  "questions": [{
    "type": "multiple_choice",
    "question": "What do React hooks enable?",
    "options": ["State in functional components", "..."],
    "answer": "State in functional components"
  }]
}

NOW GENERATE FOR:
"${moduleContent}"`
}
```

### 2. Chain-of-Thought Reasoning

Explicitly ask for reasoning:

```javascript
{
  "content": `You are selecting a video. Think step by step:
1. Read the module content
2. Identify key concepts
3. Evaluate each video for relevance
4. Select the best match

MODULE: ${content}
VIDEOS: ${videos}

Your reasoning:
Best video: [videoId]`
}
```

### 3. Constraint Enforcement

Be very explicit about constraints:

```javascript
{
  "content": `CRITICAL RULES:
- You MUST output valid JSON
- You MUST NOT add explanatory text
- You MUST base questions ONLY on provided text
- You MUST include exactly 4 questions

Now generate the quiz for: ${content}`
}
```

---

## 📚 Model Selection Guide

### GROQ Models Available

1. **llama3-70b-8192** (Recommended)
   - Best for: Course content, detailed explanations
   - Context: 8,192 tokens
   - Speed: Fast

2. **llama3-8b-8192**
   - Best for: Quick tasks, search queries
   - Context: 8,192 tokens
   - Speed: Very fast

3. **mixtral-8x7b-32768**
   - Best for: Long context, comprehensive content
   - Context: 32,768 tokens
   - Speed: Moderate

### When to Use Each

```javascript
// Outline generation - needs creativity
model: 'llama3-70b-8192', temperature: 0.8

// Module content - needs detail
model: 'llama3-70b-8192', temperature: 0.7

// Quiz generation - needs accuracy
model: 'llama3-70b-8192', temperature: 0.6

// Video queries - needs conciseness
model: 'llama3-8b-8192', temperature: 0.7

// Video selection - needs consistency
model: 'llama3-70b-8192', temperature: 0.3
```

---

## ✅ Prompt Testing Checklist

Before deploying a new prompt:

- [ ] Test with 3 different topics
- [ ] Verify JSON parsing works
- [ ] Check output quality (comprehensive? accurate?)
- [ ] Measure response time
- [ ] Test error cases (empty input, very long input)
- [ ] Validate against edge cases
- [ ] Compare different temperature settings
- [ ] Test different difficulty levels

---

**End of GROQ Prompts Reference** 🤖
