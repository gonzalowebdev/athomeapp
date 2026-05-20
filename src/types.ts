export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: 'internacion' | 'procedimiento' | 'control';
  duration: string;
  icon: string;
}

export interface Nurse {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  avatar: string;
  status: 'available' | 'busy';
  bio: string;
}

export interface Booking {
  id: string;
  service_id: string;
  nurse_id?: string;
  patient_name: string;
  patient_phone: string;
  address: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'night' | '24hs';
  status: 'pending' | 'confirmed' | 'paid' | 'completed' | 'cancelled';
  total_price: number;
  created_at: string;
}

export interface Contract {
  id: string;
  patient_name: string;
  patient_condition: string;
  hours_per_day: number;
  weeks: number;
  weekly_visits: number;
  total_price: number;
  status: 'pending' | 'active' | 'completed';
  created_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: string;
}
