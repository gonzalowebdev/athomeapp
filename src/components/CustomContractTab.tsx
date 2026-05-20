import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Sparkles, Clipboard, Award, Clock, ArrowRight, CheckCircle, HelpCircle } from 'lucide-react';
import { Contract } from '../types';
import { createContract } from '../database';

interface CustomContractTabProps {
  onContractSuccess: () => void;
}

export default function CustomContractTab({ onContractSuccess }: CustomContractTabProps) {
  // Plan builder state
  const [patientName, setPatientName] = useState('');
  const [patientCondition, setPatientCondition] = useState('post-operatorio');
  const [patientConditionDetail, setPatientConditionDetail] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState<number>(8);
  const [weeklyVisits, setWeeklyVisits] = useState<number>(5);
  const [weeks, setWeeks] = useState<number>(4);
  
  // Calculations
  const [priceQuote, setPriceQuote] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [newContractObj, setNewContractObj] = useState<Contract | null>(null);

  // Hourly base rate: $4500 ARS
  const BASE_HOURLY_RATE = 4500;

  useEffect(() => {
    // Basic Quote Formula
    let total = hoursPerDay * weeklyVisits * weeks * BASE_HOURLY_RATE;
    
    // Volume Discounts
    // 1. Long term discount (4+ weeks)
    if (weeks >= 4 && weeks < 12) {
      total = total * 0.90; // 10% off
    } else if (weeks >= 12) {
      total = total * 0.80; // 20% off long term
    }

    // 2. High intensity hours discount
    if (hoursPerDay >= 12) {
      total = total * 0.95; // 5% extra discount
    }

    setPriceQuote(Math.round(total));
  }, [hoursPerDay, weeklyVisits, weeks]);

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      alert('Por favor complete el nombre del paciente');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patient_name: patientName,
        patient_condition: `${patientCondition.toUpperCase()}: ${patientConditionDetail || 'Estable'}`,
        hours_per_day: hoursPerDay,
        weeks: weeks,
        weekly_visits: weeklyVisits,
        total_price: priceQuote,
        status: 'active' as const
      };

      const result = await createContract(payload);
      setNewContractObj(result);
      setShowConfirmation(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetContract = () => {
    setPatientName('');
    setPatientCondition('post-operatorio');
    setPatientConditionDetail('');
    setHoursPerDay(8);
    setWeeklyVisits(5);
    setWeeks(4);
    setShowConfirmation(false);
    setNewContractObj(null);
  };

  if (showConfirmation && newContractObj) {
    return (
      <div className="max-w-xl mx-auto bg-white border border-teal-100 rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-6 animate-fade-in my-4">
        <div className="bg-teal-100 text-teal-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xs border border-teal-200">
          <Award className="h-10 w-10 text-teal-600 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h2 className="font-sans font-extrabold text-2xl text-slate-800 tracking-tight">¡Plan de Cuidados Activo!</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Se ha generado un Plan de Tratamiento Personalizado continuo. Un supervisor clínico matriculado se comunicará para el relevamiento presencial obligatorio sin cargo.
          </p>
        </div>

        <div className="border border-teal-100 rounded-2xl bg-teal-50/20 p-5 text-left space-y-4 text-xs">
          <div className="flex justify-between border-b border-dashed border-teal-200 pb-2.5">
            <div>
              <p className="font-mono text-teal-700 font-bold">CONTRATO PREVENTIVO</p>
              <h4 className="font-extrabold text-slate-800 text-sm">ATHOME CARE PLAN</h4>
            </div>
            <p className="font-mono text-teal-600">ID: {newContractObj.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-slate-600">
            <div>
              <span className="text-slate-400 block font-medium">Paciente Asignado:</span>
              <span className="font-bold text-slate-800">{newContractObj.patient_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Condición Clínica:</span>
              <span className="font-bold text-slate-850 line-clamp-1 truncate max-w-[155px]">{newContractObj.patient_condition}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Esquema Horario:</span>
              <span className="font-bold text-slate-800">{newContractObj.hours_per_day} horas por día</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Asistencia Frecuencia:</span>
              <span className="font-bold text-slate-800">{newContractObj.weekly_visits} días a la semana</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Duración de Servicio:</span>
              <span className="font-bold text-slate-800">{newContractObj.weeks} semanas</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Estado del Plan:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                ACTIVO / EN COORDINACIÓN
              </span>
            </div>
          </div>

          <div className="border-t border-teal-200 pt-3 flex justify-between items-center text-sm font-bold">
            <span className="text-teal-900">Cotización Total Plan:</span>
            <span className="text-teal-700 font-black text-lg">${newContractObj.total_price.toLocaleString()} ARS</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleResetContract}
            className="flex-1 py-3 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer"
          >
            Crear Otro Plan
          </button>
          <button
            onClick={() => {
              handleResetContract();
              onContractSuccess();
            }}
            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-all cursor-pointer"
          >
            Ver Mi Tablero
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Configuration Form Side */}
      <div className="lg:col-span-2 space-y-5">
        <div>
          <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">Diseñador de Plan Mensual Personalizado</h2>
          <p className="text-xs text-slate-500">
            Modela un esquema de enfermería continua adaptado a las necesidades post-operatorias o crónicas del paciente. Recibe bonificaciones de larga estadía automáticas.
          </p>
        </div>

        <form onSubmit={handleCreateContract} className="bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 block">Nombre del Paciente Beneficiario *</label>
            <input
              required
              type="text"
              placeholder="Ej. Carmen Inés Ledesma"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Cuadro Clínico del Paciente</label>
              <select
                value={patientCondition}
                onChange={(e) => setPatientCondition(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800 font-sans"
              >
                <option value="post-operatorio">Post-operatorio Inmediato</option>
                <option value="geriatria">Cuidado Geriátrico de Adulto Mayor</option>
                <option value="paliativo">Cuidados Paliativos y Alivio del Dolor</option>
                <option value="neonatal">Cuidados Neonatales o Pediátricos</option>
                <option value="rehabilitacion">Rehabilitación Motriz o Postura</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Insumos o Aparatos Especiales requeridos</label>
              <input
                type="text"
                placeholder="Ej. Sonda Foley, Monitoreo oxígeno, Traqueostomía..."
                value={patientConditionDetail}
                onChange={(e) => setPatientConditionDetail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 my-4 pt-4 space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono text-teal-600">Esquema Operativo Horario</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Hours per day select */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Horas por Día</label>
                <select
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                >
                  <option value={2}>2 hs diarias (Procedimiento y Control)</option>
                  <option value={4}>4 hs diarias (Cuidado básico)</option>
                  <option value={8}>8 hs diarias (Guardia Estándar)</option>
                  <option value={12}>12 hs diarias (Guardia Turno Completo)</option>
                  <option value={24}>24 hs diarias (Apoyo Continuo Rotatorio)</option>
                </select>
              </div>

              {/* Weekly visits frequency selection */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Días a la Semana</label>
                <select
                  value={weeklyVisits}
                  onChange={(e) => setWeeklyVisits(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                >
                  <option value={1}>1 día / sem (Solo controles puntuales)</option>
                  <option value={3}>3 días / sem (Esquema alternado L-M-V)</option>
                  <option value={5}>5 días / sem (Esquema Día de Semana L a V)</option>
                  <option value={7}>7 días / sem (Cobertura Completa Lun a Dom)</option>
                </select>
              </div>

              {/* Number of weeks */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Duración del Plan</label>
                <select
                  value={weeks}
                  onChange={(e) => setWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-slate-800"
                >
                  <option value={1}>1 Semana (Acompañamiento agudo)</option>
                  <option value={2}>2 Semanas (Post-quirúrgico clave)</option>
                  <option value={4}>4 Semanas (1 Mes Completo - 10% OFF)</option>
                  <option value={12}>12 Semanas (Trimestre Completo - 20% OFF)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer pt-3"
          >
            <span>{isSubmitting ? 'Registrando Propuesta de Plan...' : 'Contratar y Coordinar Plan Directo'}</span>
          </button>
        </form>
      </div>

      {/* Calculator Side Panel */}
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-5 h-fit text-slate-700">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest font-mono text-slate-400">Cotización Estimada</h3>
          <p className="text-[10px] text-slate-400">Cálculo instantáneo regulado por volumen.</p>
        </div>

        <div className="space-y-3.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Carga horaria mensual/total:</span>
            <span className="font-bold text-slate-800">{hoursPerDay * weeklyVisits * weeks} Horas Clínicas</span>
          </div>
          <div className="flex justify-between">
            <span>Tarifa base por hora arancelada:</span>
            <span className="font-bold text-slate-800">${BASE_HOURLY_RATE.toLocaleString()} ARS</span>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block mb-1">Estructura Descuentos</span>
            <div className="space-y-1.5 font-mono text-[11px]">
              {weeks >= 4 ? (
                <div className="flex justify-between text-emerald-600">
                  <span>Bonificación Duración ({weeks >= 12 ? '20%' : '10%'}):</span>
                  <span>✓ Aplicado (-${Math.round((hoursPerDay * weeklyVisits * weeks * BASE_HOURLY_RATE) * (weeks >= 12 ? 0.20 : 0.10)).toLocaleString()})</span>
                </div>
              ) : (
                <div className="flex justify-between text-slate-400">
                  <span>Bonificación mensual (4+ semanas):</span>
                  <span>No elegible (10% OFF)</span>
                </div>
              )}
              {hoursPerDay >= 12 ? (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Bonificación Intensidad (5%):</span>
                  <span>✓ Aplicado</span>
                </div>
              ) : (
                <div className="text-slate-400 flex justify-between">
                  <span>Bonificación intensidad (12+ hs diarias):</span>
                  <span>No elegible (5% OFF)</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-250 pt-3 flex justify-between items-center text-sm font-bold bg-white -mx-5 -mb-5 p-4 rounded-b-3xl">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase font-mono">Cuota Total Estimada</span>
              <span className="text-xl font-black text-teal-700">${priceQuote.toLocaleString()} ARS</span>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-[9px] bg-teal-50 text-teal-700 font-bold border border-teal-100">
              Con Coordinador S.A.
            </span>
          </div>
        </div>

        <div className="bg-white border rounded-2xl p-4 space-y-3 text-xs shadow-3xs pt-4">
          <div className="flex items-center space-x-1.5 text-slate-705 font-bold">
            <Sparkles className="h-4.5 w-4.5 text-teal-600" />
            <span>Beneficios del Contrato ATHOME</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-500 list-disc pl-4">
            <li>Asignación de enfermeros suplentes de relevo sin cargo en caso de enfermedad.</li>
            <li>Auditoría y control presencial sorpresivo quincenal por Supervisor de Enfermería.</li>
            <li>Canal prioritario de emergencias por WhatsApp y línea baja corporativa.</li>
            <li>Historial médico digital accesible con Supabase.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
