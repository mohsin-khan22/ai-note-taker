import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, History, Settings, Github } from 'lucide-react'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import ExportPage from './pages/ExportPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary transition-colors">
                <Sparkles className="w-5 h-5 text-primary group-hover:text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">AI NoteTaker</span>
            </Link>



          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <HomePage />
                </motion.div>
              } />
              <Route path="/results" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ResultsPage />
                </motion.div>
              } />
              <Route path="/export" element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ExportPage />
                </motion.div>
              } />
            </Routes>
          </AnimatePresence>
        </main>


      </div>
    </Router>
  )
}

export default App
