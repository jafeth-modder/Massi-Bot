import fs from "fs"
import { getSettings } from "./group-settings.js"

const WARNS_FILE = "./warns.json"
const MAX_WARNS = 2
const BAD_WORDS = [
  "puto", "puta", "porno", "cp", "xno",
  "inutil", "inútil", "estupido", "estúpido",
  "idiota", "imbecil", "imbécil",
  "pendejo", "verga", "mierda", "cabron",
  "zorra", "maricon", "maricón", "perra",
  "chingar", "chingada", "coño"
]
function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function loadWarns() {
  if (!fs.existsSync(WARNS_FILE)) {
    fs.writeFileSync(WARNS_FILE, "{}")
  }
  return JSON.parse(fs.readFileSync(WARNS_FILE))
}

function saveWarns(data) {
  fs.writeFileSync(WARNS_FILE, JSON.stringify(data, null, 2))
}

function removeBadWords(text) {
  let result = text
  const normalized = normalize(text)

  for (const word of BAD_WORDS) {
    const w = normalize(word)
    const regex = new RegExp(`\\b${w}\\b`, "gi")

    if (normalized.includes(w)) {
      result = result
        .replace(regex, "")
        .replace(/\s{2,}/g, " ")
        .trim()
    }
  }

  return result
}
export async function cleanBadWords({
  sock,
  msg,
  jid,
  sender,
  isGroup,
  botIsAdmin
}) {
  if (!isGroup || !botIsAdmin) return
  const settings = getSettings(jid)
  if (!settings.antipalabras) return

  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    ""

  if (!text) return

  const cleaned = removeBadWords(text)
  if (cleaned === text) return

  const warns = loadWarns()
  if (!warns[jid]) warns[jid] = {}
  if (!warns[jid][sender]) warns[jid][sender] = 0

  warns[jid][sender]++
  const count = warns[jid][sender]

  saveWarns(warns)

  try {
    await sock.sendMessage(jid, { delete: msg.key })

    if (count >= MAX_WARNS) {
      await sock.sendMessage(jid, {
        text: `🚫 @${sender} expulsado por usar palabras prohibidas.`,
        mentions: [sender]
      })

      await sock.groupParticipantsUpdate(
        jid,
        [`${sender}@s.whatsapp.net`],
        "remove"
      )

      delete warns[jid][sender]
      saveWarns(warns)
      return
    }
    await sock.sendMessage(jid, {
      text:
        `⚠️ @${sender} lenguaje inapropiado eliminado\n` +
        `Advertencia ${count}/${MAX_WARNS}\n\n` +
        `${cleaned || " "}`,
      mentions: [sender]
    })

  } catch (e) {
    console.error("❌ Bpalabras error:", e)
  }
}
