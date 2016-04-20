import { RUNNING, NOT_RUNNING, ALREADY_STARTED, LAUNCH_SUCCESS, LAUNCH_FAILED } from './log'
import * as portfile from './port'
import launchDaemon from './launch'
import fetch from 'node-fetch'
import net from 'net'

let port
let host

function readPort() {
  port = portfile.read()
  host = `http://localhost:${port}`
}

readPort()

function check() {
  return new Promise(resolve => {
    if (!port) return resolve(false)
    const socket = net.connect(port, () => {
      socket.end()
      resolve(true)
    })
    socket.on('error', () => resolve(false))
  })
}

function get(url) {
  return fetch(url).then(res => res.text())
}

function post(url, body) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.text())
}

export async function connect(options) {
  const running = await check()
  if (!running) {
    const isRunning = await launchDaemon()
    readPort()
    if (!isRunning) return LAUNCH_FAILED
  }
  return post(`${host}/connect`, options)
}

export async function lsInstance() {
  const running = await check()
  if (!running) return NOT_RUNNING
  return get(`${host}/ls-instance`)
}

export async function select(instance) {
  const running = await check()
  if (!running) return NOT_RUNNING
  return post(`${host}/select`, { instance })
}

export async function action(obj) {
  const running = await check()
  if (!running) return NOT_RUNNING
  return post(`${host}/action`, obj)
}

export async function start() {
  const running = await check()
  if (running) return ALREADY_STARTED

  const isRunning = await launchDaemon()
  readPort()
  if (!isRunning) return LAUNCH_FAILED
  return LAUNCH_SUCCESS
}

export async function restart() {
  const running = await check()
  if (!running) return NOT_RUNNING

  portfile.unlink()
  const isRunning = await launchDaemon()
  readPort()
  if (!isRunning) return LAUNCH_FAILED
  return LAUNCH_SUCCESS
}

export async function stop() {
  const running = await check()
  if (!running) return NOT_RUNNING
  return post(`${host}/stop`)
}

export async function status() {
  const running = await check()
  if (!running) return NOT_RUNNING
  return RUNNING
}
