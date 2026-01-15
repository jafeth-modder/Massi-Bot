import fs from "fs"

const DB_FILE = "./users.json"

// 👑 OWNER
export const OWNER = "50765339275"

// 📊 PLANES
const PLANS = {
  free: {
    messages: 70,
    images: 2
  },
  premium: {
    messages: 150,
    images: 20
  },
  vip: {
    messages: Infinity,
    images: 40
  }
}

// 📥 Cargar DB
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({}, null, 2))
  }
  return JSON.parse(fs.readFileSync(DB_FILE))
}
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}
export function initUser(sender) {
  const id = sender.replace(/@.+/, "")
  const db = loadDB()

  if (id === OWNER) {
    db[id] = {
      plan: "vip",
      messages: 0,
      images: 0
    }
    saveDB(db)
    return
  }

  if (!db[id]) {
    db[id] = {
      plan: "free",
      messages: 0,
      images: 0
    }
    saveDB(db)
  }
}
export function canUseAI(sender) {
  const id = sender.replace(/@.+/, "")
  if (id === OWNER) return true

  const db = loadDB()
  const user = db[id]
  if (!user) return false

  const limit = PLANS[user.plan]?.messages ?? 0
  return user.messages < limit
}

// ➕ Sumar mensaje IA
export function addMessage(sender) {
  const id = sender.replace(/@.+/, "")
  if (id === OWNER) return

  const db = loadDB()
  if (!db[id]) return

  db[id].messages++
  saveDB(db)
}

// 🖼️ ¿Puede generar imagen?
export function canUseImage(sender) {
  const id = sender.replace(/@.+/, "")
  if (id === OWNER) return true

  const db = loadDB()
  const user = db[id]
  if (!user) return false

  const limit = PLANS[user.plan]?.images ?? 0
  return user.images < limit
}

// ➕ Sumar imagen
export function addImage(sender) {
  const id = sender.replace(/@.+/, "")
  if (id === OWNER) return

  const db = loadDB()
  if (!db[id]) return

  db[id].images++
  saveDB(db)
}

// 📊 Estado del usuario
export function getUserStatus(sender) {
  const id = sender.replace(/@.+/, "")
  const db = loadDB()

  if (id === OWNER) {
    return {
      plan: "vip",
      messages: "∞",
      images: "∞"
    }
  }

  const user = db[id] || {
    plan: "free",
    messages: 0,
    images: 0
  }

  const limits = PLANS[user.plan]

  return {
    plan: user.plan,
    messages: `${user.messages}/${limits.messages}`,
    images: `${user.images}/${limits.images}`
  }
}

