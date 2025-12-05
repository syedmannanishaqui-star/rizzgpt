import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          chat_context: string
          image_url: string | null
          tone: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          chat_context: string
          image_url?: string | null
          tone: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          chat_context?: string
          image_url?: string | null
          tone?: string
          created_at?: string
        }
      }
      responses: {
        Row: {
          id: string
          conversation_id: string
          response_text: string
          is_favorite: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          response_text: string
          is_favorite?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          response_text?: string
          is_favorite?: boolean
          created_at?: string
        }
      }
    }
  }
}
