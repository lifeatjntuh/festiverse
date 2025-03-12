"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

interface Event {
  id: string
  name: string
  start_time: string
  end_time: string
  venue: string
  category: string
}

export default function TimelinePage() {
  const [events, setEvents] = useState<Event[]>([])
  const supabase = createClient()

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'published')
        .order('start_time', { ascending: true })
      
      setEvents(data || [])
    }

    fetchEvents()
  }, [])

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const date = format(new Date(event.start_time), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(event)
    return acc
  }, {} as Record<string, Event[]>)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Event Timeline</h1>
      
      <div className="space-y-8">
        {Object.entries(eventsByDate).map(([date, dayEvents]) => (
          <Card key={date}>
            <CardHeader>
              <CardTitle>
                {format(new Date(date), 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-6">
                {dayEvents.map((event, index) => (
                  <div key={event.id} className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
                    
                    {/* Timeline dot */}
                    <div className="absolute left-[-0.5rem] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                    
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold">{event.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.start_time), 'h:mm a')} - {format(new Date(event.end_time), 'h:mm a')}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.venue}</p>
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        {event.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}