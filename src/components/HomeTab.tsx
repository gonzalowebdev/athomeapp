import React from 'react';
import { ShieldCheck, Clock, Users, Award, Heart, ArrowRight, Star, Phone, Mail, ChevronRight, Activity } from 'lucide-react';
import { Nurse, Service } from '../types';

interface HomeTabProps {
  nurses: Nurse[];
  services: Service[];
  setActiveTab: (tab: string) => void;
  isSupabaseConnected: boolean;
}

export default function HomeTab({ nurses, services, setActiveTab, isSupabaseConnected }: HomeTabProps) {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white rounded-2xl md:rounded-3xl shadow-xl border border-teal-600/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.15),transparent_60%)] pointer-events-none" />
        
        <div className="relative p-6 sm:p-10 md:p-12 lg:p-16 flex flex-col md:flex-row items-center gap-8 z-10">
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              🏥 Cuidado Clínico en Casa
            </div>
            
            <h1 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
              La enfermería más profesional, <span className="text-teal-300">en la comodidad de tu hogar.</span>
            </h1>
            
            <p className="text-slate-200 text-sm sm:text-base max-w-xl leading-relaxed">
              Reserva turnos de enfermería domiciliaria, guardias permanentes de 8, 12 o 24hs, y curaciones de alta complejidad con profesionales matriculados oficiales de ATHOME.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 pt-2">
              <button
                id="hero-book-now"
                onClick={() => setActiveTab('services')}
                className="w-full sm:w-auto px-6 py-3 bg-white text-teal-800 hover:bg-teal-50 active:scale-95 transition-all text-sm font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Reservar un Turno</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              
              <button
                id="hero-ai-consult"
                onClick={() => setActiveTab('ai')}
                className="w-full sm:w-auto px-6 py-3 bg-teal-600/40 hover:bg-teal-600/60 text-white border border-teal-400/30 active:scale-95 transition-all text-sm font-semibold rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Consultar Asesor IA</span>
                <Activity className="h-4 w-4 text-teal-300 animate-pulse" />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md hidden lg:block">
            <div className="relative bg-teal-900/30 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
              <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full animate-bounce">
                Servicio Oficial
              </div>
              <h3 className="text-teal-200 text-xs uppercase font-mono tracking-widest font-bold mb-3">CONTRATO DIRECTO</h3>
              <p className="text-lg font-bold text-white mb-2">Plan Mensual Integral</p>
              <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                Diseñamos planes continuos supervisados por un Coordinador Médico de ATHOME, amparando control diario, rotaciones de enfermería y reportes automáticos.
              </p>
              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <div>
                  <span className="block text-[10px] text-teal-300 uppercase font-bold">Desde</span>
                  <span className="text-2xl font-black text-white">$145.000<span className="text-xs font-normal text-slate-300">/sem</span></span>
                </div>
                <button 
                  onClick={() => setActiveTab('contract')}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-white text-xs font-bold rounded-lg transition-all"
                >
                  Ver Planes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Care Standard Value Props / Bento Section */}
      <section className="space-y-4">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="font-sans font-extrabold text-2xl text-slate-800 tracking-tight">
            ¿Por qué elegir ATHOME Enfermería?
          </h2>
          <p className="text-sm text-slate-500">
            Garantizamos la máxima excelencia clínica y humana en cada turno asistencial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs flex flex-col items-start space-y-3">
            <div className="bg-teal-50 p-2.5 rounded-xl text-teal-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Enfermeros Matriculados</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Todo nuestro personal posee su matrícula oficial de enfermería y seguro clínico obligatorio para total tranquilidad.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs flex flex-col items-start space-y-3">
            <div className="bg-teal-50 p-2.5 rounded-xl text-teal-600">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Cobertura 24hs Permanente</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Asignamos turnos de urgencia o guardias estables rotatorias en menos de 12 horas hábiles desde tu confirmación.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs flex flex-col items-start space-y-3">
            <div className="bg-teal-50 p-2.5 rounded-xl text-teal-600">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Monitoreo y Reportes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Supervisores clínicos realizan un seguimiento continuo y brindan informes evolutivos directos al médico de cabecera.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs flex flex-col items-start space-y-3">
            <div className="bg-teal-50 p-2.5 rounded-xl text-teal-600">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Insumos y Bioseguridad</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Trabajamos con kit de curación estéril cerrado y materiales de bioseguridad del laboratorio líder de internación.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services Quick View */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">Servicios Más Solicitados</h2>
            <p className="text-xs text-slate-500">Contrata de forma puntual o continua con tarifas claras.</p>
          </div>
          <button
            onClick={() => setActiveTab('services')}
            className="text-xs text-teal-600 font-bold flex items-center hover:underline cursor-pointer"
          >
            <span>Ver Catálogo</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.slice(0, 3).map((svc) => (
            <div
              key={svc.id}
              className="p-5 bg-white border border-teal-50 hover:border-teal-100 hover:shadow-xs rounded-2xl transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-bold">
                  {svc.category === 'internacion' ? 'Internación Domiciliaria' : 'Procedimiento Domiciliario'}
                </span>
                <h3 className="font-bold text-slate-800 text-sm mt-1">{svc.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {svc.description}
                </p>
              </div>
              <div className="border-t border-slate-50 mt-4 pt-4 flex justify-between items-center bg-slate-50/50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Suscripción/Precio</span>
                  <span className="text-base font-extrabold text-teal-700">${svc.price.toLocaleString()} ARS</span>
                </div>
                <button
                  onClick={() => setActiveTab('services')}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-xs text-white font-bold rounded-lg transition-all"
                >
                  Contratar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nurses Overview Slider */}
      <section className="space-y-4">
        <div>
          <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">Nuestra Plantilla de Enfermeros</h2>
          <p className="text-xs text-slate-500">Enfermeros oficiales matriculados de ATHOME, capacitados bajo estándares hospitalarios.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nurses.map((nurse) => (
            <div
              key={nurse.id}
              className="p-4 bg-white border border-slate-100 rounded-2xl shadow-3xs text-center space-y-3 hover:shadow-xs transition-shadow"
            >
              <div className="relative inline-block">
                <img
                  src={nurse.avatar}
                  alt={nurse.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-full mx-auto object-cover border-2 border-teal-500"
                />
                <span className="absolute bottom-0 right-1.5 bg-emerald-500 block w-3.5 h-3.5 rounded-full border-2 border-white" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">{nurse.name}</h4>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5 line-clamp-1">{nurse.specialty}</p>
                <div className="flex items-center justify-center space-x-1 mt-1.5 bg-amber-50 rounded-md w-fit mx-auto px-2 py-0.5 border border-amber-100/40">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
                  <span className="text-[10px] font-bold text-amber-700">{nurse.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed text-justify px-1 italic line-clamp-3">
                "{nurse.bio}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Patient Testimonials Section */}
      <section className="p-6 sm:p-8 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">Testimonios de Pacientes y Familias</h2>
          <p className="text-xs text-slate-500 mt-1">
            Conoce la opinión y experiencia de quienes confiaron la salud de sus seres queridos en ATHOME.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 bg-white rounded-xl shadow-3xs border border-slate-100 flex flex-col justify-between">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Mi papá fue operado de próstata y requería una sonda vesical y medicamentos en horarios exactos. La Lic. Mariana Gómez acudió con total puntualidad y profesionalismo. Nos dio una tranquilidad inmensa poder contar con enfermeros matriculados reales en casa."
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold uppercase">
                MC
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Mariela Calcaterra</h5>
                <span className="text-[10px] text-slate-400">Hija del paciente José (81 años)</span>
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl shadow-3xs border border-slate-100 flex flex-col justify-between">
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Excelente servicio de Guardia de 24 horas por la internación de mi madre con cuidados paliativos. El recambio de personal se dio de manera orgánica y siempre coordinados por la jefa por WhatsApp. Recomiendo ATHOME sin dudar."
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold uppercase">
                RL
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-800">Ricardo Ledesma</h5>
                <span className="text-[10px] text-slate-400">Familiar directo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact info footer */}
      <section className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 text-center md:text-left">
        <div>
          <p className="font-bold text-slate-700 text-sm">ATHOME ENFERMERÍA DOMICILIARIA S.A.</p>
          <p className="mt-1">Servicio de atención médica coordinada y cuidados preventivos de enfermería.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start text-[11px]">
          <div className="flex items-center space-x-1">
            <Phone className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-semibold">+54 9 11 5821-4972</span>
          </div>
          <div className="flex items-center space-x-1">
            <Mail className="h-3.5 w-3.5 text-teal-600" />
            <span className="font-semibold">contacto@athome-nursing.com</span>
          </div>
        </div>
      </section>
    </div>
  );
}
