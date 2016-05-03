import Koa from 'koa'
import body from 'koa-bodyparser'
import logger from 'koa-logger'
import Router from 'koa-router'
import * as portfile from './port'
import { NO_CONNECTION, NOT_FOUND_INSTANCE, NOT_SELECT_INSTANCE, NO_TYPE } from './log'
import {
  createRemoteStore,
  updateStoreInstance,
  enableSync,
} from 'remotedev-app/lib/store/createRemoteStore'

let selectedInstance
let instances
let store
let shouldSync

const app = new Koa()
app.use(logger())
app.use(body())

const router = new Router()
const haveConnection = async (ctx, next) => {
  if (!store) {
    ctx.body = NO_CONNECTION
    return
  }
  await next()
}

router.post('/connect', async ctx => {
  const { hostname, port, secure } = ctx.request.body
  selectedInstance = 'auto'
  instances = {}
  shouldSync = false
  store = createRemoteStore({
    hostname,
    port,
    secure,
    autoReconnect: true,
    autoReconnectOptions: {
      delay: 3E3,
      randomness: 1E3,
    },
  }, (instance, name, toRemove) => {
    if (toRemove) {
      delete instances[instance]
      store.liftedStore.deleteInstance(instance)
      if (selectedInstance === instance) {
        selectedInstance = 'auto'
        updateStoreInstance('auto')
        shouldSync = false
        return
      }
    } else {
      instances[instance] = name || instance
    }
  }, selectedInstance)
  ctx.body = ''
})

router.get('/ls-instance', haveConnection, async ctx => {
  let output = 'Name\t\tInstanceKey\n'
  Object.keys(instances).forEach(key => {
    const selected = selectedInstance === key
    output += `${instances[key]}\t\t${key}` + (selected ? '\t(Selected)' : '')
    output += '\n'
  })
  output += `\nShould sync: ${shouldSync ? 'Yes' : 'No'}`
  ctx.body = output
})

router.post('/select', haveConnection, async ctx => {
  const { instance } = ctx.request.body
  if (Object.keys(instances).concat('auto').indexOf(instance) === -1) {
    ctx.body = NOT_FOUND_INSTANCE
    return
  }
  updateStoreInstance(instance || 'auto')
  selectedInstance = instance || 'auto'
  shouldSync = false
  ctx.body = ''
})

router.post('/sync', haveConnection, async ctx => {
  if (selectedInstance !== 'auto') {
    shouldSync = true
    enableSync(shouldSync)
    ctx.body = ''
    return
  }
  ctx.body = NOT_SELECT_INSTANCE
})

router.post('/action', haveConnection, async ctx => {
  const { type } = ctx.request.body
  if (!type || typeof type !== 'string') {
    ctx.body = NO_TYPE
    return
  }
  store.dispatch(ctx.request.body)
  ctx.body = ''
})

router.post('/stop', () => process.exit())

app.use(router.routes())
app.use(router.allowedMethods())

portfile.unlink()
setTimeout(() => {
  const port = app.listen(0).address().port
  console.log(`[Daemon] listening port ${port}`)
  console.log('[Daemon] Will save port to `$HOME/.remotedev_d_port` file')
  portfile.write(port)
  portfile.watchExists()
}, 500)

process.on('exit', () => portfile.unlink())
process.on('SIGTERM', process.exit)
process.on('SIGINT', process.exit)
