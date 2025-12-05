'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { History, Star, Trash2, Calendar, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'

interface Conversation {
  id: string
  chat_context: string
  tone: string
  created_at: string
  responses: {
    id: string
    response_text: string
    is_favorite: boolean
  }[]
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    try {
      const { data: convos, error } = await supabase
        .from('conversations')
        .select(`
          id,
          chat_context,
          tone,
          created_at,
          responses (
            id,
            response_text,
            is_favorite
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setConversations(convos || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Failed to load history')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = async (responseId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('responses')
        .update({ is_favorite: !currentStatus })
        .eq('id', responseId)

      if (error) throw error

      // Update local state
      setConversations(conversations.map(conv => ({
        ...conv,
        responses: conv.responses.map(resp =>
          resp.id === responseId ? { ...resp, is_favorite: !currentStatus } : resp
        )
      })))

      toast.success(currentStatus ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  const deleteConversation = async (conversationId: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

      if (error) throw error

      setConversations(conversations.filter(c => c.id !== conversationId))
      toast.success('Conversation deleted')
    } catch (error) {
      toast.error('Failed to delete conversation')
    }
  }

  const copyResponse = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
            <History className="w-10 h-10 mr-3 text-pink-500" />
            Your Conversation History
          </h1>
          <p className="text-gray-600">
            View and manage all your saved conversations and responses
          </p>
        </div>

        {conversations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-6">
              Start generating responses to build your history
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              Generate Your First Response
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {conversation.tone}
                      </span>
                      <span className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">
                      {conversation.chat_context.substring(0, 200)}
                      {conversation.chat_context.length > 200 && '...'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteConversation(conversation.id)}
                    className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Generated Responses:</h4>
                  {conversation.responses.map((response) => (
                    <div
                      key={response.id}
                      className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-gray-800 flex-1">{response.response_text}</p>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => toggleFavorite(response.id, response.is_favorite)}
                            className={`p-2 rounded-lg transition-colors ${
                              response.is_favorite
                                ? 'text-yellow-500 bg-yellow-50'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                          >
                            <Star
                              className="w-5 h-5"
                              fill={response.is_favorite ? 'currentColor' : 'none'}
                            />
                          </button>
                          <button
                            onClick={() => copyResponse(response.response_text)}
                            className="px-3 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 text-sm"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
