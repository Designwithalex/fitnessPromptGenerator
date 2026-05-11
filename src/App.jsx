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

export default function App() {
  const [situacion, setSituacion] = useState(null);
  const [nivel, setNivel] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [edad, setEdad] = useState("");
  const [extra, setExtra] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [step, setStep] = useState(1);

  const buildSystemPrompt = () => {
    return `Sos un experto en crear prompts para preparadores físicos que quieren usar IA en su trabajo diario.
Generás prompts claros, específicos y listos para usar en Claude o ChatGPT.
El prompt que generás debe estar en español rioplatense, ser directo, y producir resultados profesionales cuando se lo pegue a la IA.
Respondé SOLO con el prompt generado, sin explicaciones, sin comillas al inicio o final, sin preamble.`;
  };

  const buildUserPrompt = () => {
    const sit = situaciones.find(s => s.id === situacion);
    return `Generá un prompt listo para usar en Claude o ChatGPT para un preparador físico que necesita: ${sit?.label}.

Datos del cliente/contexto:
- Nivel: ${nivel || "no especificado"}
- Objetivo: ${objetivo || "no especificado"}
- Rango de edad: ${edad || "no especificado"}
- Detalle adicional: ${extra || "ninguno"}

El prompt debe:
1. Pedirle a la IA que actúe como preparador físico profesional
2. Incluir todos los datos del cliente como contexto
3. Especificar el formato de respuesta esperado
4. Ser directo y producir resultado usable de inmediato

Devolvé SOLO el prompt, listo para copiar y pegar.`;
  };

  const generar = async () => {
    if (!situacion) return;
    setLoading(true);
    setResultado("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [{ role: "user", content: buildUserPrompt() }],
        }),
      });
      const data = await response.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setResultado(text);
      setStep(3);
    } catch (e) {
      setResultado("Hubo un error generando el prompt. Intentá de nuevo.");
    }
    setLoading(false);
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
          <p style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>IA para Todos</p>
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
                  lineHeight: 1.6,
                }}
              />
            </div>

            <button onClick={generar} disabled={loading} style={{
              width: "100%", padding: "16px",
              background: loading ? "#111" : "linear-gradient(135deg, #00e5a0, #00b8d4)",
              border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer",
              color: loading ? "#555" : "#000", fontSize: 15, fontWeight: 600,
              fontFamily: "inherit", transition: "all 0.2s",
            }}>
              {loading ? "Generando prompt..." : "⚡ Generar prompt"}
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
                ¿Te sirvió? Seguí <span style={{ color: "#00e5a0" }}>@iáparatodos</span> para conseguir el generador de prompts de tu rubro cada semana.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
