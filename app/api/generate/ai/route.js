import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import Groq from 'groq-sdk';
import { ensureModuleVideos } from '@/lib/youtube/fetchVideos';
import { makeCacheKey, getCachedCourse, setCachedCourse } from '@/lib/cache/courseCache';
import { courseGenerationSchema, courseOutputSchema } from '@/lib/validations/course';
import { normalizeGenerateAiPayload } from "@/lib/utils/normalizeGenerateAiPayload";
import { repairLLMOutput } from "@/lib/utils/repairLLMOutput";
import { cleanJSON } from "@/lib/utils/cleanJSON";
import { safeJSONParse } from "@/lib/utils/safeJSONParse";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const raw = await request.json();
        const body = normalizeGenerateAiPayload(raw);

        // Validate input with Zod
        const validation = courseGenerationSchema.safeParse(body);
        if (!validation.success) {
            console.error("❌ /api/generate/ai Validation Failed:");
            console.error("   Input:", JSON.stringify(body, null, 2));
            console.error("   Errors:", JSON.stringify(validation.error.format(), null, 2));

            return NextResponse.json({
                error: 'Invalid input',
                details: validation.error.format()
            }, { status: 400 });
        }

        const { topic, difficulty, modules: moduleCount, includeQuiz, includeVideos } = validation.data;

        // ========== CACHING SYSTEM ==========
        // Build deterministic cache key based on normalized input
        const cacheKey = makeCacheKey({
            topic,
            difficulty,
            moduleCount,
            includeQuiz,
            includeVideos,
        }, userId);

        // Check cache first - return instantly if found
        const cachedCourse = await getCachedCourse(cacheKey);
        if (cachedCourse) {
            console.log(`⚡ Returning cached course for: "${topic}"`);
            return NextResponse.json({
                success: true,
                course: cachedCourse,
                cached: true,
                message: 'Course loaded from cache',
            });
        }

        console.log(`🔄 Cache miss - Generating new course for: "${topic}"`);
        // ====================================

        const quizSection = includeQuiz ? `
📝 Module Quiz
Include 5 quiz questions per module in this format:
{
  "question": "Question text",
  "options": ["A) option", "B) option", "C) option", "D) option"],
  "correctAnswer": "A"
}` : '';

        const videoSection = includeVideos ? `
🎥 YouTube Learning Resources
For each module, provide 2-3 recommended YouTube video searches with:
{
  "title": "Video title suggestion",
  "searchQuery": "YouTube search query to find this video",
  "reason": "Why this video is useful"
}` : '';

        const prompt = `You are IntelliCourse AI. You MUST generate course modules in the exact structure used by IntelliCourse’s UI.

STRICT OUTPUT FORMAT (DO NOT CHANGE KEYS OR NESTING):

{
  "title": "Course Title",
  "modules": [
    {
      "title": "Module Title",
      "description": "Short paragraph.",
      "content": [
        { "section": "Introduction", "text": "Full paragraph text." },
        { "section": "Core Concepts", "text": "Bullet points with \\n- item1 \\n- item2" },
        { "section": "Real-World Examples", "text": "Two examples." },
        { "section": "Best Practices", "text": "Bullet list." },
        { "section": "Common Mistakes to Avoid", "text": "Bullet list." },
        { "section": "Key Takeaways", "text": "3-5 bullet points." }
      ],
      "videos": [
        { "title": "Video Title", "url": "https://www.youtube.com/watch?v=xxxx" }
      ],
      "quiz": [
        { "question": "Q?", "options": ["A","B","C","D"], "answer": "A" }
      ]
    }
  ]
}

RULES:

1. Every module MUST contain exactly the 6 sections listed above.
2. Use rich formatting inside text:
   - Bold important terms
   - Numbered lists
   - Bullet lists
   - Short paragraphs for easy reading
3. Each module must have 1–3 YouTube videos (leave array empty if video enabled = false).
4. Each module must have exactly 5 quiz questions.
5. Quiz answers MUST always be provided.
6. Never hallucinate code blocks, markdown fences, or undefined fields.
7. Ensure the final JSON is valid and strictly matches the schema above.

Your only output must be the JSON object. Do not include explanations or commentary.

Course Topic: ${topic}
Difficulty: ${difficulty || 'Intermediate'}
Number of Modules: ${moduleCount || 5}
Include Quizzes: ${includeQuiz ? 'yes' : 'no'}
Include Videos: ${includeVideos ? 'yes' : 'no'}
${quizSection}
${videoSection}
`;

        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert educational course creator. Generate comprehensive, well-structured courses. Return only valid JSON without markdown code blocks. Make content detailed, educational, and beginner-friendly.'
                },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 8192,
        });

        const response = completion.choices[0]?.message?.content;

        try {
            // Enhanced Parsing Pipeline
            const cleaned = cleanJSON(response);
            let parsed;

            try {
                parsed = safeJSONParse(cleaned);
            } catch (err) {
                console.error("❌ JSON parse failed:", err);
                console.error("Raw response snippet:", response?.substring(0, 200));
                return NextResponse.json({ error: 'LLM returned invalid JSON' }, { status: 500 });
            }

            // REPAIR: Auto-fix common LLM issues (missing answers, titles, etc.)
            const repaired = repairLLMOutput(parsed);

            // Validate structure
            const validationResult = courseOutputSchema.safeParse(repaired);

            if (!validationResult.success) {
                console.warn("⚠️ LLM Output Validation Failed, using repaired fallback:", validationResult.error.format());
            }

            // Use validated data if success, otherwise use robust repaired data
            const course = validationResult.success ? validationResult.data : repaired;

            if (course.modules) {
                course.modules = course.modules.map((module, index) => {
                    // Build comprehensive description from content array
                    let fullDescription = '';

                    if (Array.isArray(module.content)) {
                        module.content.forEach(section => {
                            if (section.section && section.text) {
                                let icon = '📌';
                                if (section.section.includes('Introduction')) icon = '📚';
                                if (section.section.includes('Core Concepts')) icon = '🎯';
                                if (section.section.includes('Real-World Examples')) icon = '💡';
                                if (section.section.includes('Best Practices')) icon = '✅';
                                if (section.section.includes('Common Mistakes')) icon = '⚠️';
                                if (section.section.includes('Key Takeaways')) icon = '🎓';

                                fullDescription += `## ${icon} ${section.section}\n\n${section.text}\n\n`;
                            }
                        });
                    }

                    if (fullDescription.length === 0) {
                        // Fallback if content array is dry for some reason
                        fullDescription = module.description || "No content generated.";
                    }

                    // Add completion message
                    fullDescription += `---\n\n🏁 **Great job! You have completed this module.**\n`;

                    return {
                        ...module,
                        id: `module-${index}`,
                        orderIndex: index + 1,
                        description: fullDescription || module.description,
                        quiz: includeQuiz && module.quiz ? module.quiz : [],
                        videos: module.videos || [], // Will be populated below if includeVideos
                    };
                });
            }

            // Fetch and rank YouTube videos for each module if includeVideos is true
            if (includeVideos && course.modules && Array.isArray(course.modules)) {
                console.log('📺 Fetching and ranking YouTube videos for modules...');

                // Use new FINAL SAFE PIPELINE
                const { getSafeYouTubeVideos } = await import('@/lib/youtube/getSafeVideos');

                for (let i = 0; i < course.modules.length; i++) {
                    const module = course.modules[i];

                    // Check if module already has valid YouTube videos
                    const hasValidVideos = module.videos &&
                        Array.isArray(module.videos) &&
                        module.videos.length > 0 &&
                        module.videos.some(v => v.url && v.url.includes('youtube'));

                    if (!hasValidVideos) {
                        try {
                            const searchQuery = `${module.title} ${topic} tutorial`;
                            course.modules[i].videos = await getSafeYouTubeVideos(searchQuery);
                        } catch (err) {
                            console.error(`   ⚠️ Module ${i + 1}: Video fetch failed - ${err.message}`);
                            course.modules[i].videos = [{
                                title: "No verified videos available for this module yet.",
                                url: null
                            }];
                        }
                    } else {
                        console.log(`   ℹ️ Module ${i + 1}: Already has ${module.videos.length} videos`);
                    }
                }
            }

            // Build final course object
            const finalCourse = {
                ...course,
                topic,
                include_quiz: includeQuiz,
                include_videos: includeVideos,
                chapterCount: course.modules?.length || moduleCount,
            };

            // Store in cache for future identical requests
            await setCachedCourse(cacheKey, finalCourse);
            console.log(`💾 Course cached for: "${topic}"`);

            return NextResponse.json({
                success: true,
                course: finalCourse,
                cached: false,
            });
        } catch (parseError) {
            console.error('Failed to parse course:', parseError);
            console.error('Raw response:', response?.substring(0, 500));
            return NextResponse.json({ error: 'Failed to parse generated course' }, { status: 500 });
        }
    } catch (error) {
        console.error('Generate AI API error:', error);
        return NextResponse.json({ error: 'Failed to generate course' }, { status: 500 });
    }
}
