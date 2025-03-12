"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Calendar, Clock, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/events', icon: Calendar, label: 'Events' },
  { href: '/timeline', icon: Clock, label: 'Timeline' },
  { href: '/profile', icon: User, label: 'Profile' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex items-center justify-around p-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center w-16 py-2 rounded-lg transition-colors relative",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{label}</span>
              {isActive && (
                <div className="absolute -bottom-2 w-12 h-1 bg-primary rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}