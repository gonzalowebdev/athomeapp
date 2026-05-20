import React, { useState } from 'react';
import { Calendar, Trash2, CheckSquare, FileText, BadgePercent, MapPin, User, Phone, CheckCircle, Activity, Hourglass } from 'lucide-react';
import { Booking, Service, Nurse } from '../types';
import { updateBookingStatus } from '../database';

interface MyBookingsTabProps {
  bookings: Booking[];
  services: Service[];
  nurses: Nurse[];
  onRefresh: () => void;
}

export default function MyBookingsTab({ bookings, services, nurses, onRefresh }: MyBookingsTabProps) {
  const [selectedBookingReceipt, setSelectedBookingReceipt] = useState<Booking | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: Booking['status']) => {
    setIsUpdating(id);
    try {
      const ok = await updateBookingStatus(id, newStatus);
      if (ok) {
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(null);
    }
  };

  const getServiceForBooking = (serviceId: string): Service | undefined => {
    return services.find(s => s.id === serviceId);
  };

  const getNurseForBooking = (nurseId?: string): Nurse | undefined => {
    if (!nurseId) return undefined;
    return nurses.find(n => n.id === nurseId);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Title block */}
      <div>
        <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">Mis Reservas y Contrataciones</h2>
        <p className="text-xs text-slate-500">
          Revisa el estado administrativo de tus turnos vigentes, descarga tus recibos arancelarios estipulados y cancela o reprograma si es necesario.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-10 sm:p-16 text-center shadow-xs max-w-xl mx-auto space-y-4">
          <div className="bg-teal-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-teal-600 border border-teal-100/50">
            <Calendar className="h-8 w-8 text-teal-500 animate-pulse" />
          </div>
          <div className="space-y-1.5 flex flex-col items-center">
            <h3 className="font-bold text-slate-800 text-base">Aún no registras reservas</h3>
            <p className="text-xs text-slate-550 max-w-sm mx-auto leading-relaxed">
              Reserva tu primer turno puntual de enfermería o contrata guardias hospitalarias a domicilio en solo un par de clics.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {bookings.map((b) => {
            const service = getServiceForBooking(b.service_id);
            const nurse = getNurseForBooking(b.nurse_id);
            const isProcessing = isUpdating === b.id;

            return (
              <div
                key={b.id}
                className="bg-white border border-slate-100 hover:border-teal-50 rounded-2xl p-5 shadow-3xs flex flex-col justify-between space-y-4 transition-all"
              >
                {/* Header info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      <span className="text-[9px] font-mono font-bold uppercase bg-slate-50 text-slate-505 px-2 py-0.5 rounded border border-slate-100">
                        ID: {b.id}
                      </span>
                      {b.status === 'paid' && (
                        <span className="text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center">
                          <CheckCircle className="h-2.5 w-2.5 mr-1" />
                          Abonado
                        </span>
                      )}
                      {b.status === 'confirmed' && (
                        <span className="text-[9px] font-mono font-bold bg-teal-100 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-full inline-flex items-center">
                          <Activity className="h-2.5 w-2.5 mr-1 text-teal-600 animate-pulse" />
                          Coordinado
                        </span>
                      )}
                      {b.status === 'completed' && (
                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full">
                          Asistencia Finalizada
                        </span>
                      )}
                      {b.status === 'cancelled' && (
                        <span className="text-[9px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                          Anulado
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-extrabold text-slate-800 text-sm leading-tight">
                      {service ? service.title : 'Servicio Especial'}
                    </h3>
                  </div>

                  <div className="text-right whitespace-nowrap">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase font-mono">Total Pago</span>
                    <span className="text-sm font-black text-teal-700">${b.total_price.toLocaleString()} ARS</span>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-2 border-t border-b border-slate-50 py-3.5 text-xs text-slate-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">{b.patient_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-550 truncate max-w-[280px]">{b.patient_phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-550 truncate max-w-[280px]">{b.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold text-slate-800">
                      {b.date} &mdash; Turno {b.shift === 'morning' ? 'Mañana (8 a 16hs)' : b.shift === 'afternoon' ? 'Tarde (16 a 00hs)' : b.shift === 'night' ? 'Noche (00 a 08hs)' : '24 Horas'}
                    </span>
                  </div>

                  {/* Asigned nurse profile view */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      {nurse ? (
                        <>
                          <img
                            src={nurse.avatar}
                            alt={nurse.name}
                            className="w-8 h-8 rounded-full object-cover border border-teal-200"
                          />
                          <div>
                            <span className="text-[9px] text-teal-600 font-mono font-bold block">ENFERMERO ASIGNADO</span>
                            <span className="text-xs font-bold text-slate-800">{nurse.name}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-mono font-bold text-xs uppercase animate-pulse">
                            AT
                          </div>
                          <div>
                            <span className="text-[9px] text-teal-500 font-mono font-bold block">ASIGNACIÓN SISTEMA BOOT</span>
                            <span className="text-xs font-bold text-teal-700">Coordinador Oficial Coordinando</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations Actions bar */}
                <div className="flex justify-between items-center gap-2 pt-2">
                  <button
                    onClick={() => setSelectedBookingReceipt(b)}
                    className="flex items-center space-x-1.5 text-xs text-slate-550 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer"
                  >
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    <span>Ver Recibo</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    {/* Mark complete simulation */}
                    {b.status !== 'completed' && b.status !== 'cancelled' && (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(b.id, 'completed')}
                        className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-3 py-2 rounded-lg font-bold transition-all cursor-pointer"
                      >
                        {isProcessing ? 'Guardando...' : 'Marcar Completado'}
                      </button>
                    )}

                    {/* Cancel booking */}
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                        className="text-xs text-rose-700 hover:text-red-800 bg-rose-50 hover:bg-rose-100 border border-rose-100 p-2 rounded-lg transition-all cursor-pointer"
                        title="Cancelar Reserva"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recibo modal popup panel */}
      {selectedBookingReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-scale-up">
            <div className="flex justify-between items-start border-b border-dashed border-slate-100 pb-3">
              <div>
                <h4 className="font-extrabold text-slate-800 text-base">ATHOME ENFERMERÍA S.A.</h4>
                <p className="text-[10px] text-slate-400 font-mono">CUIT: 30-71649215-9 &mdash; Supervisión Médica</p>
              </div>
              <button
                onClick={() => setSelectedBookingReceipt(null)}
                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-250 border border-slate-200 text-slate-400 hover:text-slate-800 text-xs font-bold rounded-lg transition-all"
              >
                Cerrar
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-slate-700">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Recibo Fiscal:</span>
                <span className="font-bold">No-9472-ATH-{selectedBookingReceipt.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha Emisión:</span>
                <span className="font-semibold text-slate-850">{new Date(selectedBookingReceipt.created_at).toLocaleDateString()}</span>
              </div>
              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold mb-1">Paciente Asistido</span>
                <div className="bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                  <div className="flex justify-between">
                    <span>Nombre:</span>
                    <span className="font-bold text-slate-850">{selectedBookingReceipt.patient_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Contacto:</span>
                    <span className="font-medium text-slate-850 truncate max-w-[200px]">{selectedBookingReceipt.patient_phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Ubicación:</span>
                    <span className="font-medium text-slate-850 truncate max-w-[200px]">{selectedBookingReceipt.address}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-50 pt-2.5">
                <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold mb-1">Concepto Farmacológico y Cuidado</span>
                <div className="flex justify-between text-xs font-bold">
                  <span>{getServiceForBooking(selectedBookingReceipt.service_id)?.title || 'Servicio Domiciliario'}</span>
                  <span>${selectedBookingReceipt.total_price.toLocaleString()} ARS</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  Incluye kit estéril clínico de curación, jeringas de inyección e informes evolutivos coordinados.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-bold bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl">
                <div>
                  <span className="text-[10px] block font-mono font-bold text-slate-400 uppercase">Estado Pago</span>
                  <span className="text-xs font-extrabold text-teal-700 uppercase">TRANSACCIÓN COMPLETADA</span>
                </div>
                <span className="text-lg font-black text-slate-800">${selectedBookingReceipt.total_price.toLocaleString()} ARS</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
