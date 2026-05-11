import { useState } from "react";

const situaciones = [
  { id: "consulta", label: "Responder consulta de cliente", icon: "💬" },
  { id: "rutina", label: "Armar rutina personalizada", icon: "📋" },
  { id: "contenido", label: "Crear contenido para redes", icon: "📱" },
  { id: "presupuesto", label: "Redactar presupuesto", icon: "💰" },
  { id: "motivacion", label: "Mensaje motivacional", icon: "🔥" },
];

const niveles = ["Principiante", "Intermedio", "Avanzado"];
const objetivos = ["Bajar de peso", "Ganar músculo", "Mejorar resistencia", "Tonificar", "Rehabilitación"];
const edades = ["18-25", "26-35", "36-45", "46+"];

const generarPromptLocal = ({ situacion, nivel, objetivo, edad, extra }) => {
  const ctx = [];
  if (nivel) ctx.push(`Nivel de condición física: ${nivel}`);
  if (objetivo) ctx.push(`Objetivo principal: ${objetivo}`);
  if (edad) ctx.push(`Rango de edad: ${edad} años`);
  if (extra) ctx.push(`Contexto adicional: ${extra}`);

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
  const [nivel, setNivel] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [edad, setEdad] = useState("");
  const [extra, setExtra] = useState("");
  const [resultado, setResultado] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [step, setStep] = useState(1);

  const generar = () => {
    if (!situacion) return;
    const prompt = generarPromptLocal({ situacion, nivel, objetivo, edad, extra });
    setResultado(prompt);
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
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      padding: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        width: "100%",
        borderBottom: "1px solid #1e1e1e",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        background: "#0a0a0a",
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "linear-gradient(135deg, #00e5a0, #00b8d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16,
        }}>⚡</div>
        <div>
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>Chicha Labs</p>
          <p style={{ color: "#555", fontSize: 11, margin: 0 }}>Generador de prompts para preparadores físicos</p>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: 560, padding: "32px 24px" }}>

        {/* Steps indicator */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, alignItems: "center" }}>
          {["Situación", "Detalles", "Tu prompt"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flex: i < 2 ? "1" : "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                opacity: step >= i + 1 ? 1 : 0.35,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: step >= i + 1 ? "linear-gradient(135deg, #00e5a0, #00b8d4)" : "#1e1e1e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 600, color: step >= i + 1 ? "#000" : "#555",
                  flexShrink: 0,
                }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: step >= i + 1 ? "#ddd" : "#444", whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 1, background: step > i + 1 ? "#00e5a0" : "#1e1e1e", transition: "background 0.3s" }} />}
            </div>
          ))}
        </div>

        {/* STEP 1 — Situacion */}
        {step === 1 && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
              ¿Qué necesitás hacer?
            </h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 24 }}>
              Elegí la situación y generamos el prompt perfecto para vos.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {situaciones.map(s => (
                <button key={s.id} onClick={() => { setSituacion(s.id); setStep(2); }} style={{
                  background: situacion === s.id ? "#0d1f1a" : "#111",
                  border: situacion === s.id ? "1px solid #00e5a0" : "1px solid #1e1e1e",
                  borderRadius: 10, padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: 12,
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}>
                  <span style={{ fontSize: 20 }}>{s.icon}</span>
                  <span style={{ color: "#ddd", fontSize: 14, fontWeight: 400 }}>{s.label}</span>
                  <span style={{ marginLeft: "auto", color: "#333", fontSize: 16 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Detalles */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} style={{
              background: "none", border: "none", color: "#555", fontSize: 13,
              cursor: "pointer", padding: 0, marginBottom: 20, display: "flex", alignItems: "center", gap: 4,
            }}>← Volver</button>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
              Contanos del cliente
            </h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 24 }}>
              Cuanto más detalle, mejor el prompt. Todo es opcional.
            </p>

            {/* Nivel */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "#888", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Nivel del cliente</p>
              <div style={{ display: "flex", gap: 8 }}>
                {niveles.map(n => (
                  <button key={n} onClick={() => setNivel(nivel === n ? "" : n)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 13,
                    background: nivel === n ? "#0d1f1a" : "#111",
                    border: nivel === n ? "1px solid #00e5a0" : "1px solid #1e1e1e",
                    color: nivel === n ? "#00e5a0" : "#666", transition: "all 0.15s",
                  }}>{n}</button>
                ))}
              </div>
            </div>

            {/* Objetivo */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "#888", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Objetivo</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {objetivos.map(o => (
                  <button key={o} onClick={() => setObjetivo(objetivo === o ? "" : o)} style={{
                    padding: "8px 14px", borderRadius: 20, cursor: "pointer", fontSize: 13,
                    background: objetivo === o ? "#0d1f1a" : "#111",
                    border: objetivo === o ? "1px solid #00e5a0" : "1px solid #1e1e1e",
                    color: objetivo === o ? "#00e5a0" : "#666", transition: "all 0.15s",
                  }}>{o}</button>
                ))}
              </div>
            </div>

            {/* Edad */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "#888", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Rango de edad</p>
              <div style={{ display: "flex", gap: 8 }}>
                {edades.map(e => (
                  <button key={e} onClick={() => setEdad(edad === e ? "" : e)} style={{
                    flex: 1, padding: "10px 0", borderRadius: 8, cursor: "pointer", fontSize: 13,
                    background: edad === e ? "#0d1f1a" : "#111",
                    border: edad === e ? "1px solid #00e5a0" : "1px solid #1e1e1e",
                    color: edad === e ? "#00e5a0" : "#666", transition: "all 0.15s",
                  }}>{e}</button>
                ))}
              </div>
            </div>

            {/* Extra */}
            <div style={{ marginBottom: 28 }}>
              <p style={{ color: "#888", fontSize: 12, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Detalle extra (opcional)</p>
              <textarea
                value={extra}
                onChange={e => setExtra(e.target.value)}
                placeholder="Ej: tiene una lesión en la rodilla, entrena a la mañana, sin equipamiento..."
                rows={3}
                style={{
                  width: "100%", background: "#111", border: "1px solid #1e1e1e",
                  borderRadius: 10, padding: "12px 14px", color: "#ddd", fontSize: 13,
                  resize: "none", outline: "none", fontFamily: "inherit",
                  lineHeight: 1.6, boxSizing: "border-box",
                }}
              />
            </div>

            <button onClick={generar} style={{
              width: "100%", padding: "16px",
              background: "linear-gradient(135deg, #00e5a0, #00b8d4)",
              border: "none", borderRadius: 10, cursor: "pointer",
              color: "#000", fontSize: 15, fontWeight: 600,
              fontFamily: "inherit", transition: "all 0.2s",
            }}>
              ⚡ Generar prompt
            </button>
          </div>
        )}

        {/* STEP 3 — Resultado */}
        {step === 3 && resultado && (
          <div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 500, marginBottom: 6 }}>
              Tu prompt está listo
            </h2>
            <p style={{ color: "#555", fontSize: 14, marginBottom: 20 }}>
              Copialo y pegalo en Claude o ChatGPT.
            </p>

            <div style={{
              background: "#0d0d0d", border: "1px solid #1e1e1e",
              borderRadius: 12, padding: "20px", marginBottom: 16,
              position: "relative",
            }}>
              <p style={{
                color: "#ccc", fontSize: 13, lineHeight: 1.8,
                fontFamily: "'DM Mono', monospace", margin: 0, whiteSpace: "pre-wrap",
              }}>{resultado}</p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={copiar} style={{
                flex: 2, padding: "14px",
                background: copiado ? "#0d1f1a" : "linear-gradient(135deg, #00e5a0, #00b8d4)",
                border: copiado ? "1px solid #00e5a0" : "none",
                borderRadius: 10, cursor: "pointer",
                color: copiado ? "#00e5a0" : "#000", fontSize: 14, fontWeight: 600,
                fontFamily: "inherit", transition: "all 0.2s",
              }}>
                {copiado ? "✓ Copiado" : "Copiar prompt"}
              </button>
              <button onClick={reset} style={{
                flex: 1, padding: "14px",
                background: "#111", border: "1px solid #1e1e1e",
                borderRadius: 10, cursor: "pointer",
                color: "#666", fontSize: 14, fontFamily: "inherit",
              }}>
                Nuevo
              </button>
            </div>

            <div style={{
              marginTop: 24, padding: "16px", background: "#0d0d0d",
              border: "1px solid #1a1a1a", borderRadius: 10,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <p style={{ color: "#555", fontSize: 12, lineHeight: 1.6, margin: 0 }}>
                ¿Te sirvió? Seguinos en{" "}
                <a href="https://www.instagram.com/chichalabs" target="_blank" rel="noopener noreferrer" style={{ color: "#00e5a0", textDecoration: "none" }}>Instagram</a>
                ,{" "}
                <a href="https://www.tiktok.com/@chichalabs" target="_blank" rel="noopener noreferrer" style={{ color: "#00e5a0", textDecoration: "none" }}>TikTok</a>
                {" "}y{" "}
                <a href="https://www.youtube.com/@chichalabs" target="_blank" rel="noopener noreferrer" style={{ color: "#00e5a0", textDecoration: "none" }}>YouTube</a>
                {" "}— <span style={{ color: "#444" }}>@chichalabs</span> — para conseguir el generador de prompts de tu rubro cada semana.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
