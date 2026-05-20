import { createClient } from '@supabase/supabase-js';
import { Service, Nurse, Booking, Contract } from './types';

// Detect environment variables for Supabase
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase keys exist and are not placeholder values
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== '' && 
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('YOUR_') &&
  !supabaseAnonKey.includes('YOUR_');

let supabaseClient: any = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error('Error initializing Supabase client:', error);
  }
}

// Pre-seeded lists for mock mode / LocalStorage
export const SEED_SERVICES: Service[] = [
  {
    id: 's-1',
    title: 'Guardia de Enfermería de 8 hs',
    description: 'Cuidado continuo de enfermería en domicilio por un turno de 8 horas. Ideal para administración de medicación compleja, monitoreo de signos vitales, aseo y alimentación guiada.',
    price: 36000,
    category: 'internacion',
    duration: '8 Horas',
    icon: 'ShieldAlert'
  },
  {
    id: 's-2',
    title: 'Guardia de Enfermería de 12 hs',
    description: 'Cuidado continuo de enfermería diurno/nocturno por un lapso de 12 horas. Recomendado para pacientes post-quirúrgicos agudos o con dependencias de mediana/alta complejidad.',
    price: 52000,
    category: 'internacion',
    duration: '12 Horas',
    icon: 'Activity'
  },
  {
    id: 's-3',
    title: 'Guardia Primaria las 24 hs (Día Completo)',
    description: 'Internación domiciliaria de máxima asistencia. Rotación de personal calificado de la plantilla oficial de ATHOME para cobertura total e ininterrumpida de 24 horas.',
    price: 98000,
    category: 'internacion',
    duration: '24 Horas',
    icon: 'HeartHandshake'
  },
  {
    id: 's-4',
    title: 'Higiene y Confort en Cama',
    description: 'Servicio puntual de aseo, baño en cama, rotaciones preventivas de escaras y cambio de sábanas. Brindado por enfermeros con excelente trato humano y profesional.',
    price: 15000,
    category: 'procedimiento',
    duration: 'Aproximadamente 1:30 hs',
    icon: 'Sparkles'
  },
  {
    id: 's-5',
    title: 'Curación Compleja de Heridas / Escaras',
    description: 'Curación de escaras por decúbito, suturas post-quirúrgicas, úlceras o quemaduras utilizando parches hidrogeles o apósitos avanzados bajo estrictas normas de bioseguridad.',
    price: 18000,
    category: 'procedimiento',
    duration: 'Puntual',
    icon: 'HeartPulse'
  },
  {
    id: 's-6',
    title: 'Colocación de Vía Periférica y Sueroterapia',
    description: 'Acceso venoso para infusión parenteral de sales, hidratación o antibióticos indicados por un médico de cabecera.',
    price: 14000,
    category: 'procedimiento',
    duration: 'Puntual',
    icon: 'Droplet'
  },
  {
    id: 's-7',
    title: 'Aplicación de Inyección Intramuscular / SC',
    description: 'Administración rápida de analgésicos, corticoides, vacunas, insulina o antibióticos recetados vía intramuscular o subcutánea.',
    price: 6000,
    category: 'procedimiento',
    duration: 'Puntual',
    icon: 'Syringe'
  },
  {
    id: 's-8',
    title: 'Control de Signos Vitales y Parámetros',
    description: 'Monitoreo preventivo avanzado en domicilio: Presión arterial, frecuencia cardíaca, saturación de oxígeno, temperatura y glucemia capilar con registro formal en planilla médica.',
    price: 8000,
    category: 'control',
    duration: '30 min',
    icon: 'Gauge'
  }
];

export const SEED_NURSES: Nurse[] = [
  {
    id: 'n-1',
    name: 'Lic. Mariana Gómez',
    specialty: 'Cuidados Críticos y Terapia del Adulto',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    status: 'available',
    bio: 'Licenciada de Enfermería con más de 8 años de experiencia en Unidades de Terapia Intensiva (UTI). Experta en el manejo de vías centrales, respiradores mecánicos de soporte doméstico y monitoreo crítico.'
  },
  {
    id: 'n-2',
    name: 'Enf. Carlos Rodríguez',
    specialty: 'Geriatría, Rehabilitación y Paliativos',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
    status: 'available',
    bio: 'Enfermero profesional con vocación inquebrantable dedicada a la recuperación motora, la rehabilitación y el relevamiento de pacientes con enfermedades de curso crónico o avanzada edad.'
  },
  {
    id: 'n-3',
    name: 'Lic. Andrea Paz',
    specialty: 'Pediatría, Neonatología e Internación Maternal',
    rating: 5.0,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200',
    status: 'available',
    bio: 'Especialista en el cuidado de bebés prematuros en esquema domiciliario y pediatría clínica general. Asistencia empática en lactancia, control de crecimiento y colocación de vías pediátricas.'
  },
  {
    id: 'n-4',
    name: 'Enf. Javier Soto',
    specialty: 'Heridas Complejas y Control de Medicación',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
    status: 'available',
    bio: 'Experto en curaciones avanzadas de escaras y úlceras vasculares. Dedicado al control riguroso de planes medicamentosos complejos, prevención de infecciones en domicilio e informes evolutivos.'
  }
];

// Helper to get from LocalStorage with fallback seed
const getStorageItem = <T>(key: string, seed: T[]): T[] => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return seed;
  }
};

const setStorageItem = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- DATA ACCESS OPERATIONS WITH INTEGRATED MOCK FALLBACKS ---

export const getServices = async (): Promise<Service[]> => {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('services').select('*').order('price', { ascending: true });
      if (!error && data && data.length > 0) return data as Service[];
      console.warn('Empty or error fetching services from Supabase, using standard seed:', error);
    } catch (e) {
      console.error('Supabase fetch exception for services:', e);
    }
  }
  return getStorageItem<Service>('athome_services', SEED_SERVICES);
};

export const getNurses = async (): Promise<Nurse[]> => {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('nurses').select('*');
      if (!error && data && data.length > 0) return data as Nurse[];
      console.warn('Empty or error fetching nurses from Supabase, using standard seed:', error);
    } catch (e) {
      console.error('Supabase fetch exception for nurses:', e);
    }
  }
  return getStorageItem<Nurse>('athome_nurses', SEED_NURSES);
};

export const getBookings = async (): Promise<Booking[]> => {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('bookings').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Booking[];
      console.warn('Supabase bookings query empty or errored, using local data:', error);
    } catch (e) {
      console.error('Supabase fetch exception for bookings:', e);
    }
  }
  return getStorageItem<Booking>('athome_bookings', []);
};

export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
  const newBooking: Booking = {
    ...booking,
    id: 'bkt-' + Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('bookings').insert([newBooking]).select();
      if (!error && data && data[0]) {
        return data[0] as Booking;
      }
      console.error('Error inserting booking in Supabase, saving locally to avoid user interruption:', error);
    } catch (e) {
      console.error('Supabase insert exception:', e);
    }
  }

  // Local storage fallback
  const current = getStorageItem<Booking>('athome_bookings', []);
  const updated = [newBooking, ...current];
  setStorageItem('athome_bookings', updated);
  return newBooking;
};

export const updateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<boolean> => {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { error } = await supabaseClient.from('bookings').update({ status }).eq('id', bookingId);
      if (!error) return true;
      console.error('Error updating booking in Supabase:', error);
    } catch (e) {
      console.error('Supabase update exception:', e);
    }
  }

  const current = getStorageItem<Booking>('athome_bookings', []);
  const idx = current.findIndex(b => b.id === bookingId);
  if (idx !== -1) {
    current[idx].status = status;
    setStorageItem('athome_bookings', current);
    return true;
  }
  return false;
};

export const getContracts = async (): Promise<Contract[]> => {
  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('contracts').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as Contract[];
      console.warn('Supabase contracts query empty or errored, using local:', error);
    } catch (e) {
      console.error('Supabase fetch exception for contracts:', e);
    }
  }
  return getStorageItem<Contract>('athome_contracts', []);
};

export const createContract = async (contract: Omit<Contract, 'id' | 'created_at'>): Promise<Contract> => {
  const newContract: Contract = {
    ...contract,
    id: 'cnt-' + Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabaseClient) {
    try {
      const { data, error } = await supabaseClient.from('contracts').insert([newContract]).select();
      if (!error && data && data[0]) {
        return data[0] as Contract;
      }
      console.error('Error inserting contract in Supabase:', error);
    } catch (e) {
      console.error('Supabase contract insert exception:', e);
    }
  }

  const current = getStorageItem<Contract>('athome_contracts', []);
  const updated = [newContract, ...current];
  setStorageItem('athome_contracts', updated);
  return newContract;
};

// SQL SCHEMA GENERATOR FOR USER
export const SUPABASE_SQL_SCHEMA = `-- CARTA DE CREACIÓN DE BASE DE DATOS PARA ATHOME ENFERMERIA
-- Ejecuta este script SQL en el panel de control de Supabase (SQL Editor)

-- 1. Crear tabla de Servicios
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    duration TEXT NOT NULL,
    icon TEXT
);

-- 2. Crear tabla de Enfermeros (Nurses)
CREATE TABLE IF NOT EXISTS public.nurses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    rating NUMERIC NOT NULL DEFAULT 5.0,
    avatar TEXT,
    status TEXT DEFAULT 'available',
    bio TEXT
);

-- 3. Crear tabla de Reservas/Turnos (Bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    service_id TEXT NOT NULL,
    nurse_id TEXT,
    patient_name TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    date TEXT NOT NULL,
    shift TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Crear tabla de Contratos (Contracts)
CREATE TABLE IF NOT EXISTS public.contracts (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    patient_condition TEXT NOT NULL,
    hours_per_day INT NOT NULL,
    weeks INT NOT NULL,
    weekly_visits INT NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Insertar Datos Base de Servicios
INSERT INTO public.services (id, title, description, price, category, duration, icon) VALUES
('s-1', 'Guardia de Enfermería de 8 hs', 'Cuidado continuo de enfermería en domicilio por un turno de 8 horas.', 36000, 'internacion', '8 Horas', 'ShieldAlert'),
('s-2', 'Guardia de Enfermería de 12 hs', 'Cuidado continuo diurno/nocturno por un lapso de 12 horas.', 52000, 'internacion', '12 Horas', 'Activity'),
('s-3', 'Guardia Primaria las 24 hs (Día Completo)', 'Internación domiciliaria de máxima asistencia asistida.', 98000, 'internacion', '24 Horas', 'HeartHandshake'),
('s-4', 'Higiene y Confort en Cama', 'Servicio de aseo, baño en cama, rotación de decúbito y cambio de blancos.', 15000, 'procedimiento', 'Aproximadamente 1:30 hs', 'Sparkles'),
('s-5', 'Curación Compleja de Heridas / Escaras', 'Curación y cuidado de heridas con hidrogeles avanzados.', 18000, 'procedimiento', 'Puntual', 'HeartPulse'),
('s-6', 'Colocación de Vía Periférica y Sueroterapia', 'Acceso endovenoso de sales para hidratación o antibióticos indicados por su médico.', 14000, 'procedimiento', 'Puntual', 'Droplet'),
('s-7', 'Aplicación de Inyección Intramuscular / SC', 'Inyección puntual de analgésicos o vacunas autorizadas.', 6000, 'procedimiento', 'Puntual', 'Syringe'),
('s-8', 'Control de Signos Vitales y Parámetros', 'Control preventivo de presión arterial, glucemia capilar e informes.', 8000, 'control', '30 min', 'Gauge')
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Datos Base de Enfermeros
INSERT INTO public.nurses (id, name, specialty, rating, avatar, status, bio) VALUES
('n-1', 'Lic. Mariana Gómez', 'Cuidados Críticos y Terapia del Adulto', 4.9, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', 'available', 'Licenciada de Enfermería con más de 8 años de experiencia en Unidades de Terapia Intensiva (UTI).'),
('n-2', 'Enf. Carlos Rodríguez', 'Geriatría, Rehabilitación y Paliativos', 4.8, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200', 'available', 'Enfermero profesional dedicada a la recuperación motora y asistencia geriátrica avanzada.'),
('n-3', 'Lic. Andrea Paz', 'Pediatría, Neonatología e Internación Maternal', 5.0, 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=200', 'available', 'Especialista en el cuidado de bebés prematuros en esquema domiciliario.'),
('n-4', 'Enf. Javier Soto', 'Heridas Complejas y Control de Medicación', 4.7, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200', 'available', 'Experto en curaciones avanzadas de escaras y prevención de infecciones.')
ON CONFLICT (id) DO NOTHING;

-- Configurar políticas de Row Level Security (RLS) para lectura y escritura públicas para simplificar
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de servicios" ON public.services FOR SELECT USING (true);
CREATE POLICY "Permitir lectura publica de enfermeros" ON public.nurses FOR SELECT USING (true);

CREATE POLICY "Permitir todo en reservas" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir todo en contratos" ON public.contracts FOR ALL USING (true) WITH CHECK (true);
`;
