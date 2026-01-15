// ❌ NO importar node-fetch
// Node 18+ ya trae fetch nativo

const API_KEY =
  process.env.OPENAI_API_KEY ||
  "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"

// ─────────────────────
// CONFIG
// ─────────────────────
const MODEL = "gpt-4o-mini"
const MAX_TOKENS = 300
const TEMPERATURE = 0.7
const TIMEOUT = 20_000
const MAX_PROMPT = 2_000

// ─────────────────────
// FETCH CON TIMEOUT
// ─────────────────────
async function fetchWithTimeout(url, options) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    })
  } finally {
    clearTimeout(id)
  }
}

// ─────────────────────
// VALIDACIÓN
// ─────────────────────
function sanitizePrompt(text) {
  if (typeof text !== "string") return ""
  return text.trim().slice(0, MAX_PROMPT)
}

// ─────────────────────
// ASK AI
// ─────────────────────
export async function askAI(prompt) {
  if (!API_KEY || API_KEY.startsWith("COPIA")) {
    return "❌ API no configurada"
  }

  const content = sanitizePrompt(prompt)
  if (!content) {
    return "❌ Escribe algo para preguntar"
  }

  try {
    const res = await fetchWithTimeout(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "Eres un asistente útil, claro y conciso para WhatsApp."
            },
            { role: "user", content }
          ],
          max_tokens: MAX_TOKENS,
          temperature: TEMPERATURE
        })
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("❌ OpenAI error:", data)
      return "❌ Error al responder con la IA"
    }

    return (
      data?.choices?.[0]?.message?.content?.trim() ||
      "❌ Sin respuesta de la IA"
    )

  } catch (err) {
    if (err.name === "AbortError") {
      return "⏱️ La IA tardó demasiado en responder"
    }

    console.error("❌ Error IA:", err.message)
    return "❌ Error interno de la IA"
  }
}
