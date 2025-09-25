// Database types based on the Supabase schema
export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          description: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo_url?: string | null
          description?: string | null
          is_active?: boolean
          created_at?: string
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
        Insert: {
          id?: string
          name: string
          gender: 'homme' | 'femme' | 'enfant' | 'unisexe'
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          gender?: 'homme' | 'femme' | 'enfant' | 'unisexe'
          description?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          brand_id: string | null
          category_id: string | null
          name: string
          description: string | null
          base_price: number
          gender: 'homme' | 'femme' | 'enfant' | 'unisexe'
          is_active: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id?: string | null
          category_id?: string | null
          name: string
          description?: string | null
          base_price: number
          gender: 'homme' | 'femme' | 'enfant' | 'unisexe'
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string | null
          category_id?: string | null
          name?: string
          description?: string | null
          base_price?: number
          gender?: 'homme' | 'femme' | 'enfant' | 'unisexe'
          is_active?: boolean
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string | null
          sku: string
          color: string | null
          price: number
          image_url: string | null
          hover_image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          sku: string
          color?: string | null
          price: number
          image_url?: string | null
          hover_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          sku?: string
          color?: string | null
          price?: number
          image_url?: string | null
          hover_image_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sizes: {
        Row: {
          id: string
          size_value: string
          size_display: string
          gender: 'homme' | 'femme' | 'enfant' | 'unisexe' | null
          sort_order: number | null
          is_active: boolean
        }
        Insert: {
          id?: string
          size_value: string
          size_display: string
          gender?: 'homme' | 'femme' | 'enfant' | 'unisexe' | null
          sort_order?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          size_value?: string
          size_display?: string
          gender?: 'homme' | 'femme' | 'enfant' | 'unisexe' | null
          sort_order?: number | null
          is_active?: boolean
        }
      }
      product_stock: {
        Row: {
          id: string
          variant_id: string | null
          size_id: string | null
          quantity: number
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          variant_id?: string | null
          size_id?: string | null
          quantity?: number
          updated_by?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          variant_id?: string | null
          size_id?: string | null
          quantity?: number
          updated_by?: string | null
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          auth_user_id: string | null
          email: string
          first_name: string
          last_name: string
          phone: string | null
          role: 'admin' | 'vendor' | 'customer' | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role?: 'admin' | 'vendor' | 'customer' | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          auth_user_id?: string | null
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: 'admin' | 'vendor' | 'customer' | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | null
          subtotal: number
          shipping_cost: number | null
          tax_amount: number | null
          total_amount: number
          currency: string | null
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown> | null
          tracking_number: string | null
          notes: string | null
          processed_by: string | null
          shipped_at: string | null
          delivered_at: string | null
          created_at: string | null
          updated_at: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          variant_id: string | null
          size_id: string | null
          product_name: string
          variant_color: string | null
          variant_sku: string | null
          size_value: string | null
          unit_price: number
          quantity: number
          line_total: number
          created_at: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      gender_type: 'homme' | 'femme' | 'enfant' | 'unisexe'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      user_role: 'admin' | 'vendor' | 'customer'
    }
  }
}

// Extended types for frontend use
export type Product = Database['public']['Tables']['products']['Row'] & {
  brand?: Database['public']['Tables']['brands']['Row']
  category?: Database['public']['Tables']['categories']['Row']
  variants?: ProductVariant[]
}

export type ProductVariant = Database['public']['Tables']['product_variants']['Row'] & {
  product?: Database['public']['Tables']['products']['Row']
  stock?: ProductStock[]
}

export type ProductStock = Database['public']['Tables']['product_stock']['Row'] & {
  size?: Database['public']['Tables']['sizes']['Row']
}

export type User = Database['public']['Tables']['users']['Row']

export type CartItem = {
  variant: ProductVariant & {
    product?: Product
  }
  size: Database['public']['Tables']['sizes']['Row']
  quantity: number
}

export type Order = Database['public']['Tables']['orders']['Row'] & {
  items?: Database['public']['Tables']['order_items']['Row'][]
  user?: User
}