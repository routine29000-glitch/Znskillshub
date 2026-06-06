// Auto-generated Supabase types (run: npx supabase gen types typescript --local)
// This file represents the full DB schema for Zn_SkillsHub

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: 'buyer' | 'seller' | 'admin'
          wilaya: string | null
          commune: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'buyer' | 'seller' | 'admin'
          wilaya?: string | null
          commune?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }

      sellers: {
        Row: {
          id: string
          profile_id: string
          full_name: string
          category_id: number
          subcategory: string | null
          description: string | null
          wilaya: string
          commune: string
          gps_lat: number | null
          gps_lng: number | null
          phone: string
          whatsapp: string | null
          selfie_url: string | null
          id_front_url: string | null
          id_back_url: string | null
          diploma_url: string | null
          verified: boolean
          verification_notes: string | null
          status: 'pending' | 'active' | 'blocked' | 'permanently_banned'
          total_deals: number
          free_deals_remaining: number
          unpaid_commission: number
          block_count: number
          payment_deadline: string | null
          promoted: boolean
          promoted_until: string | null
          rating_avg: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          full_name: string
          category_id: number
          subcategory?: string | null
          description?: string | null
          wilaya: string
          commune: string
          gps_lat?: number | null
          gps_lng?: number | null
          phone: string
          whatsapp?: string | null
          selfie_url?: string | null
          id_front_url?: string | null
          id_back_url?: string | null
          diploma_url?: string | null
          verified?: boolean
          verification_notes?: string | null
          status?: 'pending' | 'active' | 'blocked' | 'permanently_banned'
          total_deals?: number
          free_deals_remaining?: number
          unpaid_commission?: number
          block_count?: number
          payment_deadline?: string | null
          promoted?: boolean
          promoted_until?: string | null
          rating_avg?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['sellers']['Insert']>
      }

      categories: {
        Row: {
          id: number
          name: string
          icon: string
          color: string
          description: string | null
        }
        Insert: {
          id?: number
          name: string
          icon: string
          color: string
          description?: string | null
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }

      deals: {
        Row: {
          id: string
          seller_id: string
          buyer_id: string
          agreed_price: number
          commission_amount: number
          commission_percent: number
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed'
          description: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          seller_id: string
          buyer_id: string
          agreed_price: number
          commission_amount: number
          commission_percent: number
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed'
          description?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['deals']['Insert']>
      }

      payments: {
        Row: {
          id: string
          seller_id: string
          amount: number
          penalty_amount: number
          total_amount: number
          method: 'ccp' | 'edahabia'
          status: 'pending' | 'confirmed' | 'rejected'
          type: 'commission' | 'penalty' | 'promotion'
          receipt_url: string | null
          admin_note: string | null
          created_at: string
          confirmed_at: string | null
        }
        Insert: {
          id?: string
          seller_id: string
          amount: number
          penalty_amount?: number
          total_amount: number
          method: 'ccp' | 'edahabia'
          status?: 'pending' | 'confirmed' | 'rejected'
          type: 'commission' | 'penalty' | 'promotion'
          receipt_url?: string | null
          admin_note?: string | null
          created_at?: string
          confirmed_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }

      promotion_requests: {
        Row: {
          id: string
          seller_id: string
          weeks: number
          amount: number
          receipt_url: string | null
          status: 'pending' | 'confirmed' | 'rejected'
          starts_at: string | null
          ends_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          weeks: number
          amount: number
          receipt_url?: string | null
          status?: 'pending' | 'confirmed' | 'rejected'
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['promotion_requests']['Insert']>
      }

      ratings: {
        Row: {
          id: string
          seller_id: string
          buyer_id: string
          deal_id: string | null
          stars: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          buyer_id: string
          deal_id?: string | null
          stars: number
          comment?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['ratings']['Insert']>
      }

      conversations: {
        Row: {
          id: string
          seller_id: string
          buyer_id: string
          last_message: string | null
          last_message_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          buyer_id: string
          last_message?: string | null
          last_message_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }

      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }

      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          read: boolean
          data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          read?: boolean
          data?: Json | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }

      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_type: string
          target_id: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          target_type: string
          target_id: string
          notes?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['admin_logs']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
