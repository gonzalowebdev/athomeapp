import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageCircle, ArrowRight, Activity, Thermometer, ShieldAlert } from 'lucide-react';
import { ChatMessage } from '../types';

export default function AiConsultantTab() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: '¡Hola! Soy tu Asistente Clínica de ATHOME ENFERMERÍA. Estoy aquí para escucharte y ayudarte a escoger el plan de asistencia o el turno de enfermería domiciliario más adecuado para tu familiar.\n\nPor favor, cuéntame: ¿Qué edad tiene el paciente? ¿De qué patología se está recuperando o qué requerimientos médicos específicos (sondas, vía intravenosa, curaciones, higiene) posee?',
      createdAt: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const quickPrompts = [
    "Paciente operado de cadera, requiere movilización segura",
    "Curación de escaras complicadas en cama",
    "Guardia continua de 12 hs diurna/nocturna",
    "Bebé recién nacido requiere sueroterapia y control"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: textToSend,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Network error calling AI consultant');
      }

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: 'msg-' + Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: data.text || 'Lamentamos el inconveniente, el asesor de ATHOME se encuentra offline temporalmente. Por favor contáctenos directamente al WhatsApp corporativo para una atención prioritaria inmediata.',
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Error connecting to AI consultant endpoint:', error);
      
      const errorMsg: ChatMessage = {
        id: 'msg-err-' + Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: '¡Disculpa las molestias! Hubo un problema al procesar la respuesta asistida por IA. Si tienes una consulta urgente sobre guardia de enfermería o curación a domicilio, por favor contáctanos al WhatsApp de ATHOME (+54 9 11 5821-4972) y un Coordinador Oficial de Guardia te dará una respuesta inmediata de tarifas.',
        createdAt: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  return (
    <div className="space-y-5 flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] animate-fade-in">
      {/* Tab Header banner */}
      <div className="flex-shrink-0 flex items-center justify-between bg-teal-50 border border-teal-100 rounded-2xl p-3.5 shadow-3xs">
        <div className="flex items-center space-x-3">
          <div className="bg-teal-600 p-2.5 rounded-xl text-white">
            <Bot className="h-5 w-5 animate-bounce text-teal-100" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center">
              Asesoría de Coordinación Médica IA &nbsp;
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-teal-600 bg-teal-100 border border-teal-200 px-1.5 py-0.2 rounded-full">Gemini Pro</span>
            </h3>
            <p className="text-[10px] text-slate-500">Haz consultas sobre servicios específicos de enfermería domiciliaria para tu cuadro.</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-1 text-[10px] font-mono font-bold bg-white text-emerald-600 px-2 py-1 rounded-lg border border-teal-100 shadow-3xs">
          <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span>SISTEMA DE ASIGNACIÓN ACTIVO</span>
        </div>
      </div>

      {/* Grid containing Quick Prompts & Chat Container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden min-h-0">
        
        {/* Left column only on Desktop: Quick Prompts guide list */}
        <div className="hidden lg:flex w-64 flex-col gap-3 flex-shrink-0">
          <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3.5">
            <div className="flex items-center space-x-1.5 text-slate-705 font-bold text-xs uppercase tracking-wider font-mono">
              <Sparkles className="h-4.5 w-4.5 text-teal-600" />
              <span>Preguntas Frecuentes</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Selecciona uno de los siguientes ejemplos preparados para simular la recomendación directa del Supervisor de Guardia:
            </p>
            <div className="flex flex-col gap-2 pt-1.5">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  id={`quick-ai-prompt-${idx}`}
                  onClick={() => handleSendMessage(q)}
                  className="p-3 bg-white hover:bg-teal-50/40 border border-slate-100 hover:border-teal-150 text-left text-xs font-semibold rounded-xl text-slate-700 transition-all hover:shadow-3xs cursor-pointer line-clamp-2"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat canvas area */}
        <div className="flex-1 flex flex-col bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs relative">
          
          {/* Message scroll container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex ${isAi ? 'justify-start' : 'justify-end'} items-start space-x-2.5 max-w-[85%] ${
                    isAi ? '' : 'ml-auto'
                  }`}
                >
                  {isAi && (
                    <div className="bg-teal-50 text-teal-700 p-2 rounded-xl flex-shrink-0 border border-teal-100/50">
                      <Bot className="h-4.5 w-4.5 text-teal-600" />
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                      isAi
                        ? 'bg-slate-50 border border-slate-100 text-slate-800'
                        : 'bg-teal-600 text-white font-medium shadow-3xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <span
                      className={`block text-[9px] mt-2 text-right ${
                        isAi ? 'text-slate-400' : 'text-teal-200'
                      }`}
                    >
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {!isAi && (
                    <div className="bg-teal-600 text-white p-2 rounded-xl flex-shrink-0 shadow-3xs">
                      <User className="h-4.5 w-4.5 text-teal-100" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start items-center space-x-2.5 max-w-[85%]">
                <div className="bg-teal-50 text-teal-700 p-2 rounded-xl flex-shrink-0 border border-teal-100/50">
                  <Bot className="h-4.5 w-4.5 text-teal-600 animate-spin" />
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 text-xs text-slate-505 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[10px] text-slate-400">Coordinadora ATHOME analizando cuadro...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick options panel only visible on mobile at top of chat footer */}
          <div className="lg:hidden flex overflow-x-auto gap-1.5 bg-slate-50 px-3.5 py-2 border-t border-slate-100 scrollbar-none">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                id={`quick-ai-prompt-mobile-${idx}`}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1 bg-white hover:bg-teal-50 border border-slate-200 text-slate-700 text-[10px] font-semibold rounded-full whitespace-nowrap transition-all flex-shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat Form Footer */}
          <form onSubmit={handleFormSubmit} className="flex-shrink-0 border-t border-slate-100 p-3 sm:p-4 bg-slate-5 w-full flex gap-2">
            <input
              type="text"
              placeholder="Hazle una pregunta clínico-comercial al Asesor Virtual..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all text-ellipsis"
            />
            <button
              id="ai-submit-message-button"
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="bg-teal-600 hover:bg-teal-700 text-white disabled:bg-slate-200 disabled:text-slate-400 p-2.5 rounded-xl transition-all shadow-md active:scale-95 flex-shrink-0 cursor-pointer flex items-center justify-center"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
