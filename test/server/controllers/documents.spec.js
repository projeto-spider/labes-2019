/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../../../server')
const db = require('../../../server/db')
const errors = require('../../../shared/errors')

jest.useFakeTimers()

describe('/api/documents', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  test('GET /students/:studentID/documents', async done => {
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/documents')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.every(document => document.studentID === 1)).toBeTruthy()
    done()
  })

  test('GET /students/:invalid/documents', async done => {
    const resChar = await chai
      .request(server.listen())
      .get('/api/students/aaaa/documents')
    expect(resChar.status).toEqual(400)
    expect(resChar.type).toEqual('application/json')
    expect(resChar.body).toBeDefined()
    expect(resChar.body.code).toEqual(errors.INVALID_PARAMS)
    const resId = await chai
      .request(server.listen())
      .get('/api/students/10000/documents')
    expect(resId.status).toEqual(400)
    expect(resId.type).toEqual('application/json')
    expect(resId.body).toBeDefined()
    expect(resId.body.code).toEqual(errors.INVALID_PARAMS)
    done()
  })
})
