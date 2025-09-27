import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pnkomglhvrwaddshwjff.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBua29tZ2xodnJ3YWRkc2h3amZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3OTMwMDEsImV4cCI6MjA3NDM2OTAwMX0.IakWiHM3bIjAm03DDv9GvF7PIGgpmMoU2JveB0DMbr4'

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