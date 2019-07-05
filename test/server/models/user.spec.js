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
    const user = await User.forge({
      username: 'pass',
      fullName: 'Passarinho',
      password: 'pass',
      email: 'admin@example.com'
    }).save()

    expect(user.id).toBeDefined()
    expect(user.get('username')).toBe('pass')
    expect(user.get('fullName')).toBe('Passarinho')
    expect(user.get('email')).toBe('admin@example.com')
    expect(user.get('passwordDigest')).toBeDefined()
    expect(user.authenticate('pass')).resolves.toBe(user)
    expect(user.authenticate('wrong')).rejects.not.toBe(user)
    done()
  })
})
