import fs from 'fs'
import path from 'path'
import watch from 'node-watch'

const homeEnv = process.platform === 'win32' ? 'USERPROFILE' : 'HOME'
const portFile = path.join(process.env[homeEnv], '.remotedev_d_port')
let isWatching = false

export function write(port) {
  fs.writeFileSync(portFile, String(port))
}

export function read() {
  if (!fs.existsSync(portFile)) return null
  return Number(fs.readFileSync(portFile, 'utf8'))
}

export function unlink() {
  if (fs.existsSync(portFile)) {
    fs.unlinkSync(portFile)
  }
}

export function watchExists() {
  if (isWatching) return
  isWatching = true
  watch(portFile, file => {
    if (!fs.existsSync(file)) {
      process.exit()
    }
  })
}