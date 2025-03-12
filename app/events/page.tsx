import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays, MapPin, Users, Search, Filter, ExternalLink } from 'lucide-react'
import Link from 'next/link'

async function getEvents() {
  const supabase = createClient()
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('start_time', { ascending: true })
  return events || []
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Discover Events</h1>
          <p className="text-lg text-muted-foreground">
            Browse through our collection of exciting college festival events
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search events..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cultural">Cultural</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex gap-2">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="line-clamp-1">{event.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {event.description}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {new Date(event.start_time).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{event.current_attendees} attending</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button className="flex-1" asChild>
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <a 
                    href={`https://example.com/register/${event.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    Register <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}