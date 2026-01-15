import fs from "fs/promises"
import { existsSync } from "fs"

// ⚙️ CONFIGURACIÓN
const CONFIG = {
  botName: "Massi V2",
  owner: "50765339275",
  image: "./menu.jpg",
  locale: "es-PA"
}

// 🧠 CACHE DE IMAGEN (NO LEER DISCO CADA VEZ)
let menuImageCache = null

// ⏱️ HORA FORMATEADA
function getTime() {
  return new Date().toLocaleTimeString(CONFIG.locale, {
    hour: "2-digit",
    minute: "2-digit"
  })
}

// 🖼️ CARGAR IMAGEN UNA SOLA VEZ
async function loadMenuImage() {
  if (menuImageCache) return menuImageCache

  if (!existsSync(CONFIG.image)) return null

  menuImageCache = await fs.readFile(CONFIG.image)
  return menuImageCache
}

// 📜 TEXTO DEL MENÚ
function buildMenu() {
  return `
╔════════════════════╗
   ✨ ${CONFIG.botName} ✨
╚════════════════════╝

👑 Owner: +${CONFIG.owner}
🕒 Hora: ${getTime()}

━━━━━━━━━━━━━━━━━━
📜 MENÚS DISPONIBLES
━━━━━━━━━━━━━━━━━━

🤖 /ai — Chat con IA
🖼️ /img — Crear imágenes
🗣️ /tts — Texto a voz
📊 /estado — Ver tu estado
🤖 /serbot — Sub-bot

━━━━━━━━━━━━━━━━━━
⚡ Rápido • Estable • Seguro
`.trim()
}

// 📤 ENVIAR MENÚ
export async function sendMenu(sock, jid) {
  const image = await loadMenuImage()

  if (!image) {
    await sock.sendMessage(jid, {
      text: "❌ No se encontró *menu.jpg*"
    })
    return
  }

  await sock.sendMessage(jid, {
    image,
    caption: buildMenu()
  })
}
