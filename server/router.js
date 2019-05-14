const Router = require('koa-router')
const KoaBody = require('koa-body')

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

// Documents Routes
api.get('/documents/:studentID', documents.Show)

// Connect API routes to main router
router.use(api.routes())
router.use(api.allowedMethods())

// Frontend Fallback Route
router.get('*', frontend.Render)

module.exports = router
