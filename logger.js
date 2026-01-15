// logger.js — Massi Logger PRO (Termux + Baileys friendly)

const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",

  gray: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
}

// ─────────────────────
// UTILS
// ─────────────────────
const now = () =>
  new Date().toLocaleTimeString("es-PA", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })

const tag = (name, color) =>
  `${color}${COLORS.bold}[${name}]${COLORS.reset}`

const user = (num = "") =>
  `${COLORS.yellow}${num}${COLORS.reset}`

const time = () =>
  `${COLORS.gray}${now()}${COLORS.reset}`

// ─────────────────────
// LOGGER API
// ─────────────────────
export const log = {
  info: (msg) =>
    console.log(`${time()} ${tag("INFO", COLORS.blue)} ${msg}`),

  success: (msg) =>
    console.log(`${time()} ${tag("OK", COLORS.green)} ${msg}`),

  warn: (msg) =>
    console.log(`${time()} ${tag("WARN", COLORS.yellow)} ${msg}`),

  error: (msg) =>
