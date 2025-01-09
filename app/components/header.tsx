'use client';

import Link from 'next/link'
import { UserSettings } from '@/components/UserSettings'
import { usePreferences } from '@/contexts/PreferencesContext'
import { motion } from 'framer-motion'

export default function Header() {
  const { preferences } = usePreferences()

  return (
    <header className="bg-background border-b">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Voice Chat
            </Link>
            <Link 
              href="/summary" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Transcripts & Summaries
            </Link>
            <Link 
              href="/resources" 
              className="text-foreground hover:text-primary transition-colors"
            >
              Resources
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UserSettings />
          </motion.div>
        </div>
      </nav>
    </header>
  )
}

