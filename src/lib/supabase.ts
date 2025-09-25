import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database'

export const supabase = createClientComponentClient<Database>()

// Helper function to handle Supabase responses
export const handleSupabaseResponse = <T>(response: { data: T | null; error: unknown }) => {
  if (response.error) {
    console.error('Supabase error:', response.error)
    throw new Error(response.error.message)
  }
  return response.data
}