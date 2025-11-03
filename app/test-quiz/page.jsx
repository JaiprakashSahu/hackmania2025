'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestQuizGeneration() {
  const [topic, setTopic] = useState('JavaScript Basics');
  const [level, setLevel] = useState('Beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testQuizGeneration = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/enhanced-course-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          level,
          includeVideos: false,
          includeQuizzes: true
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
      
      // Log quiz status
      console.log('Quiz Generation Test Results:');
      console.log('Total modules:', data.modules?.length || 0);
      data.modules?.forEach((module, index) => {
        console.log(`Module ${index + 1}:`, {
          title: module.title,
          hasQuiz: !!module.quiz,
          quizLength: module.quiz?.length || 0,
          quiz: module.quiz
        });
      });
      
    } catch (err) {
      setError(err.message);
      console.error('Quiz generation test error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Generation Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic:</label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter course topic"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Level:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            
            <Button 
              onClick={testQuizGeneration} 
              disabled={isLoading || !topic}
              className="w-full"
            >
              {isLoading ? 'Generating...' : 'Test Quiz Generation'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Course: {result.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Overview:</h4>
                  <p className="text-gray-600">{result.overview}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Modules & Quizzes:</h4>
                  {result.modules?.map((module, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4">
                      <h5 className="font-semibold text-lg mb-2">
                        Module {index + 1}: {module.title}
                      </h5>
                      
                      <div className="mb-4">
                        <h6 className="font-medium mb-2">Key Points:</h6>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {module.keyPoints?.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h6 className="font-medium mb-2 text-blue-800">
                          Quiz Status: {module.quiz ? `✅ ${module.quiz.length} questions` : '❌ No quiz'}
                        </h6>
                        
                        {module.quiz && module.quiz.length > 0 ? (
                          <div className="space-y-3">
                            {module.quiz.map((question, qIndex) => (
                              <div key={qIndex} className="bg-white p-3 rounded border">
                                <p className="font-medium mb-2">
                                  Q{qIndex + 1}: {question.question}
                                </p>
                                <ul className="text-sm space-y-1 mb-2">
                                  {question.options?.map((option, oIndex) => (
                                    <li 
                                      key={oIndex}
                                      className={option === question.answer ? 'font-semibold text-green-600' : 'text-gray-600'}
                                    >
                                      {String.fromCharCode(65 + oIndex)}. {option}
                                      {option === question.answer && ' ✓'}
                                    </li>
                                  ))}
                                </ul>
                                <p className="text-xs text-gray-500">
                                  <strong>Explanation:</strong> {question.explanation}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-red-600 text-sm">No quiz questions generated for this module.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
