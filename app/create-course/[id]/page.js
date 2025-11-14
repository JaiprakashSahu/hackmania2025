'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Edit3, Save, X, Upload, Play, Clock, BookOpen, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuthGuard from '@/components/AuthGuard';
import SimpleYouTubeEmbed from '@/components/SimpleYouTubeEmbed';
import StructuredQuizSection from '@/components/StructuredQuizSection';
import ModuleQuizSection from '@/components/ModuleQuizSection';

export default function CourseLayout() {
  const { id } = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('dark');
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
        videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        content: 'JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web. It enables interactive web pages and is an essential part of web applications. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative programming styles. JavaScript was initially created to make web pages alive. The programs in this language are called scripts. They can be written right in a web page\'s HTML and run automatically as the page loads.'
      },
      {
        id: 2,
        title: 'Variables and Data Types',
        description: 'Understanding variables, strings, numbers, and other data types',
        duration: '25 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=9emXNzqCKyg',
        content: 'Variables in JavaScript are containers for storing data values. JavaScript has several data types including primitive types like numbers, strings, booleans, undefined, null, and symbols, as well as non-primitive types like objects and arrays. Variables can be declared using var, let, or const keywords. The let and const keywords were introduced in ES6 and provide block scope, while var provides function scope. Numbers in JavaScript can be integers or floating-point values. Strings are sequences of characters enclosed in quotes. Booleans represent true or false values.'
      },
      {
        id: 3,
        title: 'Functions and Scope',
        description: 'Creating and using functions, understanding scope and closures',
        duration: '30 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
        content: 'Functions are reusable blocks of code designed to perform a particular task. They are executed when called or invoked. JavaScript functions can be declared using function declarations, function expressions, or arrow functions. Scope determines the accessibility of variables. JavaScript has global scope, function scope, and block scope. Closures are functions that have access to variables from an outer scope even after the outer function has returned. This is a powerful feature that enables data privacy and function factories.'
      },
      {
        id: 4,
        title: 'Arrays and Objects',
        description: 'Working with arrays, objects, and common array methods',
        duration: '35 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=R8rmfD9Y5-c',
        content: 'Arrays are ordered lists of values, indexed by numbers starting from 0. They can store multiple values in a single variable and provide methods like push, pop, shift, unshift, slice, splice, and many others. Objects are collections of key-value pairs, where keys are strings and values can be any data type. Objects can be created using object literals, constructor functions, or the Object.create method. Both arrays and objects are reference types in JavaScript, meaning variables store references to the actual data rather than the data itself.'
      },
      {
        id: 5,
        title: 'DOM Manipulation',
        description: 'Interacting with HTML elements using JavaScript',
        duration: '40 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
        content: 'The Document Object Model (DOM) is a programming interface for web documents. It represents the page so that programs can change the document structure, style, and content. JavaScript can access and manipulate DOM elements using methods like getElementById, querySelector, createElement, appendChild, and many others. You can change element content, attributes, styles, and respond to user interactions. DOM manipulation is essential for creating dynamic and interactive web pages.'
      },
      {
        id: 6,
        title: 'Events and Event Handling',
        description: 'Responding to user interactions and browser events',
        duration: '30 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=XF1_MlZ5l6M',
        content: 'Events are actions that can be triggered by user interactions or browser actions. Common events include click, mouseover, keydown, load, and submit. Event handling in JavaScript involves attaching event listeners to DOM elements using addEventListener method or inline event handlers. Event objects contain information about the event that occurred. Event delegation is a technique where you attach a single event listener to a parent element to handle events for multiple child elements.'
      },
      {
        id: 7,
        title: 'Asynchronous JavaScript',
        description: 'Understanding callbacks, promises, and async/await',
        duration: '45 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
        content: 'Asynchronous programming allows JavaScript to perform long-running operations without blocking the main thread. Callbacks are functions passed as arguments to other functions and executed after some operation has completed. Promises represent the eventual completion or failure of an asynchronous operation and provide a cleaner way to handle async code. The async/await syntax, introduced in ES2017, makes asynchronous code look and behave more like synchronous code. Understanding asynchronous JavaScript is crucial for working with APIs, file operations, and user interactions.'
      },
      {
        id: 8,
        title: 'Project: Building a Todo App',
        description: 'Apply all learned concepts in a practical project',
        duration: '60 minutes',
        videoUrl: 'https://www.youtube.com/watch?v=Ttf3CEsEwMQ',
        content: 'In this project, you will build a complete Todo application that demonstrates all the JavaScript concepts learned in previous chapters. The app will include features like adding new tasks, marking tasks as complete, deleting tasks, and filtering tasks by status. You will use DOM manipulation to update the interface, event handling to respond to user interactions, arrays to store tasks, and local storage to persist data. This project will help solidify your understanding of JavaScript fundamentals and give you practical experience building a real application.'
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

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = stored || (prefersDark ? 'dark' : 'light');
      setTheme(initial);
      document.documentElement.classList.toggle('dark', initial === 'dark');
    } catch {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try {
        window.localStorage.setItem('theme', next);
      } catch {}
      return next;
    });
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
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
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Course Layout</h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  aria-label="Toggle dark mode"
                  onClick={toggleTheme}
                  className="relative w-16 h-9 rounded-full bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 transition-colors duration-300"
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <span className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-white dark:bg-indigo-400 shadow transition-all duration-300 ${theme === 'dark' ? 'translate-x-7' : ''}`}></span>
                  <span className="absolute left-2 top-1.5 text-yellow-500 text-sm">☀️</span>
                  <span className="absolute right-2 top-1.5 text-indigo-200 text-sm">🌙</span>
                </button>
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
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Course Header */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Thumbnail */}
                <div className="lg:col-span-1">
                  <div className="relative">
                    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
                    {isEditing.title ? (
                      <EditableField
                        value={course.title}
                        onSave={(value) => saveEdit('title', value)}
                        placeholder="Enter course title"
                        className="text-xl font-bold"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{course.title}</h2>
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
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    {isEditing.description ? (
                      <EditableField
                        value={course.description}
                        onSave={(value) => saveEdit('description', value)}
                        placeholder="Enter course description"
                      />
                    ) : (
                      <div className="flex items-start space-x-2">
                        <p className="text-gray-600 dark:text-gray-400 flex-1">{course.description}</p>
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
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{course.category}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Zap className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{course.difficulty}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{course.duration}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <BookOpen className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">{course.chapters} Chapters</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapters List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Course Chapters</h3>
            
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
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{chapter.title}</h4>
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
                          <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
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
                              <p className="text-gray-600 dark:text-gray-400 flex-1">{chapter.description}</p>
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

                        {/* Chapter Video Tutorial */}
                        {chapter.videoUrl && course.includeVideos && (
                          <div className="ml-11 mb-4">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 mb-3">
                                <Play className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                  Video Tutorial
                                </span>
                                <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                                  Educational Content
                                </span>
                              </div>
                              <SimpleYouTubeEmbed
                                url={chapter.videoUrl}
                                title={`${chapter.title} - Video Tutorial`}
                                autoPlay={false}
                                showControls={true}
                                className="w-full max-w-4xl"
                                height="400"
                              />
                            </div>
                          </div>
                        )}

                        {/* Chapter Content */}
                        {chapter.content && (
                          <div className="ml-11 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                              <div 
                                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: chapter.content
                                    .replace(/## (.*)/g, '<h2 class="text-xl font-bold text-gray-800 mt-6 mb-4 flex items-center gap-2">$1</h2>')
                                    .replace(/### (.*)/g, '<h3 class="text-lg font-semibold text-gray-800 mt-4 mb-3">$1</h3>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                                    .replace(/^- (.*)/gm, '<li class="ml-4 mb-2">$1</li>')
                                    .replace(/(\n|^)([^<\n].*?)(?=\n|$)/g, '<p class="mb-3">$2</p>')
                                    .replace(/(<li.*?<\/li>)/gs, '<ul class="list-disc list-inside mb-4 space-y-1">$1</ul>')
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Quiz Button Section - Appears after content and videos */}
                        {(chapter.quiz && chapter.quiz.length > 0) && (
                          <div className="ml-11 mt-6">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-lg font-semibold text-blue-900 mb-1">
                                    📝 Module Quiz Available
                                  </h4>
                                  <p className="text-blue-700 text-sm">
                                    Test your understanding with {chapter.quiz.length} questions
                                  </p>
                                </div>
                                <button
                                  onClick={() => {
                                    // Toggle quiz visibility
                                    const quizSection = document.getElementById(`quiz-${chapter.id}`);
                                    if (quizSection) {
                                      quizSection.style.display = quizSection.style.display === 'none' ? 'block' : 'none';
                                    }
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                                >
                                  🎯 Take Quiz
                                </button>
                              </div>
                            </div>
                            
                            {/* Hidden Quiz Section */}
                            <div id={`quiz-${chapter.id}`} style={{ display: 'none' }} className="mt-4">
                              <ModuleQuizSection
                                moduleId={chapter.id}
                                moduleTitle={chapter.title}
                                quizData={chapter.quiz}
                                onScoreUpdate={(score, correct, total) => {
                                  console.log(`Module ${chapter.title} quiz completed:`, { score, correct, total });
                                  // You can add additional logic here to update course progress
                                }}
                              />
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
