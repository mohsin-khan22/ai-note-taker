import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, History, Settings, Github, Sun, Moon } from 'lucide-react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import SettingsDrawer from './components/SettingsDrawer'
import { useHealth } from './hooks/useHealth'
import HomePage from './pages/HomePage'
import ReviewPage from './pages/ReviewPage'
import ResultsPage from './pages/ResultsPage'
import ExportPage from './pages/ExportPage'
import HistoryPage from './pages/HistoryPage'

const githubUrl = import.meta.env.VITE_GITHUB_URL || ''

function AppContent() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { data: health } = useHealth()

  const pageWrap = (children) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {children}
    </motion.div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary transition-colors">
              <Sparkles className="w-5 h-5 text-primary group-hover:text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">AI NoteTaker</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/history"
              className="p-2 text-muted hover:text-white hover:bg-card rounded-lg transition-colors"
              title="Meeting history"
              aria-label="Meeting history"
            >
              <History className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 text-muted hover:text-white hover:bg-card rounded-lg transition-colors"
              title="Settings"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 text-muted hover:text-white hover:bg-card rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-muted hover:text-white hover:bg-card rounded-lg transition-colors"
                title="GitHub"
                aria-label="GitHub repository"
              >
                <Github className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </nav>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} health={health} />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={pageWrap(<HomePage />)} />
            <Route path="/review" element={pageWrap(<ReviewPage />)} />
            <Route path="/history" element={pageWrap(<HistoryPage />)} />
            <Route path="/results" element={pageWrap(<ResultsPage />)} />
            <Route path="/results/:id" element={pageWrap(<ResultsPage />)} />
            <Route path="/export" element={pageWrap(<ExportPage />)} />
            <Route path="/export/:id" element={pageWrap(<ExportPage />)} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  )
}

export default App
