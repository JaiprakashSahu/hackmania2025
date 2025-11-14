'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Plus, BookOpen, Zap, Crown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/AuthGuard';
import CourseCard from '@/components/CourseCard';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import { CourseListSkeleton } from '@/components/shared/SkeletonLoader';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';

export default function Dashboard() {
	const { user } = useUser();
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		fetchCourses();
	}, []);

	const fetchCourses = async () => {
		try {
			const response = await fetch('/api/courses');
			if (response.ok) {
				const data = await response.json();
				setCourses(data.courses || []);
			} else {
				toast.error('Failed to load courses');
			}
		} catch (error) {
			console.error('Error fetching courses:', error);
			toast.error('An error occurred while loading courses');
		} finally {
			setIsLoading(false);
		}
	};

	const handleCourseDelete = (deletedCourseId) => {
		setCourses(prevCourses => prevCourses.filter(course => course.id !== deletedCourseId));
	};

	const getCategoryStats = () => {
		const stats = {};
		courses.forEach(course => {
			stats[course.category] = (stats[course.category] || 0) + 1;
		});
		return stats;
	};

	const categoryStats = getCategoryStats();

	return (
		<AuthGuard>
		<div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-black">
			{/* Animated Globe Background */}
			<div className="absolute left-[-100px] top-[40%] w-[450px] h-[450px] z-0 hidden lg:block">
				<motion.div 
					className="w-full h-full rounded-full relative"
					style={{
						background: 'radial-gradient(circle at 30% 30%, rgba(147, 51, 234, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, rgba(147, 51, 234, 0.4) 100%)',
						boxShadow: '0 0 100px rgba(147, 51, 234, 0.5)'
					}}
					animate={{ 
						y: [0, -30, 0],
						rotate: [0, 5, 0]
					}}
					transition={{ 
						duration: 6,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				>
					<motion.div 
						className="absolute w-full h-full rounded-full"
						style={{
							background: `repeating-linear-gradient(0deg, transparent, transparent 35px, rgba(255, 255, 255, 0.1) 35px, rgba(255, 255, 255, 0.1) 36px),
										 repeating-linear-gradient(90deg, transparent, transparent 35px, rgba(255, 255, 255, 0.1) 35px, rgba(255, 255, 255, 0.1) 36px)`
						}}
						animate={{ rotate: 360 }}
						transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
					/>
					{[
						{ top: '25%', left: '35%', delay: 0 },
						{ top: '45%', left: '55%', delay: 0.5 },
						{ top: '65%', left: '25%', delay: 1 }
					].map((dot, i) => (
						<motion.div
							key={i}
							className="absolute w-2 h-2 bg-white rounded-full"
							style={{ 
								top: dot.top, 
								left: dot.left,
								boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)'
							}}
							animate={{ 
								scale: [1, 1.5, 1],
								opacity: [1, 0.5, 1]
							}}
							transition={{ 
								duration: 2,
								repeat: Infinity,
								delay: dot.delay,
								ease: "easeInOut"
							}}
						/>
					))}
				</motion.div>
			</div>
				
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
				<div className="min-h-screen relative z-10 pb-24 md:pb-8">
					<div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto">
						{/* Enhanced Header Section */}
						<motion.div 
							className="text-center mb-8 lg:mb-12 pt-16 lg:pt-4"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<motion.h1 
								className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 lg:mb-6 px-4"
								style={{
									background: 'linear-gradient(90deg, #a78bfa 0%, #60a5fa 25%, #a78bfa 50%, #60a5fa 75%, #a78bfa 100%)',
									backgroundSize: '200% auto',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									lineHeight: '1.2'
								}}
								animate={{
									backgroundPosition: ['0% center', '200% center']
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "linear"
								}}
								initial={{ opacity: 0, scale: 0.9 }}
								whileInView={{ opacity: 1, scale: 1 }}
							>
								Hello, {user?.firstName || 'Creator'}!
							</motion.h1>
							<motion.p 
								className="text-base md:text-lg text-gray-600 mb-5 lg:mb-6 max-w-2xl mx-auto px-4"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.2 }}
							>
								Create new courses with AI, share with friends, and grow your library.
							</motion.p>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<Link href="/create-course">
									<Button 
										size="lg" 
										className="flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-5 text-base font-semibold text-white rounded-xl border border-white/15 bg-white/10 backdrop-blur-md shadow-lg hover:bg-white/15 hover:shadow-2xl transition-all duration-300"
									>
										<Plus className="w-5 h-5" />
										<span>Create AI Course</span>
									</Button>
								</Link>
							</motion.div>
						</motion.div>

						{/* Enhanced Stats Cards */}
						<motion.div 
							className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-10 lg:mb-14"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
						>
							<motion.div 
								className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.5 }}
								whileHover={{ y: -5, scale: 1.03 }}
							>
								<div className="flex flex-col items-center text-center gap-3">
									<div 
										className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600"
									>
										<BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
									</div>
									<div>
										<p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">{courses.length}</p>
										<p className="text-xs text-white/70 font-medium">Total Courses</p>
									</div>
								</div>
							</motion.div>

							<motion.div 
								className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.6 }}
								whileHover={{ y: -5, scale: 1.03 }}
							>
								<div className="flex flex-col items-center text-center gap-3">
									<div 
										className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600"
									>
										<Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
									</div>
									<div>
										<p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
											{courses.reduce((total, course) => total + (course.chapterCount || 0), 0)}
										</p>
										<p className="text-xs text-white/70 font-medium">Total Chapters</p>
									</div>
								</div>
							</motion.div>

							<motion.div 
								className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.7 }}
								whileHover={{ y: -5, scale: 1.03 }}
							>
								<div className="flex flex-col items-center text-center gap-3">
									<div 
										className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"
									>
										<Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
									</div>
									<div>
										<p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
											{Object.keys(categoryStats).length}
										</p>
										<p className="text-xs text-white/70 font-medium">Categories</p>
									</div>
								</div>
							</motion.div>

							<motion.div 
								className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.8 }}
								whileHover={{ y: -5, scale: 1.03 }}
							>
								<div className="flex flex-col items-center text-center gap-3">
									<div 
										className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600"
									>
										<Crown className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
									</div>
									<div>
										<p className="text-2xl sm:text-3xl font-bold text-white mb-0.5">
											{courses.filter(c => c.includeVideos).length}
										</p>
										<p className="text-xs text-white/70 font-medium">With Videos</p>
									</div>
								</div>
							</motion.div>
						</motion.div>

						{/* Enhanced My AI Courses Section */}
						<motion.div 
							className="mb-8"
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.9 }}
						>
							<div className="mb-8 text-center">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0 }}
								>
									<h2 
										className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-3"
										style={{
											background: 'linear-gradient(90deg, #a78bfa 0%, #60a5fa 50%, #a78bfa 100%)',
											backgroundSize: '200% auto',
											WebkitBackgroundClip: 'text',
											WebkitTextFillColor: 'transparent',
											backgroundClip: 'text'
										}}
									>
										My AI Courses
									</h2>
									<p className="text-gray-600 text-lg mt-3 mb-2">Your personalized learning library</p>
									<div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 backdrop-blur-md shadow-sm">
										<span className="text-sm font-medium">
											{courses.length} course{courses.length !== 1 ? 's' : ''} created
										</span>
									</div>
								</motion.div>
							</div>

							{isLoading ? (
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
									{[1, 2, 3].map((i) => (
										<motion.div 
											key={i} 
											className="h-80 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/20 animate-pulse shadow-xl"
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: i * 0.1 }}
										/>
									))}
								</div>
							) : courses.length === 0 ? (
								<motion.div 
									className="py-20 text-center bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 1.1 }}
								>
									<motion.div 
										className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-violet-600 shadow-xl"
										animate={{ 
											rotate: [0, 10, -10, 0],
											scale: [1, 1.1, 1]
										}}
										transition={{ 
											duration: 3,
											repeat: Infinity,
											ease: "easeInOut"
										}}
									>
										<BookOpen className="h-14 w-14 text-white" />
									</motion.div>
									<h3 className="mb-3 text-3xl font-bold text-gray-900">No courses yet</h3>
									<p className="mb-8 text-gray-600 text-lg">Create your first AI-powered course to get started!</p>
									<Link href="/create-course">
										<Button 
											size="lg"
											className="text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 px-10 py-6 text-lg font-semibold"
											style={{
												background: '#1e293b'
											}}
										>
											<Plus className="mr-2 h-6 w-6" />
											Create Your First Course
										</Button>
									</Link>
								</motion.div>
							) : (
								<motion.div 
									className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.6, delay: 0.7 }}
								>
									{courses.map((course, index) => (
										<motion.div
											key={course.id}
											initial={{ opacity: 0, y: 30 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.8 + index * 0.1 }}
											whileHover={{ y: -8, scale: 1.02 }}
										>
																<CourseCard 
																	course={course} 
																	onDelete={handleCourseDelete}
																	className="bg-black/20 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20"
																/>
										</motion.div>
									))}
								</motion.div>
							)}
						</motion.div>
					</div>
				</div>
			</div>
		</AuthGuard>
	);
}
