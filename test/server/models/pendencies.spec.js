/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const db = require('../../../server/db')
const Pendency = require('../../../server/models/Pendency')

jest.useFakeTimers()

describe('/api/students/:idStudent/pendencies', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  afterEach(() => {
    return db.knex.migrate.rollback()
  })

  test('Create a Pendency', async done => {
    const pendency = await Pendency.forge({
      studentId: 1,
      subjectId: 10
    }).save()
    expect(pendency.id).toBeDefined()
    expect(pendency.attributes.studentId).toEqual(1)
    expect(pendency.attributes.subjectId).toEqual(10)
    done()
  })
})
