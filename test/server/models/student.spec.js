/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const db = require('../../../server/db')
const Student = require('../../../server/models/Student')

jest.useFakeTimers()

describe('Student', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

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

  test('Force booleans', async done => {
    const student = await Student.forge({
      name: 'Lorem Ipsum',
      registrationNumber: '201504940020',
      course: 'cbcc',
      email: 'example@gmail.com',
      crg: 5.123456789,
      isFit: 1,
      isConcluding: 0,
      isActive: 1,
      isForming: 0,
      isGraduating: 1,
      academicHighlight: 0,
      missingCollation: 1,
      cancelled: 1
    }).save()

    const booleanFields = [
      'isFit',
      'isConcluding',
      'isActive',
      'isForming',
      'isGraduating',
      'academicHighlight',
      'missingCollation',
      'cancelled'
    ]

    const obj = JSON.parse(JSON.stringify(student))

    for (const field of booleanFields) {
      expect(typeof student.get(field)).toBe('boolean')
      expect(typeof obj[field]).toBe('boolean')
    }

    done()
  })
})
