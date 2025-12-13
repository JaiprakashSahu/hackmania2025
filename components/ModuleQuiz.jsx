'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Brain, Trophy, RefreshCw } from 'lucide-react';

export default function ModuleQuiz({ module, onComplete }) {
  const [quizStarted, setQuizStarted] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Reset quiz state when module changes
  useEffect(() => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
    setScore(0);
  }, [module]);

  if (!module.quiz || module.quiz.length === 0) {
    return null;
  }

  const handleAnswer = (questionIndex, answer) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < module.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    module.quiz.forEach((question, index) => {
      if (userAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const handleRetake = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  const currentQuestion = module.quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / module.quiz.length) * 100;

  // Card styles matching spec
  const cardStyle = {
    background: '#1C1E27',
    border: '1px solid rgba(255,255,255,0.05)',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    borderRadius: '16px',
    padding: '24px'
  };

  // Start Quiz Screen
  if (!quizStarted && !showResults) {
    return (
      <div className="mt-6" style={cardStyle}>
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-[#9B6BFF]" />
          <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="text-white">
            Test Your Knowledge
          </h3>
        </div>
        <div className="text-center space-y-4">
          <p className="text-gray-300" style={{ fontSize: '16px' }}>
            Ready to test what you learned? This quiz has {module.quiz.length} questions.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setQuizStarted(true)}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ background: '#9B6BFF' }}
            >
              <Brain className="w-4 h-4 mr-2 inline" />
              Start Quiz
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-lg font-medium transition-colors hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgb(209,213,219)' }}
            >
              Skip Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults) {
    const scorePercentage = Math.round((score / module.quiz.length) * 100);
    return (
      <div className="mt-6" style={cardStyle}>
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="text-white">
            Quiz Complete!
          </h3>
        </div>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-white">
              {scorePercentage}%
            </div>
            <p className="text-xl text-gray-300">
              {score} out of {module.quiz.length} correct
            </p>
            <p className="text-gray-400">
              {scorePercentage >= 80 ? '🎉 Excellent work!' :
                scorePercentage >= 60 ? '👍 Good job!' :
                  '💪 Keep learning!'}
            </p>
          </div>

          {/* Show all questions with answers */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {module.quiz.map((question, index) => {
              const isCorrect = userAnswers[index] === question.correct_answer;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl"
                  style={{
                    background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: isCorrect ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)'
                  }}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2" style={{ fontSize: '16px' }}>
                        {index + 1}. {question.question}
                      </p>
                      <p className="text-sm text-gray-400 mb-1">
                        Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                          {userAnswers[index]}
                        </span>
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-gray-400">
                          Correct answer: <span className="text-green-400">{question.correct_answer}</span>
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-gray-400 mt-2 italic">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetake}
              className="px-6 py-3 rounded-lg font-medium transition-colors hover:bg-white/5"
              style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgb(209,213,219)' }}
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Retake Quiz
            </button>
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ background: '#9B6BFF' }}
            >
              Continue to Next Module
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  return (
    <div className="mt-6" style={cardStyle}>
      {/* Header */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-[#9B6BFF]" />
            <h3 style={{ fontSize: '20px', fontWeight: 600 }} className="text-white">
              Module Quiz
            </h3>
          </div>
          <span className="text-sm text-gray-400">
            Question {currentQuestionIndex + 1} of {module.quiz.length}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: '6px', background: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: '#9B6BFF' }}
          />
        </div>
      </div>

      {/* Question Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <p className="text-white font-medium" style={{ fontSize: '18px' }}>
            {currentQuestion.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const letter = option.charAt(0);
              const isSelected = userAnswers[currentQuestionIndex] === letter;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(currentQuestionIndex, letter)}
                  className="w-full text-left p-4 rounded-xl transition-all duration-200"
                  style={{
                    background: isSelected ? 'rgba(155,107,255,0.2)' : 'rgba(255,255,255,0.03)',
                    border: isSelected ? '1px solid #9B6BFF' : '1px solid rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }
                  }}
                >
                  <span className="font-medium text-gray-300" style={{ fontSize: '16px' }}>
                    {option}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 mt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-3 rounded-lg font-medium transition-colors hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgb(209,213,219)' }}
        >
          Previous
        </button>

        <div className="flex gap-2">
          {currentQuestionIndex < module.quiz.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ background: '#9B6BFF' }}
            >
              Next Question
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ background: '#22C55E' }}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Mark as Done button */}
      <div className="pt-4 mt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={onComplete}
          className="w-full px-6 py-3 rounded-lg font-medium transition-colors hover:bg-white/5 flex items-center justify-center gap-2"
          style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgb(209,213,219)' }}
        >
          <CheckCircle2 className="w-4 h-4" />
          Mark as Done & Continue
        </button>
      </div>
    </div>
  );
}
