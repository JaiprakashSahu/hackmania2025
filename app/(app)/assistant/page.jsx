'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Sparkles, BookOpen, HelpCircle, Brain, FileQuestion } from 'lucide-react';

const SUGGESTION_CHIPS = [
    { label: 'Summarize my module', icon: BookOpen },
    { label: 'Explain this concept', icon: HelpCircle },
    { label: 'Make me a quiz', icon: Brain },
    { label: 'Help me study', icon: Sparkles },
    { label: 'Predict exam questions', icon: FileQuestion },
];

export default function AssistantPage() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hello! I\'m your AI learning assistant. Ask me anything about your courses, study tips, or any topic you\'re learning about.',
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/assistant/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            const data = await response.json();
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.response || 'Sorry, I could not generate a response.' },
            ]);
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, there was an error processing your request.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    return (
        <div className="min-h-screen bg-[#0f0f17]">
            <div className="max-w-4xl mx-auto px-6 py-8">

                {/* Hero Header Card */}
                <div className="bg-[#1C1E27] border border-white/[0.07] rounded-2xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.4)] mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#9B6BFF]/10 flex items-center justify-center">
                            <Bot className="w-7 h-7 text-[#9B6BFF]" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-semibold text-white">AI Assistant</h1>
                            <p className="text-white/[0.55] text-sm">Get help with your learning journey</p>
                        </div>
                    </div>
                </div>

                {/* Suggested Actions Row */}
                <div className="mb-6 overflow-x-auto scrollbar-hide">
                    <div className="flex gap-3 pb-2">
                        {SUGGESTION_CHIPS.map((chip, i) => (
                            <button
                                key={i}
                                onClick={() => handleSuggestionClick(chip.label)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1C1E27] border border-white/[0.07] text-gray-300 text-sm whitespace-nowrap hover:bg-white/[0.05] transition-colors"
                            >
                                <chip.icon className="w-4 h-4 text-white/40" />
                                {chip.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Window Card */}
                <div className="bg-[#1C1E27] border border-white/[0.07] rounded-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)] overflow-hidden">

                    {/* Messages Area */}
                    <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                        {messages.map((message, i) => (
                            <div
                                key={i}
                                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {/* Assistant Avatar */}
                                {message.role === 'assistant' && (
                                    <div className="w-9 h-9 rounded-xl bg-[#9B6BFF]/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-[#9B6BFF]" />
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div
                                    className={`max-w-[75%] p-4 rounded-xl ${message.role === 'user'
                                            ? 'bg-[#9B6BFF] text-white'
                                            : 'bg-[#1C1E27] border border-white/[0.07] text-gray-300'
                                        }`}
                                >
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex gap-3">
                                <div className="w-9 h-9 rounded-xl bg-[#9B6BFF]/10 flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-5 h-5 text-[#9B6BFF]" />
                                </div>
                                <div className="bg-[#1C1E27] border border-white/[0.07] p-4 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-[#9B6BFF] animate-spin" />
                                        <span className="text-sm text-white/50">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Bar */}
                    <form onSubmit={handleSubmit} className="p-4 border-t border-white/[0.07]">
                        <div className="flex items-center gap-3 bg-[#14151C] border border-white/10 rounded-full h-14 px-6">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm focus:outline-none"
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-10 h-10 rounded-full bg-[#9B6BFF] hover:bg-[#8258e6] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                                <Send className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}
