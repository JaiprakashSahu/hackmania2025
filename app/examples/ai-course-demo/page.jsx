'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Video, 
  Download, 
  CheckCircle, 
  Lightbulb, 
  FileText,
  Play,
  Languages,
  Target,
  Clock,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BilingualYouTubeEmbed from '@/components/BilingualYouTubeEmbed';

/**
 * AI Course Generator Demo
 * 
 * Demonstrates the complete AI-powered course generation system with:
 * - Level-based content generation (Beginner/Intermediate/Advanced)
 * - Structured modules with key points, explanations, and examples
 * - Bilingual YouTube video integration
 * - Export functionality for notes
 */
export default function AICourseDemo() {
  const [selectedLevel, setSelectedLevel] = useState('Intermediate');

  // Mock generated course data showing different complexity levels
  const mockCourseData = {
    'Beginner': {
      title: 'Introduction to Machine Learning for Beginners',
      overview: 'Learn the basics of machine learning with simple explanations, real-world examples, and hands-on practice. Perfect for those with no prior experience in AI or programming.',
      level: 'Beginner',
      estimatedDuration: '4-6 hours',
      modules: [
        {
          id: 'module-1',
          title: 'What is Machine Learning?',
          description: 'Understanding the basics of machine learning and how it works in everyday life',
          keyPoints: [
            'Learn what machine learning means in simple terms',
            'Discover how ML is used in apps you already know',
            'Understand the difference between AI and ML',
            'See real examples from Netflix, Spotify, and shopping apps'
          ],
          explanation: 'Machine learning is like teaching a computer to recognize patterns, just like how you learned to recognize your friends\' faces. Instead of giving the computer specific instructions for every situation, we show it lots of examples and let it figure out the patterns on its own. For instance, when Netflix recommends movies you might like, it\'s using machine learning to look at what you\'ve watched before and find patterns similar to other users with similar tastes. The computer learns from millions of viewing habits to make these smart suggestions.',
          example: 'Think of machine learning like learning to ride a bicycle. At first, you might fall down a lot, but each time you try, you get a little better at balancing. The computer does something similar - it makes mistakes at first, but learns from each mistake to get better at making predictions. Just like you eventually learned to ride without thinking about it, the computer eventually gets really good at recognizing patterns in data.',
          videos: [
            {
              id: 'ukzFI9rgwfU',
              title: 'Machine Learning Explained',
              url: 'https://www.youtube.com/watch?v=ukzFI9rgwfU',
              channelTitle: 'Zach Star'
            }
          ]
        },
        {
          id: 'module-2',
          title: 'Types of Machine Learning',
          description: 'Exploring the three main types of machine learning with simple examples',
          keyPoints: [
            'Supervised learning: Learning with a teacher',
            'Unsupervised learning: Finding hidden patterns',
            'Reinforcement learning: Learning through trial and error',
            'See examples of each type in everyday apps'
          ],
          explanation: 'There are three main ways computers can learn, just like there are different ways people learn. Supervised learning is like having a teacher show you flashcards - you see the question and the correct answer many times until you learn the pattern. Unsupervised learning is like being given a box of mixed LEGO pieces and figuring out how to group them by color or size without anyone telling you how. Reinforcement learning is like learning to play a video game - you try different actions and get rewards or penalties, gradually learning which moves work best.',
          example: 'Imagine you\'re learning to cook. Supervised learning would be following a recipe exactly (input: ingredients and steps, output: finished dish). Unsupervised learning would be looking at your spice cabinet and grouping spices by smell or flavor without a guide. Reinforcement learning would be experimenting with different ingredient combinations, tasting as you go, and learning from what tastes good or bad.',
          videos: [
            {
              id: 'f_uwKZIAeM0',
              title: 'Types of Machine Learning',
              url: 'https://www.youtube.com/watch?v=f_uwKZIAeM0',
              channelTitle: 'Simplilearn'
            }
          ]
        }
      ]
    },
    'Intermediate': {
      title: 'Machine Learning Fundamentals and Applications',
      overview: 'Dive deeper into machine learning concepts, algorithms, and practical implementations. Learn to build and evaluate ML models with hands-on projects and real-world case studies.',
      level: 'Intermediate',
      estimatedDuration: '8-12 hours',
      modules: [
        {
          id: 'module-1',
          title: 'Supervised Learning Algorithms',
          description: 'Understanding and implementing key supervised learning algorithms',
          keyPoints: [
            'Master linear and logistic regression techniques',
            'Implement decision trees and random forests',
            'Understand support vector machines (SVM)',
            'Learn model evaluation metrics and cross-validation'
          ],
          explanation: 'Supervised learning algorithms form the backbone of predictive modeling in machine learning. Linear regression finds the best line through data points to predict continuous values, while logistic regression uses the sigmoid function to classify data into categories. Decision trees create a series of yes/no questions to classify data, and random forests combine multiple decision trees to improve accuracy and reduce overfitting. Support vector machines find the optimal boundary between different classes by maximizing the margin between them. Each algorithm has specific use cases: linear regression for price prediction, logistic regression for binary classification, decision trees for interpretable models, and SVMs for high-dimensional data.',
          example: 'Consider predicting house prices: linear regression would find the relationship between features like size, location, and age to predict price. For email spam detection, logistic regression would learn patterns in word frequency and sender information to classify emails as spam or not spam. A decision tree might ask: "Does the email contain \'free money\'? If yes, is it from an unknown sender? If yes, classify as spam." Random forests would combine hundreds of such decision trees to make more robust predictions.',
          videos: [
            {
              id: 'nk2CQITm_eo',
              title: 'Supervised Learning Algorithms',
              url: 'https://www.youtube.com/watch?v=nk2CQITm_eo',
              channelTitle: 'StatQuest'
            }
          ]
        },
        {
          id: 'module-2',
          title: 'Feature Engineering and Data Preprocessing',
          description: 'Techniques for preparing and transforming data for machine learning models',
          keyPoints: [
            'Handle missing data and outliers effectively',
            'Perform feature scaling and normalization',
            'Create new features from existing data',
            'Apply dimensionality reduction techniques'
          ],
          explanation: 'Feature engineering is often considered the most important aspect of machine learning, as the quality of input features directly impacts model performance. Data preprocessing involves cleaning the dataset by handling missing values through imputation or removal, detecting and treating outliers that could skew results, and ensuring data consistency. Feature scaling normalizes different features to similar ranges, preventing features with larger scales from dominating the model. Feature creation involves combining existing features or extracting new information, such as creating age categories from birth dates or extracting day-of-week from timestamps. Dimensionality reduction techniques like PCA help reduce computational complexity while preserving important information.',
          example: 'In a customer churn prediction model, you might engineer features like "days since last purchase," "average order value," and "frequency of complaints." Missing data in income fields could be imputed using median values for similar demographic groups. Features like age (ranging 18-80) and income (ranging $20K-$200K) would be scaled to 0-1 range so neither dominates the model. You might create interaction features like "high_income_young_customer" by combining age and income categories.',
          videos: [
            {
              id: 'Ura_ioOcpQI',
              title: 'Feature Engineering',
              url: 'https://www.youtube.com/watch?v=Ura_ioOcpQI',
              channelTitle: 'Krish Naik'
            }
          ]
        }
      ]
    },
    'Advanced': {
      title: 'Advanced Machine Learning: Deep Learning and Neural Networks',
      overview: 'Master advanced ML concepts including deep neural networks, optimization algorithms, and cutting-edge architectures. Explore research-level topics and implement state-of-the-art models.',
      level: 'Advanced',
      estimatedDuration: '15-20 hours',
      modules: [
        {
          id: 'module-1',
          title: 'Deep Neural Network Architectures',
          description: 'Advanced neural network designs and architectural innovations',
          keyPoints: [
            'Implement residual networks (ResNet) and skip connections',
            'Master attention mechanisms and transformer architectures',
            'Design custom loss functions and optimization strategies',
            'Apply advanced regularization techniques (dropout, batch norm)'
          ],
          explanation: 'Modern deep learning architectures have evolved beyond simple feedforward networks to address specific challenges in learning complex representations. Residual networks introduce skip connections that allow gradients to flow directly to earlier layers, solving the vanishing gradient problem in very deep networks. The mathematical formulation F(x) = H(x) - x allows the network to learn residual mappings rather than direct mappings. Attention mechanisms, particularly in transformer architectures, enable models to focus on relevant parts of the input sequence through learned attention weights α_ij = softmax(e_ij), where e_ij represents the compatibility between query and key vectors. Advanced optimization techniques like Adam with learning rate scheduling and gradient clipping ensure stable training of these complex architectures.',
          example: 'In computer vision, ResNet-50 uses bottleneck blocks with 1x1, 3x3, and 1x1 convolutions, where the skip connection adds the input directly to the output: y = F(x, {W_i}) + x. For natural language processing, BERT uses multi-head attention where each head computes Attention(Q,K,V) = softmax(QK^T/√d_k)V, allowing the model to attend to different representation subspaces simultaneously. Custom loss functions might combine cross-entropy with regularization terms: L = -∑y_i log(p_i) + λ||W||_2^2 + β∑|W_i|.',
          videos: [
            {
              id: 'ZIkBcvVwl58',
              title: 'Deep Learning Architectures',
              url: 'https://www.youtube.com/watch?v=ZIkBcvVwl58',
              channelTitle: 'DeepLearningAI'
            }
          ]
        },
        {
          id: 'module-2',
          title: 'Optimization and Hyperparameter Tuning',
          description: 'Advanced optimization algorithms and systematic hyperparameter search',
          keyPoints: [
            'Implement advanced optimizers (AdamW, RMSprop variants)',
            'Design Bayesian optimization for hyperparameter search',
            'Apply learning rate scheduling and warm-up strategies',
            'Utilize distributed training and gradient accumulation'
          ],
          explanation: 'Advanced optimization in deep learning requires understanding the theoretical foundations and practical considerations of gradient-based methods. AdamW decouples weight decay from gradient-based updates, computing m_t = β_1 m_{t-1} + (1-β_1)g_t and v_t = β_2 v_{t-1} + (1-β_2)g_t^2, then applying weight decay directly to parameters. Bayesian optimization treats hyperparameter tuning as a black-box optimization problem, using Gaussian processes to model the objective function and acquisition functions like Expected Improvement to guide search. Learning rate scheduling strategies like cosine annealing follow η_t = η_min + (η_max - η_min)(1 + cos(πt/T))/2, while warm-up prevents early training instability in large models.',
          example: 'For training a large transformer model, you might use AdamW with β_1=0.9, β_2=0.999, weight_decay=0.01, combined with linear warm-up for 4000 steps followed by inverse square root decay. Bayesian optimization could search over learning rates [1e-5, 1e-3], batch sizes [16, 128], and dropout rates [0.1, 0.5] using 50 evaluation budget. Distributed training across 8 GPUs with gradient accumulation steps=4 effectively creates batch size of 8×32×4=1024, requiring learning rate scaling by √8≈2.83.',
          videos: [
            {
              id: 'md2fYip6QsQ',
              title: 'Advanced Optimization',
              url: 'https://www.youtube.com/watch?v=md2fYip6QsQ',
              channelTitle: 'Stanford CS229'
            }
          ]
        }
      ]
    }
  };

  const currentCourse = mockCourseData[selectedLevel];

  const levelInfo = {
    'Beginner': { icon: '🌱', color: 'from-green-500 to-emerald-500', description: 'Simple explanations, basic concepts' },
    'Intermediate': { icon: '🚀', color: 'from-blue-500 to-cyan-500', description: 'Technical details, practical applications' },
    'Advanced': { icon: '🎯', color: 'from-purple-500 to-pink-500', description: 'Deep concepts, professional terminology' }
  };

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
              AI Course Generator Demo
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience how our AI generates comprehensive courses with level-based content depth, 
            structured modules, bilingual videos, and exportable notes.
          </p>
        </motion.div>

        {/* Level Selector */}
        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
              <Target className="w-5 h-5" />
              Select Difficulty Level
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(levelInfo).map(([level, info]) => (
                <motion.div
                  key={level}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    onClick={() => setSelectedLevel(level)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedLevel === level
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{info.icon}</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {info.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generated Course */}
        <motion.div
          key={selectedLevel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          
          {/* Course Overview */}
          <Card className="border-2 border-green-200 dark:border-green-800">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-green-900 dark:text-green-100">
                    {currentCourse.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-green-700 dark:text-green-300">
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {currentCourse.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {currentCourse.estimatedDuration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {currentCourse.modules.length} Modules
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Export DOCX
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {currentCourse.overview}
              </p>
            </CardContent>
          </Card>

          {/* Course Modules */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              Course Modules
            </h2>
            
            {currentCourse.modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-6 space-y-6">
                    
                    {/* Module Header */}
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${levelInfo[selectedLevel].color} text-white rounded-full flex items-center justify-center font-bold`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          {module.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    {/* Key Learning Points */}
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

                    {/* Detailed Explanation */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Detailed Explanation
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        {module.explanation}
                      </p>
                    </div>

                    {/* Example */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Example & Analogy
                      </h4>
                      <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
                        {module.example}
                      </p>
                    </div>

                    {/* YouTube Videos */}
                    {module.videos && module.videos.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <Play className="w-4 h-4" />
                          Related Videos
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <BilingualYouTubeEmbed
                            url={module.videos[0].url}
                            title={module.videos[0].title}
                            autoPlay={false}
                            showControls={true}
                            defaultLanguage="auto"
                            className="max-w-full"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Features Showcase */}
          <Card className="border-2 border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <CardTitle className="text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Course Generator Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="w-6 h-6 text-purple-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100">AI Content Generation</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Level-based content depth with Gemini AI
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                    <Video className="w-6 h-6 text-blue-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100">Bilingual Videos</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Hindi/English audio toggle with YouTube API
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100">Structured Content</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Key points, explanations, and examples
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
                    <Download className="w-6 h-6 text-orange-600" />
                  </div>
                  <h5 className="font-semibold text-gray-900 dark:text-gray-100">Export Notes</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    PDF/DOCX export with video links
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
