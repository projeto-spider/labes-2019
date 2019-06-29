const Koa = require('koa')
const consola = require('consola')
const router = require('./router')
const errorHandler = require('./error-handler')
const config = require('./config')

const app = new Koa()

const host = config.HOST
const port = config.PORT

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
