const { Nuxt, Builder } = require('nuxt')

// Import and Set Nuxt.js options
const config = require('../../../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

// Instantiate nuxt.js
const nuxt = new Nuxt(config)

// Build in development
const preparations = config.dev ? new Builder(nuxt).build() : nuxt.ready()

module.exports = async function frontendRender(ctx) {
  await preparations

  ctx.status = 200
  ctx.respond = false // Bypass Koa's built-in response handling
  ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
  nuxt.render(ctx.req, ctx.res)
}
