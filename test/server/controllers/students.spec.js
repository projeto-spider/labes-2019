/**
 * @jest-environment node
 */

const path = require('path')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const server = require('../../../server')
const db = require('../../../server/db')
const Student = require('../../../server/models/Student')
const errors = require('../../../shared/errors')

jest.useFakeTimers()

/**
 * Helper function to get fixtures path
 *
 * @param {string} name - A file name from test/server/fixtures folder
 * @return {string} File full path
 *
 * @example
 *
 *     sigaaCsvFixture('valid.csv')
 */
function sigaaCsvFixture(name) {
  return path.join(__dirname, '../fixtures/sigaa', name)
}

describe('/api/students', () => {
  beforeEach(async () => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
  }, 100000)

  test('POST /from-csv', async done => {
    /**
     * Find a student by it's registrationNumber
     *
     * @param {object[]} students - Object of student from the database
     * @param {string} registrationNumber - The wanted student's registrationNumber
     * @return {object} The student
     *
     * @example
     *
     *     const students = [{ registrationNumber: '123', name: 'test user' }]
     *     findByRegistrationNumber(students, '123')
     */
    function findByRegistrationNumber(students, registrationNumber) {
      return students.find(u => u.registrationNumber === registrationNumber)
    }

    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .attach('csv', sigaaCsvFixture('valid.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.count).toEqual(7)

    const studentsUpdated = (await Student.fetchAll()).toJSON()

    const [felipe, laura, jose, enzo, kauan, eduardo, julian] = [
      '201704940001',
      '201304940002',
      '200504940003',
      '201104940004',
      '200604940005',
      '201804940006',
      '199604940007'
    ].map(registrationNumber =>
      findByRegistrationNumber(studentsUpdated, registrationNumber)
    )

    expect(studentsUpdated.length).toEqual(7)

    expect(felipe.isActive).toBeTruthy()
    expect(felipe.isForming).toBeTruthy()
    expect(felipe.isGraduating).toBeFalsy()
    expect(felipe.isConcluding).toBeFalsy()
    expect(felipe.cancelled).toBeFalsy()

    expect(laura.isActive).toBeFalsy()
    expect(laura.isForming).toBeFalsy()
    expect(laura.isGraduating).toBeFalsy()
    expect(laura.isConcluding).toBeTruthy()
    expect(laura.cancelled).toBeFalsy()

    expect(jose.isActive).toBeFalsy()
    expect(jose.isForming).toBeFalsy()
    expect(jose.isGraduating).toBeFalsy()
    expect(jose.isConcluding).toBeTruthy()
    expect(jose.cancelled).toBeFalsy()

    expect(enzo.isActive).toBeTruthy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isConcluding).toBeFalsy()
    expect(enzo.cancelled).toBeFalsy()

    expect(kauan.isActive).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isConcluding).toBeFalsy()
    expect(kauan.cancelled).toBeTruthy()

    expect(eduardo.isActive).toBeTruthy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isConcluding).toBeFalsy()
    expect(eduardo.cancelled).toBeFalsy()

    expect(julian.isActive).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isConcluding).toBeTruthy()
    expect(julian.cancelled).toBeFalsy()

    done()
  })

  test('POST /from-csv missing csv field', async done => {
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .type('form')

    debugger

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_MISSING_CSV_FIELD)
    done()
  })

  test('POST /from-csv invalid CSV length', async done => {
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .attach('csv', sigaaCsvFixture('wrong-length.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_LENGTH)
    done()
  })

  test('POST /from-csv invalid CSV headers', async done => {
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .attach('csv', sigaaCsvFixture('wrong-headers.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_HEADER)
    done()
  })

  test('POST /from-csv invalid CSV column number', async done => {
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .attach('csv', sigaaCsvFixture('wrong-col-number.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_COL_NUMBER)
    done()
  })

  test('POST /from-csv invalid not CSV ', async done => {
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .attach('csv', sigaaCsvFixture('wrong-invalid-csv.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_HEADER)
    done()
  })
})
