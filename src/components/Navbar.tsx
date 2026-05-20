import React from 'react';
import { Heart, Calendar, Bot, ClipboardList, Database, Briefcase } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSupabaseConnected: boolean;
}

export default function Navbar({ activeTab, setActiveTab, isSupabaseConnected }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Inicio', icon: Heart },
    { id: 'services', label: 'Servicios', icon: ClipboardList },
    { id: 'contract', label: 'Plan Personalizado', icon: Briefcase },
    { id: 'bookings', label: 'Mis Reservas', icon: Calendar },
    { id: 'ai', label: 'Asesor IA', icon: Bot }
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center bg-white border-b border-teal-100 px-6 py-4 shadow-xs sticky top-0 z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="bg-teal-600 p-2.5 rounded-xl text-white shadow-sm flex items-center justify-center">
            <Heart className="h-6 w-6 fill-current animate-pulse text-teal-100" />
          </div>
          <div>
            <span className="font-sans font-extrabold tracking-tight text-xl text-slate-800">
              ATHOME
            </span>
            <span className="block text-xs font-mono font-bold tracking-widest text-teal-600 uppercase">
              Enfermería Domiciliaria
            </span>
          </div>
        </div>

        <nav className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-desktop-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 shadow-3xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-teal-50 text-teal-800 px-4 py-1.5 rounded-full text-xs font-semibold border border-teal-100">
            <span>✓ Profesionales Matriculados 24hs</span>
          </div>
        </div>
      </header>

      {/* Mobile Top Branding Bar */}
      <div className="md:hidden flex justify-between items-center bg-white border-b border-teal-50 px-4 py-3 shadow-xs sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="bg-teal-600 p-2 rounded-lg text-white">
            <Heart className="h-5 w-5 fill-current text-teal-100" />
          </div>
          <div>
            <span className="font-sans font-black tracking-tight text-base text-slate-800">ATHOME</span>
            <span className="block text-[9px] font-mono tracking-wider font-bold text-teal-600 uppercase">ENFERMERÍA</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 bg-teal-50 text-teal-800 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-teal-100">
          <span>Soporte 24hs</span>
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-lg px-2 py-1.5 flex justify-around items-center z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all rounded-md"
            >
              <div className={`p-1.5 rounded-lg transition-all ${
                isActive ? 'bg-teal-50 text-teal-600' : 'text-slate-400'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`text-[9px] mt-0.5 font-sans font-medium tracking-tight ${
                isActive ? 'text-teal-700 font-semibold' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
