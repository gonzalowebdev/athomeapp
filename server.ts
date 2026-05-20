import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Enable JSON parsing
app.use(express.json());

// Initialize Gemini API client on server-side
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
} else {
  console.warn('GEMINI_API_KEY environment variable is not defined. AI Assistant will operate in fallback mode.');
}

// API endpoint for AI Nursing Consultant
app.post('/api/consultant', async (req, res) => {
  const { messages, patientDetails } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Falta historial de mensajes (messages) válido' });
  }

  // Fallback if AI isn't configured
  if (!ai) {
    // Generate a comforting mock nursing recommendation response
    const lastUserMessage = messages[messages.length - 1]?.text || '';
    let mockResponse = '¡Hola! Soy tu Asesor Virtual de ATHOME ENFERMERÍA. Veo que nos consultas acerca de cuidados médicos a domicilio. ';
    
    if (lastUserMessage.toLowerCase().includes('operado') || lastUserMessage.toLowerCase().includes('cadera') || lastUserMessage.toLowerCase().includes('cirugía')) {
      mockResponse += 'Para pacientes en etapa post-operatoria aguda (como reemplazo de cadera u otra cirugía mayor), recomendamos fuertemente nuestro "Guardia de Enfermería de 12 hs" o "24 hs" durante los primeros 7 a 14 días. Esto asegura una movilización segura asistida, control exhaustivo del dolor endotraqueal o venoso, y previene eventos tromboembólicos mediante ejercicios pasivos.';
    } else if (lastUserMessage.toLowerCase().includes('inyección') || lastUserMessage.toLowerCase().includes('suero') || lastUserMessage.toLowerCase().includes('vía')) {
      mockResponse += 'Para la aplicación de inyecciones, colocación de vías o hidratación con suero intravenoso, contamos con nuestro servicio presencial puntual "Colocación de Vía Periférica" y "Aplicación de Inyección Intramuscular". Puedes reservarlos seleccionando el día y la hora exacta y un profesional matriculado acudirá a tu domicilio para el procedimiento.';
    } else if (lastUserMessage.toLowerCase().includes('escaras') || lastUserMessage.toLowerCase().includes('herida') || lastUserMessage.toLowerCase().includes('curación')) {
      mockResponse += 'Las lesiones de piel como úlceras por decúbito (escaras) requieren de material de cura avanzada y desbridamiento profesional. Nuestro servicio "Curación Compleja de Heridas / Escaras" incluye la higiene aséptica y colocación de parches regenerativos para acelerar la cicatrización.';
    } else {
      mockResponse += 'Para brindarte el mejor asesoramiento, por favor detalles si el paciente posee alguna patología de base, si está postrado, o si requiere de control de aparatos complejos. Contamos con Guardias continuas de 8 hs, 12 hs, y 24 hs, al igual que visitas de Higiene y Confort diario.';
    }
    
    return res.json({ 
      text: mockResponse + '\n\n*(Nota: Esta respuesta fue generada localmente en modo sin conexión a la API de Gemini)*' 
    });
  }

  try {
    // Format patient profile context if provided
    let contextPrompt = 'Eres un Coordinador y Supervisor de Enfermería de la empresa "ATHOME ENFERMERIA". Tu objetivo es asesorar a familiares de pacientes postrados, de la tercera edad o recién operados sobre qué servicios de enfermería les conviene contratar.\n';
    contextPrompt += 'Los servicios oficiales de ATHOME son:\n';
    contextPrompt += '1. Guardia de Enfermería de 8 hs ($36.000) - Cuidado de mediano rango.\n';
    contextPrompt += '2. Guardia de Enfermería de 12 hs ($52.000) - Turno diurno o nocturno completo.\n';
    contextPrompt += '3. Guardia Primaria de 24 hs ($98.000) - Cobertura ininterrumpida de alta complejidad.\n';
    contextPrompt += '4. Higiene y Confort en Cama ($15.000) - Visita puntual para aseo integral.\n';
    contextPrompt += '5. Curación Compleja ($18.000) - Parches avanzados, post-quirúrgicos y escaras.\n';
    contextPrompt += '6. Colocación de Vía y Sueroterapia ($14.000) - Medicación intravenosa.\n';
    contextPrompt += '7. Aplicación de Inyección ($6.000) - Intramuscular o subcutánea puntual.\n';
    contextPrompt += '8. Control de Signos Vitales y Parámetros ($8.000) - Medición de presión, glucemia, informe capilar.\n\n';
    
    if (patientDetails) {
      contextPrompt += `Información actual del paciente:\n`;
      contextPrompt += `- Nombre: ${patientDetails.name || 'No especificado'}\n`;
      contextPrompt += `- Diagnóstico / Condición general: ${patientDetails.condition || 'No especificada'}\n`;
      if (patientDetails.hoursPerDay) contextPrompt += `- Necesidad horaria estimada: ${patientDetails.hoursPerDay} hs diarias.\n`;
    }

    contextPrompt += '\nResponde de forma sumamente profesional, empática, y tranquilizadora. Haz hincapié en que todos los enfermeros de ATHOME son matriculados y supervisados. Recomienda el servicio exacto de la lista que más se adecúe al caso del paciente y explica por qué. Evita diagnósticos médicos directos, siempre deriva a la supervisión médica de ATHOME pero ofrece la solución inmediata de cuidado.';

    // Construct Chat contents
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Generate output with gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: contextPrompt,
        temperature: 0.7,
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error generating response via Gemini:', error);
    return res.status(500).json({ error: 'Error del consultor de Inteligencia Artificial', details: error.message });
  }
});

// Configure Vite or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development mode: Inject Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted on Express app.');
  } else {
    // Production mode: Serve built static files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log(`Static file server enabled for production path: ${distPath}`);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ATHOME ENFERMERÍA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
