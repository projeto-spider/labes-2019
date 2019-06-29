/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const db = require('../../../server/db')
const useSeeds = require('../../use-seeds')
const User = require('../../../server/models/User')

jest.useFakeTimers()

describe('models/User', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('Create a User', async done => {
    const student = await User.forge({
      username: 'admin',
      password: 'pass',
      email: 'admin@example.com'
    }).save()

    expect(student.id).toBeDefined()
    expect(student.attributes.username).toEqual('admin')
    expect(student.attributes.email).toEqual('admin@example.com')
    expect(student.attributes.passwordDigest).toBeDefined()
    expect(student.authenticate('pass')).resolves.toBe(student)
    expect(student.authenticate('wrong')).rejects.not.toBe(student)
    done()
  })
})
