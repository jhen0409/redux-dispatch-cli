import net from 'net'
import { spawn } from 'child_process'
import * as portfile from './port'

// Check server is available
function check() {
  return new Promise(resolve => {
    const port = portfile.read()
    if (!port) return resolve(false)
    const socket = net.connect(port, () => {
      socket.end()
      resolve(true)
    })
    socket.on('error', () => resolve(false))
  })
}

const delay = t => new Promise(resolve => setTimeout(resolve, t))

async function wait() {
  let running = false
  let total = 0
  await delay(500)
  while (!running) {
    running = await check()
    if (running) return true

    await delay(100)
    total += 100
    if (total >= 5E3) return false
  }
}

export default () => {
  const daemon = require.resolve('./daemon')
  spawn('node', [daemon], {
    detached: true,
    stdio: ['ignore', 'ignore', 'ignore'],
  }).unref()
  return wait()
}
