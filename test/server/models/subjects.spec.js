/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const db = require('../../../server/db')
const useSeeds = require('../../use-seeds')
const Subject = require('../../../server/models/Subject')

jest.useFakeTimers()

describe('models/Subjects', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['subjects'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('Create a Subject', async done => {
    const subject = await Subject.forge({
      name: 'TEARS ORIENTED PROGRAMMING'
    }).save()

    expect(subject.id).toBeDefined()
    expect(subject.attributes.name).toEqual('TEARS ORIENTED PROGRAMMING')
    done()
  })
})
