import Router from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import serve from 'koa-static'
import { randomBytes } from 'node:crypto'
import { resolve } from 'node:path'
import { setTimeout } from 'node:timers'
import { inspect } from 'node:util'
const app = new Koa()
const router = new Router()
const serveFrontend = serve(resolve(__dirname, './frontend'))

const users = {
  alice: {
    pin: '1234',
  },
  bob: {
    pin: '5678',
  },
  carol: {
    pin: '9012',
  },
  dave: {
    pin: '345678',
  },
}
const sessions: Map<string, KeyboardMap> = new Map()
const MAX_COOKIE_AGE = 1000 * 60 * 5 // 5 minutes

// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
const fisherYates = async <T extends any[]>(array: T) => {
  const shuffledArray = [...array]
  for (let i = array.length - 1; i > 0; i--) {
    const randomElement = Math.floor(Math.random() * i)
    ;[shuffledArray[randomElement], shuffledArray[i]] = [shuffledArray[i], shuffledArray[randomElement]]
  }
  return shuffledArray
}

type KeyboardMap = [number, number][]

router.get('/', serveFrontend)

async function makeMap(): Promise<KeyboardMap> {
  const shuffledArray = await fisherYates([...Array(10).keys()])
  return shuffledArray.flatMap((_, i) => (i % 2 === 0 ? [shuffledArray.slice(i, i + 2) as [number, number]] : []))
}

router.get('/config', async (ctx) => {
  const currentSession = randomBytes(8).toString('hex')
  const expirationDate = new Date(Date.now() + MAX_COOKIE_AGE)

  sessions.set(currentSession, await makeMap())
  console.info(
    `Created session ${currentSession} with map ${inspect(sessions.get(currentSession))} expiring at ${expirationDate}`,
  )

  ctx.cookies.set('sessid', currentSession, {
    httpOnly: true,
    sameSite: 'lax',
    expires: expirationDate,
    maxAge: MAX_COOKIE_AGE,
  })

  // TTL for session
  setTimeout(() => {
    console.info('Deleting session', currentSession)
    sessions.delete(currentSession)
  }, MAX_COOKIE_AGE)

  ctx.body = { map: sessions.get(currentSession), expirationDate }
})

router.post('/api/check', async (ctx) => {
  ctx.set('Content-Type', 'application/json')
  const sessionId = ctx.cookies.get('sessid')
  console.info(`Checking session ${sessionId}`)
  if (!sessionId) {
    ctx.status = 403
    ctx.body = { error: 'Missing session' }
    return
  }

  const session = sessions.get(sessionId)
  console.info(`Session ${sessionId} is ${inspect(session)}`)
  if (!session) {
    ctx.status = 410
    ctx.body = { error: 'Session was not found or is expired' }
    return
  }

  const { possibilities } = ctx.request.body as { possibilities?: string[] }
  if (possibilities) {
    console.time('Check for Pin')
    // Get all pins from users as an array
    const validPins = Object.values(users).map((user) => user.pin)
    // Find the first pin that is in the possibilities array
    const validPin = possibilities.find((pin) => validPins.includes(pin))
    // Find the user that has the valid pin
    const user = Object.entries(users).find(([, user]) => user.pin === validPin)
    console.timeEnd('Check for Pin')

    ctx.body = { user: user ? user[0] : null }
    return
  }

  ctx.status = 422
  ctx.body = { error: 'No possibilities provided' }
})

app.use(bodyParser({ enableTypes: ['json'] }))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`)
})
