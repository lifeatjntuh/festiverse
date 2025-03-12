import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

async function getPublicEvents() {
  try {
    const supabase = createClient()
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('start_time', { ascending: true })
      .limit(6)
    return events || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

export default async function Home() {
  const events = await getPublicEvents()

  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center bg-gradient-to-r from-primary/10 via-primary/5 to-background">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 mb-6">
              Your Ultimate College Festival Experience
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Discover amazing events, connect with fellow students, and make unforgettable memories at your college festivals
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/events">Browse Events</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Events</h2>
            <Button variant="ghost" asChild>
              <Link href="/events" className="flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

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
                <CardFooter>
                  <Button className="w-full group-hover:bg-primary/90" asChild>
                    <Link href={`/events/${event.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Festival?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sign up now to register for events, get personalized recommendations, and connect with other attendees. Don't miss out on the full festival experience!
          </p>
          <Button size="lg" asChild>
            <Link href="/auth">Get Started</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}