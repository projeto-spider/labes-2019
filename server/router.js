const Router = require('koa-router')
const KoaBody = require('koa-body')
const KoaJwt = require('koa-jwt')

const errors = require('../shared/errors')
const config = require('./config')
const documents = require('./controllers/documents')
const frontend = require('./controllers/frontend')
const users = require('./controllers/users')
const students = require('./controllers/students')
const subjects = require('./controllers/subjects')
const auth = require('./controllers/auth')
const solicitations = require('./controllers/solicitations')
const pendencies = require('./controllers/pendencies')
const defenses = require('./controllers/defenses')
const settings = require('./controllers/settings')

const router = new Router()
const api = new Router({ prefix: '/api' })

api.use(KoaJwt({ getToken, secret: config.JWT_SECRET, passthrough: true }))

// Middlewares
const bodyJson = KoaBody()
const bodyMultipart = KoaBody({ multipart: true })

// Authorization
api.use(['/students'], isLoggedIn)
api.use(['/defenses'], isLoggedIn)
api.use(['/settings'], isLoggedIn, isAdmin)

// User Routes
api.get('/users/', isLoggedIn, isAdmin, users.List)
api.get('/users/:id', isLoggedIn, isAdmin, users.Show)
api.post('/users/', isLoggedIn, isAdmin, bodyJson, users.Create)
api.put('/users/:id', isLoggedIn, bodyJson, users.Update)

// Student Routes
api.get('/students/email-changes', isAdmin, students.EmailChanges)
api.get('/students/actives-mailing-list', isAdmin, students.ActiveMailList)
api.get('/students/', isAdminOrTeacher, students.List)
api.get('/students/:id', isAdmin, students.Show)
api.get(
  '/students/:id/concluding-certificate',
  isAdmin,
  students.ConcludingCertificate
)
api.post('/students/from-csv', isAdmin, bodyMultipart, students.FromCsv)
api.put(
  '/students/update-academic-highlight',
  bodyJson,
  students.UpdateAcademicHighlight
)
api.put('/students/:id', isAdmin, bodyJson, students.Update)
api.post(
  '/students/update-mailing-list',
  isAdmin,
  bodyJson,
  students.UpdateMailingList
)
api.post('/students/from-csv', isAdmin, bodyMultipart, students.FromCsv)

// Documents Routes
api.get('/students/:studentId/documents', isAdmin, documents.List)
api.get('/students/:studentId/documents/:id', isAdmin, documents.Show)
api.del('/students/:studentId/documents/:id', isAdmin, documents.Delete)
api.get('/students/:studentId/documents/:id/view', isAdmin, documents.View)
api.post(
  '/students/:studentId/documents',
  isAdmin,
  bodyMultipart,
  documents.Upload
)

// Pendencies Routes
api.get('/students/:studentId/pendencies/:id', isAdmin, pendencies.Show)
api.get('/students/:studentId/pendencies/', isAdmin, pendencies.List)
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
api.get('/defenses/:id', isAdmin, bodyJson, defenses.Show)
api.get('/defenses/:id/pdf/', isAdmin, defenses.TccGenerate)
api.get('/defenses/:id/pdf/:files', isAdmin, defenses.TccGenerate)
api.post('/defenses/', isTeacher, bodyJson, defenses.Create)
api.put('/defenses/:id', isAdmin, bodyJson, defenses.Update)
api.del('/defenses/:id', isAdmin, defenses.Delete)

// Auth routes
api.get('/auth', isLoggedIn, auth.Show)
api.post('/auth', bodyJson, auth.Login)

// Solicitation routes
api.post('/solicitations/', bodyJson, solicitations.Create)

// Settings routes
api.get('/settings/', settings.List)
api.get('/settings/:key', settings.Show)
api.put('/settings/:key', bodyJson, settings.Update)

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
