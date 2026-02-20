export interface Event {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  event_date: string;
  location?: string;
  max_participants?: number;
  is_free: boolean;
  price?: number;
  participants?: number;
  participants_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CreateEventDto {
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  event_date: string;
  location?: string;
  max_participants?: number;
  is_free: boolean;
  price?: number;
}

export interface UpdateEventDto {
  title?: string;
  description?: string;
  category?: string;
  image_url?: string;
  event_date?: string;
  location?: string;
  max_participants?: number;
  is_free?: boolean;
  price?: number;
}
