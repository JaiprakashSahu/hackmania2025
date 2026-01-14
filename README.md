# 🎓 MindCourse - AI-Powered Learning Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)

### 🚀 [Live Demo](https://alluarjun-seven.vercel.app/) | 📖 [Documentation](#features)

*An intelligent course generation platform powered by Groq AI that transforms any topic into comprehensive, structured learning experiences.*

</div>

---

## 🌟 Overview

MindCourse is a full-stack AI-powered educational platform that revolutionizes course creation. Built with modern web technologies, it leverages Groq's advanced language models to generate complete courses with structured modules, quizzes, and curated learning resources - all from a simple topic input.

### 💡 Why MindCourse?

- **Instant Course Creation**: Generate complete courses in seconds, not hours
- **AI-Driven Content**: Leverages Groq AI for intelligent, contextual content generation
- **Interactive Learning**: Built-in quizzes, progress tracking, and AI tutoring
- **Modern UX**: Beautiful, responsive interface with smooth animations
- **Production-Ready**: Deployed on Vercel with PostgreSQL database

---

## ✨ Key Features

### 🤖 AI-Powered Generation
- **Smart Course Builder**: Uses Groq's LLaMA models to generate structured courses
- **Adaptive Difficulty**: Beginner, Intermediate, and Advanced content levels
- **YouTube Integration**: Automatically curates relevant video resources
- **Quiz Generation**: AI-generated questions for each module

### 📚 Learning Experience
- **Interactive Modules**: Expandable chapters with rich content
- **Progress Tracking**: Real-time course completion analytics
- **AI Tutor**: Chat-based learning assistant for course-specific help
- **OCR Support**: Upload PDFs and images to generate courses from documents

### 🎨 User Interface
- **Modern Design**: Dark theme with glassmorphism effects
- **Responsive Layout**: Mobile-first design, optimized for all devices
- **Smooth Animations**: Framer Motion for fluid transitions
- **Accessibility**: WCAG compliant with keyboard navigation

### 🔐 Authentication & Data
- **Secure Auth**: Clerk-powered authentication system
- **User Dashboard**: Personalized course library and analytics
- **Real-time Updates**: Live progress synchronization
- **Data Persistence**: PostgreSQL with Drizzle ORM

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18 with TypeScript
- **Styling**: TailwindCSS + shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context + Zustand

### Backend
- **API Routes**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Caching**: Redis (Upstash)
- **File Storage**: Vercel Blob

### AI & Integrations
- **AI Provider**: Groq AI (LLaMA 3.1)
- **Authentication**: Clerk
- **Video API**: YouTube Data API v3
- **OCR**: Tesseract.js + PDF.js
- **Charts**: Recharts

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or Neon account)
- Clerk account ([clerk.com](https://clerk.com))
- Groq API key ([console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mindcourse.git
   cd mindcourse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   
   Create `.env.local` file:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:5432/mindcourse"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Groq AI
   GROQ_API_KEY=gsk_...
   
   # Optional: YouTube API (for video recommendations)
   YOUTUBE_API_KEY=AIza...
   
   # Optional: Redis Cache
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

4. **Database setup**
   ```bash
   npm run db:push
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
mindcourse/
├── app/
│   ├── (app)/              # Authenticated routes
│   │   ├── assistant/      # AI chat tutor
│   │   ├── courses/        # Course library
│   │   ├── analytics/      # Learning analytics
│   │   └── create/         # Course creation
│   ├── api/                # API endpoints
│   │   ├── generate/       # AI generation routes
│   │   ├── courses/        # CRUD operations
│   │   └── chat/           # AI tutor endpoints
│   └── course/[id]/        # Course viewer
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── chat/               # Chat tutor components
│   └── analytics/          # Analytics visualizations
├── lib/
│   ├── db/                 # Database schema & config
│   ├── llm/                # AI integration logic
│   ├── ocr/                # OCR processing
│   └── validations/        # Zod schemas
└── public/                 # Static assets
```

---

## 🎯 Core Functionality

### Course Generation Flow

1. **User Input**: Topic, difficulty level, module count, preferences
2. **AI Processing**: Groq AI generates structured course outline
3. **Content Creation**: Modules with sections, explanations, examples
4. **Resource Curation**: YouTube videos, quiz questions
5. **Database Storage**: Course saved with user association
6. **Instant Access**: Navigate to course viewer

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate/ai` | POST | Generate course with Groq AI |
| `/api/courses` | GET/POST | Fetch or create courses |
| `/api/courses/[id]` | GET | Get course details |
| `/api/chat/tutor` | POST | AI tutor conversation |
| `/api/analytics/overview` | GET | User learning analytics |
| `/api/progress/update` | POST | Update course progress |

---

## � Design Philosophy

- **Dark-First**: Optimized for reduced eye strain during learning
- **Minimalist**: Clean interface that prioritizes content
- **Responsive**: Mobile-first approach with breakpoint optimization
- **Accessible**: Keyboard navigation, screen reader support
- **Performance**: Optimized bundle size, lazy loading, image optimization

---

## 🔧 Key Technical Highlights

### AI Integration
- Structured JSON parsing with error recovery
- Retry logic for API failures
- Token optimization for cost efficiency
- Context-aware prompt engineering

### Performance Optimizations
- Server-side rendering for initial load
- Dynamic imports for code splitting
- Image optimization with Next.js Image
- Database query optimization with indexes

### Security
- Environment variable validation
- SQL injection prevention via ORM
- XSS protection with React
- CSRF tokens for mutations

---

## 📊 Features in Detail

### 1. AI Course Generator
Create courses on any topic with customizable parameters:
- Difficulty levels (Beginner/Intermediate/Advanced)
- Module count (3-7 modules)
- YouTube video integration
- Quiz generation

### 2. Course Viewer
Interactive learning experience:
- Expandable module sections
- Embedded YouTube videos
- Progress tracking
- AI tutor sidebar

### 3. Analytics Dashboard
Track your learning journey:
- Course completion rates
- Category distribution
- Weekly progress charts
- Learning insights

### 4. AI Tutor
Contextual learning assistant:
- Course-specific knowledge
- Conversation history
- Markdown-formatted responses
- Real-time streaming

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com) for blazing-fast AI inference
- [Clerk](https://clerk.com) for authentication
- [Vercel](https://vercel.com) for hosting
- [shadcn/ui](https://ui.shadcn.com) for beautiful components

---

<div align="center">

**Built with ❤️ using Next.js 14, Groq AI, and modern web technologies**

[⬆ Back to Top](#-mindcourse---ai-powered-learning-platform)

</div>
