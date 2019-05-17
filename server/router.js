const Router = require('koa-router')
const KoaBody = require('koa-body')

const errors = require('../shared/errors')
const documents = require('./controllers/documents')
const frontend = require('./controllers/frontend')
const users = require('./controllers/users')
const students = require('./controllers/students')

const router = new Router()
const api = new Router({ prefix: '/api' })

// User Routes
api.get('/users/', users.List)
api.get('/users/:id', users.Show)

// Student Routes
api.get('/students/', students.List)
api.get('/students/:id', students.Show)
api.post('/students/from-csv', KoaBody({ multipart: true }), students.FromCsv)
api.put('/students/:id', KoaBody({ multipart: true }), students.Update)

// Not Found Routes
api.all('/*', ctx => {
  ctx.status = 404
  ctx.body = { code: errors.NOT_FOUND_ROUTE }
})
// Documents Routes
api.get('/documents/:studentID', documents.Show)
// Documents Routes
api.get('/students/:studentId/documents', documents.List)
api.get('/students/:studentId/documents/:id', documents.Show)
api.get('/students/:studentId/documents/:id/view', documents.View)
api.post(
  '/students/:studentId/documents',
  KoaBody({ multipart: true }),
  documents.Upload
)

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
