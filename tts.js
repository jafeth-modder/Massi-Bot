import { execFile } from "child_process"
import fs from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

// ─────────────────────
// CONFIG
// ─────────────────────
const TTS_DIR = "./tts"
const VOICE = "es-la"
const SPEED = 150
const BITRATE = "48k"
const MIN_SIZE = 1000
const TIMEOUT = 12_000
const DEBUG = false

// ─────────────────────
// INIT
// ─────────────────────
if (!existsSync(TTS_DIR)) {
  await fs.mkdir(TTS_DIR, { recursive: true })
}

// ─────────────────────
// LOGGER
// ─────────────────────
const log = (...a) => DEBUG && console.log("[tts]", ...a)

// ─────────────────────
// UTILS
// ─────────────────────
const uid = (ext) =>
  path.join(TTS_DIR, `tts_${crypto.randomBytes(6).toString("hex")}.${ext}`)

const sanitize = (t) =>
  String(t)
    .replace(/\r?\n/g, " ")
    .replace(/"/g, "")
    .trim()

const validFile = async (file) => {
  try {
    const { size } = await fs.stat(file)
    return size >= MIN_SIZE
  } catch {
    return false
  }
}

// ─────────────────────
// DEPENDENCIES (1 VEZ)
// ─────────────────────
let depsChecked = false

async function checkDeps() {
  if (depsChecked) return

  const check = (bin) =>
    new Promise((r) =>
      execFile("sh", ["-c", `command -v ${bin}`], (e) => r(!e))
    )

  const [espeak, ffmpeg] = await Promise.all([
    check("espeak"),
    check("ffmpeg")
  ])

  if (!espeak || !ffmpeg) {
    throw new Error("❌ Faltan dependencias: espeak / ffmpeg")
  }

  depsChecked = true
}

// ─────────────────────
// EXEC SAFE
// ─────────────────────
const execSafe = (bin, args) =>
  new Promise((resolve, reject) => {
    execFile(bin, args, { timeout: TIMEOUT }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })

// ─────────────────────
// TEXT → VOICE
// ─────────────────────
export async function textToSpeech(text) {
  try {
    await checkDeps()

    const content = sanitize(text)
    if (!content) throw new Error("Texto vacío")

    const wav = uid("wav")
    const ogg = uid("ogg")

    // 1️⃣ ESPEAK → WAV
    await execSafe("espeak", [
      "-v", VOICE,
      "-s", String(SPEED),
      content,
      "-w", wav
    ])

    // 2️⃣ WAV → OGG OPUS (WhatsApp)
    await execSafe("ffmpeg", [
      "-y",
      "-i", wav,
      "-c:a", "libopus",
      "-b:a", BITRATE,
      "-ar", "48000",
      ogg
    ])

    await fs.unlink(wav)

    if (!(await validFile(ogg))) {
      await fs.unlink(ogg)
      throw new Error("Audio inválido")
    }

    return ogg
  } catch (e) {
    log("TTS error:", e.message)
    throw e
  }
}
