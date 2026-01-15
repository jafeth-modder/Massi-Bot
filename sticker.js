import { execFile } from "child_process"
import fs from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import crypto from "crypto"

// ─────────────────────
// CONFIG
// ─────────────────────
const TMP = "./tmp"
const SIZE = 512
const MAX_TEXT = 140
const FONT = "DejaVu-Sans-Bold"
const TIMEOUT = 12_000
const MIN_BUFFER = 1024
const DEBUG = false

// ─────────────────────
// INIT
// ─────────────────────
if (!existsSync(TMP)) {
  await fs.mkdir(TMP, { recursive: true })
}

// ─────────────────────
// LOGGER
// ─────────────────────
const log = (...a) => DEBUG && console.log("[sticker]", ...a)

// ─────────────────────
// UTILS
// ─────────────────────
const uid = (ext) =>
  path.join(TMP, `${crypto.randomBytes(8).toString("hex")}.${ext}`)

const exists = (p) => p && existsSync(p)

const safeUnlink = async (p) => {
  try {
    if (exists(p)) await fs.unlink(p)
  } catch {}
}

const cleanLater = (...files) =>
  setTimeout(() => files.forEach(safeUnlink), 5000)

const sanitizeText = (t) =>
  String(t)
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/"/g, '\\"')
    .trim()

const validBuffer = (b) =>
  Buffer.isBuffer(b) && b.length >= MIN_BUFFER

// ─────────────────────
// DEPENDENCY CHECK (1 VEZ)
// ─────────────────────
let depsChecked = false

async function checkDeps() {
  if (depsChecked) return

  const check = (bin) =>
    new Promise((r) =>
      execFile("sh", ["-c", `command -v ${bin}`], (e) => r(!e))
    )

  const [ffmpeg, convert] = await Promise.all([
    check("ffmpeg"),
    check("convert")
  ])

  if (!ffmpeg || !convert) {
    throw new Error("❌ Faltan ffmpeg o imagemagick")
  }

  depsChecked = true
}

// ─────────────────────
// EXEC SAFE (sin shell injection)
// ─────────────────────
const execSafe = (bin, args) =>
  new Promise((resolve, reject) => {
    execFile(bin, args, { timeout: TIMEOUT }, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })

// ─────────────────────
// IMAGE → STICKER
// ─────────────────────
export async function imageToSticker(imagePath) {
  try {
    await checkDeps()
    if (!exists(imagePath)) return null

    const out = uid("webp")

    await execSafe("ffmpeg", [
      "-y",
      "-i", imagePath,
      "-vf",
      `scale=${SIZE}:${SIZE}:force_original_aspect_ratio=decrease,
       pad=${SIZE}:${SIZE}:(ow-iw)/2:(oh-ih)/2:color=0x00000000,
       fps=15`,
      "-vcodec", "libwebp",
      "-preset", "default",
      "-loop", "0",
      "-an",
      out
    ])

    const buffer = await fs.readFile(out)
    if (!validBuffer(buffer)) return null

    return buffer
  } catch (e) {
    log("imageToSticker:", e.message)
    return null
  } finally {
    cleanLater(imagePath)
  }
}

// ─────────────────────
// TEXT → STICKER
// ─────────────────────
export async function textToSticker(text) {
  try {
    await checkDeps()

    if (!text || text.length > MAX_TEXT) return null

    const content = sanitizeText(text)
    if (!content) return null

    const img = uid("png")
    const out = uid("webp")

    await execSafe("convert", [
      "-size", `${SIZE}x${SIZE}`,
      "xc:none",
      "-gravity", "center",
      "-font", FONT,
      "-fill", "white",
      "-stroke", "black",
      "-strokewidth", "2",
      "-pointsize", "52",
      "-interline-spacing", "8",
      "-annotate", "0", content,
      img
    ])

    await execSafe("ffmpeg", [
      "-y",
      "-i", img,
      "-vcodec", "libwebp",
      "-preset", "default",
      "-loop", "0",
      "-an",
      out
    ])

    const buffer = await fs.readFile(out)
    if (!validBuffer(buffer)) return null

    return buffer
  } catch (e) {
    log("textToSticker:", e.message)
    return null
  } finally {
    cleanLater()
  }
}

// ─────────────────────
// AUTO
// ─────────────────────
export async function makeSticker({ imagePath, text }) {
  if (exists(imagePath)) return imageToSticker(imagePath)
  if (text) return textToSticker(text)
  return null
}

// ─────────────────────
// SEND
// ─────────────────────
export async function sendSticker(sock, jid, buffer) {
  if (!sock || !jid) return

  if (!validBuffer(buffer)) {
    return sock.sendMessage(jid, {
      text: "❌ No se pudo generar el sticker."
    })
  }

  await sock.sendMessage(jid, { sticker: buffer })
}
