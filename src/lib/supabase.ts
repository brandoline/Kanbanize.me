import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          username: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          email?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          priority: 'baixa' | 'média' | 'alta'
          contact_id: string | null
          status: 'não-iniciado' | 'em-andamento' | 'concluído'
          start_date: string | null
          due_date: string | null
          attachments: string[]
          notes: string
          last_updated: string
          category_id: string
          reminder_enabled: boolean
          is_interrupted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          priority: 'baixa' | 'média' | 'alta'
          contact_id?: string | null
          status: 'não-iniciado' | 'em-andamento' | 'concluído'
          start_date?: string | null
          due_date?: string | null
          attachments?: string[]
          notes?: string
          last_updated?: string
          category_id: string
          reminder_enabled?: boolean
          is_interrupted?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          priority?: 'baixa' | 'média' | 'alta'
          contact_id?: string | null
          status?: 'não-iniciado' | 'em-andamento' | 'concluído'
          start_date?: string | null
          due_date?: string | null
          attachments?: string[]
          notes?: string
          last_updated?: string
          category_id?: string
          reminder_enabled?: boolean
          is_interrupted?: boolean
          created_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string
          institution: string
          city: string
          position: string
          notes: string
          is_faculty: boolean
          courses: string[] | null
          sgn_link: string | null
          course_modality: 'qualificação' | 'desenvolvimento' | 'técnico' | null
          class_days: string[] | null
          available_days: string[] | null
          available_shifts: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone?: string
          email: string
          institution?: string
          city?: string
          position?: string
          notes?: string
          is_faculty?: boolean
          courses?: string[] | null
          sgn_link?: string | null
          course_modality?: 'qualificação' | 'desenvolvimento' | 'técnico' | null
          class_days?: string[] | null
          available_days?: string[] | null
          available_shifts?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string
          institution?: string
          city?: string
          position?: string
          notes?: string
          is_faculty?: boolean
          courses?: string[] | null
          sgn_link?: string | null
          course_modality?: 'qualificação' | 'desenvolvimento' | 'técnico' | null
          class_days?: string[] | null
          available_days?: string[] | null
          available_shifts?: string[] | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      info_tecs: {
        Row: {
          id: string
          user_id: string
          name: string
          period: string
          modality: 'presencial' | 'EAD'
          color: string
          start_date: string
          student_days: string
          class_days: string
          duration: number
          priority: 'alta' | 'media' | 'baixa'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          period: string
          modality: 'presencial' | 'EAD'
          color: string
          start_date: string
          student_days: string
          class_days: string
          duration: number
          priority: 'alta' | 'media' | 'baixa'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          period?: string
          modality?: 'presencial' | 'EAD'
          color?: string
          start_date?: string
          student_days?: string
          class_days?: string
          duration?: number
          priority?: 'alta' | 'media' | 'baixa'
          created_at?: string
        }
      }
    }
  }
}