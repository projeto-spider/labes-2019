const Router = require('koa-router')

const frontend = require('./controllers/frontend')
const users = require('./controllers/users')

const router = new Router()
const api = new Router({ prefix: '/api' })

// User Routes
api.get('/users/', users.List)
api.get('/users/:id', users.Show)

// Connect API routes to main router
router.use(api.routes())
router.use(api.allowedMethods())

// Frontend Fallback Route
router.get('*', frontend.Render)

module.exports = router
