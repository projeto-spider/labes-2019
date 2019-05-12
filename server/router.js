const Router = require('koa-router')
const KoaBody = require('koa-body')
const KoaJwt = require('koa-jwt')

const errors = require('../shared/errors')
const documents = require('./controllers/documents')
const frontend = require('./controllers/frontend')
const users = require('./controllers/users')
const students = require('./controllers/students')
const auth = require('./controllers/auth')

const router = new Router()
const api = new Router({ prefix: '/api' })

api.use(KoaJwt({ secret: 'my-secret', passthrough: true }))

// Middlewares
const bodyParser = KoaBody()
const bodyParserMultipart = KoaBody({ multipart: true })

// User Routes
api.get('/users/', users.List)
api.get('/users/:id', users.Show)

// Student Routes
api.get('/students/', students.List)
api.get('/students/:id', students.Show)
api.post('/students/from-csv', KoaBody({ multipart: true }), students.FromCsv)
api.put('/students/:id', KoaBody(), students.Update)
// Documents Routes
api.get('/students/:studentId/documents', documents.List)
api.get('/students/:studentId/documents/:id', documents.Show)
api.get('/students/:studentId/documents/:id/view', documents.View)
api.post(
  '/students/:studentId/documents',
  KoaBody({ multipart: true }),
  documents.Upload
)
api.post('/students/from-csv', bodyParserMultipart, students.FromCsv)

// Auth routes
api.get('/auth', isLoggedIn, auth.Show)
api.post('/auth', bodyParser, auth.Login)

// Not Found Routes
api.all('/*', ctx => {
  ctx.status = 404
  ctx.body = { code: errors.NOT_FOUND }
})

// Connect API routes to main router
router.use(api.routes())
router.use(api.allowedMethods())

// Frontend Fallback Route
router.get('*', frontend.Render)

module.exports = router

function isLoggedIn(ctx, next) {
  const hasUser = ctx.state.user
  const hasToken = ctx.request.get('Authorization')

  if (hasToken && !hasUser) {
    ctx.status = 400
    ctx.body = {
      code: errors.INVALID_TOKEN
    }
    return
  }

  if (!hasUser) {
    ctx.status = 401
    ctx.body = {
      code: errors.UNAUTHORIZED
    }
    return
  }

  return next()
}
