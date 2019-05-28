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
describe('/api/subjects', () => {
  beforeEach(async () => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
  }, 100000)

  test('POST /subjects', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/subjects/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'UNDERWATER PROGRAMMING',
        code: 'UN52301'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(201)
    expect(res.body.id).toBeDefined()
    expect(res.body.name).toEqual('UNDERWATER PROGRAMMING')
    expect(res.body.code).toEqual('UN52301')
    done()
  })

  test('POST /subjects with duplicate code', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/subjects/')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'UNDERWATER PROGRAMMING',
        code: 'EN01209'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(422)
    expect(res.body.prop).toEqual('code')
    expect(res.body.code).toEqual(errors.UNPROCESSABLE_ENTITY)
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
      .get('/api/subjects/?page=1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body[1].id).toEqual(2)
    expect(res.body[1].name).toEqual('CALCULO COMPUTACIONAL I')
    expect(res.body[1].code).toEqual('EN01209')
    done()
  })

  test('GET /subjects', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/subjects/1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('ALGEBRA LINEAR PARA COMPUTACAO')
    expect(res.body.code).toEqual('EN01208')
    done()
  })

  test('PUT /subjects', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .put('/api/subjects/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'SEIZE THE MEANS OF PRODUCTION',
        code: 'AA09099'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.id).toEqual(1)
    expect(res.body.name).toEqual('SEIZE THE MEANS OF PRODUCTION')
    expect(res.body.code).toEqual('AA09099')
    done()
  })

  test('PUT /subjects with duplicate code', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .put('/api/subjects/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'SEIZE THE MEANS OF PRODUCTION',
        code: 'EN01209'
      })
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(422)
    expect(res.body.prop).toEqual('code')
    expect(res.body.code).toEqual(errors.UNPROCESSABLE_ENTITY)
    done()
  })
})
