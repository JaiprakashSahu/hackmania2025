# 🎨 UI Design System & Component Library

## Design Tokens

### Colors
```javascript
// tailwind.config.js
const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    500: '#3b82f6',  // Main brand color
    600: '#2563eb',
    900: '#1e3a8a',
  },
  secondary: {
    500: '#8b5cf6',  // Purple accent
    600: '#7c3aed',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  dark: {
    bg: '#0f172a',
    card: '#1e293b',
    border: '#334155',
  },
  light: {
    bg: '#ffffff',
    card: '#f8fafc',
    border: '#e2e8f0',
  }
}
```

### Typography
```css
/* Font Scale */
--font-xs: 0.75rem;     /* 12px */
--font-sm: 0.875rem;    /* 14px */
--font-base: 1rem;      /* 16px */
--font-lg: 1.125rem;    /* 18px */
--font-xl: 1.25rem;     /* 20px */
--font-2xl: 1.5rem;     /* 24px */
--font-3xl: 1.875rem;   /* 30px */
--font-4xl: 2.25rem;    /* 36px */
--font-5xl: 3rem;       /* 48px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```javascript
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
}
```

### Border Radius
```javascript
const borderRadius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
}
```

## Component Specifications

### 1. Button Component
```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
        outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
        gradient: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600',
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-13 px-8 text-lg',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);
```

### 2. Card Component
```typescript
// components/shared/AnimatedCard.tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export function AnimatedCard({ children, delay = 0, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card 
        className="border-0 bg-white/5 backdrop-blur-xl shadow-2xl border-purple-500/20 hover:border-purple-500/40 transition-all"
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}
```

### 3. Loading States
```typescript
// components/shared/SkeletonLoader.tsx
export function CourseCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-700 rounded-t-xl"></div>
      <div className="p-6 bg-gray-800 rounded-b-xl space-y-4">
        <div className="h-6 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-700 rounded w-20"></div>
          <div className="h-8 bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  );
}

// Shimmer effect
export function ShimmerLoader() {
  return (
    <div className="relative overflow-hidden bg-gray-800 rounded-xl h-64">
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );
}

// tailwind.config.js animation
keyframes: {
  shimmer: {
    '100%': { transform: 'translateX(100%)' },
  },
},
animation: {
  shimmer: 'shimmer 2s infinite',
}
```

### 4. Progress Bar
```typescript
// components/course/CourseProgress.tsx
export function CourseProgress({ progress, total }) {
  const percentage = (progress / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">Progress</span>
        <span className="text-white font-medium">{progress}/{total} modules</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <p className="text-xs text-white/60 text-right">{percentage.toFixed(0)}% complete</p>
    </div>
  );
}
```

## Layout Patterns

### Dashboard Layout
```typescript
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Animated background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-blue-500/20"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_purple-500/10_60deg,_transparent_120deg,_blue-500/10_180deg,_transparent_240deg,_purple-500/10_300deg,_transparent_360deg)] animate-spin [animation-duration:20s]"></div>
      </div>
      
      {/* Layout */}
      <div className="relative z-10 flex">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Course Detail Tabs
```typescript
// app/(dashboard)/courses/[id]/page.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CoursePage() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-xl">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="modules">Modules</TabsTrigger>
        <TabsTrigger value="quiz">Quiz</TabsTrigger>
        <TabsTrigger value="videos">Videos</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <CourseOverview />
      </TabsContent>
      <TabsContent value="modules">
        <ModuleList />
      </TabsContent>
      {/* ... other tabs */}
    </Tabs>
  );
}
```

## Dark Mode Implementation

```typescript
// contexts/ThemeContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'dark',
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    if (stored) setTheme(stored);
  }, []);
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
    const root = document.documentElement;
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

## Responsive Design

```typescript
// hooks/useMediaQuery.ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  
  return matches;
}

// Usage
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');
```

## Accessibility Guidelines

1. **Keyboard Navigation**: All interactive elements focusable
2. **ARIA Labels**: Proper labeling for screen readers
3. **Color Contrast**: WCAG AA compliance (4.5:1 ratio)
4. **Focus Indicators**: Visible focus states
5. **Semantic HTML**: Use proper heading hierarchy

```typescript
// Example accessible button
<button
  className="..."
  aria-label="Generate new course"
  aria-describedby="generate-description"
  disabled={isLoading}
>
  {isLoading ? <Spinner aria-hidden="true" /> : <Plus />}
  Generate Course
</button>
<span id="generate-description" className="sr-only">
  Creates a new AI-generated course based on your preferences
</span>
```
