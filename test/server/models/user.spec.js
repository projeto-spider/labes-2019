/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const db = require('../../../server/db')
const User = require('../../../server/models/User')

jest.useFakeTimers()

describe('models/User', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  test.only('Create a User', async done => {
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
