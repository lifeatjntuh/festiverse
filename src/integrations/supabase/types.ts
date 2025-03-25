export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      event_updates: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_updates_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_updates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: Database["public"]["Enums"]["event_category"]
          college: string | null
          created_at: string | null
          date: string
          department: string | null
          description: string | null
          id: string
          image_url: string | null
          is_approved: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          organizer_id: string | null
          star_count: number | null
          time: string
          updated_at: string | null
          venue: string
        }
        Insert: {
          category: Database["public"]["Enums"]["event_category"]
          college?: string | null
          created_at?: string | null
          date: string
          department?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          organizer_id?: string | null
          star_count?: number | null
          time: string
          updated_at?: string | null
          venue: string
        }
        Update: {
          category?: Database["public"]["Enums"]["event_category"]
          college?: string | null
          created_at?: string | null
          date?: string
          department?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_approved?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          organizer_id?: string | null
          star_count?: number | null
          time?: string
          updated_at?: string | null
          venue?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      festival_updates: {
        Row: {
          admin_id: string | null
          created_at: string | null
          id: string
          message: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          message: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "festival_updates_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      starred_events: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "starred_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "starred_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          admission_year: number | null
          auth_id: string | null
          college: string | null
          course: string | null
          created_at: string | null
          department: string | null
          email: string
          id: string
          name: string
          passout_year: number | null
          phone: string | null
          role_elevation_requested: boolean | null
          type: Database["public"]["Enums"]["user_type"] | null
          updated_at: string | null
        }
        Insert: {
          admission_year?: number | null
          auth_id?: string | null
          college?: string | null
          course?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          id?: string
          name: string
          passout_year?: number | null
          phone?: string | null
          role_elevation_requested?: boolean | null
          type?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string | null
        }
        Update: {
          admission_year?: number | null
          auth_id?: string | null
          college?: string | null
          course?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          id?: string
          name?: string
          passout_year?: number | null
          phone?: string | null
          role_elevation_requested?: boolean | null
          type?: Database["public"]["Enums"]["user_type"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      event_category:
        | "competition"
        | "workshop"
        | "stall"
        | "exhibit"
        | "performance"
        | "lecture"
        | "games"
        | "food"
        | "merch"
        | "art"
        | "sport"
      user_type: "admin" | "organizer" | "attendee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
