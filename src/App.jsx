import { useState } from "react";
import "./App.css";

const situaciones = [
  { id: "consulta",    label: "Responder consulta de cliente", icon: "💬" },
  { id: "rutina",      label: "Armar rutina personalizada",    icon: "📋" },
  { id: "contenido",   label: "Crear contenido para redes",    icon: "📱" },
  { id: "presupuesto", label: "Redactar presupuesto",          icon: "💰" },
  { id: "motivacion",  label: "Mensaje motivacional",          icon: "🔥" },
];

const niveles   = ["Principiante", "Intermedio", "Avanzado"];
const objetivos = ["Bajar de peso", "Ganar músculo", "Mejorar resistencia", "Tonificar", "Rehabilitación"];
const edades    = ["18-25", "26-35", "36-45", "46+"];

const STEPS = ["Situación", "Detalles", "Tu prompt"];

const generarPromptLocal = ({ situacion, nivel, objetivo, edad, extra }) => {
  const ctx = [];
  if (nivel)    ctx.push(`Nivel de condición física: ${nivel}`);
  if (objetivo) ctx.push(`Objetivo principal: ${objetivo}`);
  if (edad)     ctx.push(`Rango de edad: ${edad} años`);
  if (extra)    ctx.push(`Contexto adicional: ${extra}`);

  const contextoStr = ctx.length > 0
    ? `\n\nDatos del cliente:\n${ctx.map(c => `- ${c}`).join("\n")}`
    : "";

  const templates = {
    consulta: `Actuá como un preparador físico profesional con experiencia en entrenamiento personalizado. Un cliente te hace una consulta y necesitás responderle de forma clara, empática y con fundamento técnico.${contextoStr}

Respondé la siguiente consulta del cliente: [PEGÁ ACÁ LA CONSULTA DEL CLIENTE]

Tu respuesta debe:
- Ser clara y fácil de entender, sin jerga técnica innecesaria
- Dar una recomendación concreta y accionable
- Mencionar si hay algo a ajustar según el nivel o condición del cliente
- Tener un tono profesional pero cercano
- Tener máximo 150 palabras`,

    rutina: `Actuá como un preparador físico profesional especializado en diseño de programas de entrenamiento. Creá una rutina semanal personalizada para el siguiente cliente.${contextoStr}

La rutina debe incluir:
- Nombre del plan y objetivo central
- Días de entrenamiento (especificá días de descanso)
- Para cada día: ejercicios con series, repeticiones y tiempo de descanso entre series
- Progresión sugerida para las primeras 4 semanas
- Indicaciones de calentamiento y vuelta a la calma
- Un consejo nutricional básico alineado al objetivo

Usá tablas o listas ordenadas para que sea fácil de leer en pantalla.`,

    contenido: `Actuá como un experto en marketing digital para profesionales del fitness. Creá contenido para redes sociales (Instagram y TikTok) para un preparador físico.${contextoStr}

Generá este pack de contenido:

1. Post educativo (carrusel de 5 slides): elegí un tema relevante al objetivo del cliente. Incluí título de cada slide, texto principal y caption con hashtags.
2. Reel / TikTok: guión de 30-45 segundos con hook inicial, desarrollo y llamado a la acción al final.
3. Stories interactivas: 3 ideas de stories con preguntas o encuestas para generar engagement.

Tono: cercano, motivador, con autoridad. Sin clichés del fitness.`,

    presupuesto: `Actuá como un preparador físico profesional que redacta una propuesta de servicios para un cliente potencial.${contextoStr}

Redactá un presupuesto/propuesta que incluya:
- Presentación breve (2-3 líneas de propuesta de valor)
- Descripción del plan recomendado para este cliente
- Detalle de lo que incluye el servicio (sesiones, seguimiento, comunicación, etc.)
- Cuadro de precios con 3 opciones (básico, completo, premium) — usá [PRECIO] como placeholder
- Condiciones básicas: forma de pago, política de cancelaciones y duración mínima del plan
- Cierre con llamado a la acción

Tono: profesional, confiable, orientado a resultados. Máximo una página.`,

    motivacion: `Actuá como un preparador físico que conoce bien a su cliente y quiere enviarle un mensaje motivacional personalizado.${contextoStr}

Escribí un mensaje motivacional que:
- Reconozca el punto de partida y los desafíos específicos de este cliente
- Conecte con el "por qué" real detrás de su objetivo físico
- Incluya 1 acción concreta para hoy o esta semana
- Sea auténtico, sin frases trilladas tipo "¡tú puedes!"
- Tenga entre 80 y 120 palabras
- Se pueda enviar por WhatsApp o Instagram DM`,
  };

  return templates[situacion] || "";
};

export default function App() {
  const [situacion, setSituacion] = useState(null);
  const [nivel,     setNivel]     = useState("");
  const [objetivo,  setObjetivo]  = useState("");
  const [edad,      setEdad]      = useState("");
  const [extra,     setExtra]     = useState("");
  const [resultado, setResultado] = useState("");
  const [copiado,   setCopiado]   = useState(false);
  const [step,      setStep]      = useState(1);

  const generar = () => {
    if (!situacion) return;
    setResultado(generarPromptLocal({ situacion, nivel, objetivo, edad, extra }));
    setStep(3);
  };

  const copiar = () => {
    navigator.clipboard.writeText(resultado);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const reset = () => {
    setSituacion(null);
    setNivel("");
    setObjetivo("");
    setEdad("");
    setExtra("");
    setResultado("");
    setStep(1);
  };

  return (
    <div className="app">
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="header">
        <div className="header-logo">⚡</div>
        <div>
          <p className="header-title">Chicha Labs</p>
          <p className="header-sub">Generador de prompts para preparadores físicos</p>
        </div>
      </header>

      <main className="main">

        {/* Step indicator */}
        <div className="steps">
          {STEPS.map((label, i) => (
            <div key={i} className="step-item">
              <div className={`step-dot ${step >= i + 1 ? "active" : "passive"}`}>
                {i + 1}
              </div>
              <span className={`step-label ${step >= i + 1 ? "active" : "passive"}`}>
                {label}
              </span>
              {i < 2 && (
                <div className={`step-line ${step > i + 1 ? "done" : "pending"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Situación */}
        {step === 1 && (
          <div>
            <h2 className="section-title">¿Qué necesitás hacer?</h2>
            <p className="section-sub">
              Elegí la situación y generamos el prompt perfecto para vos.
            </p>
            <div className="situation-list">
              {situaciones.map(s => (
                <button
                  key={s.id}
                  className={`situation-btn ${situacion === s.id ? "selected" : ""}`}
                  onClick={() => { setSituacion(s.id); setStep(2); }}
                >
                  <span className="situation-icon">{s.icon}</span>
                  <span className="situation-label">{s.label}</span>
                  <span className="situation-arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 — Detalles */}
        {step === 2 && (
          <div>
            <button className="back-btn" onClick={() => setStep(1)}>
              ← Volver
            </button>
            <h2 className="section-title">Contanos del cliente</h2>
            <p className="section-sub">
              Cuanto más detalle, mejor el prompt. Todo es opcional.
            </p>

            {/* Nivel */}
            <div className="field-group">
              <span className="field-label">Nivel del cliente</span>
              <div className="toggle-row">
                {niveles.map(n => (
                  <button
                    key={n}
                    className={`toggle-btn ${nivel === n ? "active" : "passive"}`}
                    onClick={() => setNivel(nivel === n ? "" : n)}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div className="field-group">
              <span className="field-label">Objetivo</span>
              <div className="chip-row">
                {objetivos.map(o => (
                  <button
                    key={o}
                    className={`chip-btn ${objetivo === o ? "active" : "passive"}`}
                    onClick={() => setObjetivo(objetivo === o ? "" : o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Edad */}
            <div className="field-group">
              <span className="field-label">Rango de edad</span>
              <div className="age-grid">
                {edades.map(e => (
                  <button
                    key={e}
                    className={`age-btn ${edad === e ? "active" : "passive"}`}
                    onClick={() => setEdad(edad === e ? "" : e)}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra */}
            <div className="field-group" style={{ marginBottom: 28 }}>
              <span className="field-label">Detalle extra (opcional)</span>
              <textarea
                className="textarea"
                value={extra}
                onChange={e => setExtra(e.target.value)}
                placeholder="Ej: tiene una lesión en la rodilla, entrena a la mañana, sin equipamiento..."
                rows={3}
              />
            </div>

            <button className="btn-primary" onClick={generar}>
              ⚡ Generar prompt
            </button>
          </div>
        )}

        {/* Step 3 — Resultado */}
        {step === 3 && resultado && (
          <div>
            <h2 className="section-title">Tu prompt está listo</h2>
            <p className="section-sub">Copialo y pegalo en Claude o ChatGPT.</p>

            <div className="result-box">
              <p className="result-text">{resultado}</p>
            </div>

            <div className="action-row">
              <button
                className={`btn-copy ${copiado ? "copied" : "default"}`}
                onClick={copiar}
              >
                {copiado ? "✓ Copiado" : "Copiar prompt"}
              </button>
              <button className="btn-reset" onClick={reset}>
                Nuevo
              </button>
            </div>

            <div className="footer-card">
              <span className="footer-icon">💡</span>
              <p className="footer-text">
                ¿Te sirvió? Seguinos en{" "}
                <a className="footer-link" href="https://www.instagram.com/chichalabs" target="_blank" rel="noopener noreferrer">Instagram</a>
                ,{" "}
                <a className="footer-link" href="https://www.tiktok.com/@chichalabs" target="_blank" rel="noopener noreferrer">TikTok</a>
                {" "}y{" "}
                <a className="footer-link" href="https://www.youtube.com/@chichalabs" target="_blank" rel="noopener noreferrer">YouTube</a>
                {" "}—{" "}
                <span className="footer-handle">@chichalabs</span>
                {" "}— para conseguir el generador de prompts de tu rubro cada semana.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
