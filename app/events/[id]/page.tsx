import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CalendarDays, MapPin, Users, Clock, Share2, BookmarkPlus, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

async function getEvent(id: string) {
  const supabase = createClient()
  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      users (
        full_name,
        college_name
      )
    `)
    .eq('id', id)
    .eq('status', 'published')
    .single()
  
  return event
}

export default async function EventPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id)

  if (!event) {
    notFound()
  }

  const startDate = new Date(event.start_time)
  const endDate = new Date(event.end_time)

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {event.venue}
            </span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
              <p className="text-muted-foreground">
                Organized by {event.users.full_name} from {event.users.college_name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <BookmarkPlus className="w-4 h-4" />
              </Button>
              <Button asChild>
                <a href={`https://example.com/register/${event.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Register <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Event Schedule</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Start Time</h3>
                  <p className="text-muted-foreground">
                    {startDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">End Time</h3>
                  <p className="text-muted-foreground">
                    {endDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium">{event.current_attendees} people attending</span>
              </div>
              
              <Button className="w-full mb-4" asChild>
                <a href={`https://example.com/register/${event.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Register Now <ExternalLink className="w-4 h-4" />
                </a>
              </Button>

              {event.ispaid && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4" />
                  <span>This is a paid event. Visit the registration page for ticket prices.</span>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Event Location</h3>
              <div className="aspect-video bg-muted rounded-lg mb-4" />
              <p className="text-muted-foreground mb-2">{event.venue}</p>
              <Button variant="outline" className="w-full" asChild>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(event.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Get Directions <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}