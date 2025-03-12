import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          try {
            return cookies().get(name)?.value
          } catch (error) {
            return undefined
          }
        },
        set(name: string, value: string, options: any) {
          try {
            cookies().set(name, value, options)
          } catch (error) {
            // Handle cookie setting error in development
          }
        },
        remove(name: string, options: any) {
          try {
            cookies().set(name, '', options)
          } catch (error) {
            // Handle cookie removal error in development
          }
        }
      }
    }
  )
}