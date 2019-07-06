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
const Setting = require('../../../server/models/Setting')

jest.useFakeTimers()
jest.setTimeout(10000)

describe('/api/settings', () => {
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

    const { id } = await Setting.forge({
      key: 'x',
      value: 10
    }).save()

    const res = await chai
      .request(server.listen())
      .get('/api/settings')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.length).toBe(1)
    expect(res.body[0].id).toBe(id)
    expect(res.body[0].key).toBe('x')
    expect(res.body[0].value).toBe(10)
    done()
  })

  test('GET /:key', async done => {
    const { token } = await testUtils.user('admin')

    const { id } = await Setting.forge({
      key: 'x',
      value: 10
    }).save()

    const res = await chai
      .request(server.listen())
      .get('/api/settings/x')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.id).toBe(id)
    expect(res.body.key).toBe('x')
    expect(res.body.value).toBe(10)
    done()
  })

  test('GET /:key não existe', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .get('/api/settings/x')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
    expect(res.body.code).toBe(errors.NOT_FOUND)
    done()
  })

  test('PUT /:key', async done => {
    const { token } = await testUtils.user('admin')

    const { id } = await Setting.forge({
      key: 'x',
      value: 10
    }).save()

    const res = await chai
      .request(server.listen())
      .put('/api/settings/x')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 100 })
    expect(res.status).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.id).toBe(id)
    expect(res.body.key).toBe('x')
    expect(res.body.value).toBe(100)
    done()
  })

  test('PUT /:key for new setting', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .put('/api/settings/x')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 100 })
    expect(res.status).toBe(200)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.key).toBe('x')
    expect(res.body.value).toBe(100)
    done()
  })

  test('PUT /:key missing value', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .put('/api/settings/x')
      .set('Authorization', `Bearer ${token}`)
      .send({})
    expect(res.status).toBe(400)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.INVALID_REQUEST)
    done()
  })
})
