'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Download,
  Loader2,
  Play,
  Languages,
  ChevronDown,
  FileText,
  Video,
  Lightbulb,
  Target,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BilingualYouTubeEmbed from '@/components/BilingualYouTubeEmbed';

/**
 * AI-Powered Course Generator
 * 
 * This component creates comprehensive, structured courses using:
 * 1. Gemini AI for intelligent content generation with level-based depth
 * 2. YouTube Data API for relevant video discovery and embedding
 * 3. Bilingual audio/subtitle support for Hindi and English
 * 4. Export functionality for notes and course materials
 * 
 * Integration Points:
 * - Gemini AI: Generates course structure, explanations, and examples
 * - YouTube API: Searches and validates educational videos
 * - Export API: Converts course content to PDF/DOCX format
 */
export default function AICourseGenerator() {
  // Form state for user input
  const [formData, setFormData] = useState({
    topic: '',
    level: 'Beginner',
    includeVideos: true,
    preferredLanguage: 'auto'
  });

  // Course generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [error, setError] = useState(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Available difficulty levels with descriptions
  const difficultyLevels = [
    {
      value: 'Beginner',
      label: 'Beginner',
      description: 'Simple explanations, basic concepts, easy examples',
      icon: '🌱'
    },
    {
      value: 'Intermediate',
      label: 'Intermediate',
      description: 'Technical details, practical applications, moderate complexity',
      icon: '🚀'
    },
    {
      value: 'Advanced',
      label: 'Advanced',
      description: 'Deep concepts, professional terminology, complex examples',
      icon: '🎯'
    }
  ];

  /**
   * Handles course generation using Gemini AI
   * Sends user input to backend API which:
   * 1. Generates structured course content based on difficulty level
   * 2. Searches for relevant YouTube videos using YouTube Data API
   * 3. Validates video availability and embeddability
   */
  const handleGenerateCourse = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic to generate a course');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Call enhanced course generation API with level-based content depth
      const response = await fetch('/api/ai-course-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: formData.topic,
          level: formData.level,
          includeVideos: formData.includeVideos,
          preferredLanguage: formData.preferredLanguage,
          // Request detailed content generation
          generateDetailedContent: true,
          includeExamples: true,
          includeKeyPoints: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate course: ${response.status}`);
      }

      const courseData = await response.json();
      setGeneratedCourse(courseData);
    } catch (err) {
      setError(err.message || 'Failed to generate course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Exports course content as PDF or DOCX
   * Includes all text content, video links, and structured formatting
   */
  const handleExportNotes = async (format = 'pdf') => {
    if (!generatedCourse) return;

    setIsExporting(true);
    try {
      const response = await fetch('/api/export-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: generatedCourse,
          format: format,
          includeVideoLinks: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export notes');
      }

      // Download the generated file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedCourse.title || 'course'}-notes.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to export notes. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f17]">
      <div className="max-w-6xl mx-auto p-6 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold text-white">
              AI Course Generator
            </h1>
          </div>
          <p className="text-white/50 max-w-2xl mx-auto">
            Generate comprehensive, structured courses with AI-powered content and bilingual YouTube videos
          </p>
        </motion.div>

        {/* User Input Form */}
        <Card className="bg-[#1C1C29] border border-white/10 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
          <CardHeader className="bg-[#14151C] border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              Course Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">

            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">
                Course Topic
              </label>
              <Input
                placeholder="e.g., Machine Learning, React.js, Digital Marketing..."
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="text-lg h-12 bg-[#14151C] border border-white/10 text-white placeholder-white/30 focus:border-[#9B6BFF]"
              />
            </div>

            {/* Difficulty Level Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-white/70">
                Difficulty Level
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficultyLevels.map((level) => (
                  <motion.div
                    key={level.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      onClick={() => setFormData(prev => ({ ...prev, level: level.value }))}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${formData.level === level.value
                        ? 'border-[#9B6BFF] bg-[#9B6BFF]/20'
                        : 'border-white/10 bg-[#14151C] hover:border-[#9B6BFF]/50'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{level.icon}</span>
                        <span className="font-semibold text-white">
                          {level.label}
                        </span>
                      </div>
                      <p className="text-sm text-white/50">
                        {level.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Video Integration Options */}
            <div className="space-y-4 p-4 bg-[#14151C] border border-white/10 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#57D1FF]" />
                  <span className="font-medium text-white">
                    Video Integration
                  </span>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.includeVideos}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeVideos: e.target.checked }))}
                    className="w-4 h-4 text-[#9B6BFF] rounded bg-[#14151C] border-white/10"
                  />
                  <span className="text-sm text-white/70">Include YouTube Videos</span>
                </label>
              </div>

              {formData.includeVideos && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center justify-between pt-3 border-t border-white/10"
                >
                  <span className="text-sm text-white/70">
                    Default Language:
                  </span>
                  <div className="flex gap-2">
                    {[
                      { value: 'auto', label: 'Auto', flag: '🌐' },
                      { value: 'en', label: 'English', flag: '🇺🇸' },
                      { value: 'hi', label: 'हिंदी', flag: '🇮🇳' }
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setFormData(prev => ({ ...prev, preferredLanguage: lang.value }))}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${formData.preferredLanguage === lang.value
                          ? 'bg-[#9B6BFF] text-white'
                          : 'bg-[#1C1C29] text-white/70 hover:bg-[#272732]'
                          }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateCourse}
              disabled={isGenerating || !formData.topic.trim()}
              className="w-full h-12 text-lg font-semibold bg-[#9B6BFF] hover:bg-[#8a59ff] text-white"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Course...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span>Generate Course</span>
                </div>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Generated Course Content */}
        <AnimatePresence>
          {generatedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >

              {/* Course Overview */}
              <Card className="bg-[#1C1C29] border border-white/10 rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
                <CardHeader className="bg-[#14151C] border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-white">
                      {generatedCourse.title}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleExportNotes('pdf')}
                        disabled={isExporting}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {isExporting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                        Export PDF
                      </Button>
                      <Button
                        onClick={() => handleExportNotes('docx')}
                        disabled={isExporting}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <FileText className="w-4 h-4" />
                        Export DOCX
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Level: {formData.level}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {generatedCourse.modules?.length || 0} Modules
                      </span>
                      {formData.includeVideos && (
                        <span className="flex items-center gap-1">
                          <Video className="w-4 h-4" />
                          Videos Included
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 leading-relaxed">
                      {generatedCourse.overview}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Course Modules */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6" />
                  Course Modules
                </h2>

                {generatedCourse.modules?.map((module, index) => (
                  <motion.div
                    key={module.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-[#1C1C29] border border-white/10">
                      <CardContent className="p-6 space-y-6">

                        {/* Module Header */}
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-[#9B6BFF] text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white mb-2">
                              {module.title}
                            </h3>
                            {module.description && (
                              <p className="text-white/60">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Key Learning Points */}
                        {module.keyPoints && module.keyPoints.length > 0 && (
                          <div className="bg-[#14151C] border border-white/10 rounded-xl p-4">
                            <h4 className="font-semibold text-[#57D1FF] mb-3 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              Key Learning Points
                            </h4>
                            <ul className="space-y-2">
                              {module.keyPoints.map((point, pointIndex) => (
                                <li key={pointIndex} className="flex items-start gap-2 text-white/70">
                                  <span className="w-1.5 h-1.5 bg-[#57D1FF] rounded-full mt-2 flex-shrink-0" />
                                  <span className="text-sm">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Detailed Explanation */}
                        {module.explanation && (
                          <div className="bg-[#14151C] border border-white/10 rounded-xl p-4">
                            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Detailed Explanation
                            </h4>
                            <div className="prose prose-sm prose-invert max-w-none">
                              <p className="text-white/70 leading-relaxed">
                                {module.explanation}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Example/Analogy */}
                        {module.example && (
                          <div className="bg-[#14151C] border border-[#9B6BFF]/30 rounded-xl p-4">
                            <h4 className="font-semibold text-[#9B6BFF] mb-3 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              Example & Analogy
                            </h4>
                            <p className="text-white/70 text-sm leading-relaxed">
                              {module.example}
                            </p>
                          </div>
                        )}

                        {/* YouTube Videos Integration */}
                        {formData.includeVideos && module.videos && module.videos.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-semibold text-white flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              Related Videos
                            </h4>
                            <div className="grid gap-4">
                              {module.videos.map((video, videoIndex) => (
                                <div key={videoIndex} className="bg-[#14151C] border border-white/10 rounded-xl p-4">
                                  <BilingualYouTubeEmbed
                                    url={video.url}
                                    title={video.title || `${module.title} - Video ${videoIndex + 1}`}
                                    autoPlay={false}
                                    showControls={true}
                                    defaultLanguage={formData.preferredLanguage === 'auto' ? null : formData.preferredLanguage}
                                    className="max-w-full"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
