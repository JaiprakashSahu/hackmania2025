'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Code, Heart, Palette, BookOpen, Brain, Zap, Clock, ChevronRight, Sparkles, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthGuard from '@/components/AuthGuard';
import LoadingModal from '@/components/LoadingModal';

export default function CreateCourse() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [courseData, setCourseData] = useState({
    category: '',
    topic: '',
    description: '',
    difficulty: '',
    duration: '',
    chapterCount: '',
    includeVideos: false,
    includeQuiz: false,
    preferredLanguage: 'auto' // Default language for video content
  });

  const categories = [
    { id: 'programming', name: 'Programming', icon: Code, color: 'from-blue-500 to-cyan-500', description: 'Learn coding and software development' },
    { id: 'health', name: 'Health & Fitness', icon: Heart, color: 'from-red-500 to-pink-500', description: 'Wellness, nutrition, and physical health' },
    { id: 'creative', name: 'Creative Arts', icon: Palette, color: 'from-purple-500 to-indigo-500', description: 'Design, art, and creative skills' },
    { id: 'business', name: 'Business', icon: BookOpen, color: 'from-green-500 to-emerald-500', description: 'Entrepreneurship and business skills' },
    { id: 'science', name: 'Science', icon: Brain, color: 'from-indigo-500 to-blue-500', description: 'Scientific concepts and research' },
    { id: 'technology', name: 'Technology', icon: Zap, color: 'from-yellow-500 to-orange-500', description: 'Latest tech trends and innovations' }
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const durations = ['1-2 hours', '3-5 hours', '6-10 hours', '10+ hours'];
  const chapterCounts = ['3-5', '6-8', '9-12', '12+'];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateCourse = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Starting course generation with data:', courseData);
      
      // Call course generation API
      const response = await fetch('/api/courses/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: courseData.topic,
          category: courseData.category,
          difficulty: courseData.difficulty,
          duration: courseData.duration,
          chapterCount: courseData.chapterCount,
          includeVideos: courseData.includeVideos,
          includeQuiz: courseData.includeQuiz,
          preferredLanguage: courseData.preferredLanguage
        }),
      });

      console.log('Generate course response status:', response.status);
      console.log('Generate course response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Generate course error response:', errorText);
        throw new Error(`Failed to generate course: ${response.status} ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Generated course data:', responseData);
      
      const { course: generatedCourse } = responseData;

      if (!generatedCourse) {
        throw new Error('No course data received from API');
      }

      // Save course to database
      const saveResponse = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: generatedCourse.title || generatedCourse.courseTitle || courseData.topic,
          description: generatedCourse.description || generatedCourse.courseDescription || (courseData.description || `Learn ${courseData.topic} with this comprehensive course.`),
          category: courseData.category,
          difficulty: courseData.difficulty,
          duration: courseData.duration,
          chapterCount: Array.isArray(generatedCourse.chapters) ? generatedCourse.chapters.length : 5,
          includeVideos: courseData.includeVideos,
          preferredLanguage: courseData.preferredLanguage,
          topic: courseData.topic,
          generatedChapters: generatedCourse.chapters || [],
          quizzes: generatedCourse.quizzes
        }),
      });

      console.log('Save course response status:', saveResponse.status);
      console.log('Save course response ok:', saveResponse.ok);

      if (!saveResponse.ok) {
        const errorText = await saveResponse.text();
        console.error('Save course error response:', errorText);
        throw new Error(`Failed to save course: ${saveResponse.status} ${errorText}`);
      }

      const { course: savedCourse } = await saveResponse.json();
      console.log('Saved course:', savedCourse);
      
      // Redirect to the course page
      router.push(`/course/${savedCourse.id}`);
      
    } catch (error) {
      console.error('Error generating course:', error);
      // Show a more user-friendly error message
      const errorMessage = error.message.includes('Failed to generate course') 
        ? 'Course generation failed. Please try again with different parameters.'
        : error.message.includes('Failed to save course')
        ? 'Course was generated but failed to save. Please try again.'
        : 'An unexpected error occurred. Please try again.';
      
      alert(`Failed to generate course: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const updateCourseData = (field, value) => {
    setCourseData(prev => ({ ...prev, [field]: value }));
  };


  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div 
        className="text-center mb-8 bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/30 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="w-20 h-20 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-3">Choose Course Category</h2>
        <p className="text-white/70 text-xl">Select the category that best fits your course topic</p>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -12, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-500 hover:shadow-2xl border-0 bg-black/20 backdrop-blur-xl ${
                courseData.category === category.id 
                  ? 'ring-2 ring-purple-400 shadow-lg shadow-purple-500/30' 
                  : 'border-white/10 hover:border-purple-400/50'
              }`}
              onClick={() => updateCourseData('category', category.id)}
            >
              <CardContent className="p-8 text-center relative overflow-hidden">
                {/* Holographic overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                
                <motion.div 
                  className={`icon-wrapper w-20 h-20 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}
                  animate={courseData.category === category.id ? {
                    boxShadow: ['0 0 20px rgba(168,85,247,0.5)', '0 0 30px rgba(168,85,247,0.8)', '0 0 20px rgba(168,85,247,0.5)'],
                    scale: [1, 1.1, 1]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <category.icon className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-white relative z-10">{category.name}</h3>
                <p className="text-sm leading-relaxed text-white/70 relative z-10">{category.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <motion.div 
        className="text-center mb-8 bg-gradient-to-br from-black/30 via-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-3xl p-10 border border-blue-500/40 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
              animate={{
                x: [0, 120, 0],
                y: [0, -60, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${15 + i * 12}%`,
                top: `${25 + i * 8}%`,
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/50 relative z-10"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 30px rgba(59, 130, 246, 0.5)",
              "0 0 50px rgba(168, 85, 247, 0.7)",
              "0 0 30px rgba(59, 130, 246, 0.5)"
            ]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity },
            boxShadow: { duration: 3, repeat: Infinity }
          }}
        >
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="w-12 h-12 text-white drop-shadow-lg" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-5xl font-bold text-white bg-gradient-to-r from-white via-blue-200 via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Course Details
        </motion.h2>
        
        <motion.p 
          className="text-white/80 text-xl relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Tell us about your course topic and description
        </motion.p>
      </motion.div>
      
      <div className="space-y-8 max-w-3xl mx-auto">
        <motion.div 
          className="bg-gradient-to-br from-black/30 via-blue-900/20 to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/40 shadow-2xl relative overflow-hidden group hover:shadow-blue-500/25 transition-all duration-500"
          initial={{ opacity: 0, x: -50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating icon */}
          <motion.div 
            className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center opacity-20"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
          >
            <span className="text-white text-xs">📝</span>
          </motion.div>
          
          <motion.label 
            className="block text-xl font-bold mb-4 text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Course Topic *
          </motion.label>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
          <Input
            placeholder="e.g., JavaScript Fundamentals for Beginners"
            value={courseData.topic}
            onChange={(e) => updateCourseData('topic', e.target.value)}
              className="w-full h-16 text-lg border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/60 focus:border-blue-400/60 focus:ring-blue-400/30 hover:border-white/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 rounded-2xl relative z-10"
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-br from-black/30 via-purple-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/40 shadow-2xl relative overflow-hidden group hover:shadow-purple-500/25 transition-all duration-500"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-cyan-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating icon */}
          <motion.div 
            className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center opacity-20"
            animate={{ 
              rotate: [0, -360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity }
            }}
          >
            <span className="text-white text-xs">📄</span>
          </motion.div>
          
          <motion.label 
            className="block text-xl font-bold mb-4 text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Description (Optional)
          </motion.label>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
          <textarea
            placeholder="Describe what students will learn in this course..."
            value={courseData.description}
            onChange={(e) => updateCourseData('description', e.target.value)}
              className="w-full h-48 px-6 py-6 border-2 border-white/20 bg-white/10 backdrop-blur-xl text-white placeholder:text-white/60 focus:border-purple-400/60 focus:ring-purple-400/30 hover:border-white/40 hover:bg-white/15 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 resize-none text-lg leading-relaxed rounded-2xl relative z-10"
          />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <motion.div 
        className="text-center mb-8 bg-gradient-to-br from-black/30 via-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-3xl p-10 border border-purple-500/40 shadow-2xl relative overflow-hidden"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 animate-pulse"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="w-24 h-24 bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-500/50 relative z-10"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 30px rgba(34, 197, 94, 0.5)",
              "0 0 50px rgba(59, 130, 246, 0.7)",
              "0 0 30px rgba(34, 197, 94, 0.5)"
            ]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity },
            boxShadow: { duration: 3, repeat: Infinity }
          }}
        >
          <motion.div
            animate={{ rotate: [0, -360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-12 h-12 text-white drop-shadow-lg" />
          </motion.div>
        </motion.div>
        
        <motion.h2 
          className="text-5xl font-bold text-white bg-gradient-to-r from-white via-purple-200 via-blue-200 to-cyan-200 bg-clip-text text-transparent mb-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Course Options
        </motion.h2>
        
        <motion.p 
          className="text-white/80 text-xl relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          Customize your course settings with precision
        </motion.p>
      </motion.div>
      
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="bg-gradient-to-br from-black/30 via-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/40 shadow-2xl relative overflow-hidden group hover:shadow-purple-500/25 transition-all duration-500"
            initial={{ opacity: 0, x: -50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating icon */}
            <motion.div 
              className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center opacity-20"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <span className="text-white text-xs">⚡</span>
            </motion.div>
            
            <motion.label 
              className="block text-xl font-bold mb-4 text-white bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Difficulty Level
            </motion.label>
            
            <Select value={courseData.difficulty} onValueChange={(value) => updateCourseData('difficulty', value)}>
              <SelectTrigger className="h-18 text-lg rounded-2xl border-2 border-white/30 bg-gradient-to-r from-white/15 via-purple-500/10 to-blue-500/10 backdrop-blur-xl text-white placeholder:text-white/60 focus:border-purple-400/80 focus:ring-purple-400/40 hover:border-white/50 hover:bg-gradient-to-r hover:from-white/20 hover:via-purple-500/15 hover:to-blue-500/15 transition-all duration-300 shadow-xl hover:shadow-purple-500/30 [&>span]:text-white relative z-10 group">
                <SelectValue placeholder="Select difficulty" />
                <motion.div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  animate={{ rotate: [0, 180, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-black/95 via-purple-900/90 to-blue-900/90 backdrop-blur-xl border border-white/30 text-white rounded-2xl shadow-2xl p-2">
                {difficulties.map((diff, index) => (
                  <SelectItem 
                    key={diff} 
                    value={diff} 
                    className="text-white hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-blue-500/30 focus:bg-gradient-to-r focus:from-purple-500/30 focus:to-blue-500/30 transition-all duration-200 rounded-xl m-1 p-3 cursor-pointer"
                  >
                    <span className="font-medium">{diff}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-black/30 via-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/40 shadow-2xl relative overflow-hidden group hover:shadow-blue-500/25 transition-all duration-500"
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-cyan-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating icon */}
            <motion.div 
              className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center opacity-20"
              animate={{ 
                rotate: [0, -360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity }
              }}
            >
              <span className="text-white text-xs">⏱️</span>
            </motion.div>
            
            <motion.label 
              className="block text-xl font-bold mb-4 text-white bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Course Duration
            </motion.label>
            
            <Select value={courseData.duration} onValueChange={(value) => updateCourseData('duration', value)}>
              <SelectTrigger className="h-18 text-lg rounded-2xl border-2 border-white/30 bg-gradient-to-r from-white/15 via-blue-500/10 to-cyan-500/10 backdrop-blur-xl text-white placeholder:text-white/60 focus:border-blue-400/80 focus:ring-blue-400/40 hover:border-white/50 hover:bg-gradient-to-r hover:from-white/20 hover:via-blue-500/15 hover:to-cyan-500/15 transition-all duration-300 shadow-xl hover:shadow-blue-500/30 [&>span]:text-white relative z-10 group">
                <SelectValue placeholder="Select duration" />
                <motion.div
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  animate={{ rotate: [0, 180, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-black/95 via-blue-900/90 to-cyan-900/90 backdrop-blur-xl border border-white/30 text-white rounded-2xl shadow-2xl p-2">
                {durations.map((dur, index) => (
                  <SelectItem 
                    key={dur} 
                    value={dur} 
                    className="text-white hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-500/30 focus:bg-gradient-to-r focus:from-blue-500/30 focus:to-cyan-500/30 transition-all duration-200 rounded-xl m-1 p-3 cursor-pointer"
                  >
                    <span className="font-medium">{dur}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </div>
        
        <motion.div 
          className="bg-gradient-to-br from-black/30 via-cyan-900/20 to-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/40 shadow-2xl relative overflow-hidden group hover:shadow-cyan-500/25 transition-all duration-500"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 via-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Floating icon */}
          <motion.div 
            className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center opacity-20"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity }
            }}
          >
            <span className="text-white text-xs">📚</span>
          </motion.div>
          
          <motion.label 
            className="block text-xl font-bold mb-4 text-white bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Number of Chapters
          </motion.label>
          
          <Select value={courseData.chapterCount} onValueChange={(value) => updateCourseData('chapterCount', value)}>
            <SelectTrigger className="h-18 text-lg rounded-2xl border-2 border-white/30 bg-gradient-to-r from-white/15 via-cyan-500/10 to-purple-500/10 backdrop-blur-xl text-white placeholder:text-white/60 focus:border-cyan-400/80 focus:ring-cyan-400/40 hover:border-white/50 hover:bg-gradient-to-r hover:from-white/20 hover:via-cyan-500/15 hover:to-purple-500/15 transition-all duration-300 shadow-xl hover:shadow-cyan-500/30 [&>span]:text-white relative z-10 group">
              <SelectValue placeholder="Select chapter count" />
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: [0, 180, 0] }}
                transition={{ duration: 0.3 }}
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </SelectTrigger>
            <SelectContent className="bg-gradient-to-br from-black/95 via-cyan-900/90 to-purple-900/90 backdrop-blur-xl border border-white/30 text-white rounded-2xl shadow-2xl p-2">
              {chapterCounts.map((count, index) => (
                <SelectItem 
                  key={count} 
                  value={count} 
                  className="text-white hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-500/30 focus:bg-gradient-to-r focus:from-cyan-500/30 focus:to-purple-500/30 transition-all duration-200 rounded-xl m-1 p-3 cursor-pointer"
                >
                  <span className="font-medium">{count} chapters</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
        
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Video option */}
          <motion.div 
            className="bg-gradient-to-br from-black/30 via-red-900/20 to-orange-900/20 backdrop-blur-xl rounded-3xl p-8 border border-red-500/40 shadow-2xl relative overflow-hidden group hover:shadow-red-500/25 transition-all duration-500"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-orange-600/5 to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating icon */}
            <motion.div 
              className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center opacity-20"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <span className="text-white text-xs">🎥</span>
            </motion.div>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center space-x-4">
                <motion.input
              type="checkbox"
              id="includeVideos"
              checked={courseData.includeVideos}
              onChange={(e) => updateCourseData('includeVideos', e.target.checked)}
                  className="w-6 h-6 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-xl text-red-500 focus:ring-red-400/30 focus:ring-2 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                <motion.label 
                  htmlFor="includeVideos" 
                  className="text-xl font-bold text-white bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent flex items-center space-x-3 cursor-pointer"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Video className="w-6 h-6 text-red-400" />
                  <span>Include YouTube Videos</span>
                  <div className="text-sm font-normal text-white/70 ml-2">
                    (Automatically find relevant videos for each chapter)
                  </div>
                </motion.label>
              </div>
              
              {/* Video inclusion info with language preference */}
              {courseData.includeVideos && (
                <motion.div 
                  className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3 text-white/80">
                    <Sparkles className="w-5 h-5 text-red-400" />
                    <div>
                      <p className="text-sm font-medium">Smart Video Integration Enabled</p>
                      <p className="text-xs text-white/60 mt-1">
                        Our AI will automatically find and embed relevant YouTube videos for each chapter with bilingual support.
                      </p>
                    </div>
                  </div>
                  
                  {/* Language Preference Selection */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-white/80">Preferred Language:</span>
                    </div>
                    <div className="flex space-x-2">
                      {[
                        { value: 'auto', label: 'Auto', flag: '🌐' },
                        { value: 'en', label: 'English', flag: '🇺🇸' },
                        { value: 'hi', label: 'हिंदी', flag: '🇮🇳' }
                      ].map((lang) => (
                        <motion.button
                          key={lang.value}
                          type="button"
                          onClick={() => updateCourseData('preferredLanguage', lang.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1 ${
                            courseData.preferredLanguage === lang.value
                              ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                              : 'bg-white/10 text-white/70 hover:bg-white/15 border border-white/20'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-black/30 via-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-3xl p-8 border border-green-500/40 shadow-2xl relative overflow-hidden group hover:shadow-green-500/25 transition-all duration-500"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Floating icon */}
            <motion.div 
              className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center opacity-20"
              animate={{ 
                rotate: [0, -360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity }
              }}
            >
              <span className="text-white text-xs">🧠</span>
            </motion.div>
            
            <div className="flex items-center space-x-4 relative z-10">
              <motion.input
              type="checkbox"
              id="includeQuiz"
              checked={courseData.includeQuiz}
              onChange={(e) => updateCourseData('includeQuiz', e.target.checked)}
                className="w-6 h-6 rounded-lg border-2 border-white/30 bg-white/10 backdrop-blur-xl text-green-500 focus:ring-green-400/30 focus:ring-2 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.label 
                htmlFor="includeQuiz" 
                className="text-xl font-bold text-white bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent flex items-center space-x-3 cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                >
                  <Brain className="w-8 h-8 text-green-400 drop-shadow-lg" />
                </motion.div>
              <span>Include quiz questions for each module</span>
              </motion.label>
          </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return courseData.category;
      case 2:
        return courseData.topic.trim();
      case 3:
        return courseData.difficulty && courseData.duration && courseData.chapterCount;
      default:
        return false;
    }
  };

  const canGoBack = () => currentStep > 1;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 relative overflow-hidden">
        {/* Holographic Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-blue-500/20"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_purple-500/10_60deg,_transparent_120deg,_blue-500/10_180deg,_transparent_240deg,_purple-500/10_300deg,_transparent_360deg)] animate-spin [animation-duration:20s]"></div>
        
        {/* Header with Enhanced Glass Effect */}
        <div className="bg-black/20 backdrop-blur-2xl border-b border-purple-500/30 shadow-2xl relative z-10">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-3 text-white/90 hover:text-purple-300 hover:bg-purple-500/20 rounded-xl px-4 py-2 transition-all duration-300 border border-white/10 hover:border-purple-400/50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Button>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">Create New Course</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="bg-black/10 backdrop-blur-xl border-b border-purple-500/20 relative z-10">
          <div className="max-w-5xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <motion.div key={step} className="flex items-center">
                  <motion.div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-500 ${
                      step <= currentStep 
                        ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg shadow-purple-500/50 scale-110' 
                        : 'bg-white/10 text-white/60 border border-white/20'
                    }`}
                    animate={step <= currentStep ? { 
                      boxShadow: ['0 0 20px rgba(168,85,247,0.5)', '0 0 30px rgba(168,85,247,0.8)', '0 0 20px rgba(168,85,247,0.5)'],
                      scale: [1.1, 1.15, 1.1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {step}
                  </motion.div>
                  {step < 3 && (
                    <motion.div 
                      className={`w-20 h-1 mx-4 transition-all duration-500 ${
                        step < currentStep ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-white/20'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: step < currentStep ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-6 py-12 relative z-10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </AnimatePresence>

          {/* Enhanced Navigation Buttons */}
          <motion.div 
            className="flex justify-between items-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={!canGoBack()}
              className="flex items-center space-x-3 px-8 py-4 text-lg font-medium rounded-xl border-white/20 text-white/80 hover:text-white hover:bg-purple-500/20 hover:border-purple-400/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Previous</span>
            </Button>

            {currentStep < 3 ? (
              <Button
                variant="purple"
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center space-x-3 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </Button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="purple"
                  size="lg"
                  onClick={handleGenerateCourse}
                  disabled={!canProceed() || isGenerating}
                  className="flex items-center space-x-3 px-12 py-4 text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <motion.div
                    animate={isGenerating ? { rotate: 360 } : {}}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-6 h-6" />
                  </motion.div>
                  <span>{isGenerating ? 'Generating...' : 'Generate Course with AI'}</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Loading Modal */}
        <LoadingModal 
          isOpen={isGenerating} 
          onOpenChange={setIsGenerating}
        />
      </div>
    </AuthGuard>
  );
}
