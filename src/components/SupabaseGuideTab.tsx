import React, { useState } from 'react';
import { Database, Copy, Check, Terminal, Play, Key, Settings, Sparkles, BookOpen } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured } from '../database';

export default function SupabaseGuideTab() {
  const [copied, setCopied] = useState(false);
  const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 text-slate-700">
      {/* Tab Heading */}
      <div>
        <h2 className="font-sans font-extrabold text-xl text-slate-800 tracking-tight">Guía de Conexión de Supabase</h2>
        <p className="text-xs text-slate-550">
          Sigue esta guía paso a paso para acoplar la aplicación con tu propia base de datos de Supabase en producción.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step List columns */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border rounded-2xl p-5 shadow-3xs space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center space-x-1.5 border-b pb-3 border-slate-50">
              <BookOpen className="h-4.5 w-4.5 text-teal-600" />
              <span>Instrucciones de Setup</span>
            </h3>

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="flex gap-3">
                <span className="w-5 h-5 bg-teal-100 text-teal-700 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Crea tu Base de Datos</h4>
                  <p className="text-slate-500 mt-0.5">
                    Crea un proyecto gratis en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-teal-600 font-semibold underline">supabase.com</a>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 bg-teal-100 text-teal-700 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Ejecuta el Script SQL</h4>
                  <p className="text-slate-500 mt-0.5">
                    Dirígete a <strong>SQL Editor</strong> de tu panel Supabase, pega el script de la derecha y haz clic en <strong>RUN</strong>. Esto creará las tablas e insertará los servicios y enfermeros automáticamente.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 bg-teal-100 text-teal-700 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Obtén tus credenciales API</h4>
                  <p className="text-slate-500 mt-0.5">
                    Entra a <strong>Project Settings &rarr; API</strong> y copia el <strong>Project URL</strong> y la clave <strong>anon / public</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5 h-5 bg-teal-100 text-teal-700 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-[10px]">
                  4
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Empaqueta Variables</h4>
                  <p className="text-slate-500 mt-0.5">
                    Abre el panel de **Secrets** de Google AI Studio y agrega las siguientes variables de entorno:
                  </p>
                  <ul className="list-disc pl-4 mt-1 font-mono text-[10px] text-teal-700 font-bold space-y-0.5">
                    <li>VITE_SUPABASE_URL</li>
                    <li>VITE_SUPABASE_ANON_KEY</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Connection status card widget */}
          <div className="bg-slate-50/50 border rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono text-slate-550">Analizador Conectividad</h3>
            
            <div className="bg-white border rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                <span className="font-bold text-slate-850">
                  {isSupabaseConfigured ? 'Supabase Conectado Clínico' : 'Modo Simulador Activo'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isSupabaseConfigured 
                  ? `La aplicación se encuentra extrayendo e insertando información en tiempo real a la URL: ${supabaseUrl?.substring(0, 30)}...`
                  : 'Falta configurar credenciales. Para garantizar que tu experiencia sea 100% fluida, ATHOME ha montado un motor LocalStorage simulado de datos.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Copy SQL Schema Panel */}
        <div className="lg:col-span-2 flex flex-col space-y-3 h-full">
          <div className="bg-slate-900 text-slate-100 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-lg border border-slate-800">
            
            {/* Terminal Top bar controls */}
            <div className="flex-shrink-0 bg-slate-950 px-4 py-3 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Terminal className="h-4 w-4 text-teal-400" />
                <span className="font-mono text-xs text-slate-300 font-semibold">authome_schema_supabase.sql</span>
              </div>
              <button
                id="copy-sql-schema-button"
                onClick={handleCopySql}
                className="flex items-center space-x-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-all cursor-pointer border border-slate-700/50"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-300">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-teal-400" />
                    <span>Copiar Script</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Content code view box */}
            <div className="flex-1 overflow-auto p-4 max-h-[420px] lg:max-h-none">
              <pre className="font-mono text-xs text-teal-300 leading-relaxed overflow-x-auto text-left whitespace-pre select-all">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
