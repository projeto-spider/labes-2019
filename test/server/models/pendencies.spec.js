/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const db = require('../../../server/db')
const useSeeds = require('../../use-seeds')
const Pendency = require('../../../server/models/Pendency')

jest.useFakeTimers()

describe('models/Pendency', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['students', 'subjects', 'pendencies'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

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
