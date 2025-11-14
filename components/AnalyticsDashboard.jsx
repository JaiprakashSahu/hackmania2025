'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  BookOpen,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { CircularProgress } from './ProgressIndicator';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?type=overview');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!analytics?.overview) {
    return null;
  }

  const { overview } = analytics;

  const stats = [
    {
      label: 'Total Courses',
      value: overview.totalCourses,
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      label: 'Completed',
      value: overview.completedCourses,
      icon: CheckCircle2,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      label: 'In Progress',
      value: overview.inProgressCourses,
      icon: TrendingUp,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    {
      label: 'Modules Done',
      value: overview.totalModulesCompleted,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      label: 'Avg Quiz Score',
      value: `${overview.averageQuizScore}%`,
      icon: Award,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/30'
    },
    {
      label: 'Time Spent',
      value: formatTime(overview.totalTimeSpent),
      icon: Clock,
      color: 'from-rose-500 to-red-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${stat.bgColor} backdrop-blur-xl rounded-xl p-6 border ${stat.borderColor} hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              </div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Rate Circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-around gap-8">
          <div className="flex flex-col items-center">
            <CircularProgress percentage={overview.averageCompletionRate} />
            <p className="text-sm text-white/70 mt-4">Course Completion Rate</p>
          </div>
          <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl font-bold text-green-400">
                {overview.completedCourses}
              </div>
              <div className="text-sm text-white/60 mt-1">Completed</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-3xl font-bold text-yellow-400">
                {overview.inProgressCourses}
              </div>
              <div className="text-sm text-white/60 mt-1">In Progress</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg col-span-2">
              <div className="text-3xl font-bold text-purple-400">
                {overview.averageQuizScore}%
              </div>
              <div className="text-sm text-white/60 mt-1">Average Quiz Score</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      {analytics.recentActivity && analytics.recentActivity.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analytics.recentActivity.slice(0, 5).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {activity.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-400" />
                  )}
                  <div>
                    <div className="text-sm text-white">Module {activity.moduleIndex + 1}</div>
                    <div className="text-xs text-white/60">
                      {new Date(activity.lastAccessedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                {activity.quizScore !== null && (
                  <div className="text-sm font-semibold text-purple-400">
                    {activity.quizScore}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds) return '0m';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
