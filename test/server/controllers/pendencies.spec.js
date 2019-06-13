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
describe('/api/students/:id/pendencies/', () => {
  beforeEach(async () => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
  }, 100000)

  test('GET /students/1/pendencies/', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/pendencies/')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.length).toEqual(3)
    expect(res.body[0].name).toEqual('ALGEBRA LINEAR PARA COMPUTACAO')
    expect(res.body[1].name).toEqual('CALCULO COMPUTACIONAL I')
    expect(res.body[2].name).toEqual('FISICA PARA COMPUTACAO')
    done()
  })

  test('GET /students/1/pendencies/1', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/pendencies/1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.name).toEqual('ALGEBRA LINEAR PARA COMPUTACAO')
    done()
  })

  test('GET /students/1000/pendencies/1 NOT FOUND STUDENT', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1000/pendencies/1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(404)
    expect(res.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  test('GET /students/1/pendencies/1000 NOT FOUND PENDENCY', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/pendencies/1000')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(404)
    expect(res.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  test('GET /students/4/pendencies/ NO PENDENCIES', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/4/pendencies/')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body).toBeDefined()
    expect(res.type).toEqual('application/json')
    expect(res.status).toEqual(200)
    expect(res.body.length).toEqual(0)
    done()
  })
})
