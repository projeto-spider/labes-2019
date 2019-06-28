const Router = require('koa-router')
const KoaBody = require('koa-body')
const KoaJwt = require('koa-jwt')

const errors = require('../shared/errors')
const documents = require('./controllers/documents')
const frontend = require('./controllers/frontend')
const users = require('./controllers/users')
const students = require('./controllers/students')
const subjects = require('./controllers/subjects')
const auth = require('./controllers/auth')
const solicitations = require('./controllers/solicitations')
const pendencies = require('./controllers/pendencies')
const defenses = require('./controllers/defenses')

const router = new Router()
const api = new Router({ prefix: '/api' })

api.use(KoaJwt({ getToken, secret: 'my-secret', passthrough: true }))

// Middlewares
const bodyJson = KoaBody()
const bodyMultipart = KoaBody({ multipart: true })

// Authorization
api.use(['/users', '/students'], isLoggedIn, isAdmin)
api.use(['/defenses'], isLoggedIn)

// User Routes
api.get('/users/', users.List)
api.get('/users/:id', users.Show)
api.post('/users/', bodyJson, users.Create)

// Student Routes
api.get('/students/email-changes', students.EmailChanges)
api.get('/students/actives-mailing-list', students.ActiveMailList)
api.get('/students/', students.List)
api.get('/students/:id', students.Show)
api.post('/students/from-csv', bodyMultipart, students.FromCsv)
api.put(
  '/students/update-academic-highlight',
  bodyJson,
  students.UpdateAcademicHighlight
)
api.put('/students/:id', bodyJson, students.Update)

// Documents Routes
api.get('/students/:studentId/documents', documents.List)
api.get('/students/:studentId/documents/:id', documents.Show)
api.del('/students/:studentId/documents/:id', documents.Delete)
api.get('/students/:studentId/documents/:id/view', documents.View)
api.post('/students/update-mailing-list', bodyJson, students.UpdateMailingList)
api.post('/students/:studentId/documents', bodyMultipart, documents.Upload)
api.post('/students/from-csv', bodyMultipart, students.FromCsv)

// Pendencies Routes
api.get('/students/:studentId/pendencies/:id', pendencies.Show)
api.get('/students/:studentId/pendencies/', pendencies.List)
api.post(
  '/students/:studentId/pendencies/batch',
  bodyJson,
  pendencies.FromBatch
)

// Subjects Routes
api.get('/subjects/', subjects.List)
api.get('/subjects/:id', subjects.Show)
api.post('/subjects/', bodyJson, subjects.Create)
api.put('/subjects/:id', bodyJson, subjects.Update)
api.del('/subjects/:id', subjects.Destroy)
// Defenses Routes
api.get('/defenses/', isAdminOrTeacher, defenses.List)
api.post('/defenses/', isTeacher, bodyJson, defenses.Create)
api.put('/defenses/:id', isAdmin, bodyJson, defenses.Update)

// Auth routes
api.get('/auth', isLoggedIn, auth.Show)
api.post('/auth', bodyJson, auth.Login)

// Solicitation routes
api.post('/solicitations/', bodyJson, solicitations.Create)

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

function getToken(ctx) {
  return ctx.request.query.token
}

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

function isAdmin(ctx, next) {
  return checkRole(ctx, next, 'admin')
}

function isTeacher(ctx, next) {
  return checkRole(ctx, next, 'teacher')
}

function isAdminOrTeacher(ctx, next) {
  return checkRole(ctx, next, ['admin', 'teacher'])
}

function checkRole(ctx, next, role) {
  const { user } = ctx.state.user

  const hasRole = Array.isArray(role)
    ? role.includes(user.role)
    : user.role === role

  if (!hasRole) {
    ctx.status = 403
    ctx.body = { code: errors.FORBIDDEN }
    return
  }

  return next()
}
