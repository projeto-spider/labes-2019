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
describe('/api/subjects', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users', 'subjects'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('POST /subjects', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/subjects/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'UNDERWATER PROGRAMMING'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.name).toEqual('UNDERWATER PROGRAMMING')
    done()
  })

  test('POST /subjects duplicated', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/subjects/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ALGORITMOS'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(422)
    done()
  })

  test('DELETE /subjects', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .del('/api/subjects/1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body).toEqual({})
    done()
  })

  test('GET /subjects', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/subjects/')
      .query({ page: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body[1].id).toEqual(2)
    expect(res.body[1].name).toEqual('CALCULO COMPUTACIONAL I')
    done()
  })

  test('GET /subjects/1', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/subjects/1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('ALGEBRA LINEAR PARA COMPUTACAO')
    done()
  })

  test('PUT /subjects/1', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .put('/api/subjects/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'SEIZE THE MEANS OF PRODUCTION'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.id).toEqual(1)
    expect(res.body.name).toEqual('SEIZE THE MEANS OF PRODUCTION')
    done()
  })

  test('PUT /subjects/1 duplicated name', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .put('/api/subjects/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ALGORITMOS'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(422)
    done()
  })

  test('GET /subjects?paginate=false ALL SUBJECTS', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/subjects')
      .query({ paginate: false })
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.length).toEqual(96)
    expect(res.body[0].name).toEqual('ALGEBRA LINEAR PARA COMPUTACAO')
    expect(res.body[95].name).toEqual(
      '(ELETIVA) DISCIPLINA ELETIVA - SISTEMAS DE INFORMACAO'
    )
    done()
  })

  test('GET /subjects/1?invalid=1 invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/subjects/1')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(400)
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_QUERY)
    expect(res.body.invalidParams.length).toEqual(1)
    expect(res.body.invalidParams).toContainEqual('invalid')
    done()
  })

  test('GET /subjects?invalid=1 invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/subjects/')
      .query({ page: 1, invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(400)
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_QUERY)
    expect(res.body.invalidParams.length).toEqual(1)
    expect(res.body.invalidParams).toContainEqual('invalid')
    done()
  })
  test('POST /subjects?invalid=1 invalid query/body', async done => {
    const { token } = await testUtils.user('admin')
    {
      const res = await chai
        .request(server.listen())
        .post('/api/subjects/')
        .query({ invalid2: 2, invalid1: 1 })
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'UNDERWATER PROGRAMMING'
        })
      expect(res.body).toBeDefined()
      expect(res.type).toEqual('application/json')
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      expect(res.body.code).toBe(errors.INVALID_QUERY)
      expect(res.body.invalidParams.length).toBe(2)
      expect(res.body.invalidParams).toContainEqual('invalid1')
    }
    {
      const res = await chai
        .request(server.listen())
        .post('/api/subjects/')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'UNDERWATER PROGRAMMING',
          invalid1: 1
        })
      expect(res.body).toBeDefined()
      expect(res.type).toEqual('application/json')
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      expect(res.body.code).toBe(errors.INVALID_BODY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalid1')
    }
    done()
  })

  test('PUT /subjects/1?invalid=1 invalid query/body', async done => {
    const { token } = await testUtils.user('admin')
    {
      const res = await chai
        .request(server.listen())
        .put('/api/subjects/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'SEIZE THE MEANS OF PRODUCTION',
          invalid1: 1,
          invalid2: 2
        })
      expect(res.body).toBeDefined()
      expect(res.type).toEqual('application/json')
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_BODY)
      expect(res.body.invalidParams.length).toEqual(2)
      expect(res.body.invalidParams).toContainEqual('invalid2')
      expect(res.body.invalidParams).toContainEqual('invalid1')
    }
    {
      const res = await chai
        .request(server.listen())
        .put('/api/subjects/1')
        .query({ invalid1: 1, invalid2: 2 })
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'SEIZE THE MEANS OF PRODUCTION'
        })
      expect(res.body).toBeDefined()
      expect(res.type).toEqual('application/json')
      expect(res.status).toEqual(400)
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_QUERY)
      expect(res.body.invalidParams.length).toEqual(2)
      expect(res.body.invalidParams).toContainEqual('invalid2')
      expect(res.body.invalidParams).toContainEqual('invalid1')
    }
    done()
  })
})
