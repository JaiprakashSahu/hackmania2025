'use client';

import { useState, useEffect } from 'react';
import { FolderOpen, FileText, Image, Video, StickyNote, Download, Archive, Loader2 } from 'lucide-react';

// Category configuration
const categories = [
    { id: 'documents', name: 'Documents', icon: FileText, color: '#D4A853' },
    { id: 'images', name: 'Images', icon: Image, color: '#D4A853' },
    { id: 'videos', name: 'Videos', icon: Video, color: '#D4A853' },
    { id: 'notes', name: 'Notes', icon: StickyNote, color: '#D4A853' },
    { id: 'exports', name: 'Exports', icon: Download, color: '#D4A853' },
    { id: 'archives', name: 'Archives', icon: Archive, color: '#D4A853' },
];

export default function LibraryPage() {
    const [counts, setCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            const response = await fetch('/api/library');
            const data = await response.json();
            setCounts(data.counts || {});
        } catch (error) {
            console.error('Error fetching library:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}
                <div className="flex items-center gap-4 mb-10">
                    <div
                        className="p-3 rounded-xl"
                        style={{
                            background: 'rgba(212, 168, 83, 0.1)',
                            border: '1px solid rgba(212, 168, 83, 0.2)'
                        }}
                    >
                        <FolderOpen className="w-8 h-8" style={{ color: '#D4A853' }} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Library</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Your saved resources and materials</p>
                    </div>
                </div>

                {/* Category Cards Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            const itemCount = counts[category.id] || 0;

                            return (
                                <button
                                    key={category.id}
                                    className="group p-6 rounded-xl text-center transition-all hover:scale-[1.02]"
                                    style={{
                                        background: 'var(--card)',
                                        border: '1px solid var(--border)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = 'rgba(212, 168, 83, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--border)';
                                    }}
                                >
                                    {/* Icon */}
                                    <div className="flex justify-center mb-4">
                                        <div
                                            className="p-4 rounded-xl"
                                            style={{
                                                background: 'rgba(212, 168, 83, 0.08)'
                                            }}
                                        >
                                            <Icon
                                                className="w-8 h-8"
                                                style={{ color: category.color }}
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <h3 className="text-sm font-medium text-white mb-1">
                                        {category.name}
                                    </h3>

                                    {/* Count */}
                                    <p
                                        className="text-xs"
                                        style={{ color: category.color }}
                                    >
                                        {itemCount} items
                                    </p>
                                </button>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}
