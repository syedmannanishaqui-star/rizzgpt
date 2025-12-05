'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Copy, RefreshCw, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'

interface ResponseGeneratorProps {
  chatContext: string
  tone: string
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
}

interface Response {
  id: number
  text: string
  tone: string
}

export default function ResponseGenerator({ 
  chatContext, 
  tone, 
  isGenerating, 
  setIsGenerating 
}: ResponseGeneratorProps) {
  const [responses, setResponses] = useState<Response[]>([])
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const { user } = useAuth()

  const generateResponses = async () => {
    setIsGenerating(true)
    setResponses([])

    try {
      const response = await fetch('/api/generate-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatContext,
          tone,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResponses(data.responses)
        toast.success('Responses generated!')

        // Save to database if user is logged in
        if (user) {
          await saveConversation(data.responses)
        }
      } else {
        toast.error('Failed to generate responses')
      }
    } catch (error) {
      console.error('Error generating responses:', error)
      toast.error('Error generating responses')
    } finally {
      setIsGenerating(false)
    }
  }

  const saveConversation = async (generatedResponses: Response[]) => {
    try {
      // Insert conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          user_id: user!.id,
          chat_context: chatContext,
          tone: tone,
        })
        .select()
        .single()

      if (convError) throw convError

      // Insert responses
      const responsesToInsert = generatedResponses.map(resp => ({
        conversation_id: conversation.id,
        response_text: resp.text,
        is_favorite: false,
      }))

      const { error: respError } = await supabase
        .from('responses')
        .insert(responsesToInsert)

      if (respError) throw respError

      console.log('Conversation saved successfully')
    } catch (error) {
      console.error('Error saving conversation:', error)
      // Don't show error to user - saving is optional
    }
  }

  const copyToClipboard = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  useEffect(() => {
    if (chatContext && tone) {
      generateResponses()
    }
  }, [chatContext, tone])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI-Generated Responses</h3>
        <button
          onClick={generateResponses}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating...' : 'Regenerate'}</span>
        </button>
      </div>

      {isGenerating && responses.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Crafting the perfect responses...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((response) => (
            <div
              key={response.id}
              className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200 hover:shadow-lg transition-shadow"
            >
              <p className="text-gray-800 text-lg mb-4">{response.text}</p>
              <button
                onClick={() => copyToClipboard(response.text, response.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                {copiedId === response.id ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
