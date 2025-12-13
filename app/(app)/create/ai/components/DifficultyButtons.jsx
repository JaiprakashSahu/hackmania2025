'use client';

import { motion } from 'framer-motion';

export default function DifficultyButtons({ value, onChange }) {
    const levels = [
        { id: 'beginner', label: 'Beginner', icon: '🌱' },
        { id: 'intermediate', label: 'Intermediate', icon: '📚' },
        { id: 'advanced', label: 'Advanced', icon: '🚀' },
    ];

    return (
        <div role="radiogroup" aria-label="Course difficulty" className="flex gap-3">
            {levels.map((level) => {
                const selected = value === level.id;
                return (
                    <motion.button
                        key={level.id}
                        onClick={() => onChange(level.id)}
                        role="radio"
                        aria-checked={selected}
                        tabIndex={0}
                        className={`flex-1 py-3.5 px-4 rounded-xl text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B6BFF]/50 ${selected
                                ? 'bg-[#9B6BFF]/20 border-2 border-[#9B6BFF] text-white shadow-[0_8px_30px_rgba(155,107,255,0.15)]'
                                : 'bg-[#14151C] border border-white/10 text-white/70 hover:border-white/20 hover:text-white'
                            }`}
                        whileTap={{ scale: 0.97 }}
                        whileHover={{ scale: 1.02 }}
                        animate={{
                            y: selected ? -2 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                        <span className="text-lg mr-2">{level.icon}</span>
                        {level.label}
                    </motion.button>
                );
            })}
        </div>
    );
}
