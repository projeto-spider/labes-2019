/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const db = require('../../../server/db')
const Subject = require('../../../server/models/Subject')

jest.useFakeTimers()

describe('models/Subjects', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  test('Create a Subject', async done => {
    const subject = await Subject.forge({
      name: 'TEARS ORIENTED PROGRAMMING',
      code: 'TR09999'
    }).save()

    expect(subject.id).toBeDefined()
    expect(subject.attributes.name).toEqual('TEARS ORIENTED PROGRAMMING')
    expect(subject.attributes.code).toEqual('TR09999')
    done()
  })
})