import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeTab from './components/HomeTab';
import ServicesTab from './components/ServicesTab';
import MyBookingsTab from './components/MyBookingsTab';
import CustomContractTab from './components/CustomContractTab';
import AiConsultantTab from './components/AiConsultantTab';
import SupabaseGuideTab from './components/SupabaseGuideTab';

import { getServices, getNurses, getBookings, isSupabaseConfigured } from './database';
import { Service, Nurse, Booking } from './types';
import { Heart, Globe, Settings, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [services, setServices] = useState<Service[]>([]);
  const [nurses, setNurses] = useState<Nurse[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const svcs = await getServices();
      const nrs = await getNurses();
      const bkts = await getBookings();
      setServices(svcs);
      setNurses(nrs);
      setBookings(bkts);
    } catch (e) {
      console.error('Error loading core data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookingComplete = () => {
    fetchData();
    setActiveTab('bookings');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">

      {/* Main Responsive Framework Outer Frame */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:px-4 md:py-6">
        
        {/* Responsive Mobile-first Frame wrapper container */}
        <div className="flex-1 bg-white md:rounded-3xl shadow-xs md:border border-slate-100 overflow-hidden flex flex-col min-h-[calc(100vh-100px)] relative">
          
          {/* Navigation Bar */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isSupabaseConnected={isSupabaseConfigured} 
          />

          {/* Core content slot */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto pb-24 md:pb-8">
            {isLoading ? (
              <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <Heart className="h-10 w-10 text-teal-600 animate-pulse fill-current" />
                <p className="text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">Cargando ATHOME ENFERMERÍA...</p>
              </div>
            ) : (
              <>
                {activeTab === 'home' && (
                  <HomeTab 
                    nurses={nurses} 
                    services={services} 
                    setActiveTab={setActiveTab} 
                    isSupabaseConnected={isSupabaseConfigured} 
                  />
                )}
                {activeTab === 'services' && (
                  <ServicesTab 
                    services={services} 
                    nurses={nurses} 
                    onBookingSuccess={handleBookingComplete} 
                  />
                )}
                {activeTab === 'contract' && (
                  <CustomContractTab 
                    onContractSuccess={handleBookingComplete} 
                  />
                )}
                {activeTab === 'bookings' && (
                  <MyBookingsTab 
                    bookings={bookings} 
                    services={services} 
                    nurses={nurses} 
                    onRefresh={fetchData} 
                  />
                )}
                {activeTab === 'ai' && (
                  <AiConsultantTab />
                )}
                {activeTab === 'developer' && (
                  <SupabaseGuideTab />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
