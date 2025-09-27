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
      stock_movements: {
        Row: {
          id: string
          variant_id: string | null
          size_id: string | null
          movement_type: 'in' | 'out' | 'adjustment' | 'reservation' | 'release'
          quantity_change: number
          quantity_before: number
          quantity_after: number
          reference_type: string | null
          reference_id: string | null
          reason: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          variant_id?: string | null
          size_id?: string | null
          movement_type: 'in' | 'out' | 'adjustment' | 'reservation' | 'release'
          quantity_change: number
          quantity_before: number
          quantity_after: number
          reference_type?: string | null
          reference_id?: string | null
          reason?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          variant_id?: string | null
          size_id?: string | null
          movement_type?: 'in' | 'out' | 'adjustment' | 'reservation' | 'release'
          quantity_change?: number
          quantity_before?: number
          quantity_after?: number
          reference_type?: string | null
          reference_id?: string | null
          reason?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
      stock_alerts: {
        Row: {
          id: string
          variant_id: string | null
          size_id: string | null
          alert_type: 'low_stock' | 'out_of_stock' | 'overstocked'
          threshold_value: number
          current_stock: number
          status: 'active' | 'resolved' | 'ignored'
          created_at: string
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          id?: string
          variant_id?: string | null
          size_id?: string | null
          alert_type: 'low_stock' | 'out_of_stock' | 'overstocked'
          threshold_value: number
          current_stock: number
          status?: 'active' | 'resolved' | 'ignored'
          created_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          id?: string
          variant_id?: string | null
          size_id?: string | null
          alert_type?: 'low_stock' | 'out_of_stock' | 'overstocked'
          threshold_value?: number
          current_stock?: number
          status?: 'active' | 'resolved' | 'ignored'
          created_at?: string
          resolved_at?: string | null
          resolved_by?: string | null
        }
      }
      stock_reservations: {
        Row: {
          id: string
          variant_id: string
          size_id: string
          quantity: number
          reservation_type: 'cart' | 'checkout' | 'manual'
          reference_id: string | null
          user_id: string | null
          expires_at: string
          status: 'active' | 'fulfilled' | 'expired' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          variant_id: string
          size_id: string
          quantity: number
          reservation_type: 'cart' | 'checkout' | 'manual'
          reference_id?: string | null
          user_id?: string | null
          expires_at: string
          status?: 'active' | 'fulfilled' | 'expired' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          variant_id?: string
          size_id?: string
          quantity?: number
          reservation_type?: 'cart' | 'checkout' | 'manual'
          reference_id?: string | null
          user_id?: string | null
          expires_at?: string
          status?: 'active' | 'fulfilled' | 'expired' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      stock_thresholds: {
        Row: {
          id: string
          category_id: string | null
          brand_id: string | null
          low_stock_threshold: number
          overstock_threshold: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          brand_id?: string | null
          low_stock_threshold?: number
          overstock_threshold?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          brand_id?: string | null
          low_stock_threshold?: number
          overstock_threshold?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      stock_available: {
        Row: {
          id: string
          variant_id: string | null
          size_id: string | null
          physical_stock: number
          reserved_quantity: number
          available_quantity: number
          updated_at: string
        }
      }
      stock_overview: {
        Row: {
          variant_id: string
          sku: string
          color: string | null
          product_name: string
          brand_name: string | null
          size_display: string
          physical_stock: number
          reserved_quantity: number
          available_quantity: number
          active_alerts: number
          last_movement_date: string | null
          updated_at: string
        }
      }
    }
    Functions: {
      reserve_stock: {
        Args: {
          p_variant_id: string
          p_size_id: string
          p_quantity: number
          p_reservation_type: string
          p_reference_id?: string | null
          p_user_id?: string | null
          p_expires_minutes?: number
        }
        Returns: any
      }
      release_reservation: {
        Args: {
          p_reservation_id: string
        }
        Returns: any
      }
      fulfill_reservation: {
        Args: {
          p_reservation_id: string
        }
        Returns: any
      }
      adjust_stock: {
        Args: {
          p_variant_id: string
          p_size_id: string
          p_new_quantity: number
          p_reason?: string
          p_user_id?: string | null
        }
        Returns: any
      }
      cleanup_expired_reservations: {
        Args: {}
        Returns: void
      }
    }
    Enums: {
      gender_type: 'homme' | 'femme' | 'enfant' | 'unisexe'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      user_role: 'admin' | 'vendor' | 'customer'
      movement_type: 'in' | 'out' | 'adjustment' | 'reservation' | 'release'
      alert_type: 'low_stock' | 'out_of_stock' | 'overstocked'
      alert_status: 'active' | 'resolved' | 'ignored'
      reservation_status: 'active' | 'fulfilled' | 'expired' | 'cancelled'
      reservation_type: 'cart' | 'checkout' | 'manual'
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

// New stock management types
export type StockMovement = Database['public']['Tables']['stock_movements']['Row'] & {
  product_variant?: ProductVariant
  size?: Database['public']['Tables']['sizes']['Row']
  user?: User
}

export type StockAlert = Database['public']['Tables']['stock_alerts']['Row'] & {
  product_variant?: ProductVariant & {
    product?: Product
  }
  size?: Database['public']['Tables']['sizes']['Row']
  resolved_by_user?: User
}

export type StockReservation = Database['public']['Tables']['stock_reservations']['Row'] & {
  product_variant?: ProductVariant
  size?: Database['public']['Tables']['sizes']['Row']
  user?: User
}

export type StockThreshold = Database['public']['Tables']['stock_thresholds']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row']
  brand?: Database['public']['Tables']['brands']['Row']
}

export type StockAvailable = Database['public']['Views']['stock_available']['Row']

export type StockOverview = Database['public']['Views']['stock_overview']['Row']

// API response types
export type StockReservationResponse = {
  success: boolean
  reservation_id?: string
  expires_at?: string
  error?: string
  available?: number
  requested?: number
}

export type StockAdjustmentResponse = {
  success: boolean
  previous_quantity?: number
  new_quantity?: number
  change?: number
  error?: string
}