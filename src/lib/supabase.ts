import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper function to handle Supabase responses
export const handleSupabaseResponse = <T>(response: { data: T | null; error: unknown }) => {
  if (response.error) {
    console.error('Supabase error:', response.error)
    const errorMessage = typeof response.error === 'object' && response.error && 'message' in response.error
      ? (response.error as { message: string }).message
      : String(response.error)
    throw new Error(errorMessage)
  }
  return response.data
}