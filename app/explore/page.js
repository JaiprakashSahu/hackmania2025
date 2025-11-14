'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Sparkles, BookOpen, Zap, Filter, TrendingUp, Star, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/CourseCard';
import Sidebar from '@/components/Sidebar';

export default function Explore() {
	const [query, setQuery] = useState('');
	const [filter, setFilter] = useState('all');
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showFilters, setShowFilters] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const res = await fetch('/api/courses');
			if (res.ok) {
				const data = await res.json();
				setCourses(data.courses || []);
			}
		} finally {
			setLoading(false);
		}
	};

	const filtered = courses.filter((c) => {
		const matchesQuery = !query || c.title?.toLowerCase().includes(query.toLowerCase());
		const matchesFilter = filter === 'all' || c.difficulty === filter;
		const matchesCategory = !selectedCategory || c.category?.toLowerCase() === selectedCategory.toLowerCase();
		return matchesQuery && matchesFilter && matchesCategory;
	});

	const getCategoryStats = () => {
		const stats = {};
		courses.forEach(course => {
			stats[course.category] = (stats[course.category] || 0) + 1;
		});
		return stats;
	};

	const categoryStats = getCategoryStats();

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-black relative overflow-hidden">
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			
			{/* Hamburger Menu Button - 3 Lines */}
			<motion.button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className="fixed top-5 left-5 z-30 p-3 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300"
				whileHover={{ scale: 1.1, rotate: 90 }}
				whileTap={{ scale: 0.9 }}
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className="flex flex-col gap-1.5 w-6 h-6 items-center justify-center">
					<motion.span 
						className="w-full h-0.5 bg-white rounded-full"
						animate={{ width: ["100%", "80%", "100%"] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
					/>
					<motion.span 
						className="w-full h-0.5 bg-white rounded-full"
					/>
					<motion.span 
						className="w-full h-0.5 bg-white rounded-full"
						animate={{ width: ["100%", "80%", "100%"] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.75 }}
					/>
				</div>
			</motion.button>

			{/* Main Content */}
			<div className="min-h-screen relative z-10">
				<div className="p-8">
					{/* Enhanced Header Section */}
					<motion.div 
						className="mb-8"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
							<div className="bg-white/95 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-purple-500/30 shadow-xl mb-8">
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2 }}
							>
								<div className="flex items-center gap-4 mb-6">
														<motion.div 
															className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"
															animate={{ 
															rotate: [0, 360],
															scale: [1, 1.05, 1]
														}}
															transition={{ 
															rotate: { duration: 10, repeat: Infinity, ease: "linear" },
															scale: { duration: 2, repeat: Infinity }
														}}
													>
										<Sparkles className="w-8 h-8 text-white" />
									</motion.div>
									<div>
															<h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
											Explore Courses
										</h1>
										<p className="text-gray-600 dark:text-gray-300 text-xl mt-2">
											Discover amazing AI-generated courses and expand your knowledge
										</p>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Enhanced Search and Filter Section */}
							<motion.div 
												className="bg-white/95 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-purple-500/30 shadow-xl"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
								{/* Search Bar */}
								<div className="relative flex-1 max-w-2xl">
									<Input 
										value={query} 
										onChange={(e) => setQuery(e.target.value)} 
										placeholder="Search courses by title, topic, or category..." 
										className={`h-14 text-lg rounded-xl border-2 border-gray-200 dark:border-purple-500/30 bg-white dark:bg-black/30 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-purple-400 focus:ring-purple-400/20 pl-12 ${selectedCategory ? 'pr-32' : 'pr-4'}`}
									/>
									<motion.div
										className="absolute left-4 top-1/2 -translate-y-1/2"
										animate={{ 
											scale: [1, 1.1, 1],
											rotate: [0, 5, -5, 0]
										}}
										transition={{ duration: 2, repeat: Infinity }}
									>
										<Search className="h-6 w-6 text-gray-400 dark:text-gray-500" />
									</motion.div>
									{/* Active Category Badge */}
									{selectedCategory && (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2"
										>
											<span className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-md">
												{selectedCategory}
											</span>
											<button
												onClick={() => setSelectedCategory(null)}
												className="p-1 rounded-full hover:bg-white/20 transition-colors"
												title="Clear category filter"
											>
												<X className="h-4 w-4 text-white" />
											</button>
										</motion.div>
									)}
								</div>

								{/* Filter Button */}
								<motion.div
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										onClick={() => setShowFilters(!showFilters)}
										className="h-14 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-0 flex items-center gap-3"
									>
										<motion.div
											animate={{ rotate: showFilters ? 180 : 0 }}
											transition={{ duration: 0.3 }}
										>
											<Filter className="h-5 w-5" />
										</motion.div>
										<span className="font-semibold">Advanced Filters</span>
									</Button>
								</motion.div>
							</div>

							{/* Advanced Filters Panel */}
							<AnimatePresence>
								{showFilters && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										exit={{ opacity: 0, height: 0 }}
										transition={{ duration: 0.3 }}
										className="mt-6 pt-6 border-t border-gray-200 dark:border-purple-500/30"
									>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
											<div>
												<h3 className="text-gray-800 dark:text-white font-semibold mb-3 flex items-center gap-2">
													<TrendingUp className="h-4 w-4" />
													Popular Categories
												</h3>
												<div className="space-y-2">
													{Object.entries(categoryStats)
														.sort((a, b) => b[1] - a[1])
														.map(([category, count]) => {
															const isSelected = selectedCategory?.toLowerCase() === category.toLowerCase();
															return (
																<motion.button
																	key={category}
																	onClick={() => {
																		if (isSelected) {
																			setSelectedCategory(null);
																		} else {
																			setSelectedCategory(category);
																		}
																	}}
																	className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer ${
																		isSelected
																			? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
																			: 'bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-800/40 text-gray-700 dark:text-gray-200'
																	}`}
																	whileHover={{ scale: isSelected ? 1.05 : 1.02, x: isSelected ? 0 : 5 }}
																	whileTap={{ scale: 0.98 }}
																>
																	<span className="capitalize font-medium">{category}</span>
																	<span className={`font-semibold ${isSelected ? 'text-white' : 'text-purple-600 dark:text-purple-400'}`}>
																		{count}
																	</span>
																</motion.button>
															);
														})}
													{selectedCategory && (
														<motion.button
															initial={{ opacity: 0, y: -10 }}
															animate={{ opacity: 1, y: 0 }}
															onClick={() => setSelectedCategory(null)}
															className="w-full mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium transition-colors"
														>
															Clear Category Filter
														</motion.button>
													)}
												</div>
											</div>
											<div>
												<h3 className="text-gray-800 dark:text-white font-semibold mb-3 flex items-center gap-2">
													<Star className="h-4 w-4" />
													Course Features
												</h3>
												<div className="space-y-2">
													<div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30">
														<span className="text-gray-700 dark:text-gray-200">With Videos</span>
														<span className="text-blue-600 dark:text-blue-400 font-semibold">
															{courses.filter(c => c.includeVideos).length}
														</span>
													</div>
													<div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/30">
														<span className="text-gray-700 dark:text-gray-200">With Quizzes</span>
														<span className="text-green-600 dark:text-green-400 font-semibold">
															{courses.filter(c => c.includeQuiz).length}
														</span>
													</div>
												</div>
											</div>
											<div>
												<h3 className="text-gray-800 dark:text-white font-semibold mb-3 flex items-center gap-2">
													<BookOpen className="h-4 w-4" />
													Quick Stats
												</h3>
												<div className="space-y-2">
													<div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-900/30">
														<span className="text-gray-700 dark:text-gray-200">Total Courses</span>
														<span className="text-purple-600 dark:text-purple-400 font-semibold">{courses.length}</span>
													</div>
													<div className="flex items-center justify-between p-3 rounded-lg bg-cyan-50 dark:bg-cyan-900/30">
														<span className="text-gray-700 dark:text-gray-200">Total Chapters</span>
														<span className="text-cyan-600 dark:text-cyan-400 font-semibold">
															{courses.reduce((total, course) => total + (course.chapterCount || 0), 0)}
														</span>
													</div>
												</div>
											</div>
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</motion.div>
					</motion.div>

					{/* Enhanced Filter Tabs */}
					<motion.div 
						className="mb-8"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Tabs value={filter} onValueChange={setFilter} className="w-full">
						<div className="bg-white/95 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-2 border border-gray-200 dark:border-purple-500/30 shadow-xl">
							<TabsList className="grid w-full grid-cols-4 bg-transparent border-0">
								<TabsTrigger 
									value="all" 
									className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 font-semibold"
								>
									All Courses
								</TabsTrigger>
								<TabsTrigger 
									value="Beginner" 
									className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 font-semibold"
								>
									Beginner
								</TabsTrigger>
								<TabsTrigger 
									value="Intermediate" 
									className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 font-semibold"
								>
									Intermediate
								</TabsTrigger>
								<TabsTrigger 
									value="Advanced" 
									className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-400 data-[state=active]:to-pink-400 data-[state=active]:text-white text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-300 font-semibold"
								>
									Advanced
								</TabsTrigger>
							</TabsList>
						</div>
							<TabsContent value="all" />
							<TabsContent value="Beginner" />
							<TabsContent value="Intermediate" />
							<TabsContent value="Advanced" />
						</Tabs>
					</motion.div>

					{/* Enhanced Course Grid */}
					<motion.div 
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						{loading ? (
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
								{[1,2,3,4,5,6].map((i) => (
									<motion.div 
										key={i} 
										className="h-80 rounded-2xl bg-white dark:bg-black/40 border border-gray-200 dark:border-purple-500/30 animate-pulse shadow-md"
										initial={{ opacity: 0, scale: 0.9 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: i * 0.1 }}
									/>
								))}
							</div>
						) : filtered.length === 0 ? (
							<motion.div 
								className="py-16 text-center bg-white/95 dark:bg-black/40 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-purple-500/30 shadow-xl"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.8 }}
							>
								<motion.div 
									className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-lg"
									animate={{ 
										rotate: [0, 360],
										scale: [1, 1.1, 1]
									}}
									transition={{ 
										rotate: { duration: 10, repeat: Infinity, ease: "linear" },
										scale: { duration: 2, repeat: Infinity }
									}}
								>
									<Search className="h-12 w-12 text-white" />
								</motion.div>
								<h3 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">No courses found</h3>
								<p className="mb-6 text-gray-600 dark:text-gray-300">
									{query ? `No courses match "${query}"` : 'No courses available with the selected filters'}
								</p>
								{query && (
									<Button
										onClick={() => setQuery('')}
										className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
									>
										Clear Search
									</Button>
								)}
							</motion.div>
						) : (
							<motion.div 
								className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.6, delay: 0.7 }}
							>
								<AnimatePresence>
									{filtered.map((course, index) => (
										<motion.div
											key={course.id}
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -30 }}
											transition={{ delay: index * 0.1 }}
											whileHover={{ y: -8, scale: 1.02 }}
										>
											<CourseCard 
												course={course} 
												className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
											/>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	);
}













