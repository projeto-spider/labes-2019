/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const server = require('../../../server')
const db = require('../../../server/db')
const errors = require('../../../shared/errors')

jest.useFakeTimers()

describe('/api/users', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  test('GET /', async done => {
    const { user, token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/auth')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.username).toEqual(user.get('username'))
    done()
  })

  test('GET /?token=x', async done => {
    const { user, token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/auth')
      .query({ token })
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.username).toEqual(user.get('username'))
    done()
  })

  test('GET / without credentials', async done => {
    const res = await chai.request(server.listen()).get('/api/auth')
    expect(res.status).toEqual(401)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.UNAUTHORIZED)
    done()
  })

  test('GET / invalid token', async done => {
    const res = await chai
      .request(server.listen())
      .get('/api/auth')
      .set('Authorization', `Bearer asdasdasdad`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_TOKEN)
    done()
  })

  test('GET / with expired token', async done => {
    const exp = 1
    const { token } = await testUtils.user('admin', exp)
    const res = await chai
      .request(server.listen())
      .get('/api/auth')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_TOKEN)
    done()
  })

  test('POST /', async done => {
    const payload = {
      username: 'admin',
      password: 'admin'
    }
    const res = await chai
      .request(server.listen())
      .post('/api/auth')
      .send(payload)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.token).toBeDefined()
    expect(res.body.user.username).toEqual(payload.username)
    done()
  })

  test('POST / invalid username', async done => {
    const payload = {
      username: 'invalid',
      password: 'admin'
    }
    const res = await chai
      .request(server.listen())
      .post('/api/auth')
      .send(payload)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_CREDENTIALS)
    done()
  })

  test('POST / invalid password', async done => {
    const payload = {
      username: 'admin',
      password: 'invalid'
    }
    const res = await chai
      .request(server.listen())
      .post('/api/auth')
      .send(payload)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_CREDENTIALS)
    done()
  })
})