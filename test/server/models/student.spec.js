/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const db = require('../../../server/db')
const Student = require('../../../server/models/Student')

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

  test('Create a Student', async done => {
    const student = await Student.forge({
      name: 'Lorem Ipsum',
      registrationNumber: '201504940020',
      course: 'cbcc',
      email: 'example@gmail.com'
    }).save()
    expect(student.id).toBeDefined()
    expect(student.attributes.name).toEqual('Lorem Ipsum')
    expect(student.attributes.email).toEqual('example@gmail.com')
    done()
  })

  test('Create a Student uses only 3 CRG decimal digits', async done => {
    const student = await Student.forge({
      name: 'Lorem Ipsum',
      registrationNumber: '201504940020',
      course: 'cbcc',
      email: 'example@gmail.com',
      crg: 5.123456789
    }).save()
    expect(student.id).toBeDefined()
    expect(student.attributes.name).toEqual('Lorem Ipsum')
    expect(student.attributes.email).toEqual('example@gmail.com')
    expect(student.attributes.crg).toEqual(5.123)

    await student.save({ crg: 7.123456789 })
    expect(student.attributes.crg).toEqual(7.123)
    done()
  })
})
