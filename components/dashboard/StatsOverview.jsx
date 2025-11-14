'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Target,
  Flame,
  Trophy
} from 'lucide-react';

export default function StatsOverview({ analytics }) {
  if (!analytics?.overview) {
    return null;
  }

  const { overview } = analytics;

  const stats = [
    {
      label: 'Total Courses',
      value: overview.totalCourses || 0,
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-600/10',
      borderColor: 'border-blue-500/30',
      change: '+2 this month'
    },
    {
      label: 'Completed',
      value: overview.completedCourses || 0,
      icon: CheckCircle,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-600/10',
      borderColor: 'border-green-500/30',
      change: `${overview.averageCompletionRate || 0}% rate`
    },
    {
      label: 'In Progress',
      value: overview.inProgressCourses || 0,
      icon: TrendingUp,
      gradient: 'from-yellow-500 to-orange-600',
      bgGradient: 'from-yellow-500/10 to-orange-600/10',
      borderColor: 'border-yellow-500/30',
      change: 'Keep going!'
    },
    {
      label: 'Modules Done',
      value: overview.totalModulesCompleted || 0,
      icon: Target,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-600/10',
      borderColor: 'border-purple-500/30',
      change: 'Great progress'
    },
    {
      label: 'Avg Quiz Score',
      value: `${overview.averageQuizScore || 0}%`,
      icon: Award,
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-500/10 to-purple-600/10',
      borderColor: 'border-indigo-500/30',
      change: overview.averageQuizScore >= 80 ? 'Excellent!' : 'Keep improving'
    },
    {
      label: 'Time Invested',
      value: formatTime(overview.totalTimeSpent || 0),
      icon: Clock,
      gradient: 'from-rose-400 to-red-400',
      bgGradient: 'from-rose-500/10 to-red-400/10',
      borderColor: 'border-rose-500/30',
      change: 'Hours learned'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Your Learning Stats
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Track your progress and achievements
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br backdrop-blur-xl ${stat.bgGradient} ${stat.borderColor} p-6 hover:shadow-xl transition-all cursor-pointer group`}
            >
              {/* Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                {/* Animated background gradient */}
                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:scale-150 transition-transform duration-500`} />
              </div>

              {/* Value */}
              <div className="space-y-1 mb-3">
                <div className="text-4xl font-bold text-neutral-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {stat.label}
                </div>
              </div>

              {/* Change indicator */}
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stat.change}</span>
              </div>

              {/* Hover effect line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
            </motion.div>
          );
        })}
      </div>

      {/* Achievements Preview */}
      {overview.averageQuizScore >= 90 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-amber-600/20 border border-yellow-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                🎉 Top Performer!
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                You've maintained an average quiz score of {overview.averageQuizScore}%! Keep up the excellent work!
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Streak Badge (if applicable) */}
      {overview.totalModulesCompleted >= 10 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-400/20 border border-orange-500/30 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-red-400 animate-pulse">
              <Flame className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
                🔥 On Fire!
              </h3>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {overview.totalModulesCompleted} modules completed! You're on a learning streak!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function formatTime(seconds) {
  if (!seconds) return '0h';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
