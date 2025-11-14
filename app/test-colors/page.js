'use client';

export default function TestColorsPage() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white">
            🎨 Neo-Tech Dark Theme Test
          </h1>
          <p className="text-xl text-white/70">
            All purple classes now show as Electric Blue (#00BFFF)
          </p>
          <p className="text-xl text-white/70">
            All blue classes now show as Soft Purple (#9D4EDD)
          </p>
        </div>

        {/* Gradient Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Gradient Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold">
              from-purple-600 to-blue-600
            </button>
            <button className="px-6 py-3 bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg font-semibold">
              from-purple-500 to-blue-500
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold">
              from-blue-600 to-cyan-600
            </button>
          </div>
        </div>

        {/* Solid Colors */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Solid Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 bg-purple-600 rounded-lg text-white text-center font-semibold">
              bg-purple-600
              <div className="text-xs mt-2 opacity-70">(Now Electric Blue)</div>
            </div>
            <div className="p-6 bg-purple-500 rounded-lg text-white text-center font-semibold">
              bg-purple-500
              <div className="text-xs mt-2 opacity-70">(Now Electric Blue)</div>
            </div>
            <div className="p-6 bg-blue-600 rounded-lg text-white text-center font-semibold">
              bg-blue-600
              <div className="text-xs mt-2 opacity-70">(Now Soft Purple)</div>
            </div>
            <div className="p-6 bg-blue-500 rounded-lg text-white text-center font-semibold">
              bg-blue-500
              <div className="text-xs mt-2 opacity-70">(Now Soft Purple)</div>
            </div>
          </div>
        </div>

        {/* Text Colors */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Text Colors</h2>
          <div className="space-y-2 p-6 bg-white/5 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">text-purple-600 (Electric Blue)</p>
            <p className="text-3xl font-bold text-blue-600">text-blue-600 (Soft Purple)</p>
            <p className="text-3xl font-bold text-cyan-600">text-cyan-600 (Emerald Green)</p>
            <p className="text-3xl font-bold text-pink-600">text-pink-600 (Soft Purple)</p>
          </div>
        </div>

        {/* Cards with Hover */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Hover Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white/5 border border-purple-500/30 rounded-lg hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer">
              <h3 className="text-xl font-bold text-white mb-2">Card 1</h3>
              <p className="text-white/70">Hover to see electric blue border & glow</p>
            </div>
            <div className="p-6 bg-white/5 border border-blue-500/30 rounded-lg hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer">
              <h3 className="text-xl font-bold text-white mb-2">Card 2</h3>
              <p className="text-white/70">Hover to see soft purple border & glow</p>
            </div>
            <div className="p-6 bg-white/5 border border-cyan-500/30 rounded-lg hover:border-cyan-500 transition-all hover:shadow-lg hover:shadow-cyan-500/20 cursor-pointer">
              <h3 className="text-xl font-bold text-white mb-2">Card 3</h3>
              <p className="text-white/70">Hover to see emerald green border & glow</p>
            </div>
          </div>
        </div>

        {/* Icons & Badges */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Badges & Pills</h2>
          <div className="flex flex-wrap gap-4">
            <span className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold">
              Electric Blue Badge
            </span>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
              Soft Purple Badge
            </span>
            <span className="px-4 py-2 bg-cyan-600 text-white rounded-full font-semibold">
              Emerald Badge
            </span>
            <span className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-full font-semibold">
              Outlined Blue
            </span>
            <span className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-full font-semibold">
              Outlined Purple
            </span>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Progress Indicators</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-white">Electric Blue Progress (60%)</p>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[60%] bg-gradient-to-r from-purple-600 to-purple-400"></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-white">Soft Purple Progress (80%)</p>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[80%] bg-gradient-to-r from-blue-600 to-blue-400"></div>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-white">Emerald Progress (45%)</p>
              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-gradient-to-r from-cyan-600 to-cyan-400"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Variants */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Background Opacity</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-purple-500/10 rounded-lg text-white text-center text-sm">
              purple-500/10
            </div>
            <div className="p-4 bg-purple-500/20 rounded-lg text-white text-center text-sm">
              purple-500/20
            </div>
            <div className="p-4 bg-purple-500/30 rounded-lg text-white text-center text-sm">
              purple-500/30
            </div>
            <div className="p-4 bg-purple-500/50 rounded-lg text-white text-center text-sm">
              purple-500/50
            </div>
            <div className="p-4 bg-purple-500 rounded-lg text-white text-center text-sm">
              purple-500
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center pt-8">
          <a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-bold text-lg hover:scale-105 transition-transform"
          >
            ← Back to Dashboard
          </a>
        </div>

        {/* Footer Info */}
        <div className="text-center text-white/50 text-sm space-y-2 pb-8">
          <p>✅ If you see Electric Blue (#00BFFF) instead of purple - Theme is working!</p>
          <p>✅ If you see Soft Purple (#9D4EDD) instead of blue - Theme is working!</p>
          <p>✅ If you see Emerald Green (#00C896) for cyan - Theme is working!</p>
          <p className="pt-4">📝 If nothing changed, do a hard refresh: <kbd className="px-2 py-1 bg-white/10 rounded">Ctrl + Shift + R</kbd></p>
        </div>
      </div>
    </div>
  );
}
