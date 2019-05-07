const Koa = require('koa')
const consola = require('consola')
const router = require('./router')

const app = new Koa()

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.use((ctx, next) => {
  return next().catch(err => {
    console.error(err) // eslint-disable-line
    ctx.status = 500
    ctx.body = 'Internal Server Error'
  })
})

app.use(router.routes())
app.use(router.allowedMethods())

const server = app.listen(port, host)

consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true
})

module.exports = server
