'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { SignInButton, useUser } from '@clerk/nextjs';
import { Sparkles, BookOpen, Zap, Users, Target, Shield, Play, ArrowRight, Rocket } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Typing animation component
function TypingAnimation() {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const texts = ['Data Science', 'Web Development', 'AI & ML', 'Digital Marketing', 'Mobile Apps', 'Blockchain'];
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];
      
      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
        if (currentText === current) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  return (
    <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();
  const { scrollY } = useScroll();
  
  // Rocket moves UP as you scroll DOWN
  const rocketY = useTransform(scrollY, [0, 1000], [0, -600]);
  const rocketRotate = useTransform(scrollY, [0, 1000], [0, -15]);
  const waveX = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Content on Left */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium mb-8 bg-purple-100/70 dark:bg-white/10 text-purple-800 dark:text-white border border-purple-200 dark:border-white/20 backdrop-blur-md"
              >
                <Sparkles size={18} className="animate-spin" />
                <span>AI-Powered Course Generation</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-8 leading-tight"
              >
                Create Amazing{' '}
                <br className="sm:hidden" />
                <TypingAnimation />
                <br />
                <span className="text-4xl sm:text-5xl lg:text-6xl">Courses</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-700 dark:text-white/85 mb-12 leading-relaxed"
              >
                IntelliCourse is an AI-powered course generator that creates comprehensive, 
                structured learning experiences. Transform your ideas into professional courses 
                with detailed outlines and curriculum in moments.
              </motion.p>
                
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 items-start"
              >
                {!isSignedIn ? (
                  <SignInButton mode="modal">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
                    >
                      Let's Build Together!
                    </motion.button>
                  </SignInButton>
                ) : (
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href="/dashboard"
                    className="group bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-3"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.a>
                )}
              </motion.div>
            </div>

            {/* Right Side - Rocket Illustration */}
            <div className="relative hidden lg:block h-[600px]">
              {/* Rocket with scroll animation */}
              <motion.div
                className="absolute right-[15%] bottom-[10%] w-48 z-20"
                style={{ y: rocketY, rotate: rocketRotate }}
              >
                <svg viewBox="0 0 200 300" fill="none" className="w-full h-auto drop-shadow-2xl">
                  <defs>
                    <linearGradient id="rocketBody" x1="100" y1="0" x2="100" y2="250">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                    <linearGradient id="flameGrad" x1="100" y1="250" x2="100" y2="300">
                      <stop offset="0%" stopColor="#FF7043" />
                      <stop offset="50%" stopColor="#FFCA28" />
                      <stop offset="100%" stopColor="#FFEB3B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Main Body */}
                  <path d="M100 0 C130 50, 130 200, 100 250 L100 250 C70 200, 70 50, 100 0Z" fill="url(#rocketBody)" />
                  
                  {/* Nose Cone */}
                  <path d="M100 0 C110 20, 90 20, 100 0Z" fill="#e5e7eb" />
                  
                  {/* Window */}
                  <circle cx="100" cy="100" r="20" fill="#60a5fa" opacity="0.9" />
                  <circle cx="100" cy="100" r="15" fill="#3b82f6" opacity="0.4" />
                  
                  {/* Left Fin */}
                  <path d="M70 250 L50 290 L60 270 L70 250Z" fill="#ec4899" />
                  
                  {/* Right Fin */}
                  <path d="M130 250 L150 290 L140 270 L130 250Z" fill="#ec4899" />
                  
                  {/* Animated Flame */}
                  <motion.path
                    d="M80 250 C75 270, 85 280, 100 300 C115 280, 125 270, 120 250 L80 250Z"
                    fill="url(#flameGrad)"
                    animate={{
                      d: [
                        "M80 250 C75 270, 85 280, 100 300 C115 280, 125 270, 120 250 L80 250Z",
                        "M85 250 C80 275, 90 285, 100 290 C110 285, 120 275, 115 250 L85 250Z",
                        "M80 250 C75 270, 85 280, 100 300 C115 280, 125 270, 120 250 L80 250Z"
                      ]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Animated Wavy Background */}
        <motion.div 
          className="absolute bottom-0 right-0 w-full h-[400px] pointer-events-none overflow-hidden z-0"
          style={{ x: waveX }}
        >
          <svg viewBox="0 0 1000 400" fill="none" className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave1" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a3b1ed" stopOpacity="0.6" />
                <stop offset="1" stopColor="#dbe4fb" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="wave2" x1="0" y1="0" x2="1000" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c5d1e8" stopOpacity="0.5" />
                <stop offset="1" stopColor="#eaf0f9" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path 
              d="M0 250C100 200, 200 300, 300 250, 400 200, 500 300, 600 250, 700 200, 800 300, 900 250, 1000 200V400H0V250Z" 
              fill="url(#wave1)" 
            />
            <path 
              d="M0 300C100 280, 200 320, 300 300, 400 280, 500 320, 600 300, 700 280, 800 320, 900 300, 1000 280V400H0V300Z" 
              fill="url(#wave2)" 
            />
          </svg>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Create professional courses in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: '01',
                title: 'Enter Your Course Topic',
                description: 'Simply type what you want to teach. Our AI understands any subject from coding to cooking.',
                icon: BookOpen,
                color: 'from-purple-500 to-blue-500'
              },
              {
                step: '02',
                title: 'AI Generates Outline Instantly',
                description: 'Watch as our AI creates a comprehensive course structure with modules, lessons, and objectives.',
                icon: Zap,
                color: 'from-blue-500 to-violet-600'
              },
              {
                step: '03',
                title: 'Export or Customize',
                description: 'Download your course as PDF, share online, or customize further with our editing tools.',
                icon: ArrowRight,
                color: 'from-violet-600 to-purple-600'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative"
              >
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group-hover:scale-105">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:to-gray-900">
        {/* Animated gradient blobs */}
        <div className="pointer-events-none absolute -top-20 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl animate-pulse" />
        <div className="pointer-events-none absolute -bottom-16 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-600/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Why Choose IntelliCourse?
            </h2>
            <div className="flex justify-center mb-6">
              <div className="h-2 w-24 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our platform blends cutting-edge AI with instructional design to craft premium learning experiences.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                title: 'Lightning Fast', 
                desc: 'Generate comprehensive outlines in seconds. Go from idea to structure instantly.', 
                icon: Zap, 
                grad: 'from-purple-600 to-blue-600',
                bgGrad: 'from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20'
              },
              { 
                title: 'Comprehensive Content', 
                desc: 'Learning objectives, modules, and assessments aligned to best practices.', 
                icon: BookOpen, 
                grad: 'from-blue-600 to-violet-600',
                bgGrad: 'from-blue-100 to-violet-100 dark:from-blue-900/20 dark:to-violet-900/20'
              },
              { 
                title: 'Customizable', 
                desc: 'Tune for audience, level, and outcomes. Regenerate and refine with ease.', 
                icon: Target, 
                grad: 'from-violet-600 to-purple-600',
                bgGrad: 'from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20'
              },
              { 
                title: 'Educator Approved', 
                desc: 'Built with input from seasoned educators to ensure quality.', 
                icon: Users, 
                grad: 'from-purple-600 to-blue-500',
                bgGrad: 'from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20'
              },
              { 
                title: 'Secure & Private', 
                desc: 'Your ideas stay yours. Privacy-first by design.', 
                icon: Shield, 
                grad: 'from-blue-500 to-purple-500',
                bgGrad: 'from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20'
              },
              { 
                title: 'AI-Powered', 
                desc: 'Harness state-of-the-art AI to deliver engaging, effective courses.', 
                icon: Sparkles, 
                grad: 'from-violet-500 to-blue-600',
                bgGrad: 'from-violet-100 to-blue-100 dark:from-violet-900/20 dark:to-blue-900/20'
              }
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
                className="group"
              >
                <motion.div 
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`relative rounded-3xl p-8 bg-gradient-to-br ${f.bgGrad} border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden`}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.grad} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon with enhanced styling */}
                  <motion.div 
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg bg-gradient-to-br ${f.grad} group-hover:shadow-xl transition-all duration-300`}
                  >
                    <f.icon className="h-8 w-8" />
                  </motion.div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                    {f.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-gray-200 transition-colors duration-300">
                    {f.desc}
                  </p>
                  
                  {/* Hover effect border */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-orange-500 group-hover:to-red-500 transition-all duration-300" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Teaching?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join thousands of educators who are already saving time and creating better courses with AI.
          </p>
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg">
                Start Creating Today
              </button>
            </SignInButton>
          ) : (
            <a
              href="/dashboard"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg inline-block"
            >
              Go to Dashboard
            </a>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
