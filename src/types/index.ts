export type EventCategory = 
  | 'competition'
  | 'workshop'
  | 'stall'
  | 'exhibit'
  | 'performance'
  | 'lecture'
  | 'games'
  | 'food'
  | 'merch'
  | 'art'
  | 'sport';

export type UserType = 'admin' | 'organizer' | 'attendee';

export interface User {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  phone?: string;
  passout_year?: number;
  admission_year?: number;
  course?: string;
  department?: string;
  college?: string;
  type: UserType;
  role_elevation_requested: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  category: EventCategory;
  department?: string;
  college?: string;
  organizer_id?: string;
  date: string;
  time: string;
  venue: string;
  longitude?: number;
  latitude?: number;
  description?: string;
  image_url?: string;
  is_approved: boolean;
  star_count: number;
  created_at: string;
  updated_at: string;
  is_starred?: boolean;
}

export interface StarredEvent {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface FestivalUpdate {
  id: string;
  message: string;
  admin_id: string;
  created_at: string;
}

export interface EventUpdate {
  id: string;
  event_id: string;
  message: string;
  user_id: string;
  created_at: string;
}

export interface CategoryFilterOption {
  value: EventCategory;
  label: string;
  color: string;
}
