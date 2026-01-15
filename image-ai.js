import fs from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

// ─────────────────────
// CONFIG
// ─────────────────────
const HF_API_KEY = "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"
const MODEL = "black-forest-labs/FLUX.1-schnell"

const IMAGE_DIR = "./tmp"
const MIN_SIZE = 10_000
const TIMEOUT = 20_000
const MAX_PROMPT = 500

// ─────────────────────
// INIT
// ─────────────────────
if (!existsSync(IMAGE_DIR)) {
  await fs.mkdir(IMAGE_DIR, { recursive: true })
}

// ─────────────────────
// UTILS
// ─────────────────────
const uid = () =>
  `img_${crypto.randomBytes(6).toString("hex")}.png`

const validPrompt = (p) =>
  typeof p === "string" &&
  p.trim().length > 0 &&
  p.length <= MAX_PROMPT

const validBuffer = (b) =>
  Buffer.isBuffer(b) && b.length >= MIN_SIZE

const cleanLater = (file) =>
  setTimeout(() => fs.unlink(file).catch(() => {}), 60_000)

// ─────────────────────
// FETCH CON TIMEOUT
// ─────────────────────
async function fetchWithTimeout(url, opts) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    return await fetch(url, {
      ...opts,
      signal: controller.signal
    })
  } finally {
    clearTimeout(id)
  }
}

// ─────────────────────
// IMAGE GENERATOR
// ─────────────────────
export async function createImage(prompt) {
  try {
    if (!validPrompt(prompt)) {
      return { error: "❌ Prompt inválido o muy largo." }
    }

    const res = await fetchWithTimeout(
      `https://router.huggingface.co/hf-inference/models/${MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt.trim() })
      }
    )

    if (!res.ok) {
      const err = await res.text()
      return { error: `❌ HuggingFace:\n${err.slice(0, 500)}` }
    }

    const buffer = Buffer.from(await res.arrayBuffer())
    if (!validBuffer(buffer)) {
      return { error: "❌ Imagen inválida generada" }
    }

    const file = uid()
    const filePath = path.join(IMAGE_DIR, file)

    await fs.writeFile(filePath, buffer)
    cleanLater(filePath)

    return { buffer, path: filePath }
  } catch (e) {
    if (e.name === "AbortError") {
      return { error: "⏱️ Tiempo de espera agotado" }
    }

    console.error("[image-ai]", e.message)
    return { error: "❌ Error interno generando imagen" }
  }
}
