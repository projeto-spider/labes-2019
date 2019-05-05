/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../../../server')
const db = require('../../../server/db')

jest.useFakeTimers()

describe('/api/users', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  afterEach(() => {
    return db.knex.migrate.rollback()
  })

  test('GET /', async done => {
    const res = await chai.request(server).get('/api/users')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    done()
  })

  test('GET /:id', async done => {
    const res = await chai.request(server).get('/api/users/1')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body.id).toBeDefined()
    done()
  })
})
