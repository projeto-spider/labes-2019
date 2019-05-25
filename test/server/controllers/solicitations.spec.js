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

describe('/api/solicitations', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  test('POST /', async done => {
    const { token } = await testUtils.user('admin')
    const payload = {
      reason: 'Reason',
      name: 'Person',
      email: 'person.ufpa@example.com',
      registrationNumber: '201904940001'
    }
    const res = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(res.status).toBe(201)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.reason).toBe(payload.reason)
    expect(res.body.name).toBe(payload.name)
    expect(res.body.email).toBe(payload.email)
    expect(res.body.registrationNumber).toBe(payload.registrationNumber)
    done()
  })

  test('POST / with missing fields', async done => {
    const { token } = await testUtils.user('admin')
    const payload1 = {
      reason: 'Reason',
      email: 'person.ufpa@example.com',
      registrationNumber: '201904940001'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload1)

    expect(res1.status).toBe(400)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.INVALID_REQUEST)

    const payload2 = {
      name: 'Person',
      email: 'person.ufpa@example.com',
      registrationNumber: '201904940001'
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

  test('POST / with duplicate email', async done => {
    const { token } = await testUtils.user('admin')
    const payload1 = {
      reason: 'Example Reason',
      name: 'Victor Silva Machado',
      email: 'victorsilva@example.com',
      registrationNumber: '201904940012'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload1)

    expect(res1.status).toBe(422)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.UNPROCESSABLE_ENTITY)
    done()
  })
  test('POST / invalid registration number', async done => {
    const { token } = await testUtils.user('admin')
    const payload1 = {
      reason: 'Example Reason',
      name: 'Victor Silva Machado',
      email: 'victor.silva@example.com',
      registrationNumber: '2019049400012'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .set('Authorization', `Bearer ${token}`)
      .send(payload1)

    expect(res1.status).toBe(422)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.UNPROCESSABLE_ENTITY)
    done()
  })
})
