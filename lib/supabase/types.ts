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
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'attendee' | 'organizer' | 'admin'
          college_name: string | null
          department_name: string | null
          course_name: string | null
          current_year: string | null
          phone_number: string | null
          profile_image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'attendee' | 'organizer' | 'admin'
          college_name?: string | null
          department_name?: string | null
          course_name?: string | null
          current_year?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'attendee' | 'organizer' | 'admin'
          college_name?: string | null
          department_name?: string | null
          course_name?: string | null
          current_year?: string | null
          phone_number?: string | null
          profile_image_url?: string | null
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          organizer_id: string
          name: string
          description: string
          start_time: string
          end_time: string
          venue: string
          category: string
          current_attendees: number
          ispaid: boolean
          status: 'draft' | 'published' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          organizer_id: string
          name: string
          description: string
          start_time: string
          end_time: string
          venue: string
          category: string
          current_attendees?: number
          ispaid?: boolean
          status?: 'draft' | 'published' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          organizer_id?: string
          name?: string
          description?: string
          start_time?: string
          end_time?: string
          venue?: string
          category?: string
          current_attendees?: number
          ispaid?: boolean
          status?: 'draft' | 'published' | 'cancelled'
          created_at?: string
        }
      }
      registrations: {
        Row: {
          id: string
          user_id: string
          event_id: string
          status: 'pending' | 'approved' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          created_at?: string
        }
      }
    }
  }
}