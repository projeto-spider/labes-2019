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

  test('GET /', async done => {
    const res = await chai.request(server.listen()).get('/api/students')
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.length).toEqual(7)
    expect(res.headers['pagination-page']).toEqual('1')
    done()
  })
  test('GET /?course=cb[cc|si]', async done => {
    const resCbcc = await chai
      .request(server.listen())
      .get('/api/students/?course=cbcc')
    expect(resCbcc.status).toEqual(200)
    expect(resCbcc.type).toEqual('application/json')
    expect(resCbcc.body).toBeDefined()
    expect(
      resCbcc.body.every(student => student.course === 'cbcc')
    ).toBeTruthy()
    const resCbsi = await chai
      .request(server.listen())
      .get('/api/students/?course=cbsi')
    expect(resCbsi.status).toEqual(200)
    expect(resCbsi.type).toEqual('application/json')
    expect(resCbsi.body).toBeDefined()
    expect(
      resCbsi.body.every(student => student.course === 'cbsi')
    ).toBeTruthy()
    done()
  })

  test('GET /?course=invalid', async done => {
    const res = await chai
      .request(server.listen())
      .get('/api/students/?course=invalid')
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_FILTER)
    expect(res.body.filter).toEqual('course')
    done()
  })

  test('GET /?name=[STUDENT%20NAME]', async done => {
    const resStudent1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?name=FELIPE SOUZA FERREIRA'))
    expect(resStudent1.status).toEqual(200)
    expect(resStudent1.type).toEqual('application/json')
    expect(resStudent1.body).toBeDefined()
    expect(
      resStudent1.body.every(
        student => student.name === 'FELIPE SOUZA FERREIRA'
      )
    ).toBeTruthy()
    const resStudent2 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?name=%FERREIRA%'))
    expect(resStudent2.status).toEqual(200)
    expect(resStudent2.type).toEqual('application/json')
    expect(resStudent2.body).toBeDefined()
    expect(
      resStudent2.body.every(student => student.name.includes('FERREIRA'))
    ).toBeTruthy()
    const resStudent3 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?name=KAUAN%'))
    expect(resStudent3.status).toEqual(200)
    expect(resStudent3.type).toEqual('application/json')
    expect(resStudent3.body).toBeDefined()
    expect(
      resStudent3.body.every(student => student.name.startsWith('KAUAN'))
    ).toBeTruthy()
    const resStudent4 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?name=%SANTOS'))
    expect(resStudent4.status).toEqual(200)
    expect(resStudent4.type).toEqual('application/json')
    expect(resStudent4.body).toBeDefined()
    expect(
      resStudent4.body.every(student => student.name.endsWith('SANTOS'))
    ).toBeTruthy()
    done()
  })

  test('GET /?isActive=[0|1]', async done => {
    const resTrue = await chai
      .request(server.listen())
      .get('/api/students/?isActive=1')
    expect(resTrue.status).toEqual(200)
    expect(resTrue.type).toEqual('application/json')
    expect(resTrue.body).toBeDefined()
    expect(resTrue.body.every(student => student.isActive === 1)).toBeTruthy()
    const resFalse = await chai
      .request(server.listen())
      .get('/api/students/?isActive=0')
    expect(resFalse.status).toEqual(200)
    expect(resFalse.type).toEqual('application/json')
    expect(resFalse.body).toBeDefined()
    expect(resFalse.body.every(student => student.isActive === 0)).toBeTruthy()
    done()
  })

  test('GET /?course=cb[cc|si]&name=[STUDANTE%20NAME]', async done => {
    const res = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&name=%FERREIRA%'))
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(
      res.body.every(
        student =>
          student.course === 'cbcc' && student.name.includes('FERREIRA')
      )
    ).toBeTruthy()
    done()
  })

  test('GET /?sort=parameter', async done => {
    const resStudent1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?sort=name'))
    expect(resStudent1.status).toEqual(200)
    expect(resStudent1.type).toEqual('application/json')
    expect(resStudent1.body).toBeDefined()
    expect(
      resStudent1.body.every(student => student.name === 'EDUARDO ALVES LIMA')
    ).toBeTruthy()
    const resStudent2 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?sort=registrationNumber'))
    expect(resStudent2.status).toEqual(200)
    expect(resStudent2.type).toEqual('application/json')
    expect(resStudent2.body).toBeDefined()
    expect(
      resStudent2.body.every(
        student => student.name === 'JULIAN BARBOSA SANTOS'
      )
    ).toBeTruthy()
    done()
  })
  test('GET /?course=cb[cc|si]&sort=parameter', async done => {
    const res1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&sort=name'))
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(
      res1.body.every(
        student =>
          student.course === 'cbcc' && student.name === 'EDUARDO ALVES LIMA'
      )
    ).toBeTruthy()
    const res2 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&sort=registrationNumber'))
    expect(res2.status).toEqual(200)
    expect(res2.type).toEqual('application/json')
    expect(res2.body).toBeDefined()
    expect(
      res2.body.every(
        student =>
          student.course === 'cbcc' && student.name === 'JULIAN BARBOSA SANTOS'
      )
    ).toBeTruthy()
    done()
  })
  test('GET /?course=cb[cc|si]&name=[STUDENT%20NAME]&sort=parameter', async done => {
    const res1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&name=%SANTOS&sort=name'))
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(
      res1.body.every(
        student => student.course === 'cbcc' && student.name.endsWith('SANTOS')
      )
    ).toBeTruthy()
    const res2 = await chai
      .request(server.listen())
      .get(
        encodeURI(
          '/api/students/?course=cbcc&name=%SANTOS&sort=registrationNumber'
        )
      )
    expect(res2.status).toEqual(200)
    expect(res2.type).toEqual('application/json')
    expect(res2.body).toBeDefined()
    expect(
      res2.body.every(
        student => student.course === 'cbcc' && student.name.endsWith('SANTOS')
      )
    ).toBeTruthy()
    done()
  })
  test('GET /?sort=invalid', async done => {
    const res = await chai
      .request(server.listen())
      .get('/api/students/?sort=invalid')
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_SORT_ARGUMENT)
    expect(res.body.filter).toEqual('sort')
    done()
  })
})
