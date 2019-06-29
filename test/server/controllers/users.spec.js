/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const useSeeds = require('../../use-seeds')
const server = require('../../../server')
const db = require('../../../server/db')
const errors = require('../../../shared/errors')

jest.useFakeTimers()

describe('/api/users', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('GET /', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.headers['pagination-page']).toEqual('1')
    done()
  })

  test('GET /:id', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/users/1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body.id).toBeDefined()
    done()
  })

  test('POST /', async done => {
    const { token } = await testUtils.user('admin')
    const payload = {
      username: 'person',
      password: 'person',
      email: 'person@example.com',
      role: 'admin'
    }
    const res = await chai
      .request(server.listen())
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(res.status).toBe(201)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.username).toBe(payload.username)
    expect(res.body.email).toBe(payload.email)
    expect(res.body.role).toBe(payload.role)
    done()
  })

  test('POST / with missing fields', async done => {
    const { token } = await testUtils.user('admin')
    const payload1 = {
      username: 'person',
      password: 'person',
      role: 'admin'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(payload1)

    expect(res1.status).toBe(400)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.INVALID_REQUEST)

    const payload2 = {
      password: 'person',
      email: 'person@example.com',
      role: 'admin'
    }
    const res2 = await chai
      .request(server.listen())
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(payload2)

    expect(res2.status).toBe(400)
    expect(res2.type).toBe('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body.code).toBe(errors.INVALID_REQUEST)
    done()
  })

  test('POST / with duplicate username or email', async done => {
    const { token } = await testUtils.user('admin')
    const payload1 = {
      username: 'admin',
      password: 'person',
      email: 'person@example.com',
      role: 'admin'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(payload1)

    expect(res1.status).toBe(422)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.UNPROCESSABLE_ENTITY)

    const payload2 = {
      username: 'person',
      password: 'person',
      email: 'admin@domain.com',
      role: 'admin'
    }
    const res2 = await chai
      .request(server.listen())
      .post('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .send(payload2)

    expect(res2.status).toBe(422)
    expect(res2.type).toBe('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body.code).toBe(errors.UNPROCESSABLE_ENTITY)
    done()
  })
})
