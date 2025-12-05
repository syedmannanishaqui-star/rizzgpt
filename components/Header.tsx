'use client'

import { useState } from 'react'
import { Sparkles, LogOut, History, User } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import AuthModal from './AuthModal'
import Link from 'next/link'

export default function Header() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                RizzGPT
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    href="/history"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-pink-500 transition-colors"
                  >
                    <History className="w-5 h-5" />
                    <span className="hidden sm:inline">History</span>
                  </Link>
                  
                  <div className="flex items-center space-x-3">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="hidden sm:inline">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
