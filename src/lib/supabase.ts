import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientComponentClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          auth_user_id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          role: 'admin' | 'vendor' | 'customer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role?: 'admin' | 'vendor' | 'customer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: 'admin' | 'vendor' | 'customer'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      brands: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          description: string | null
          is_active: boolean
          created_at: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          gender: 'homme' | 'femme' | 'enfant' | 'unisexe'
          description: string | null
          is_active: boolean
          created_at: string
        }
      }
      products: {
        Row: {
          id: string
          brand_id: string
          category_id: string
          name: string
          description: string | null
          base_price: number
          gender: 'homme' | 'femme' | 'enfant' | 'unisexe'
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          sku: string
          color: string | null
          price: number
          image_url: string | null
          hover_image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      sizes: {
        Row: {
          id: string
          size_value: string
          size_display: string
          gender: 'homme' | 'femme' | 'enfant' | 'unisexe' | null
          sort_order: number
          is_active: boolean
        }
      }
      product_stock: {
        Row: {
          id: string
          variant_id: string
          size_id: string
          quantity: number
          updated_by: string | null
          updated_at: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          subtotal: number
          shipping_cost: number | null
          tax_amount: number | null
          total_amount: number
          currency: string
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown> | null
          tracking_number: string | null
          notes: string | null
          processed_by: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          variant_id: string | null
          size_id: string | null
          product_name: string
          variant_color: string | null
          variant_sku: string | null
          size_value: string | null
          unit_price: number
          quantity: number
          line_total: number
          created_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_products_with_stock: {
        Args: Record<string, never>
        Returns: {
          product_id: string
          product_name: string
          brand_name: string
          base_price: number
          variant_id: string
          sku: string
          color: string
          price: number
          image_url: string | null
          total_stock: number
        }[]
      }
      check_stock_availability: {
        Args: {
          variant_id_param: string
          size_id_param: string
          quantity_param: number
        }
        Returns: boolean
      }
    }
    Enums: {
      gender_type: 'homme' | 'femme' | 'enfant' | 'unisexe'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      user_role: 'admin' | 'vendor' | 'customer'
    }
  }
}