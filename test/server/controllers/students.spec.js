/**
 * @jest-environment node
 */

const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const enums = require('../../../shared/enums')
const useSeeds = require('../../use-seeds')
const server = require('../../../server')
const db = require('../../../server/db')
const Student = require('../../../server/models/Student')
const Solicitation = require('../../../server/models/Solicitation')
const errors = require('../../../shared/errors')
const document = require('../../../server/models/Document')
const utils = require('../../../server/utils')

jest.useFakeTimers()
jest.setTimeout(10000)

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
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users', 'students', 'documents', 'solicitations'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('POST /from-csv', async done => {
    const { token } = await testUtils.user('admin')
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
      .set('Authorization', `Bearer ${token}`)
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
    expect(felipe.cd).toBeFalsy()

    expect(laura.isActive).toBeFalsy()
    expect(laura.isForming).toBeFalsy()
    expect(laura.isGraduating).toBeFalsy()
    expect(laura.isConcluding).toBeTruthy()
    expect(laura.cancelled).toBeFalsy()
    expect(laura.cd).toBeFalsy()

    expect(jose.isActive).toBeFalsy()
    expect(jose.isForming).toBeFalsy()
    expect(jose.isGraduating).toBeFalsy()
    expect(jose.isConcluding).toBeTruthy()
    expect(jose.cancelled).toBeFalsy()
    expect(jose.cd).toBeFalsy()

    expect(enzo.isActive).toBeTruthy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isConcluding).toBeFalsy()
    expect(enzo.cancelled).toBeFalsy()
    expect(enzo.cd).toBeFalsy()

    expect(kauan.isActive).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isConcluding).toBeFalsy()
    expect(kauan.cancelled).toBeTruthy()
    expect(kauan.cd).toBeFalsy()

    expect(eduardo.isActive).toBeTruthy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isConcluding).toBeFalsy()
    expect(eduardo.cancelled).toBeFalsy()
    expect(eduardo.cd).toBeFalsy()

    expect(julian.isActive).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isConcluding).toBeTruthy()
    expect(julian.cancelled).toBeFalsy()
    expect(julian.cd).toBeFalsy()

    done()
  })

  test('POST /from-csv missing csv field', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .set('Authorization', `Bearer ${token}`)
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_MISSING_CSV_FIELD)
    done()
  })

  test('POST /from-csv invalid CSV length', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('csv', sigaaCsvFixture('wrong-length.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_LENGTH)
    done()
  })

  test('POST /from-csv invalid CSV headers', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('csv', sigaaCsvFixture('wrong-headers.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_HEADER)
    done()
  })

  test('POST /from-csv invalid CSV column number', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('csv', sigaaCsvFixture('wrong-col-number.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_COL_NUMBER)
    done()
  })

  test('POST /from-csv import csv with last blank line', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('csv', sigaaCsvFixture('last-line-blank.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.count).toEqual(7)

    const studentsUpdated = (await Student.fetchAll()).toJSON()

    function findByRegistrationNumber(students, registrationNumber) {
      return students.find(u => u.registrationNumber === registrationNumber)
    }

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
    expect(felipe.cd).toBeFalsy()

    expect(laura.isActive).toBeFalsy()
    expect(laura.isForming).toBeFalsy()
    expect(laura.isGraduating).toBeFalsy()
    expect(laura.isConcluding).toBeTruthy()
    expect(laura.cancelled).toBeFalsy()
    expect(laura.cd).toBeFalsy()

    expect(jose.isActive).toBeFalsy()
    expect(jose.isForming).toBeFalsy()
    expect(jose.isGraduating).toBeFalsy()
    expect(jose.isConcluding).toBeTruthy()
    expect(jose.cancelled).toBeFalsy()
    expect(jose.cd).toBeFalsy()

    expect(enzo.isActive).toBeTruthy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isConcluding).toBeFalsy()
    expect(enzo.cancelled).toBeFalsy()
    expect(enzo.cd).toBeFalsy()

    expect(kauan.isActive).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isConcluding).toBeFalsy()
    expect(kauan.cancelled).toBeTruthy()
    expect(kauan.cd).toBeFalsy()

    expect(eduardo.isActive).toBeTruthy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isConcluding).toBeFalsy()
    expect(eduardo.cancelled).toBeFalsy()
    expect(eduardo.cd).toBeFalsy()

    expect(julian.isActive).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isConcluding).toBeTruthy()
    expect(julian.cancelled).toBeFalsy()
    expect(julian.cd).toBeFalsy()

    done()
  })

  test('POST /from-csv invalid not CSV ', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .set('Authorization', `Bearer ${token}`)
      .attach('csv', sigaaCsvFixture('wrong-invalid-csv.csv'), 'export.csv')
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.IMPORT_CSV_INVALID_HEADER)
    done()
  })

  test('POST /from-csv registrationNumber repeated', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .post('/api/students/from-csv')
      .set('Authorization', `Bearer ${token}`)
      .attach(
        'csv',
        sigaaCsvFixture('wrong-registration-number.csv'),
        'export.csv'
      )
      .type('form')

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(
      errors.IMPORT_CSV_REGISTRATION_NUMBER_REPEATED
    )
    done()
  })

  test('PUT /[studentId]', async done => {
    const { token } = await testUtils.user('admin')
    const resComplete = await chai
      .request(server.listen())
      .put('/api/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ATUALIZA NOME',
        registrationNumber: '201704940001',
        crg: 9,
        course: 'cbcc',
        email: 'null',
        isFit: false,
        isConcluding: false,
        isActive: true,
        isForming: true,
        isGraduating: false,
        academicHighlight: false,
        cancelled: false,
        mailingList: 'none',
        term: null,
        cd: true
      })
    expect(resComplete.status).toEqual(200)
    expect(resComplete.type).toEqual('application/json')
    expect(resComplete.body).toBeDefined()
    expect(resComplete.body.id).toEqual(1)
    expect(resComplete.body.name).toEqual('ATUALIZA NOME')
    expect(resComplete.body.crg).toEqual(9)
    expect(resComplete.body.cd).toBeTruthy()

    const resNome = await chai
      .request(server.listen())
      .put('/api/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ATUALIZA SOMENTE O NOME'
      })
    expect(resNome.status).toEqual(200)
    expect(resNome.type).toEqual('application/json')
    expect(resNome.body).toBeDefined()
    expect(resNome.body.id).toEqual(1)
    expect(resNome.body.name).toEqual('ATUALIZA SOMENTE O NOME')

    const resEmail = await chai
      .request(server.listen())
      .put('/api/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'novoemail@gmail.com' })
    expect(resEmail.status).toEqual(200)
    expect(resEmail.type).toEqual('application/json')
    expect(resEmail.body).toBeDefined()
    expect(resEmail.body.id).toEqual(1)
    expect(resEmail.body.email).toEqual('novoemail@gmail.com')

    done()
  })

  test('PUT /[invalid studentId]', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .put('/api/students/1000')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'FELIPE SOUZA FERREIRA',
        registrationNumber: '201704940001',
        crg: 'null',
        course: 'cbcc',
        email: 'null',
        isFit: false,
        isConcluding: false,
        isActive: true,
        isForming: true,
        isGraduating: false,
        academicHighlight: false,
        cancelled: false,
        mailingList: 'none'
      })
    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  test('PUT /update-academic-highlight', async done => {
    const { token } = await testUtils.user('admin')

    const [a, b, c] = await Promise.all(
      [
        {
          name: 'AAAAA',
          registrationNumber: '222004940001',
          crg: 5,
          course: 'cbcc', // important
          email: null,
          isFit: true, // important
          isActive: true, // important
          isForming: true, // important
          isConcluding: false,
          isGraduating: true,
          academicHighlight: false,
          cancelled: false
        },
        {
          name: 'BBBBB',
          registrationNumber: '222004940002',
          crg: 5,
          course: 'cbcc', // important
          email: null,
          isFit: true, // important
          isActive: true, // important
          isForming: true, // important
          isConcluding: false,
          isGraduating: true,
          academicHighlight: true,
          cancelled: false
        },
        {
          name: 'CCCCC',
          registrationNumber: '222004940003',
          crg: 5,
          course: 'cbsi', // important
          email: null,
          isFit: true, // important
          isActive: true, // important
          isForming: true, // important
          isConcluding: false,
          isGraduating: true,
          academicHighlight: true,
          cancelled: false
        }
      ].map(props => Student.forge(props).save())
    )

    const res = await chai
      .request(server.listen())
      .put('/api/students/update-academic-highlight')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: a.id })
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.id).toEqual(a.id)
    expect(res.body.academicHighlight).toEqual(true)

    expect(
      (await Student.forge({ id: a.id }).fetch()).get('academicHighlight')
    ).toBeTruthy()
    expect(
      (await Student.forge({ id: b.id }).fetch()).get('academicHighlight')
    ).toBeFalsy()
    expect(
      (await Student.forge({ id: c.id }).fetch()).get('academicHighlight')
    ).toBeTruthy()

    done()
  })

  test('PUT /update-academic-highlight with invalid id', async done => {
    const { token } = await testUtils.user('admin')

    const [a, b, c] = await Promise.all(
      [
        {
          name: 'AAAAA',
          registrationNumber: '222004940001',
          crg: 5,
          course: 'cbcc', // important
          email: null,
          isFit: true, // important
          isActive: true, // important
          isForming: true, // important
          isConcluding: false,
          isGraduating: true,
          academicHighlight: false,
          cancelled: false
        },
        {
          name: 'BBBBB',
          registrationNumber: '222004940002',
          crg: 5,
          course: 'cbcc', // important
          email: null,
          isFit: true, // important
          isActive: true, // important
          isForming: true, // important
          isConcluding: false,
          isGraduating: true,
          academicHighlight: true,
          cancelled: false
        },
        {
          name: 'CCCCC',
          registrationNumber: '222004940003',
          crg: 5,
          course: 'cbsi', // important
          email: null,
          isFit: true, // important
          isActive: true, // important
          isForming: true, // important
          isConcluding: false,
          isGraduating: true,
          academicHighlight: true,
          cancelled: false
        }
      ].map(props => Student.forge(props).save())
    )

    const res = await chai
      .request(server.listen())
      .put('/api/students/update-academic-highlight')
      .set('Authorization', `Bearer ${token}`)
      .send({ id: 1000000000 })
    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')

    expect(
      (await Student.forge({ id: a.id }).fetch()).get('academicHighlight')
    ).toBeFalsy()
    expect(
      (await Student.forge({ id: b.id }).fetch()).get('academicHighlight')
    ).toBeTruthy()
    expect(
      (await Student.forge({ id: c.id }).fetch()).get('academicHighlight')
    ).toBeTruthy()

    done()
  })

  test('GET /', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.length).toEqual(7)
    expect(res.headers['pagination-page']).toEqual('1')
    done()
  })

  test('GET /?course=cb[cc|si]', async done => {
    const { token } = await testUtils.user('admin')
    const resCbcc = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'cbcc' })
      .set('Authorization', `Bearer ${token}`)
    expect(resCbcc.status).toEqual(200)
    expect(resCbcc.type).toEqual('application/json')
    expect(resCbcc.body).toBeDefined()
    expect(
      resCbcc.body.every(student => student.course === 'cbcc')
    ).toBeTruthy()
    const resCbsi = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'cbsi' })
      .set('Authorization', `Bearer ${token}`)
    expect(resCbsi.status).toEqual(200)
    expect(resCbsi.type).toEqual('application/json')
    expect(resCbsi.body).toBeDefined()
    expect(
      resCbsi.body.every(student => student.course === 'cbsi')
    ).toBeTruthy()
    done()
  })

  test('GET /?course=invalid', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'invalid' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_FILTER)
    expect(res.body.filter).toEqual('course')
    done()
  })

  test('GET /?name=[STUDENT NAME]', async done => {
    const { token } = await testUtils.user('admin')
    const resStudent1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ name: 'FELIPE SOUZA FERREIRA' })
      .set('Authorization', `Bearer ${token}`)
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
      .get('/api/students/')
      .query({ name: '%FERREIRA%' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent2.status).toEqual(200)
    expect(resStudent2.type).toEqual('application/json')
    expect(resStudent2.body).toBeDefined()
    expect(
      resStudent2.body.every(student => student.name.includes('FERREIRA'))
    ).toBeTruthy()
    const resStudent3 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ name: 'KAUAN%' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent3.status).toEqual(200)
    expect(resStudent3.type).toEqual('application/json')
    expect(resStudent3.body).toBeDefined()
    expect(
      resStudent3.body.every(student => student.name.startsWith('KAUAN'))
    ).toBeTruthy()
    const resStudent4 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ name: '%SANTOS' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent4.status).toEqual(200)
    expect(resStudent4.type).toEqual('application/json')
    expect(resStudent4.body).toBeDefined()
    expect(
      resStudent4.body.every(student => student.name.endsWith('SANTOS'))
    ).toBeTruthy()
    done()
  })

  test('GET /?isActive=[false|true]', async done => {
    const { token } = await testUtils.user('admin')
    const resTrue = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ isActive: true })
      .set('Authorization', `Bearer ${token}`)
    expect(resTrue.status).toEqual(200)
    expect(resTrue.type).toEqual('application/json')
    expect(resTrue.body).toBeDefined()
    expect(resTrue.body.every(student => student.isActive)).toBeTruthy()
    const resFalse = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ isActive: false })
      .set('Authorization', `Bearer ${token}`)
    expect(resFalse.status).toEqual(200)
    expect(resFalse.type).toEqual('application/json')
    expect(resFalse.body).toBeDefined()
    expect(resFalse.body.every(student => !student.isActive)).toBeTruthy()
    done()
  })

  test('GET /?course=cb[cc|si]&name=[STUDANTE%20NAME]', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'cbcc', name: '%FERREIRA%' })
      .set('Authorization', `Bearer ${token}`)
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

  test('GET /?sort=parameter&order=parameter', async done => {
    const { token } = await testUtils.user('admin')
    const resStudent1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ sort: 'name' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent1.status).toEqual(200)
    expect(resStudent1.type).toEqual('application/json')
    expect(resStudent1.body).toBeDefined()
    expect(resStudent1.body[0].name).toEqual('EDUARDO ALVES LIMA')
    expect(resStudent1.body[1].name).toEqual('ENZO FERREIRA ALVES')
    expect(resStudent1.body[2].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(resStudent1.body[3].name).toEqual('JOSE FERREIRA SILVA')
    expect(resStudent1.body[4].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(resStudent1.body[5].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(resStudent1.body[6].name).toEqual('LAURA CARDOSO CASTRO')
    const resStudent2 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ sort: 'registrationNumber' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent2.status).toEqual(200)
    expect(resStudent2.type).toEqual('application/json')
    expect(resStudent2.body).toBeDefined()
    expect(resStudent2.body[0].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(resStudent2.body[1].name).toEqual('JOSE FERREIRA SILVA')
    expect(resStudent2.body[2].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(resStudent2.body[3].name).toEqual('ENZO FERREIRA ALVES')
    expect(resStudent2.body[4].name).toEqual('LAURA CARDOSO CASTRO')
    expect(resStudent2.body[5].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(resStudent2.body[6].name).toEqual('EDUARDO ALVES LIMA')
    const resStudent3 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ sort: 'name', order: 'DESC' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent3.status).toEqual(200)
    expect(resStudent3.type).toEqual('application/json')
    expect(resStudent3.body).toBeDefined()
    expect(resStudent3.body[0].name).toEqual('LAURA CARDOSO CASTRO')
    expect(resStudent3.body[1].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(resStudent3.body[2].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(resStudent3.body[3].name).toEqual('JOSE FERREIRA SILVA')
    expect(resStudent3.body[4].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(resStudent3.body[5].name).toEqual('ENZO FERREIRA ALVES')
    expect(resStudent3.body[6].name).toEqual('EDUARDO ALVES LIMA')
    const resStudent4 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ sort: 'registrationNumber', order: 'DESC' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent4.status).toEqual(200)
    expect(resStudent4.type).toEqual('application/json')
    expect(resStudent4.body).toBeDefined()
    expect(resStudent4.body[0].name).toEqual('EDUARDO ALVES LIMA')
    expect(resStudent4.body[1].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(resStudent4.body[2].name).toEqual('LAURA CARDOSO CASTRO')
    expect(resStudent4.body[3].name).toEqual('ENZO FERREIRA ALVES')
    expect(resStudent4.body[4].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(resStudent4.body[5].name).toEqual('JOSE FERREIRA SILVA')
    expect(resStudent4.body[6].name).toEqual('JULIAN BARBOSA SANTOS')
    const resStudent5 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ sort: 'name', order: 'asc' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent5.status).toEqual(200)
    expect(resStudent5.type).toEqual('application/json')
    expect(resStudent5.body).toBeDefined()
    expect(resStudent5.body[0].name).toEqual('EDUARDO ALVES LIMA')
    expect(resStudent5.body[1].name).toEqual('ENZO FERREIRA ALVES')
    expect(resStudent5.body[2].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(resStudent5.body[3].name).toEqual('JOSE FERREIRA SILVA')
    expect(resStudent5.body[4].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(resStudent5.body[5].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(resStudent5.body[6].name).toEqual('LAURA CARDOSO CASTRO')
    {
      const res = await chai
        .request(server.listen())
        .get(encodeURI('/api/students/?sort=period'))
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()

      expect(
        res.body
          .map(student => Number(student.period))
          .every((period, i, others) =>
            others.slice(i + 1).every(other => period <= other)
          )
      )
    }

    done()
  })

  test('GET /?course=cb[cc|si]&sort=parameter', async done => {
    const { token } = await testUtils.user('admin')
    const res1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'cbcc', sort: 'name' })
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('EDUARDO ALVES LIMA')
    expect(res1.body[1].name).toEqual('ENZO FERREIRA ALVES')
    expect(res1.body[2].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(res1.body[3].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(res1.body[4].name).toEqual('KAUAN CARVALHO SANTOS')
    const res2 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'cbsi', sort: 'registrationNumber' })
      .set('Authorization', `Bearer ${token}`)
    expect(res2.status).toEqual(200)
    expect(res2.type).toEqual('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body[0].name).toEqual('JOSE FERREIRA SILVA')
    expect(res2.body[1].name).toEqual('LAURA CARDOSO CASTRO')
    const res3 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        course: 'cbcc',
        sort: 'crg',
        order: 'desc'
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res3.status).toEqual(200)
    expect(res3.type).toEqual('application/json')
    expect(res3.body).toBeDefined()
    expect(res3.body[0].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(res3.body[1].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(res3.body[2].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(res3.body[3].name).toEqual('ENZO FERREIRA ALVES')
    expect(res3.body[4].name).toEqual('EDUARDO ALVES LIMA')
    const res4 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'cbsi', sort: 'crg' })
      .set('Authorization', `Bearer ${token}`)
    expect(res4.status).toEqual(200)
    expect(res4.type).toEqual('application/json')
    expect(res4.body).toBeDefined()
    expect(res4.body[0].name).toEqual('LAURA CARDOSO CASTRO')
    expect(res4.body[1].name).toEqual('JOSE FERREIRA SILVA')
    done()
  })

  test('GET /?course=cb[cc|si]&name=[STUDENT NAME]&sort=parameter', async done => {
    const { token } = await testUtils.user('admin')
    const res1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ course: 'cbcc', name: '%SANTOS', sort: 'name' })
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(res1.body[1].name).toEqual('KAUAN CARVALHO SANTOS')
    const res2 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        course: 'cbcc',
        name: '%SANTOS',
        sort: 'registrationNumber'
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res2.status).toEqual(200)
    expect(res2.type).toEqual('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body[0].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(res2.body[1].name).toEqual('KAUAN CARVALHO SANTOS')
    done()
  })

  test('GET /?course=cb[cc|si]&name=[STUDENT NAME]&sort=parameter&order=parameter', async done => {
    const { token } = await testUtils.user('admin')
    const res1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        course: 'cbcc',
        name: '%SANTOS',
        sort: 'name',
        order: 'DESC'
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(res1.body[1].name).toEqual('JULIAN BARBOSA SANTOS')
    const res2 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        course: 'cbcc',
        name: '%SANTOS',
        sort: 'registrationNumber',
        order: 'ASC'
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res2.status).toEqual(200)
    expect(res2.type).toEqual('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body[0].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(res2.body[1].name).toEqual('KAUAN CARVALHO SANTOS')
    done()
  })

  test('GET /?sort=invalid', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ sort: 'invalid' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_ARGUMENT)
    expect(res.body.filter).toEqual('sort')
    done()
  })

  test('GET /?sort=parameter&order=invalid', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ sort: 'name', order: 'invalid' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_ARGUMENT)
    expect(res.body.filter).toEqual('order')
    done()
  })

  test('GET /actives-mailing-list', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/actives-mailing-list')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body.mailingList).toEqual('slug@gmail.com')
    done()
  })

  test('GET /?gmail=true', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ gmail: true })
      .set('Authorization', `Bearer ${token}`)

    expect(res.body[0].email).toEqual('naosouativo@gmail.com')

    expect(res.body[1].email).toEqual('slug@gmail.com')

    expect(res.body[2].email).toEqual('dofuturo@gmail.com.br')
    done()
  })

  test('GET /?email=[STUDENT-EMAIL]', async done => {
    const { token } = await testUtils.user('admin')
    const resStudent1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ email: 'naosouativo@gmail.com' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent1.status).toEqual(200)
    expect(resStudent1.type).toEqual('application/json')
    expect(resStudent1.body).toBeDefined()
    expect(
      resStudent1.body.every(
        student => student.email === 'naosouativo@gmail.com'
      )
    ).toBeTruthy()
    const resStudent2 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ email: '%@gmail.com%' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent2.status).toEqual(200)
    expect(resStudent2.type).toEqual('application/json')
    expect(resStudent2.body).toBeDefined()
    expect(
      resStudent2.body.every(student => student.email.includes('@gmail.com'))
    ).toBeTruthy()
    const resStudent3 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ email: 'slug%' })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent3.status).toEqual(200)
    expect(resStudent3.type).toEqual('application/json')
    expect(resStudent3.body).toBeDefined()
    expect(
      resStudent3.body.every(student => student.email.startsWith('slug'))
    ).toBeTruthy()
    const resStudent4 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        email: '%@gmail.com'
      })
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent4.status).toEqual(200)
    expect(resStudent4.type).toEqual('application/json')
    expect(resStudent4.body).toBeDefined()
    expect(
      resStudent4.body.every(student => student.email.endsWith('@gmail.com'))
    ).toBeTruthy()
    done()
  })

  test('GET /?prescribed=true', async done => {
    const { token } = await testUtils.user('admin')
    const res1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ prescribed: true })
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('LAURA CARDOSO CASTRO')
    done()
  })

  test('GET /?prescribed=true&registrationNumber=201304940002&sort=name&order=desc', async done => {
    const { token } = await testUtils.user('admin')
    await Promise.all(
      [
        {
          studentId: 1,
          type: 3,
          url: 'url/file5'
        },
        {
          studentId: 4,
          type: 3,
          url: 'url/file6'
        }
      ].map(props => document.forge(props).save())
    )
    const res1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        prescribed: true,
        registrationNumber: 201304940002,
        sort: 'name',
        order: 'desc'
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('LAURA CARDOSO CASTRO')
    done()
  })

  test('GET /?prescribed=true&sort=name&order=desc', async done => {
    const { token } = await testUtils.user('admin')
    await Promise.all(
      [
        {
          studentId: 1,
          type: 3,
          url: 'url/file5'
        },
        {
          studentId: 4,
          type: 3,
          url: 'url/file6'
        }
      ].map(props => document.forge(props).save())
    )
    const res1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        prescribed: true,
        sort: 'name',
        order: 'desc'
      })
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('LAURA CARDOSO CASTRO')
    expect(res1.body[1].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(res1.body[2].name).toEqual('ENZO FERREIRA ALVES')
    done()
  })

  test('GET /?isConcluding=true&academicHighlight=true', async done => {
    const { token } = await testUtils.user('admin')
    await Promise.all(
      [
        { id: 1, isConcluding: true, academicHighlight: true },
        { id: 2, isConcluding: true, academicHighlight: true }
      ].map(props => Student.forge(props).save())
    )

    const res1 = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({
        isConcluding: true,
        academicHighlight: true
      })
      .set('Authorization', `Bearer ${token}`)

    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body.length).toEqual(2)
    expect(res1.body[0].name).toEqual('FELIPE SOUZA FERREIRA')
    expect(res1.body[0].isConcluding).toEqual(true)
    expect(res1.body[0].academicHighlight).toEqual(true)
    expect(res1.body[1].name).toEqual('LAURA CARDOSO CASTRO')
    expect(res1.body[1].isConcluding).toEqual(true)
    expect(res1.body[1].academicHighlight).toEqual(true)
    done()
  })

  test('GET /email-changes?mailingList=active', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/email-changes')
      .query({ mailingList: 'active' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.additions.length).toBeDefined()
    expect(res.body.deletions.length).toBeDefined()

    expect(
      [
        'FELIPE SOUZA FERREIRA',
        'LAURA CARDOSO CASTRO',
        'ENZO FERREIRA ALVES',
        'EDUARDO ALVES LIMA'
      ].filter(
        name => !res.body.additions.find(student => student.name === name)
      )
    ).toEqual([])

    expect(
      [
        'JOSE FERREIRA SILVA',
        'KAUAN CARVALHO SANTOS',
        'JULIAN BARBOSA SANTOS'
      ].filter(
        name => !res.body.deletions.find(student => student.name === name)
      )
    ).toEqual([])

    done()
  })

  test('GET /email-changes?mailingList=concluding', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .get('/api/students/email-changes')
      .query({ mailingList: 'concluding' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.additions.length).toBeDefined()
    expect(res.body.deletions.length).toBeDefined()
    expect(res.body.deletions.length).toEqual(0)

    expect(
      [
        'JOSE FERREIRA SILVA',
        'JULIAN BARBOSA SANTOS',
        'Ana Goncalves Gomes',
        'Gabriela Dias Cunha',
        'Rodrigo Rodrigues Santos'
      ].filter(
        name => !res.body.additions.find(student => student.name === name)
      )
    ).toEqual([])

    done()
  })

  test('GET /email-changes?mailingList=freshman', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .get('/api/students/email-changes')
      .query({ mailingList: 'freshman' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.additions.length).toBeDefined()
    expect(res.body.deletions.length).toBeDefined()
    expect(res.body.deletions.length).toEqual(0)

    expect(
      ['Victor Silva Carvalho', 'Marisa Correia Castro'].filter(
        name => !res.body.additions.find(student => student.name === name)
      )
    ).toEqual([])

    done()
  })

  test('POST /update-mailing-list for actives then concluding', async done => {
    const { token } = await testUtils.user('admin')

    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/update-mailing-list')
        .set('Authorization', `Bearer ${token}`)
        .send({ mailingList: 'active' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.additions).toEqual(4)
      expect(res.body.deletions).toEqual(3)
    }

    expect(await Student.where({ mailingList: 'active' }).count()).toEqual(4)
    expect(await Student.where({ mailingListToAdd: 'active' }).count()).toEqual(
      0
    )
    expect(
      await Student.where({ mailingListToRemove: 'active' }).count()
    ).toEqual(0)

    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/update-mailing-list')
        .set('Authorization', `Bearer ${token}`)
        .send({ mailingList: 'concluding' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.additions).toEqual(2)
      expect(res.body.deletions).toEqual(3)
    }

    expect(await Student.where({ mailingList: 'concluding' }).count()).toEqual(
      2
    )
    expect(
      await Student.where({ mailingListToAdd: 'concluding' }).count()
    ).toEqual(0)
    expect(
      await Student.where({ mailingListToRemove: 'concluding' }).count()
    ).toEqual(0)
    expect(await Solicitation.where({ type: 'concluding' }).count()).toEqual(0)

    done()
  })

  test('POST /update-mailing-list for concluding then actives', async done => {
    const { token } = await testUtils.user('admin')

    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/update-mailing-list')
        .set('Authorization', `Bearer ${token}`)
        .send({ mailingList: 'concluding' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.additions).toEqual(2)
      expect(res.body.deletions).toEqual(3)
    }

    expect(await Student.where({ mailingList: 'concluding' }).count()).toEqual(
      2
    )
    expect(
      await Student.where({ mailingListToAdd: 'concluding' }).count()
    ).toEqual(0)
    expect(
      await Student.where({ mailingListToRemove: 'concluding' }).count()
    ).toEqual(0)
    expect(await Solicitation.where({ type: 'concluding' }).count()).toEqual(0)

    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/update-mailing-list')
        .set('Authorization', `Bearer ${token}`)
        .send({ mailingList: 'active' })
      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.additions).toEqual(4)
      expect(res.body.deletions).toEqual(3)
    }

    expect(await Student.where({ mailingList: 'active' }).count()).toEqual(4)
    expect(await Student.where({ mailingListToAdd: 'active' }).count()).toEqual(
      0
    )
    expect(
      await Student.where({ mailingListToRemove: 'active' }).count()
    ).toEqual(0)

    done()
  })

  test('POST /update-mailing-list for freshman', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .post('/api/students/update-mailing-list')
      .set('Authorization', `Bearer ${token}`)
      .send({ mailingList: 'freshman' })
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.additions).toEqual(0)
    expect(res.body.deletions).toEqual(2)

    expect(await Solicitation.where({ type: 'freshman' }).count()).toEqual(0)

    done()
  })

  test('GET /?period', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/')
      .query({ period: '2018.3' })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.length).toEqual(1)
    done()
  })

  test('GET /:id invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.INVALID_QUERY)
    expect(res.body.invalidParams.length).toBe(1)
    expect(res.body.invalidParams).toContainEqual('invalid')
    done()
  })

  test('GET / invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.INVALID_QUERY)
    expect(res.body.invalidParams.length).toBe(1)
    expect(res.body.invalidParams).toContainEqual('invalid')
    done()
  })

  test('PUT /[studentId]?invalid?1 invalid query/body', async done => {
    const { token } = await testUtils.user('admin')
    const resComplete = await chai
      .request(server.listen())
      .put('/api/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        invalid: 1,
        name: 'ATUALIZA NOME',
        registrationNumber: '201704940001',
        crg: 9,
        course: 'cbcc',
        email: 'null',
        isFit: false,
        isConcluding: false,
        isActive: true,
        isForming: true,
        isGraduating: false,
        academicHighlight: false,
        cancelled: false,
        mailingList: 'none',
        term: null,
        cd: true
      })
    expect(resComplete.status).toEqual(400)
    expect(resComplete.type).toEqual('application/json')
    expect(resComplete.body).toBeDefined()
    expect(resComplete.body.code).toBe(errors.INVALID_BODY)
    expect(resComplete.body.invalidParams.length).toBe(1)
    expect(resComplete.body.invalidParams).toContainEqual('invalid')

    const resNome = await chai
      .request(server.listen())
      .put('/api/students/1')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ATUALIZA SOMENTE O NOME'
      })
    expect(resNome.status).toEqual(400)
    expect(resNome.type).toEqual('application/json')
    expect(resNome.body).toBeDefined()
    expect(resNome.body.code).toEqual(errors.INVALID_QUERY)
    expect(resNome.body.invalidParams.length).toBe(1)
    expect(resNome.body.invalidParams).toContainEqual('invalid')
    done()
  })

  test('POST /from-csv?invalid=2 invalid query/body', async done => {
    const { token } = await testUtils.user('admin')
    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/from-csv')
        .set('Authorization', `Bearer ${token}`)
        .query({ invalid: 1 })
        .type('form')
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_QUERY)
    }
    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/from-csv')
        .send({ invalid: 1 })
        .set('Authorization', `Bearer ${token}`)
        .type('form')

      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_BODY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    done()
  })

  test('GET /actives-mailing-list?invalid=1 invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/actives-mailing-list')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_QUERY)
    expect(res.body.invalidParams.length).toBe(1)
    expect(res.body.invalidParams).toContainEqual('invalid')
    done()
  })

  test('PUT /update-academic-highlight', async done => {
    const { token } = await testUtils.user('admin')
    const [a] = await Promise.all(
      [
        {
          name: 'AAAAA',
          registrationNumber: '222004940001',
          crg: 5,
          course: 'cbcc', // important
          email: null,
          isFit: true, // important
          isActive: true, // important
          isForming: true, // important
          isConcluding: false,
          isGraduating: true,
          academicHighlight: false,
          cancelled: false
        }
      ].map(props => Student.forge(props).save())
    )

    {
      const res = await chai
        .request(server.listen())
        .put('/api/students/update-academic-highlight')
        .set('Authorization', `Bearer ${token}`)
        .send({ id: a.id, invalid: 1 })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_BODY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    {
      const res = await chai
        .request(server.listen())
        .put('/api/students/update-academic-highlight')
        .query({ invalid: 1 })
        .set('Authorization', `Bearer ${token}`)
        .send({ id: a.id })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_QUERY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    done()
  })

  test('GET /email-changes?mailingList=active&invalid=1 invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/email-changes')
      .query({ mailingList: 'active', invalid: 1 })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_QUERY)
    expect(res.body.invalidParams.length).toBe(1)
    expect(res.body.invalidParams).toContainEqual('invalid')

    done()
  })

  test('POST /update-mailing-list for actives then concluding', async done => {
    const { token } = await testUtils.user('admin')
    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/update-mailing-list')
        .set('Authorization', `Bearer ${token}`)
        .send({ mailingList: 'active', invalid: 1 })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toBe(errors.INVALID_BODY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/update-mailing-list')
        .query({ invalid: 1 })
        .set('Authorization', `Bearer ${token}`)
        .send({ mailingList: 'active' })
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toBe(errors.INVALID_QUERY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }

    done()
  })

  test('PUT /[studentId] update fitness', async done => {
    const { token } = await testUtils.user('admin')

    const dirUploads = path.join(__dirname, '../../../storage/')
    if (fs.existsSync(dirUploads)) {
      rimraf.sync(dirUploads)
    }

    const student = await Student.forge({
      name: 'GRADUANDO FERREIRA ALVES',
      registrationNumber: '221104940004',
      crg: 7.89,
      course: 'cbcc',
      email: 'slug@gmail.com',
      isFit: true,
      isConcluding: false,
      isActive: true,
      isForming: false,
      isGraduating: true, // important
      academicHighlight: false,
      cancelled: false,
      mailingList: 'none',
      mailingListToRemove: 'none',
      mailingListToAdd: 'active',
      term: null,
      cd: false, // important
      period: null
    }).save()

    await updateCd({ value: true, expectedFitness: false })
    await createDocument({
      type: enums.documents.ATA,
      expectedFitness: false
    })
    await createDocument({
      type: enums.documents.LAUDA,
      expectedFitness: true
    })
    await updateCd({ value: false, expectedFitness: false })
    await updateCd({ value: true, expectedFitness: true })
    await deleteDocument({
      type: enums.documents.ATA,
      expectedFitness: false
    })
    await deleteDocument({
      type: enums.documents.LAUDA,
      expectedFitness: false
    })
    await updateCd({ value: false, expectedFitness: false })

    async function updateCd({ value, expectedFitness }) {
      const res = await chai
        .request(server.listen())
        .put(`/api/students/${student.get('id')}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          cd: value
        })

      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.cd).toBe(value)
      expect(res.body.isFit).toBe(expectedFitness)

      const updated = await Student.forge({ id: student.get('id') }).fetch()
      expect(updated.get('isFit')).toBe(expectedFitness)
    }

    async function createDocument({ type, expectedFitness }) {
      const res = await chai
        .request(server.listen())
        .post(`/api/students/${student.id}/documents`)
        .set('Authorization', `Bearer ${token}`)
        .field('documentType', type)
        .attach('file', pdfFixture('test.pdf'), 'test.pdf')
        .type('form')
      expect(res.status).toEqual(201)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()

      const updated = await Student.forge({ id: student.get('id') }).fetch()
      expect(updated.get('isFit')).toBe(expectedFitness)
    }

    async function deleteDocument({ type, expectedFitness }) {
      const doc = await document
        .where('type', type)
        .where('studentId', student.get('id'))
        .fetch()

      const res = await chai
        .request(server.listen())
        .delete(`/api/students/${student.id}/documents/${doc.get('id')}`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.status).toEqual(204)

      const updated = await Student.forge({ id: student.get('id') }).fetch()
      expect(updated.get('isFit')).toBe(expectedFitness)
    }

    done()
  })

  test('PUT /[studentId] missingCollation', async done => {
    const { token } = await testUtils.user('admin')

    // She's graduating
    const student = await Student.forge({
      name: 'LAURA CARDOSO CASTRO'
    }).fetch()

    const resComplete = await chai
      .request(server.listen())
      .put(`/api/students/${student.get('id')}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        missingCollation: true
      })

    expect(resComplete.status).toEqual(200)
    expect(resComplete.type).toEqual('application/json')
    expect(resComplete.body).toBeDefined()
    expect(resComplete.body.isConcluding).toBe(false)
    expect(resComplete.body.isGraduating).toBe(true)
    expect(resComplete.body.isFit).toBe(student.get('isFit'))

    done()
  })

  test('PUT /[studentId] kick isConcluding via missingCollation', async done => {
    const { token } = await testUtils.user('admin')

    // He's concluding
    const student = await Student.forge({
      name: 'JULIAN BARBOSA SANTOS'
    }).fetch()

    const resComplete = await chai
      .request(server.listen())
      .put(`/api/students/${student.get('id')}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        missingCollation: true
      })

    expect(resComplete.status).toEqual(200)
    expect(resComplete.type).toEqual('application/json')
    expect(resComplete.body).toBeDefined()
    expect(resComplete.body.isConcluding).toBe(false)
    expect(resComplete.body.isGraduating).toBe(true)
    expect(resComplete.body.isFit).toBe(student.get('isFit'))

    done()
  })

  test('PUT /[studentId] missingCollation UNPROCESSABLE_ENTITY', async done => {
    const { token } = await testUtils.user('admin')

    // Not graduating or concluding
    const student = await Student.forge({
      name: 'FELIPE SOUZA FERREIRA'
    }).fetch()

    const resComplete = await chai
      .request(server.listen())
      .put(`/api/students/${student.get('id')}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        missingCollation: true
      })

    expect(resComplete.status).toEqual(422)
    expect(resComplete.type).toEqual('application/json')
    expect(resComplete.body).toBeDefined()
    expect(resComplete.body.code).toBe(errors.UNPROCESSABLE_ENTITY)

    done()
  })

  test("You can't escape missingCollation", async () => {
    const { token } = await testUtils.user('admin')

    const csv = `Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status
221304940001,2013,FIRST,222.222.222-22,4/14/1992,BIANCA RIBEIRO ROCHA,Belém,SISTEMAS DE INFORMAÇÃO,CONCLUÍDO`

    {
      const data = utils.parseCsv(csv)
      const digested = utils.digestSigaaData(data)
      await utils.batchUpdateStudents(digested)
    }

    const before = await Student.forge({
      name: 'FIRST'
    }).fetch()

    expect(before).toBeDefined()
    expect(before.get('isConcluding')).toBe(true)
    expect(before.get('isGraduating')).toBe(false)

    const res = await chai
      .request(server.listen())
      .put(`/api/students/${before.get('id')}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        missingCollation: true
      })

    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.isConcluding).toBe(false)
    expect(res.body.isGraduating).toBe(true)
    expect(res.body.isFit).toBe(before.get('isFit'))

    {
      const data = utils.parseCsv(csv)
      const digested = utils.digestSigaaData(data)
      await utils.batchUpdateStudents(digested)
    }

    const after = await Student.forge({
      name: 'FIRST'
    }).fetch()

    expect(after).toBeDefined()
    expect(after.get('isConcluding')).toBe(false)
    expect(after.get('isGraduating')).toBe(true)
    expect(after.get('isFit')).toBe(before.get('isFit'))
  })
})

function pdfFixture(name) {
  return path.join(__dirname, '../fixtures/pdf', name)
}
