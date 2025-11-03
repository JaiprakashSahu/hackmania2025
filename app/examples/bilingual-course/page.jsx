'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, Languages, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BilingualYouTubeEmbed from '@/components/BilingualYouTubeEmbed';

/**
 * Demo page showing the complete "Generate Course with AI" bilingual integration
 * This demonstrates how the AI-generated course content works with Hindi/English video switching
 */
export default function BilingualCourseDemo() {
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  
  // Mock AI-generated course data
  const mockCourse = {
    title: 'JavaScript Fundamentals for Beginners',
    description: 'A comprehensive introduction to JavaScript programming with bilingual video support',
    category: 'Programming',
    difficulty: 'Beginner',
    duration: '6-8 hours',
    includeVideos: true,
    preferredLanguage: selectedLanguage,
    chapters: [
      {
        id: 1,
        title: 'Introduction to JavaScript',
        description: 'Learn what JavaScript is and why it\'s important for web development',
        duration: '15 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk', // JavaScript tutorial
        content: 'JavaScript is a versatile programming language that powers the modern web...'
      },
      {
        id: 2,
        title: 'Variables and Data Types',
        description: 'Understanding variables, strings, numbers, and other data types',
        duration: '25 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=9YffrCViTVk', // Variables tutorial
        content: 'Variables are containers for storing data values. In JavaScript, you can declare variables using var, let, or const...'
      },
      {
        id: 3,
        title: 'Functions and Scope',
        description: 'Creating and using functions, understanding scope and closures',
        duration: '30 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ', // Functions tutorial
        content: 'Functions are reusable blocks of code that perform specific tasks...'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3"
          >
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI-Generated Course with Bilingual Videos
            </h1>
          </motion.div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience how our AI generates comprehensive courses with automatic YouTube video integration 
            and seamless Hindi/English language switching.
          </p>
        </div>

        {/* Course Overview */}
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-purple-900 dark:text-purple-100">
                  {mockCourse.title}
                </CardTitle>
                <p className="text-purple-700 dark:text-purple-300 mt-2">
                  {mockCourse.description}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm text-purple-600 dark:text-purple-400">
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{mockCourse.difficulty}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{mockCourse.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Languages className="w-4 h-4" />
                  <span>Bilingual</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Global Language Preference */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Languages className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900 dark:text-blue-100">
                    Course Language Preference:
                  </span>
                </div>
                <div className="flex gap-2">
                  {[
                    { value: 'auto', label: 'Auto Detect', flag: '🌐' },
                    { value: 'en', label: 'English', flag: '🇺🇸' },
                    { value: 'hi', label: 'हिंदी', flag: '🇮🇳' }
                  ].map((lang) => (
                    <Button
                      key={lang.value}
                      variant={selectedLanguage === lang.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedLanguage(lang.value)}
                      className="flex items-center gap-1"
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                💡 This preference is applied to all videos in the course, but can be overridden per video.
              </p>
            </div>

            {/* Course Chapters */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Course Chapters
              </h3>
              
              {mockCourse.chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Chapter Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-sm font-semibold">
                                {chapter.id}
                              </div>
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {chapter.title}
                              </h4>
                              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">{chapter.duration}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 ml-11">
                              {chapter.description}
                            </p>
                          </div>
                        </div>

                        {/* AI-Generated Video Integration */}
                        {chapter.videoUrl && mockCourse.includeVideos && (
                          <div className="ml-11">
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-3">
                                <Play className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  AI-Generated Video Tutorial
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  Auto-Selected by AI
                                </span>
                              </div>
                              
                              {/* Integration Point: BilingualYouTubeEmbed with course preferences */}
                              <BilingualYouTubeEmbed
                                url={chapter.videoUrl}
                                title={`${chapter.title} - Video Tutorial`}
                                autoPlay={false}
                                showControls={true}
                                className="max-w-3xl"
                                defaultLanguage={selectedLanguage === 'auto' ? null : selectedLanguage}
                              />
                            </div>
                          </div>
                        )}

                        {/* Chapter Content */}
                        {chapter.content && (
                          <div className="ml-11">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {chapter.content}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Features */}
        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardTitle className="text-green-900 dark:text-green-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Integration Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  🤖 AI Course Generation
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Automatic course outline generation using Gemini AI</li>
                  <li>• Smart YouTube video discovery based on chapter content</li>
                  <li>• Contextual video selection with relevance scoring</li>
                  <li>• Real-time video validation and availability checking</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                  🌐 Bilingual Video Support
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Dynamic Hindi/English language switching</li>
                  <li>• Browser language detection for smart defaults</li>
                  <li>• Subtitle fallback when audio tracks unavailable</li>
                  <li>• Per-video and course-wide language preferences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardTitle className="text-blue-900 dark:text-blue-100">
              🔧 Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
{`// Integration Points in AI Course Generation

// 1. Course Creation with Language Preference
const courseData = {
  topic: "JavaScript Fundamentals",
  includeVideos: true,
  preferredLanguage: "hi", // Hindi, English, or Auto
};

// 2. AI Video Discovery (Enhanced)
const searchQueries = [
  \`\${topic} tutorial \${language}\`,
  \`\${chapterTitle} \${language} explained\`,
  \`learn \${topic} \${language} beginner\`
];

// 3. Bilingual YouTube Embed Integration
<BilingualYouTubeEmbed
  url={chapter.videoUrl}
  title={chapter.title}
  defaultLanguage={course.preferredLanguage}
  autoPlay={false}
  showControls={true}
/>

// 4. YouTube IFrame Player API Integration
const player = new YT.Player(element, {
  playerVars: {
    cc_load_policy: 1,        // Enable captions
    hl: selectedLanguage,     // Interface language
    cc_lang_pref: language    // Caption language preference
  }
});`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
