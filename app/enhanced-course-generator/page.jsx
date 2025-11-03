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
  CheckCircle,
  XCircle,
  FileText,
  Video,
  Lightbulb,
  Target,
  Clock,
  Sparkles,
  Award,
  RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import BilingualYouTubeEmbed from '@/components/BilingualYouTubeEmbed';

/**
 * Enhanced AI Course Generator with Quiz Functionality
 * 
 * Features:
 * 1. AI-generated structured course content with difficulty scaling
 * 2. Interactive quizzes after each module (W3Schools style)
 * 3. Bilingual YouTube video integration
 * 4. Progress tracking and scoring
 * 5. Export functionality for notes and quizzes
 * 6. localStorage for quiz attempts and progress
 */
export default function EnhancedCourseGenerator() {
  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    level: 'Beginner',
    includeVideos: true,
    includeQuizzes: true
  });

  // Course generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [error, setError] = useState(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [showResults, setShowResults] = useState({});
  const [courseProgress, setCourseProgress] = useState(0);

  // Export state
  const [isExporting, setIsExporting] = useState(false);

  // Load saved progress from localStorage
  useEffect(() => {
    if (generatedCourse) {
      const savedProgress = localStorage.getItem(`course_progress_${generatedCourse.id}`);
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setQuizResults(progress.quizResults || {});
        setShowResults(progress.showResults || {});
        calculateProgress(progress.quizResults || {});
      }
    }
  }, [generatedCourse]);

  // Save progress to localStorage
  const saveProgress = (results, shown) => {
    if (generatedCourse) {
      const progress = {
        quizResults: results,
        showResults: shown,
        timestamp: Date.now()
      };
      localStorage.setItem(`course_progress_${generatedCourse.id}`, JSON.stringify(progress));
    }
  };

  // Calculate course completion progress
  const calculateProgress = (results) => {
    if (!generatedCourse?.modules) return;
    
    const totalQuizzes = generatedCourse.modules.length;
    const completedQuizzes = Object.keys(results).length;
    const progress = (completedQuizzes / totalQuizzes) * 100;
    setCourseProgress(progress);
  };

  // Generate course with AI
  const handleGenerateCourse = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic to generate a course');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/enhanced-course-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate course: ${response.status}`);
      }

      const courseData = await response.json();
      courseData.id = Date.now(); // Add unique ID for localStorage
      setGeneratedCourse(courseData);
      setQuizAnswers({});
      setQuizResults({});
      setShowResults({});
      setCourseProgress(0);
    } catch (err) {
      setError(err.message || 'Failed to generate course. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle quiz answer selection
  const handleQuizAnswer = (moduleId, questionIndex, selectedOption) => {
    setQuizAnswers(prev => ({
      ...prev,
      [`${moduleId}_${questionIndex}`]: selectedOption
    }));
  };

  // Check quiz answers for a module
  const checkModuleQuiz = (moduleId) => {
    const module = generatedCourse.modules.find(m => m.id === moduleId);
    if (!module?.quiz) return;

    let correctAnswers = 0;
    const results = {};

    module.quiz.forEach((question, index) => {
      const userAnswer = quizAnswers[`${moduleId}_${index}`];
      const isCorrect = userAnswer === question.answer;
      if (isCorrect) correctAnswers++;
      
      results[`${moduleId}_${index}`] = {
        correct: isCorrect,
        userAnswer,
        correctAnswer: question.answer,
        explanation: question.explanation
      };
    });

    const newQuizResults = { ...quizResults, [moduleId]: { correctAnswers, total: module.quiz.length, results } };
    const newShowResults = { ...showResults, [moduleId]: true };

    setQuizResults(newQuizResults);
    setShowResults(newShowResults);
    calculateProgress(newQuizResults);
    saveProgress(newQuizResults, newShowResults);
  };

  // Reset quiz for a module
  const resetModuleQuiz = (moduleId) => {
    const newQuizResults = { ...quizResults };
    const newShowResults = { ...showResults };
    delete newQuizResults[moduleId];
    delete newShowResults[moduleId];

    // Clear answers for this module
    const newQuizAnswers = { ...quizAnswers };
    Object.keys(newQuizAnswers).forEach(key => {
      if (key.startsWith(`${moduleId}_`)) {
        delete newQuizAnswers[key];
      }
    });

    setQuizResults(newQuizResults);
    setShowResults(newShowResults);
    setQuizAnswers(newQuizAnswers);
    calculateProgress(newQuizResults);
    saveProgress(newQuizResults, newShowResults);
  };

  // Export course notes
  const handleExportNotes = async (format = 'pdf') => {
    if (!generatedCourse) return;

    setIsExporting(true);
    try {
      const response = await fetch('/api/export-enhanced-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course: generatedCourse,
          quizResults: quizResults,
          format: format
        }),
      });

      if (!response.ok) throw new Error('Failed to export notes');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedCourse.title || 'course'}-complete.${format}`;
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

  const difficultyLevels = [
    { value: 'Beginner', icon: '🌱', color: 'from-green-500 to-emerald-500', description: 'Simple concepts, basic examples' },
    { value: 'Intermediate', icon: '🚀', color: 'from-blue-500 to-cyan-500', description: 'Technical details, practical scenarios' },
    { value: 'Advanced', icon: '🎯', color: 'from-purple-500 to-pink-500', description: 'Complex problems, professional level' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Enhanced AI Course Generator
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate comprehensive courses with AI-powered content, interactive quizzes, and bilingual videos
          </p>
        </motion.div>

        {/* Course Configuration Form */}
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
              <Sparkles className="w-5 h-5" />
              Course Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Course Topic
              </label>
              <Input
                placeholder="e.g., JavaScript Fundamentals, Machine Learning, Digital Marketing..."
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="text-lg h-12"
              />
            </div>

            {/* Difficulty Level */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.level === level.value
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{level.icon}</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {level.value}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {level.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Include YouTube Videos</span>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.includeVideos}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeVideos: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">Include Interactive Quizzes</span>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.includeQuizzes}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeQuizzes: e.target.checked }))}
                    className="w-4 h-4 text-green-600 rounded"
                  />
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerateCourse}
              disabled={isGenerating || !formData.topic.trim()}
              className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
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
              
              {/* Course Overview with Progress */}
              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-green-900 dark:text-green-100 mb-2">
                        {generatedCourse.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-green-700 dark:text-green-300">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {formData.level}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {generatedCourse.modules?.length || 0} Modules
                        </span>
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {Math.round(courseProgress)}% Complete
                        </span>
                      </div>
                      {courseProgress > 0 && (
                        <div className="mt-3">
                          <Progress value={courseProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleExportNotes('pdf')}
                        disabled={isExporting}
                        variant="outline"
                        size="sm"
                      >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {generatedCourse.overview}
                  </p>
                </CardContent>
              </Card>

              {/* Course Modules */}
              <div className="space-y-6">
                {generatedCourse.modules?.map((module, index) => (
                  <ModuleCard
                    key={module.id || index}
                    module={module}
                    index={index}
                    formData={formData}
                    quizAnswers={quizAnswers}
                    quizResults={quizResults}
                    showResults={showResults}
                    onQuizAnswer={handleQuizAnswer}
                    onCheckQuiz={checkModuleQuiz}
                    onResetQuiz={resetModuleQuiz}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Module Card Component
function ModuleCard({ 
  module, 
  index, 
  formData, 
  quizAnswers, 
  quizResults, 
  showResults, 
  onQuizAnswer, 
  onCheckQuiz, 
  onResetQuiz 
}) {
  const moduleResult = quizResults[module.id];
  const showResult = showResults[module.id];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 space-y-6">
          
          {/* Module Header */}
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold">
              {index + 1}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {module.title}
              </h3>
              {moduleResult && (
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Quiz Score: {moduleResult.correctAnswers}/{moduleResult.total}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Key Points */}
          {module.keyPoints && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Key Learning Points
              </h4>
              <ul className="space-y-2">
                {module.keyPoints.map((point, pointIndex) => (
                  <li key={pointIndex} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Explanation */}
          {module.explanation && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Detailed Explanation
              </h4>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {module.explanation}
              </p>
            </div>
          )}

          {/* Example */}
          {module.example && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Practical Example
              </h4>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
                {module.example}
              </p>
            </div>
          )}

          {/* YouTube Video */}
          {formData.includeVideos && module.videos && module.videos.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Related Video
              </h4>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <BilingualYouTubeEmbed
                  url={module.videos[0].url}
                  title={module.videos[0].title}
                  autoPlay={false}
                  showControls={true}
                  className="max-w-full"
                />
              </div>
            </div>
          )}

          {/* Interactive Quiz */}
          {formData.includeQuizzes && module.quiz && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Test Your Knowledge
                </h4>
                {showResult && (
                  <Button
                    onClick={() => onResetQuiz(module.id)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {module.quiz.map((question, qIndex) => (
                  <QuizQuestion
                    key={qIndex}
                    question={question}
                    questionIndex={qIndex}
                    moduleId={module.id}
                    selectedAnswer={quizAnswers[`${module.id}_${qIndex}`]}
                    result={showResult ? moduleResult?.results[`${module.id}_${qIndex}`] : null}
                    onAnswerSelect={onQuizAnswer}
                    disabled={showResult}
                  />
                ))}
              </div>
              
              {!showResult ? (
                <Button
                  onClick={() => onCheckQuiz(module.id)}
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                  disabled={module.quiz.some((_, qIndex) => !quizAnswers[`${module.id}_${qIndex}`])}
                >
                  Check Answers
                </Button>
              ) : (
                <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    {moduleResult.correctAnswers === moduleResult.total ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-orange-500" />
                    )}
                    <span className="font-semibold">
                      Score: {moduleResult.correctAnswers}/{moduleResult.total}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {moduleResult.correctAnswers === moduleResult.total 
                      ? "Perfect! You've mastered this module." 
                      : "Good effort! Review the explanations and try again."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quiz Question Component
function QuizQuestion({ 
  question, 
  questionIndex, 
  moduleId, 
  selectedAnswer, 
  result, 
  onAnswerSelect, 
  disabled 
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border">
      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
        {questionIndex + 1}. {question.question}
      </h5>
      
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = result && option === result.correctAnswer;
          const isWrong = result && isSelected && !result.correct;
          
          return (
            <label
              key={optionIndex}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                disabled
                  ? isCorrect
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : isWrong
                    ? 'bg-red-50 border-red-200 text-red-800'
                    : 'bg-gray-50 border-gray-200'
                  : isSelected
                  ? 'bg-purple-50 border-purple-200'
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <input
                type="radio"
                name={`${moduleId}_${questionIndex}`}
                value={option}
                checked={isSelected}
                onChange={() => onAnswerSelect(moduleId, questionIndex, option)}
                disabled={disabled}
                className="w-4 h-4 text-purple-600"
              />
              <span className="flex-1">{option}</span>
              {result && isCorrect && <CheckCircle className="w-4 h-4 text-green-500" />}
              {result && isWrong && <XCircle className="w-4 h-4 text-red-500" />}
            </label>
          );
        })}
      </div>
      
      {result && result.explanation && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Explanation:</strong> {result.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
