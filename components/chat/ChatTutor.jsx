'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, Sparkles, X, Minimize2, Maximize2, Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatTutor({ courseId, courseTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [courseInfo, setCourseInfo] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch course info when chat opens
  useEffect(() => {
    if (isOpen && !courseInfo) {
      fetchCourseInfo();
    }
  }, [isOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const fetchCourseInfo = async () => {
    try {
      const response = await fetch(`/api/chat/tutor?courseId=${courseId}`);
      const data = await response.json();
      if (data.success) {
        setCourseInfo(data);
        // Add welcome message
        setMessages([{
          role: 'assistant',
          content: `👋 Hi! I'm your AI tutor for **${data.course.title}**. I'm here to help you understand the course material. Feel free to ask me any questions about the ${data.course.moduleCount} modules in this course!`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Failed to fetch course info:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history (last 10 messages)
      const conversationHistory = messages.slice(-10);

      const response = await fetch('/api/chat/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId,
          message: inputMessage,
          conversationHistory
        })
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Can you summarize this course?",
    "What are the key topics covered?",
    "Explain [concept] in simpler terms",
    "What should I focus on first?"
  ];

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-[#f87171] to-[#fca5a5] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-[#10b981] rounded-full border-2 border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          height: isMinimized ? '60px' : '600px'
        }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        className="fixed bottom-6 right-6 z-50 w-full max-w-md transition-all duration-300"
      >
        <Card className="border-0 bg-black/98 backdrop-blur-xl shadow-2xl border-[#f87171]/20 overflow-hidden">
          {/* Header */}
          <CardHeader className="border-b border-[#f87171]/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f87171] to-[#fca5a5] rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">AI Tutor</CardTitle>
                  <p className="text-xs text-white/60 truncate max-w-[200px]">
                    {courseTitle || 'Course Assistant'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/70 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white hover:bg-red-500/20 w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              {/* Messages */}
              <CardContent className="p-4 h-[420px] overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Bot className="w-12 h-12 text-[#f87171] mx-auto mb-4" />
                      <p className="text-white/70 text-sm mb-4">
                        Start a conversation with your AI tutor!
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs text-white/50">Try asking:</p>
                        {suggestedQuestions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInputMessage(question)}
                            className="block w-full text-left px-3 py-2 text-xs text-white/70 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-[#f87171]/50 transition-all"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' 
                              ? 'bg-gradient-to-br from-[#f87171] to-[#fca5a5]' 
                              : 'bg-gradient-to-br from-[#f87171] to-[#fca5a5]'
                          }`}>
                            {msg.role === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className={`rounded-2xl px-4 py-3 ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-[#f87171] to-[#fca5a5] text-white'
                              : msg.isError
                              ? 'bg-[#f87171]/20 border border-[#f87171]/30 text-red-200'
                              : 'bg-black border border-white/10 text-white'
                          }`}>
                            <div className="text-sm prose prose-invert prose-sm max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                  strong: ({node, ...props}) => <strong className="font-bold text-[#f87171]" {...props} />,
                                  code: ({node, ...props}) => <code className="bg-black/30 px-1 py-0.5 rounded text-xs" {...props} />
                                }}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                            <p className="text-[10px] text-white/40 mt-1">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start space-x-2"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f87171] to-[#fca5a5] flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="w-4 h-4 text-[#f87171] animate-spin" />
                          <span className="text-sm text-white/70">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              {/* Input */}
              <div className="p-4 border-t border-[#f87171]/20">
                <div className="flex items-center space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about this course..."
                    disabled={isLoading}
                    className="flex-1 bg-black border-white/10 text-white placeholder-white/50 focus:border-[#f87171]"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-gradient-to-r from-[#f87171] to-[#fca5a5] hover:from-[#fca5a5] hover:to-[#fecaca] w-10 h-10 p-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-[10px] text-white/40 mt-2 text-center">
                  AI may make mistakes. Verify important information.
                </p>
              </div>
            </>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
