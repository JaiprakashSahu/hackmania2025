'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Save, X, Upload, Play, Clock, BookOpen, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthGuard from '@/components/AuthGuard';
import BilingualYouTubeEmbed from '@/components/BilingualYouTubeEmbed';

export default function CourseLayout() {
  const { id } = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [course, setCourse] = useState({
    title: 'JavaScript Fundamentals for Beginners',
    description: 'A comprehensive introduction to JavaScript programming language covering basic concepts, syntax, and practical examples.',
    category: 'Programming',
    difficulty: 'Beginner',
    duration: '6-8 hours',
    chapters: '8',
    includeVideos: true,
    thumbnail: '/api/placeholder/400/300',
    chaptersList: [
      {
        id: 1,
        title: 'Introduction to JavaScript',
        description: 'Learn what JavaScript is and why it\'s important for web development',
        duration: '15 minutes',
        content: ''
      },
      {
        id: 2,
        title: 'Variables and Data Types',
        description: 'Understanding variables, strings, numbers, and other data types',
        duration: '25 minutes',
        content: ''
      },
      {
        id: 3,
        title: 'Functions and Scope',
        description: 'Creating and using functions, understanding scope and closures',
        duration: '30 minutes',
        content: ''
      },
      {
        id: 4,
        title: 'Arrays and Objects',
        description: 'Working with arrays, objects, and common array methods',
        duration: '35 minutes',
        content: ''
      },
      {
        id: 5,
        title: 'DOM Manipulation',
        description: 'Interacting with HTML elements using JavaScript',
        duration: '40 minutes',
        content: ''
      },
      {
        id: 6,
        title: 'Events and Event Handling',
        description: 'Responding to user interactions and browser events',
        duration: '30 minutes',
        content: ''
      },
      {
        id: 7,
        title: 'Asynchronous JavaScript',
        description: 'Understanding callbacks, promises, and async/await',
        duration: '45 minutes',
        content: ''
      },
      {
        id: 8,
        title: 'Project: Building a Todo App',
        description: 'Apply all learned concepts in a practical project',
        duration: '60 minutes',
        content: ''
      }
    ]
  });

  const startEditing = (field) => {
    setIsEditing(prev => ({ ...prev, [field]: true }));
  };

  const saveEdit = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
    setIsEditing(prev => ({ ...prev, [field]: false }));
  };

  const startChapterEdit = (chapterId, field) => {
    setIsEditing(prev => ({ ...prev, [`chapter_${chapterId}_${field}`]: true }));
  };

  const saveChapterEdit = (chapterId, field, value) => {
    setCourse(prev => ({
      ...prev,
      chaptersList: prev.chaptersList.map(chapter =>
        chapter.id === chapterId ? { ...chapter, [field]: value } : chapter
      )
    }));
    setIsEditing(prev => ({ ...prev, [`chapter_${chapterId}_${field}`]: false }));
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const updatedChapters = course.chaptersList.map(chapter => ({
        ...chapter,
        content: `This is the generated content for ${chapter.title}. Here you'll find comprehensive explanations, examples, and practical exercises to help you master the concepts covered in this chapter. The content includes step-by-step instructions, code snippets, and real-world applications to reinforce your learning.`
      }));
      
      setCourse(prev => ({ ...prev, chaptersList: updatedChapters }));
      setIsGenerating(false);
    }, 3000);
  };

  const EditableField = ({ value, onSave, placeholder, className = "" }) => {
    const [editValue, setEditValue] = useState(value);
    
    return (
      <div className="flex items-center space-x-2">
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          placeholder={placeholder}
          className={className}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSave(editValue);
            }
            if (e.key === 'Escape') {
              setEditValue(value);
              onSave(value);
            }
          }}
        />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSave(editValue)}
          className="p-1 h-8 w-8"
        >
          <Save className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditValue(value);
            onSave(value);
          }}
          className="p-1 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/dashboard')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Dashboard</span>
                </Button>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-xl font-semibold text-gray-900">Course Layout</h1>
              </div>
              <Button
                variant="purple"
                onClick={generateContent}
                disabled={isGenerating}
                className="flex items-center space-x-2"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>
                  {isGenerating ? 'Generating Content...' : 'Generate Course Content'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Course Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Thumbnail */}
                <div className="lg:col-span-1">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Course Thumbnail</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      Replace
                    </Button>
                  </div>
                </div>

                {/* Course Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                    {isEditing.title ? (
                      <EditableField
                        value={course.title}
                        onSave={(value) => saveEdit('title', value)}
                        placeholder="Enter course title"
                        className="text-xl font-bold"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing('title')}
                          className="p-1 h-8 w-8"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    {isEditing.description ? (
                      <EditableField
                        value={course.description}
                        onSave={(value) => saveEdit('description', value)}
                        placeholder="Enter course description"
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <p className="text-gray-600 flex-1">{course.description}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing('description')}
                          className="p-1 h-8 w-8"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Course Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{course.category}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{course.difficulty}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{course.duration}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">{course.chapters} Chapters</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapters List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">Course Chapters</h3>
            
            {course.chaptersList.map((chapter, index) => (
              <motion.div
                key={chapter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {chapter.id}
                          </div>
                          
                          {/* Chapter Title */}
                          <div className="flex-1">
                            {isEditing[`chapter_${chapter.id}_title`] ? (
                              <EditableField
                                value={chapter.title}
                                onSave={(value) => saveChapterEdit(chapter.id, 'title', value)}
                                placeholder="Enter chapter title"
                                className="text-lg font-semibold"
                              />
                            ) : (
                              <div className="flex items-center space-x-2">
                                <h4 className="text-lg font-semibold text-gray-900">{chapter.title}</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startChapterEdit(chapter.id, 'title')}
                                  className="p-1 h-6 w-6"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>

                          {/* Duration */}
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">{chapter.duration}</span>
                          </div>
                        </div>

                        {/* Chapter Description */}
                        <div className="ml-11 mb-4">
                          {isEditing[`chapter_${chapter.id}_description`] ? (
                            <EditableField
                              value={chapter.description}
                              onSave={(value) => saveChapterEdit(chapter.id, 'description', value)}
                              placeholder="Enter chapter description"
                            />
                          ) : (
                            <div className="flex items-start space-x-2">
                              <p className="text-gray-600 flex-1">{chapter.description}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startChapterEdit(chapter.id, 'description')}
                                className="p-1 h-6 w-6"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* Chapter Video with Bilingual Support */}
                        {chapter.videoUrl && course.includeVideos && (
                          <div className="ml-11 mb-4">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-3">
                                <Play className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Video Tutorial
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  AI-Generated Content
                                </span>
                              </div>
                              <BilingualYouTubeEmbed
                                url={chapter.videoUrl}
                                title={`${chapter.title} - Video Tutorial`}
                                autoPlay={false}
                                showControls={true}
                                className="max-w-2xl"
                                // Integration point: Pass course language preference if available
                                defaultLanguage={course.preferredLanguage || null}
                              />
                            </div>
                          </div>
                        )}

                        {/* Chapter Content */}
                        {chapter.content && (
                          <div className="ml-11">
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-700 text-sm leading-relaxed">{chapter.content}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
