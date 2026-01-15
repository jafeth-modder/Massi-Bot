import fs from "fs"

const FILE = "./group-settings.json"

function load() {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "{}")
  return JSON.parse(fs.readFileSync(FILE))
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2))
}

export function getSettings(jid) {
  const data = load()
  return data[jid] || {
    antilink: false,
    antipalabras: true
  }
}

export function setSetting(jid, key, value) {
  const data = load()
  if (!data[jid]) data[jid] = {}
  data[jid][key] = value
  save(data)
}
