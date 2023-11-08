import Router from '@koa/router'
import Koa from 'koa'
import serve from 'koa-static'
import bodyParser from 'koa-bodyparser'
import { resolve } from 'path'
const app = new Koa()
const router = new Router()
const serveFrontend = serve(resolve(__dirname, './frontend'))

const users = {
  alice: {
    pin: '1234'
  },
  bob: {
    pin: '5678'
  },
  carol: {
    pin: '9012'
  },
  dave: {
    pin: '345678'
  }
}

router.get('/', serveFrontend)

router.post('/api/check', async (ctx) => {
  ctx.set('Content-Type', 'application/json')
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

    ctx.body = JSON.stringify({ user: user ? user[0] : null })
    return
  }

  ctx.status = 422
  ctx.body = JSON.stringify({ error: 'No possibilities provided' })
})

app.use(bodyParser({ enableTypes: ['json'] }))
app.use(router.routes())
app.use(router.allowedMethods())
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`)
})
