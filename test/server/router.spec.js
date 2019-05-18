/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const db = require('../../server/db')
const server = require('../../server')
const errors = require('../../shared/errors')

jest.useFakeTimers()

describe('/api', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
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
    const resStudents = await chai.request(server.listen()).get('/api/students')
    expect(resStudents.status).toEqual(200)
    expect(resStudents.type).toEqual('application/json')
    expect(resStudents.body).toBeDefined()
    expect(resStudents.body).not.toBe(errors.NOT_FOUND)
    const resUsers = await chai.request(server.listen()).get('/api/users')
    expect(resUsers.status).toEqual(200)
    expect(resUsers.type).toEqual('application/json')
    expect(resUsers.body).toBeDefined()
    expect(resUsers.body).not.toBe(errors.NOT_FOUND)
    done()
  })
})
