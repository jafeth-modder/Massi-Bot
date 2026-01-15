
const MAX_WARNS = 5
const warns = new Map() const LINK_REGEX =
  /(https?:\/\/\S+|www\.\S+|wa\.me\/\S+|chat\.whatsapp\.com\/\S+|t\.me\/\S+|youtube\.com\/\S+|discord\.gg\/\S+|bit\.ly\/\S+|([a-z0-9-]+\.)+(com|net|org|info|xyz|io|me|es|mx|co|ar|pe|cl|br|uy|ve|tv|gg|to))/i
const BLACKLIST = [
  "xnxx",
  "xvideos",
  "pornhub",
  "redtube",
  "onlyfans",
  "xxx",
  "sex",
  "hentai"
] function addWarn(jid, user) {
  const key = `${jid}:${user}`
  const count = (warns.get(key) || 0) + 1
  warns.set(key, count)
  return count
}

function resetWarn(jid, user) {
  warns.delete(`${jid}:${user}`)
}
export async function antiLinks({
  sock,
  msg,
  jid,
  sender,
  isGroup,
  botIsAdmin,
  senderIsAdmin
}) {
  if (!isGroup) return
  if (!botIsAdmin) return
  if (senderIsAdmin) return
  if (!msg?.message) return

  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    ""

  if (!text) return

  const lower = text.toLowerCase()

  const hasLink = LINK_REGEX.test(lower)
  const hasBlacklisted = BLACKLIST.some(w => lower.includes(w))

  if (!hasLink && !hasBlacklisted) return

  const warn = addWarn(jid, sender)

  try {
    await sock.sendMessage(jid, { delete: msg.key })
    await sock.sendMessage(jid, {
      text:
        `🚫 *Enlaces no permitidos*\n` +
        `👤 @${sender}\n` +
        `⚠️ Advertencia: *${warn}/${MAX_WARNS}*\n\n` +
        (warn >= MAX_WARNS
          ? "⛔ Límite alcanzado. Serás eliminado."
          : "❗ Evita enviar enlaces."),
      mentions: [sender]
    })
    if (warn >= MAX_WARNS) {
      await sock.groupParticipantsUpdate(
        jid,
        [sender + "@s.whatsapp.net"],
        "remove"
      )
      resetWarn(jid, sender)
    }

  } catch (e) {
    console.error("❌ AntiLinks error:", e)
  }
}
