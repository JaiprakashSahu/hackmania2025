'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ToggleWithTooltip({ label, hint, icon, checked, onChange }) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div
            className="relative flex items-center justify-between bg-[#14151C] border border-white/10 rounded-xl px-5 py-4 transition-colors hover:border-white/15"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="w-10 h-10 rounded-lg bg-[#1C1C29] flex items-center justify-center">
                        {icon}
                    </div>
                )}
                <div>
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{hint}</p>
                </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9B6BFF]/50 ${checked ? 'bg-[#9B6BFF]' : 'bg-[#14151C] border border-white/10'
                    }`}
            >
                <motion.span
                    className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    animate={{ x: checked ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            </button>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-10 right-0 px-3 py-1.5 rounded-lg bg-[#272732] border border-white/10 text-white text-xs shadow-lg z-10"
                    >
                        {checked ? 'Enabled' : 'Disabled'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
