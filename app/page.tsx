'use client'

import { useState } from 'react'
import { Upload, Sparkles, MessageCircle, Zap } from 'lucide-react'
import ImageUploader from '@/components/ImageUploader'
import ResponseGenerator from '@/components/ResponseGenerator'
import ToneSelector from '@/components/ToneSelector'

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')
  const [selectedTone, setSelectedTone] = useState<string>('moderate')
  const [isGenerating, setIsGenerating] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-pink-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                RizzGPT
              </h1>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all">
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Level Up Your Chat Game 🔥
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload a screenshot of your conversation and let AI craft the perfect flirty response
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Upload className="w-12 h-12 text-pink-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Screenshot</h3>
            <p className="text-gray-600">Simply upload your chat screenshot and we'll handle the rest</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <Zap className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Choose Your Tone</h3>
            <p className="text-gray-600">From subtle to bold - pick the perfect vibe for your response</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <MessageCircle className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Get Multiple Options</h3>
            <p className="text-gray-600">Receive 3-5 AI-generated responses to choose from</p>
          </div>
        </div>

        {/* Main App Interface */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
          <ImageUploader 
            onImageUpload={setUploadedImage}
            onTextExtracted={setExtractedText}
          />

          {extractedText && (
            <div className="mt-8 animate-slide-up">
              <ToneSelector 
                selectedTone={selectedTone}
                onToneChange={setSelectedTone}
              />
            </div>
          )}

          {extractedText && (
            <div className="mt-8 animate-slide-up">
              <ResponseGenerator 
                chatContext={extractedText}
                tone={selectedTone}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 RizzGPT. Made with ❤️ for smooth talkers everywhere.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
