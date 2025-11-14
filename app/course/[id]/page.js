'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Zap, Clock, Play, Edit3, Save, X, ListTree, ChevronDown, Video, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthGuard from '@/components/AuthGuard';
import YouTubeVideo from '@/components/YouTubeVideo';
import { getYouTubeEmbedUrl } from '@/lib/utils/youtube';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ModuleQuiz from '@/components/ModuleQuiz';
import ChatTutor from '@/components/chat/ChatTutor';
import CourseProgressCard from '@/components/CourseProgressCard';

export default function CourseDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({});
  const [activeChapterId, setActiveChapterId] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const [completedModules, setCompletedModules] = useState(new Set());
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  useEffect(() => {
    if (course?.chapters?.length && !activeChapterId) {
      setActiveChapterId(course.chapters[0].id);
    }
    // Support new modules structure
    if (course?.modules?.length && activeModuleIndex === 0) {
      setActiveModuleIndex(0);
    }
  }, [course, activeChapterId]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCourse(data.course);
      } else {
        console.error('Failed to fetch course');
        setCourse(null);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      setCourse(null);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const saveEdit = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const EditableField = ({ value, onSave, placeholder, className = '' }) => {
    const [editValue, setEditValue] = useState(value);
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          className={className}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave(editValue);
            if (e.key === 'Escape') {
              setEditValue(value);
              onSave(value);
            }
          }}
        />
        <Button size="sm" variant="ghost" onClick={() => onSave(editValue)} className="h-10 w-10 p-2">
          <Save className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => { setEditValue(value); onSave(value); }} className="h-10 w-10 p-2">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    try {
      if (/youtube\.com\/embed\//i.test(url)) return url;
      const watchMatch = url.match(/[?&]v=([^&\n?#]+)/i);
      if (watchMatch && watchMatch[1]) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
      }
      const shortMatch = url.match(/youtu\.be\/([^&\n?#]+)/i);
      if (shortMatch && shortMatch[1]) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
      }
      return null;
    } catch {
      return null;
    }
  };

  const toggleChapterExpansion = (chapterId) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const handleModuleComplete = (moduleIndex) => {
    setCompletedModules(prev => new Set([...prev, moduleIndex]));
    // Auto-navigate to next module if available
    if (course?.modules && moduleIndex < course.modules.length - 1) {
      setActiveModuleIndex(moduleIndex + 1);
    }
  };

  const goToModule = (index) => {
    setActiveModuleIndex(index);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 animate-pulse shadow-lg shadow-purple-500/50">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <p className="text-white/70">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/50">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <p className="mb-4 text-white/70">Course not found or failed to load</p>
          <p className="mb-6 text-sm text-white/50">The course may have been deleted or there was an error loading it.</p>
          <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const activeChapter = course.chapters?.find((c) => c.id === activeChapterId) || null;
  const activeModule = course?.modules?.[activeModuleIndex];
  const hasModules = course?.modules && course.modules.length > 0;
  const progressPercentage = hasModules ? Math.round((completedModules.size / course.modules.length) * 100) : 0;
  
  // Calculate progress for the progress card
  const getProgressData = () => {
    if (hasModules && activeModule) {
      // For module-based courses
      const moduleIndex = course.modules.findIndex(m => m.id === activeModule.id);
      const modulesInChapter = activeChapter?.modules?.length || course.modules.length;
      return {
        completedModules: completedModules.size,
        totalModules: course.modules.length,
        nextModuleIndex: moduleIndex < course.modules.length - 1 ? moduleIndex + 1 : moduleIndex
      };
    } else if (activeChapter) {
      // For chapter-based courses
      const chapterModules = activeChapter.modules || [];
      const completedInChapter = chapterModules.filter((_, idx) => completedModules.has(idx)).length;
      return {
        completedModules: completedInChapter,
        totalModules: chapterModules.length,
        nextModuleIndex: 0
      };
    }
    return {
      completedModules: 0,
      totalModules: 0,
      nextModuleIndex: 0
    };
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-black relative overflow-hidden">
        {/* Subtle Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 dark:from-slate-500/10 via-transparent to-blue-500/10 dark:to-slate-700/10"></div>
        
        {/* Back Button */}
        <div className="relative z-10 pt-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
              className="flex items-center space-x-2 text-gray-800 dark:text-white/90 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 rounded-xl px-4 py-2 transition-all duration-300 border border-gray-200 dark:border-white/10 hover:border-purple-400/50 mb-6"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">Back to Dashboard</span>
                </Button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 md:pb-8 relative z-10">
          {/* Course Progress Card */}
          <CourseProgressCard 
            course={course}
            activeChapter={activeChapter}
            progress={getProgressData()}
          />
          {/* Course Videos Section */}
          {course?.includeVideos && course?.videoUrls && course.videoUrls.length > 0 && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="border border-white/15 bg-white/10 dark:bg-white/10 backdrop-blur-xl shadow-2xl">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Course Videos
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.videoUrls.map((url, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.4 }}
                      >
                        <YouTubeVideo 
                          url={url} 
                          title={`Course Video ${index + 1}`}
                          className="w-full"
                        />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Two-column layout - Module or Chapter based */}
          {hasModules ? (
            /* MODULE-BASED VIEW */
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
              {/* Left: Module List */}
              <Card id="chapters-list" className="lg:col-span-4 border border-white/15 bg-white/10 dark:bg-white/10 backdrop-blur-xl shadow-2xl order-2 lg:order-1">
                <CardHeader>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 h-5 text-purple-600 dark:text-purple-300" />
                      <CardTitle className="text-gray-900 dark:text-white">Modules</CardTitle>
                    </div>
                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-white/60">
                        <span>Progress</span>
                        <span>{completedModules.size} / {course.modules.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="sticky top-24 space-y-2 max-h-[600px] overflow-y-auto">
                    {course.modules.map((module, idx) => {
                      const isActive = idx === activeModuleIndex;
                      const isCompleted = completedModules.has(idx);
                      return (
                        <motion.button
                          key={idx}
                          onClick={() => goToModule(idx)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                            isActive
                              ? 'border-purple-400 bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-100 shadow-lg shadow-purple-500/30'
                              : 'border-gray-200 dark:border-white/10 hover:border-purple-400/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-gray-800 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-3 flex-1 min-w-0">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold flex-shrink-0 ${
                              isActive
                                ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50'
                                : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 group-hover:text-gray-900 dark:group-hover:text-white'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="line-clamp-2 text-sm font-medium">{module.title}</span>
                          </span>
                          {isCompleted && (
                            <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 ml-2" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Right: Module Content */}
              <div className="lg:col-span-8 order-1 lg:order-2">
                <AnimatePresence mode="wait">
                  {activeModule && (
                    <motion.div
                      key={activeModuleIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      {/* Module Content Card */}
                      <Card className="border border-white/15 bg-white/10 dark:bg-white/10 backdrop-blur-xl shadow-2xl">
                        <CardHeader>
                          <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {activeModule.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Module Videos */}
                          {activeModule?.videoUrls && activeModule.videoUrls.length > 0 && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <Video className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                                <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                                  Module Videos ({activeModule.videoUrls.length})
                                </h3>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                {activeModule.videoUrls.map((url, index) => (
                                  <div key={index} className="relative aspect-video overflow-hidden rounded-xl shadow-2xl border border-white/15 bg-white/5 dark:bg-white/10 backdrop-blur-md">
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                                    <iframe
                                      src={url}
                                      title={`Video ${index + 1}: ${activeModule.title}`}
                                      className="h-full w-full relative z-10 rounded-xl"
                                      width="100%"
                                      height="100%"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                      loading="lazy"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Module Content */}
                          <div className="markdown-content bg-white/5 dark:bg-white/5 p-4 sm:p-6 rounded-xl border border-white/15">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-purple-700 dark:text-purple-300" {...props} />,
                                p: ({node, ...props}) => <p className="text-gray-800 dark:text-white/80 leading-relaxed mb-4" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-800 dark:text-white/80" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-800 dark:text-white/80" {...props} />,
                                li: ({node, ...props}) => <li className="ml-4 leading-relaxed" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                                code: ({node, inline, ...props}) =>
                                  inline ? (
                                    <code className="bg-purple-200 dark:bg-purple-500/20 px-2 py-1 rounded text-purple-900 dark:text-purple-200 text-sm" {...props} />
                                  ) : (
                                    <code className="block bg-gray-900 dark:bg-black/30 p-4 rounded-lg text-green-400 dark:text-green-300 text-sm overflow-x-auto my-4 border border-purple-300 dark:border-purple-400/30" {...props} />
                                  ),
                              }}
                            >
                              {activeModule.description}
                            </ReactMarkdown>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Quiz Section - Show if module has quiz data */}
                      {activeModule?.quiz && activeModule.quiz.length > 0 && (
                        <ModuleQuiz
                          module={activeModule}
                          onComplete={() => handleModuleComplete(activeModuleIndex)}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            /* CHAPTER-BASED VIEW (Legacy) */
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              {/* Left: Enhanced Chapter List */}
              <Card id="chapters-list" className="lg:col-span-4 border border-white/15 bg-white/10 dark:bg-white/10 backdrop-blur-xl shadow-2xl">
              <CardHeader className="flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTree className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                  <CardTitle className="text-gray-900 dark:text-white">Chapters</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="sticky top-24 space-y-2">
                  {(course.chapters || []).map((ch, idx) => {
                    const active = ch.id === activeChapterId;
                    const expanded = expandedChapters.has(ch.id);
                    return (
                      <motion.div
                        key={ch.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <button
                          onClick={() => setActiveChapterId(ch.id)}
                          className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                            active 
                              ? 'border-purple-400 bg-purple-100 dark:bg-purple-500/20 text-purple-900 dark:text-purple-100 shadow-lg shadow-purple-500/30 cursor-default' 
                              : 'border-gray-200 dark:border-white/10 hover:border-purple-400/50 hover:bg-purple-50 dark:hover:bg-purple-500/10 text-gray-800 dark:text-white/80 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold transition-all duration-300 ${
                              active 
                                ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/50' 
                                : 'bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white/70 group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 group-hover:text-gray-900 dark:group-hover:text-white'
                            }`}>
                              {idx + 1}
                            </span>
                            <span className="line-clamp-1 text-sm font-medium">{ch.title}</span>
                          </span>
                          <ChevronDown 
                            className={`h-4 w-4 transition-all duration-300 ${
                              active ? 'text-purple-600 dark:text-purple-300' : 'text-gray-400 dark:text-white/40 group-hover:text-gray-600 dark:group-hover:text-white/70'
                            } ${expanded ? 'rotate-180' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChapterExpansion(ch.id);
                            }}
                          />
                        </button>
                        
                        {/* Chapter Sub-topics */}
                        <AnimatePresence>
                          {expanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="ml-4 mt-2 space-y-1"
                            >
                              {ch.description && (
                                <div className="text-xs text-white/80 p-2 bg-white/10 dark:bg-white/10 rounded-lg border border-white/15 backdrop-blur-md">
                                  {ch.description}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Right: Enhanced Content Pane */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeChapterId} 
                  initial={{ opacity: 0, y: 20, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: -20, scale: 0.95 }} 
                  transition={{ duration: 0.4 }}
                >
                  <Card className="border border-white/15 bg-white/10 dark:bg-white/10 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {activeChapter?.title || 'Chapter'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Enhanced Video Players with improved embedding */}
                      {Array.isArray(activeChapter?.videoUrls) && activeChapter.videoUrls.length > 0 ? (
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                              Chapter Videos ({activeChapter.videoUrls.length})
                            </h3>
                          </div>
                          {activeChapter.videoUrls.map((url, index) => (
                            <div key={index} className="space-y-3">
                              <div className="relative aspect-video overflow-hidden rounded-xl shadow-2xl border border-white/15 bg-white/5 dark:bg-white/10 backdrop-blur-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10"></div>
                                <iframe
                                  src={url}
                                  title={`Video ${index + 1}: ${activeChapter?.title}`}
                                  className="h-full w-full relative z-10 rounded-xl"
                                  width="100%"
                                  height="100%"
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                  loading="lazy"
                                />
                              </div>
                              {activeChapter.videoUrls.length > 1 && (
                                <p className="text-sm text-gray-600 dark:text-white/60 text-center">
                                  Video {index + 1} of {activeChapter.videoUrls.length}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-xl border border-dashed border-purple-300 dark:border-purple-400/30 p-8 text-center bg-gradient-to-br from-purple-100 dark:from-purple-500/10 to-blue-100 dark:to-blue-500/10">
                          <Play className="h-12 w-12 mx-auto mb-4 text-purple-600 dark:text-purple-300 animate-pulse" />
                          <p className="text-gray-700 dark:text-white/70">No video available for this chapter</p>
                        </div>
                      )}

                      {/* Enhanced Content with Markdown Support */}
                      {activeChapter?.description && (
                        <div className="markdown-content bg-white/5 dark:bg-white/5 p-6 rounded-xl border border-white/15">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-8 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-xl font-semibold mt-6 mb-3 text-purple-700 dark:text-purple-300" {...props} />,
                              h4: ({node, ...props}) => <h4 className="text-lg font-semibold mt-4 mb-2 text-purple-700 dark:text-purple-300" {...props} />,
                              p: ({node, ...props}) => <p className="text-gray-800 dark:text-white/80 leading-relaxed mb-4" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-800 dark:text-white/80" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-800 dark:text-white/80" {...props} />,
                              li: ({node, ...props}) => <li className="ml-4 leading-relaxed" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                              em: ({node, ...props}) => <em className="italic text-purple-700 dark:text-purple-300" {...props} />,
                              blockquote: ({node, ...props}) => (
                                <blockquote className="border-l-4 border-purple-400 pl-4 my-4 italic text-gray-700 dark:text-white/70 bg-purple-100 dark:bg-purple-500/10 py-2 rounded-r" {...props} />
                              ),
                              code: ({node, inline, ...props}) => 
                                inline ? (
                                  <code className="bg-purple-200 dark:bg-purple-500/20 px-2 py-1 rounded text-purple-900 dark:text-purple-200 text-sm" {...props} />
                                ) : (
                                  <code className="block bg-gray-900 dark:bg-black/30 p-4 rounded-lg text-green-400 dark:text-green-300 text-sm overflow-x-auto my-4 border border-purple-300 dark:border-purple-400/30" {...props} />
                                ),
                              a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 underline" {...props} />,
                              hr: ({node, ...props}) => <hr className="border-gray-300 dark:border-white/20 my-6" {...props} />,
                            }}
                          >
                            {activeChapter.description}
                          </ReactMarkdown>
                        </div>
                      )}

                      {/* Fallback for old content format */}
                      {!activeChapter?.description && activeChapter?.content && (
                        <div className="prose max-w-none text-gray-900 dark:text-white/90">
                          <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Key Points:
                          </h3>
                          {(() => {
                            const points = Array.isArray(activeChapter.content)
                              ? activeChapter.content
                              : String(activeChapter.content)
                                  .split(/\n+/)
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                            return (
                              <div className="grid grid-cols-1 gap-4">
                                {points.map((point, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative p-4 bg-white/10 dark:bg-white/10 backdrop-blur-md rounded-lg border border-white/15 hover:border-white/25 transition-all duration-300 group"
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative z-10 flex items-start gap-3">
                                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5">
                                        {idx + 1}
                                      </div>
                                      <p className="text-gray-800 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                                        {point}
                                      </p>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* AI Chat Tutor - Floating widget */}
      {course && (
        <ChatTutor 
          courseId={id} 
          courseTitle={course.title}
        />
      )}
    </AuthGuard>
  );
}