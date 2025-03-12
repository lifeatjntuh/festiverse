"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { User, Mail, School, GraduationCap, Phone, BookOpen } from 'lucide-react'

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    college_name: '',
    department_name: '',
    course_name: '',
    current_year: '',
    phone_number: '',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        router.push('/auth')
        return
      }

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (data) {
        setUser(data)
        setFormData({
          full_name: data.full_name || '',
          email: data.email || '',
          college_name: data.college_name || '',
          department_name: data.department_name || '',
          course_name: data.course_name || '',
          current_year: data.current_year || '',
          phone_number: data.phone_number || '',
        })
      }
    }

    getUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          college_name: formData.college_name,
          department_name: formData.department_name,
          course_name: formData.course_name,
          current_year: formData.current_year,
          phone_number: formData.phone_number,
        })
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Profile Settings</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={formData.email}
                  className="pl-10"
                  disabled
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="college_name">College Name</Label>
              <div className="relative">
                <School className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="college_name"
                  value={formData.college_name}
                  onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_name">Department</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="department_name"
                  value={formData.department_name}
                  onChange={(e) => setFormData({ ...formData, department_name: e.target.value })}
                  className="pl-10"
                  placeholder="e.g., Computer Science"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course_name">Course</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="course_name"
                  value={formData.course_name}
                  onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                  className="pl-10"
                  placeholder="e.g., B.Tech"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="current_year">Current Year</Label>
              <Select
                value={formData.current_year}
                onValueChange={(value) => setFormData({ ...formData, current_year: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your current year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                  <SelectItem value="5">Fifth Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Saving changes..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}