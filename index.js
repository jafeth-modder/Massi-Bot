import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys"

import pino from "pino"
import qrcode from "qrcode-terminal"

import { sendMenu } from "./menu.js"
import { makeSticker } from "./sticker.js"
import { createImage } from "./image-ai.js"
import { textToSpeech } from "./tts.js"
import { askAI } from "./chatgpt.js"

import {
  initUser,
  canUseAI,
  addMessage
} from "./chat-user.js"

import { antiLinks } from "./anti-enlaces.js"
import { cleanBadWords } from "./Bpalabras.js"

const PREFIXES = new Set(["/", ".", "!", "?"])

// 🔐 Estados por grupo
const antiLinkGroups = new Set()
const antiBadWordsGroups = new Set()

console.clear()
console.log("🚀 Massi V2 iniciando...\n")

// 🧠 Obtener texto
function getTextMessage(msg) {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    ""
  )
}

// 🆔 Obtener sender
function getSender(msg) {
  return (
    msg.key.participant ||
    msg.key.remoteJid ||
    ""
  ).replace(/@.+/, "")
}

// 👑 Admin check
async function getAdmins(sock, jid) {
  const meta = await sock.groupMetadata(jid)
  return meta.participants
    .filter(p => p.admin)
    .map(p => p.id.replace(/@.+/, ""))
}

// 🔌 Bot
async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth")
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: "silent" }),
    browser: ["MassiBot", "Chrome", "1.0"]
  })

  sock.ev.on("creds.update", saveCreds)

  sock.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      console.log("📲 Escanea el QR:")
      qrcode.generate(qr, { small: true })
    }

    if (connection === "open") {
      console.log("✅ WhatsApp conectado")
    }

    if (
      connection === "close" &&
      lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
    ) {
      console.log("🔄 Reconectando...")
      startBot()
    }
  })

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0]
      if (!msg?.message || msg.key.fromMe) return

      const jid = msg.key.remoteJid
      const sender = getSender(msg)
      const text = getTextMessage(msg).trim()
      const isGroup = jid.endsWith("@g.us")

      let senderIsAdmin = false
      let botIsAdmin = false

      if (isGroup) {
        const admins = await getAdmins(sock, jid)
        senderIsAdmin = admins.includes(sender)
        botIsAdmin = admins.includes(
          sock.user.id.replace(/@.+/, "")
        )
      }

      // 🛡️ ANTI LINKS (ANTES de comandos)
      if (antiLinkGroups.has(jid)) {
        await antiLinks({
          sock,
          msg,
          jid,
          sender,
          isGroup,
          botIsAdmin,
          senderIsAdmin
        })
      }

      // 🚫 ANTI PALABRAS
      if (antiBadWordsGroups.has(jid)) {
        await cleanBadWords({
          sock,
          msg,
          jid,
          sender,
          isGroup,
          botIsAdmin
        })
      }

      if (!text) return

      const prefix = [...PREFIXES].find(p => text.startsWith(p))
      if (!prefix) return

      const [command, ...args] = text
        .slice(prefix.length)
        .trim()
        .split(/\s+/)

      const content = args.join(" ")

      await initUser(sender)

      const commands = {
        menu: () => sendMenu(sock, jid, sender),

        ai: async () => {
          if (!content) return
          if (!canUseAI(sender)) return
          const reply = await askAI(content)
          await addMessage(sender)
          await sock.sendMessage(jid, { text: reply })
        },

        img: async () => {
          if (!content) return
          const img = await createImage(content)
          if (img?.buffer) {
            await sock.sendMessage(jid, { image: img.buffer })
          }
        },

        tts: async () => {
          if (!content) return
          const audio = await textToSpeech(content)
          await sock.sendMessage(jid, {
            audio: { url: audio },
            mimetype: "audio/ogg; codecs=opus",
            ptt: true
          })
        },

        s: () => makeSticker({ sock, msg, text: content }),
        sticker: () => makeSticker({ sock, msg, text: content }),

        // 🔗 AntiLink
        antilink: async () => {
          if (!isGroup || !senderIsAdmin) return
          if (antiLinkGroups.has(jid)) {
            antiLinkGroups.delete(jid)
            await sock.sendMessage(jid, { text: "❌ Anti-Link desactivado" })
          } else {
            antiLinkGroups.add(jid)
            await sock.sendMessage(jid, { text: "✅ Anti-Link activado" })
          }
        },

        // 🚫 AntiPalabras
        antipalabras: async () => {
          if (!isGroup || !senderIsAdmin) return
          if (antiBadWordsGroups.has(jid)) {
            antiBadWordsGroups.delete(jid)
            await sock.sendMessage(jid, { text: "❌ Anti-Palabras desactivado" })
          } else {
            antiBadWordsGroups.add(jid)
            await sock.sendMessage(jid, { text: "✅ Anti-Palabras activado" })
          }
        }
      }

      if (commands[command]) {
        await commands[command]()
      }

    } catch (err) {
      console.error("❌ Error:", err)
    }
  })
}

startBot()