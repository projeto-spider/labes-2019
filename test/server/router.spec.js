/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const db = require('../../server/db')
const useSeeds = require('../use-seeds')
const server = require('../../server')
const errors = require('../../shared/errors')
const testUtils = require('./test-utils')

jest.useFakeTimers()

describe('/api', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users', 'students'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('GET /', async done => {
    const res = await chai.request(server.listen()).get('/api/')
    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')
    expect(res.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  test('GET /invalid', async done => {
    const res = await chai.request(server.listen()).get('/api/invalid')
    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')
    expect(res.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  test('GET /[students|users]', async done => {
    const { token } = await testUtils.user('admin')
    const resStudents = await chai
      .request(server.listen())
      .get('/api/students')
      .set('Authorization', `Bearer ${token}`)
    expect(resStudents.status).toEqual(200)
    expect(resStudents.type).toEqual('application/json')
    expect(resStudents.body).toBeDefined()
    expect(resStudents.body.code).not.toBe(errors.NOT_FOUND_ROUTE)

    const resUsers = await chai
      .request(server.listen())
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
    expect(resUsers.status).toEqual(200)
    expect(resUsers.type).toEqual('application/json')
    expect(resUsers.body).toBeDefined()
    expect(resStudents.body.code).not.toBe(errors.NOT_FOUND_ROUTE)
    done()
  })

  test('GET /[students|users] unauthorized', async done => {
    const resStudents = await chai.request(server.listen()).get('/api/students')
    expect(resStudents.status).toEqual(401)
    expect(resStudents.type).toEqual('application/json')
    expect(resStudents.body).toBeDefined()
    expect(resStudents.body.code).toBe(errors.UNAUTHORIZED)

    const resUsers = await chai.request(server.listen()).get('/api/users')
    expect(resUsers.status).toEqual(401)
    expect(resUsers.type).toEqual('application/json')
    expect(resUsers.body).toBeDefined()
    expect(resStudents.body.code).toBe(errors.UNAUTHORIZED)
    done()
  })

  test('GET /[students|users] with invalid role', async done => {
    const { token } = await testUtils.user('teacher')
    const resStudents = await chai
      .request(server.listen())
      .get('/api/students')
      .set('Authorization', `Bearer ${token}`)
    expect(resStudents.status).toEqual(403)
    expect(resStudents.type).toEqual('application/json')
    expect(resStudents.body).toBeDefined()
    expect(resStudents.body.code).toBe(errors.FORBIDDEN)

    const resUsers = await chai
      .request(server.listen())
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
    expect(resUsers.status).toEqual(403)
    expect(resUsers.type).toEqual('application/json')
    expect(resUsers.body).toBeDefined()
    expect(resStudents.body.code).toBe(errors.FORBIDDEN)
    done()
  })
})
