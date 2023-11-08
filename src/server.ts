import Router from '@koa/router'
import Koa from 'koa'
import serve from 'koa-static'
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
  ctx.body = {
    message: 'Hello World!'
  }
})

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`)
})
