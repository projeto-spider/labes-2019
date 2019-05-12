const Koa = require('koa')
const consola = require('consola')
const router = require('./router')
const errorHandler = require('./error-handler')

const app = new Koa()

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

app.use(errorHandler)

app.use(router.routes())
app.use(router.allowedMethods())

if (!module.parent) {
  app.listen(port, host)
}

consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true
})

module.exports = app
