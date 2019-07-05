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
jest.setTimeout(10000)

describe('/api/solicitations', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['solicitations'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('POST /', async done => {
    const payload = {
      name: 'Person',
      email: 'person.ufpa@example.com',
      registrationNumber: '201904940001',
      type: 'concluding',
      course: 'cbcc',
      admissionType: 'psufpa'
    }
    const res = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .send(payload)

    expect(res.status).toBe(201)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(payload.name)
    expect(res.body.email).toBe(payload.email)
    expect(res.body.registrationNumber).toBe(payload.registrationNumber)
    expect(res.body.type).toBe(payload.type)
    expect(res.body.course).toBe(payload.course)
    expect(res.body.admissionType).toBe(payload.admissionType)

    const payload2 = {
      name: 'Person',
      email: 'person@example.com',
      type: 'freshman',
      course: 'cbsi',
      admissionType: 'sisu'
    }
    const res2 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .send(payload2)

    expect(res2.status).toBe(201)
    expect(res2.type).toBe('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body.name).toBe(payload2.name)
    expect(res2.body.email).toBe(payload2.email)
    expect(res2.body.type).toBe(payload2.type)
    expect(res2.body.course).toBe(payload2.course)
    expect(res2.body.admissionType).toBe(payload2.admissionType)
    done()
  })

  test('POST / with missing fields', async done => {
    const payload1 = {
      email: 'person.ufpa@example.com',
      registrationNumber: '201904940001',
      course: 'cbcc',
      admissionType: 'psufpa'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .send(payload1)

    expect(res1.status).toBe(400)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.INVALID_REQUEST)

    const payload2 = {
      name: 'Person',
      registrationNumber: '201804940001',
      type: 'concluding',
      course: 'cbcc',
      admissionType: 'psufpa'
    }
    const res2 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .send(payload2)

    expect(res2.status).toBe(400)
    expect(res2.type).toBe('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body.code).toBe(errors.INVALID_REQUEST)
    done()
  })

  test('POST / with duplicate email', async done => {
    const payload1 = {
      name: 'Victor Silva Machado',
      email: 'victorsilva@example.com',
      registrationNumber: '201904940012',
      type: 'concluding',
      course: 'cbcc',
      admissionType: 'psufpa'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .send(payload1)

    expect(res1.status).toBe(422)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.UNPROCESSABLE_ENTITY)
    done()
  })

  test('POST / invalid registration number', async done => {
    const payload1 = {
      name: 'Victor Silva Machado',
      email: 'victor.silva@example.com',
      registrationNumber: '2019049400012',
      type: 'freshman',
      course: 'cbcc',
      admissionType: 'psufpa'
    }
    const res1 = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .send(payload1)

    expect(res1.status).toBe(422)
    expect(res1.type).toBe('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.code).toBe(errors.UNPROCESSABLE_ENTITY)
    done()
  })

  test('POST /', async done => {
    const payload = {
      name: 'Person',
      email: 'person@gmail.com',
      registrationNumber: '201904940001',
      course: 'cbcc',
      admissionType: 'psufpa'
    }
    const res = await chai
      .request(server.listen())
      .post('/api/solicitations')
      .send(payload)

    expect(res.status).toBe(400)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.INVALID_REQUEST)
    done()
  })

  test('POST /?invalid=1 invalid param/body', async done => {
    {
      const payload = {
        name: 'Person',
        email: 'person.ufpa@example.com',
        registrationNumber: '201904940001',
        type: 'concluding',
        course: 'cbcc',
        admissionType: 'psufpa'
      }
      const res = await chai
        .request(server.listen())
        .post('/api/solicitations')
        .query({ invalid: 1 })
        .send(payload)
      expect(res.status).toBe(400)
      expect(res.type).toBe('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_QUERY)
      expect(res.body.invalidParams.length).toEqual(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    {
      const payload = {
        invalid: 1,
        name: 'Person',
        email: 'person.ufpa@example.com',
        registrationNumber: '201904940001',
        type: 'concluding',
        course: 'cbcc',
        admissionType: 'psufpa'
      }
      const res = await chai
        .request(server.listen())
        .post('/api/solicitations')
        .send(payload)

      expect(res.status).toBe(400)
      expect(res.type).toBe('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_BODY)
      expect(res.body.invalidParams.length).toEqual(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    done()
  })
})
