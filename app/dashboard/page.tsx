"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CalendarDays, MapPin, Users, Clock } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [registrations, setRegistrations] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      setUser(userData)

      const { data: registrationsData } = await supabase
        .from('registrations')
        .select(`
          *,
          events (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setRegistrations(registrationsData || [])
    }

    getUser()
  }, [])

  if (!user) return null

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid gap-8">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back, {user.full_name}! 👋</CardTitle>
            <CardDescription>
              Here's what's happening with your event registrations
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Upcoming Events */}
        <div className="grid gap-6">
          <h2 className="text-2xl font-bold">Your Upcoming Events</h2>
          {registrations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {registrations.map((registration) => (
                <Card key={registration.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{registration.events.name}</CardTitle>
                    <CardDescription>
                      Status: <span className="capitalize">{registration.status}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(registration.events.start_time).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {new Date(registration.events.start_time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{registration.events.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{registration.events.current_attendees} attending</span>
                      </div>
                    </div>

                    <Button className="w-full mt-4" asChild>
                      <Link href={`/events/${registration.events.id}`}>
                        View Event Details
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>No Registrations Yet</CardTitle>
                <CardDescription>
                  You haven't registered for any events yet. Browse our events and join the fun!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/events">Browse Events</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}