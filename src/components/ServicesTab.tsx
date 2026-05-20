import React, { useState } from 'react';
import { Search, ArrowLeft, Heart, CreditCard, CheckCircle, Calendar, MapPin, Phone, User, Star, Clock, Sparkles } from 'lucide-react';
import { Service, Nurse, Booking } from '../types';
import { createBooking } from '../database';

interface ServicesTabProps {
  services: Service[];
  nurses: Nurse[];
  onBookingSuccess: () => void;
}

export default function ServicesTab({ services, nurses, onBookingSuccess }: ServicesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // States for booking wizard workflow
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientDni, setPatientDni] = useState('');
  const [address, setAddress] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingShift, setBookingShift] = useState<'morning' | 'afternoon' | 'night' | '24hs'>('morning');
  const [selectedNurse, setSelectedNurse] = useState<string>('auto'); // nurse_id or 'auto'
  
  // Checkout & Payment simulation states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter service catalog
  const filteredServices = services.filter((svc) => {
    const matchesSearch = svc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          svc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || svc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'ATHOME15' || couponCode.trim().toUpperCase() === 'DESCUENTO') {
      if (activeService) {
        setDiscountAmount(activeService.price * 0.15);
        setErrorMessage('');
      }
    } else {
      setErrorMessage('Cupón inválido o vencido');
    }
  };

  const handleCreateBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeService) return;

    if (!patientName.trim() || !patientPhone.trim() || !address.trim() || !bookingDate) {
      setErrorMessage('Por favor complete todos los datos obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const finalPrice = activeService.price - discountAmount;
      const bookingPayload = {
        service_id: activeService.id,
        nurse_id: selectedNurse === 'auto' ? undefined : selectedNurse,
        patient_name: patientName,
        patient_phone: `${patientPhone} (DNI: ${patientDni})`,
        address: address,
        date: bookingDate,
        shift: bookingShift,
        status: 'paid' as const, // Automatically confirmed and paid since it simulates instant gateway checkout
        total_price: finalPrice
      };

      const result = await createBooking(bookingPayload);
      setConfirmedBooking(result);
      setShowInvoice(true);
    } catch (error) {
      console.error(error);
      setErrorMessage('Error al registrar la reserva en la base de datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetBookingForm = () => {
    setActiveService(null);
    setPatientName('');
    setPatientPhone('');
    setPatientDni('');
    setAddress('');
    setBookingDate('');
    setBookingShift('morning');
    setSelectedNurse('auto');
    setDiscountAmount(0);
    setCouponCode('');
    setShowInvoice(false);
    setConfirmedBooking(null);
  };

  if (showInvoice && confirmedBooking && activeService) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-teal-100 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-fade-in my-4">
        <div className="bg-emerald-100 text-emerald-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
          <CheckCircle className="h-10 w-10 text-emerald-600" />
        </div>
        
        <div className="space-y-2">
          <h2 className="font-sans font-extrabold text-2xl text-slate-800 tracking-tight">¡Contratación Exitosa!</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Tu reserva ha sido procesada, abonada y registrada con éxito. Un supervisor de ATHOME se pondrá en contacto por WhatsApp con ustedes a la brevedad.
          </p>
        </div>

        {/* Factura / Recibo formal */}
        <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-5 text-left space-y-4 font-sans text-xs">
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-3">
            <div>
              <p className="font-mono text-slate-400">RECIBO DE TURNO</p>
              <p className="font-bold text-slate-800 text-sm">ATHOME ENFERMERÍA</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-slate-500">ID: {confirmedBooking.id}</p>
              <p className="font-mono text-slate-400">{new Date(confirmedBooking.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-2.5 gap-x-2">
            <div>
              <span className="text-slate-400 block font-medium">Servicio Contratado:</span>
              <span className="font-semibold text-slate-800">{activeService.title}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Paciente:</span>
              <span className="font-semibold text-slate-800">{confirmedBooking.patient_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Domicilio de Atención:</span>
              <span className="font-semibold text-slate-800">{confirmedBooking.address}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Fecha y Turno:</span>
              <span className="font-semibold text-slate-800">
                {confirmedBooking.date} - {confirmedBooking.shift === 'morning' ? 'Mañana' : confirmedBooking.shift === 'afternoon' ? 'Tarde' : confirmedBooking.shift === 'night' ? 'Noche' : '24 hs'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Enfermero Asignado:</span>
              <span className="font-semibold text-teal-600">
                {confirmedBooking.nurse_id 
                  ? nurses.find(n => n.id === confirmedBooking.nurse_id)?.name 
                  : 'Asignación Automática (Oficial Matriculado)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Estado de Transacción:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                PAGADO / CONFIRMADO
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-bold">
            <span className="text-slate-750">Total Abonado:</span>
            <span className="text-teal-700 font-extrabold text-base">${confirmedBooking.total_price.toLocaleString()} ARS</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={resetBookingForm}
            className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Contratar Otro Servicio
          </button>
          <button
            onClick={() => {
              resetBookingForm();
              onBookingSuccess();
            }}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Ir a Mis Reservas
          </button>
        </div>
      </div>
    );
  }

  // Booking Flow Screen
  if (activeService) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setActiveService(null)}
            className="bg-white hover:bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-slate-600 transition-all shadow-3xs cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="font-sans font-extrabold text-lg text-slate-800 tracking-tight">Formulario de Reserva y Pago</h2>
            <p className="text-xs text-slate-500">Completa la ficha médica de atención para coordinar el enfermero de ATHOME.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Side */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex items-center space-x-3 border-b border-teal-50 pb-4">
              <div className="bg-teal-50 p-2 rounded-lg text-teal-600">
                <Heart className="h-5 w-5 fill-current text-teal-200" />
              </div>
              <div>
                <span className="text-[10px] text-teal-600 font-mono font-bold tracking-widest uppercase">SERVICIO SELECCIONADO</span>
                <h3 className="font-bold text-slate-800 text-sm">{activeService.title}</h3>
              </div>
            </div>

            <form onSubmit={handleCreateBookingSubmit} className="space-y-4">
              <h3 className="font-bold text-slate-850 text-xs uppercase tracking-wider font-mono text-teal-700 border-l-2 border-teal-500 pl-2">
                1. Datos del Paciente en Domicilio
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Nombre Completo del Paciente *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                    <input
                      required
                      type="text"
                      placeholder="Ej. Juan Carlos Pérez"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">DNI / Documento *</label>
                    <input
                      required
                      type="text"
                      placeholder="Ej. 35432912"
                      value={patientDni}
                      onChange={(e) => setPatientDni(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 block">Teléfono / WhatsApp *</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                      <input
                        required
                        type="tel"
                        placeholder="Ej. 1158214972"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Dirección de Atención Domiciliaria *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    required
                    type="text"
                    placeholder="Ej. Av. Santa Fe 3421, Piso 4 Depto B, Palermo, CABA"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                  />
                </div>
              </div>

              <h3 className="font-bold text-slate-855 text-xs uppercase tracking-wider font-mono text-teal-700 border-l-2 border-teal-500 pl-2 pt-2">
                2. Programación del Turno
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Fecha Solicitada *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400 animate-pulse" />
                    <input
                      required
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Turno de Preferencia *</label>
                  <select
                    value={bookingShift}
                    onChange={(e) => setBookingShift(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                  >
                    <option value="morning">Mañana (08:00 a 16:00 hs)</option>
                    <option value="afternoon">Tarde (16:00 a 00:00 hs)</option>
                    <option value="night">Noche (00:00 a 08:00 hs)</option>
                    <option value="24hs">24hs Continuas (Rotación)</option>
                  </select>
                </div>
              </div>

              <h3 className="font-bold text-slate-855 text-xs uppercase tracking-wider font-mono text-teal-700 border-l-2 border-teal-500 pl-2 pt-2">
                3. Selección del Profesional
              </h3>

              <div className="space-y-3">
                <p className="text-[11px] text-slate-500">
                  Elige un enfermero especializado de nuestra plantilla oficial o deja la asignación automática recomendada por el sistema.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    selectedNurse === 'auto' ? 'border-teal-500 bg-teal-50/20' : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}>
                    <div className="flex items-center space-x-2.5">
                      <input 
                        type="radio" 
                        name="selected_nurse" 
                        value="auto" 
                        checked={selectedNurse === 'auto'}
                        onChange={() => setSelectedNurse('auto')}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <div>
                        <span className="text-xs font-bold block text-slate-800">Asignar Automáticamente</span>
                        <span className="text-[10px] text-slate-400">El supervisor clínico elegirá el perfil óptimo</span>
                      </div>
                    </div>
                    <Sparkles className="h-4.5 w-4.5 text-teal-600" />
                  </label>

                  {nurses.map((nurse) => (
                    <label key={nurse.id} className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                      selectedNurse === nurse.id ? 'border-teal-500 bg-teal-50/15' : 'border-slate-100 bg-white hover:bg-slate-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input 
                          type="radio" 
                          name="selected_nurse" 
                          value={nurse.id}
                          checked={selectedNurse === nurse.id}
                          onChange={() => setSelectedNurse(nurse.id)}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <img 
                          src={nurse.avatar} 
                          alt={nurse.name} 
                          className="w-8 h-8 rounded-full object-cover" 
                        />
                        <div>
                          <span className="text-xs font-bold block text-slate-800">{nurse.name}</span>
                          <span className="text-[9px] text-slate-400 block line-clamp-1">{nurse.specialty}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded">
                        <Star className="h-3 w-3 fill-current mr-0.5" />
                        {nurse.rating.toFixed(1)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 text-xs rounded-xl">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                id="submit-booking-button"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-95 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Procesando Pago y Turno...' : 'Proceder al Pago Seguro'}</span>
              </button>
            </form>
          </div>

          {/* Checkout Side panel */}
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-4 h-fit">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest font-mono text-slate-500">Resumen de Cuenta</h3>
            
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Servicio:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">{activeService.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Categoría:</span>
                <span className="font-semibold text-slate-800 capitalize">{activeService.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Duración estimada:</span>
                <span className="font-semibold text-slate-800">{activeService.duration}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2.5">
                <span>Precio base:</span>
                <span className="font-semibold text-slate-800">${activeService.price.toLocaleString()} ARS</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Descuento Aplicado (15%):</span>
                  <span>-${discountAmount.toLocaleString()} ARS</span>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-2.5 text-sm font-bold text-slate-800">
                <span>Total Estimado:</span>
                <span className="text-teal-700 font-extrabold text-base">
                  ${(activeService.price - discountAmount).toLocaleString()} ARS
                </span>
              </div>
            </div>

            {/* Coupons section */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <label className="text-[10px] font-bold text-slate-400 block uppercase font-mono">¿Tienes un cupón?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ej. ATHOME15"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden flex-1 uppercase font-mono"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-teal-100 hover:bg-teal-200 text-teal-700 font-bold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Aplicar
                </button>
              </div>
              <p className="text-[9px] text-teal-600 font-semibold italic">Tip: Usa "ATHOME15" para 15% de descuento directo en tu reserva.</p>
            </div>

            {/* Simulated Payment Gateway Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 text-slate-600 font-medium">
                <CreditCard className="h-4 w-4 text-teal-600" />
                <span>Pasarela de Pago Segura Integrada</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Este sistema utiliza un procesador simulado compatible con Mercado Pago y tarjetas de crédito habilitadas por Supabase.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title & Introduction */}
      <div>
        <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">Catálogo de Servicios de Enfermería</h2>
        <p className="text-xs text-slate-500">
          Encuentra el procedimiento clínico o la guardia de cuidado domiciliaria que requiere tu paciente. Todas las tarifas son finales e incluyen insumos.
        </p>
      </div>

      {/* Catalog Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por servicio (Ej: Guardia, vía, inyección, higiene...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800 text-ellipsis font-sans font-medium"
          />
        </div>

        {/* Tab Selector Categories */}
        <div className="flex overflow-x-auto gap-1 border-b sm:border-0 border-slate-100 pb-2 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold cursor-pointer transition-all ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white shadow-3xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedCategory('internacion')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold cursor-pointer transition-all ${
              selectedCategory === 'internacion'
                ? 'bg-teal-600 text-white shadow-3xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Guardias e Internación
          </button>
          <button
            onClick={() => setSelectedCategory('procedimiento')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold cursor-pointer transition-all ${
              selectedCategory === 'procedimiento'
                ? 'bg-teal-600 text-white shadow-3xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Procedimientos Clínicos
          </button>
          <button
            onClick={() => setSelectedCategory('control')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold cursor-pointer transition-all ${
              selectedCategory === 'control'
                ? 'bg-teal-600 text-white shadow-3xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Controles Preventivos
          </button>
        </div>
      </div>

      {/* Services Grid layout */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((svc) => (
            <div
              key={svc.id}
              className="bg-white border border-slate-100 hover:border-teal-100 hover:shadow-xs rounded-2xl p-5 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase font-mono font-bold tracking-wider rounded-md px-2 py-0.5 bg-slate-50 text-slate-505">
                    {svc.category === 'internacion' 
                      ? 'GUARDIA Y CUIDADO' 
                      : svc.category === 'procedimiento' 
                        ? 'PROCEDIMIENTO PUNTUAL' 
                        : 'CONTROL RÁPIDO'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold">⏱️ {svc.duration}</span>
                </div>
                
                <h3 className="font-bold text-slate-800 text-sm">{svc.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed text-justify">
                  {svc.description}
                </p>
              </div>

              <div className="border-t border-slate-50 mt-4.5 pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase font-mono">Consumo / Tarifa</span>
                  <span className="text-lg font-extrabold text-teal-700">${svc.price.toLocaleString()} ARS</span>
                </div>
                <button
                  id={`book-service-${svc.id}`}
                  onClick={() => setActiveService(svc)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white active:scale-95 text-xs font-bold rounded-lg leading-none transition-all cursor-pointer shadow-3xs"
                >
                  Contratar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-12 bg-white rounded-2xl border border-slate-100 text-slate-505">
          <p className="text-sm font-semibold">No se encontraron servicios que coincidan con la búsqueda.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs bg-slate-100 hover:bg-slate-250 text-slate-600 px-3 py-1.5 rounded-lg font-semibold transition-all"
          >
            Restablecer Filtros
          </button>
        </div>
      )}
    </div>
  );
}
