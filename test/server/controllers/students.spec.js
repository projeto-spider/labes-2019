/**
 * @jest-environment node
 */

const path = require('path')
const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
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
    expect(felipe.recordSigned).toBeFalsy()
    expect(felipe.termPaper).toBeFalsy()
    expect(felipe.cd).toBeFalsy()
    expect(felipe.isUndergraduate).toBeFalsy()

    expect(laura.isActive).toBeFalsy()
    expect(laura.isForming).toBeFalsy()
    expect(laura.isGraduating).toBeFalsy()
    expect(laura.isConcluding).toBeTruthy()
    expect(laura.cancelled).toBeFalsy()
    expect(laura.recordSigned).toBeFalsy()
    expect(laura.termPaper).toBeFalsy()
    expect(laura.cd).toBeFalsy()
    expect(laura.isUndergraduate).toBeFalsy()

    expect(jose.isActive).toBeFalsy()
    expect(jose.isForming).toBeFalsy()
    expect(jose.isGraduating).toBeFalsy()
    expect(jose.isConcluding).toBeTruthy()
    expect(jose.cancelled).toBeFalsy()
    expect(jose.recordSigned).toBeFalsy()
    expect(jose.termPaper).toBeFalsy()
    expect(jose.cd).toBeFalsy()
    expect(jose.isUndergraduate).toBeFalsy()

    expect(enzo.isActive).toBeTruthy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isConcluding).toBeFalsy()
    expect(enzo.cancelled).toBeFalsy()
    expect(enzo.recordSigned).toBeFalsy()
    expect(enzo.termPaper).toBeFalsy()
    expect(enzo.cd).toBeFalsy()
    expect(enzo.isUndergraduate).toBeFalsy()

    expect(kauan.isActive).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isConcluding).toBeFalsy()
    expect(kauan.cancelled).toBeTruthy()
    expect(kauan.recordSigned).toBeFalsy()
    expect(kauan.termPaper).toBeFalsy()
    expect(kauan.cd).toBeFalsy()
    expect(kauan.isUndergraduate).toBeFalsy()

    expect(eduardo.isActive).toBeTruthy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isConcluding).toBeFalsy()
    expect(eduardo.cancelled).toBeFalsy()
    expect(eduardo.recordSigned).toBeFalsy()
    expect(eduardo.termPaper).toBeFalsy()
    expect(eduardo.cd).toBeFalsy()
    expect(eduardo.isUndergraduate).toBeFalsy()

    expect(julian.isActive).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isConcluding).toBeTruthy()
    expect(julian.cancelled).toBeFalsy()
    expect(julian.recordSigned).toBeFalsy()
    expect(julian.termPaper).toBeFalsy()
    expect(julian.cd).toBeFalsy()
    expect(julian.isUndergraduate).toBeFalsy()

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
    expect(felipe.recordSigned).toBeFalsy()
    expect(felipe.termPaper).toBeFalsy()
    expect(felipe.cd).toBeFalsy()
    expect(felipe.isUndergraduate).toBeFalsy()

    expect(laura.isActive).toBeFalsy()
    expect(laura.isForming).toBeFalsy()
    expect(laura.isGraduating).toBeFalsy()
    expect(laura.isConcluding).toBeTruthy()
    expect(laura.cancelled).toBeFalsy()
    expect(laura.recordSigned).toBeFalsy()
    expect(laura.termPaper).toBeFalsy()
    expect(laura.cd).toBeFalsy()
    expect(laura.isUndergraduate).toBeFalsy()

    expect(jose.isActive).toBeFalsy()
    expect(jose.isForming).toBeFalsy()
    expect(jose.isGraduating).toBeFalsy()
    expect(jose.isConcluding).toBeTruthy()
    expect(jose.cancelled).toBeFalsy()
    expect(jose.recordSigned).toBeFalsy()
    expect(jose.termPaper).toBeFalsy()
    expect(jose.cd).toBeFalsy()
    expect(jose.isUndergraduate).toBeFalsy()

    expect(enzo.isActive).toBeTruthy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isConcluding).toBeFalsy()
    expect(enzo.cancelled).toBeFalsy()
    expect(enzo.recordSigned).toBeFalsy()
    expect(enzo.termPaper).toBeFalsy()
    expect(enzo.cd).toBeFalsy()
    expect(enzo.isUndergraduate).toBeFalsy()

    expect(kauan.isActive).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isGraduating).toBeFalsy()
    expect(kauan.isConcluding).toBeFalsy()
    expect(kauan.cancelled).toBeTruthy()
    expect(kauan.recordSigned).toBeFalsy()
    expect(kauan.termPaper).toBeFalsy()
    expect(kauan.cd).toBeFalsy()
    expect(kauan.isUndergraduate).toBeFalsy()

    expect(eduardo.isActive).toBeTruthy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isConcluding).toBeFalsy()
    expect(eduardo.cancelled).toBeFalsy()
    expect(eduardo.recordSigned).toBeFalsy()
    expect(eduardo.termPaper).toBeFalsy()
    expect(eduardo.cd).toBeFalsy()
    expect(eduardo.isUndergraduate).toBeFalsy()

    expect(julian.isActive).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isConcluding).toBeTruthy()
    expect(julian.cancelled).toBeFalsy()
    expect(julian.recordSigned).toBeFalsy()
    expect(julian.termPaper).toBeFalsy()
    expect(julian.cd).toBeFalsy()
    expect(julian.isUndergraduate).toBeFalsy()

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

  test('PUT /[studentId]', async done => {
    const { token } = await testUtils.user('admin')
    const resComplete = await chai
      .request(server.listen())
      .put('/api/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
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
        prescribed: false,
        mailingList: 'none',
        entryDate: '05-28-2019',
        advisor: 'Novo Orientador',
        defenseDate: '06-30-2019',
        term: null,
        recordSigned: false,
        termPaper: false,
        cd: true,
        isUndergraduate: false
      })
    expect(resComplete.status).toEqual(200)
    expect(resComplete.type).toEqual('application/json')
    expect(resComplete.body).toBeDefined()
    expect(resComplete.body.id).toEqual(1)
    expect(resComplete.body.name).toEqual('ATUALIZA NOME')
    expect(resComplete.body.crg).toEqual(9)
    expect(resComplete.body.advisor).toEqual('Novo Orientador')
    expect(resComplete.body.cd).toBeTruthy()
    expect(resComplete.body.defenseDate).toEqual('06-30-2019')

    const resNome = await chai
      .request(server.listen())
      .put('/api/students/1')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 1,
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
        id: 1000,
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
        prescribed: false,
        mailingList: 'none'
      })
    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.NOT_FOUND)
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
      .get('/api/students/?course=cbcc')
      .set('Authorization', `Bearer ${token}`)
    expect(resCbcc.status).toEqual(200)
    expect(resCbcc.type).toEqual('application/json')
    expect(resCbcc.body).toBeDefined()
    expect(
      resCbcc.body.every(student => student.course === 'cbcc')
    ).toBeTruthy()
    const resCbsi = await chai
      .request(server.listen())
      .get('/api/students/?course=cbsi')
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
      .get('/api/students/?course=invalid')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_FILTER)
    expect(res.body.filter).toEqual('course')
    done()
  })

  test('GET /?name=[STUDENT%20NAME]', async done => {
    const { token } = await testUtils.user('admin')
    const resStudent1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?name=FELIPE SOUZA FERREIRA'))
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
      .get(encodeURI('/api/students/?name=%FERREIRA%'))
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent2.status).toEqual(200)
    expect(resStudent2.type).toEqual('application/json')
    expect(resStudent2.body).toBeDefined()
    expect(
      resStudent2.body.every(student => student.name.includes('FERREIRA'))
    ).toBeTruthy()
    const resStudent3 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?name=KAUAN%'))
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent3.status).toEqual(200)
    expect(resStudent3.type).toEqual('application/json')
    expect(resStudent3.body).toBeDefined()
    expect(
      resStudent3.body.every(student => student.name.startsWith('KAUAN'))
    ).toBeTruthy()
    const resStudent4 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?name=%SANTOS'))
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent4.status).toEqual(200)
    expect(resStudent4.type).toEqual('application/json')
    expect(resStudent4.body).toBeDefined()
    expect(
      resStudent4.body.every(student => student.name.endsWith('SANTOS'))
    ).toBeTruthy()
    done()
  })

  test('GET /?isActive=[0|1]', async done => {
    const { token } = await testUtils.user('admin')
    const resTrue = await chai
      .request(server.listen())
      .get('/api/students/?isActive=1')
      .set('Authorization', `Bearer ${token}`)
    expect(resTrue.status).toEqual(200)
    expect(resTrue.type).toEqual('application/json')
    expect(resTrue.body).toBeDefined()
    expect(resTrue.body.every(student => student.isActive === 1)).toBeTruthy()
    const resFalse = await chai
      .request(server.listen())
      .get('/api/students/?isActive=0')
      .set('Authorization', `Bearer ${token}`)
    expect(resFalse.status).toEqual(200)
    expect(resFalse.type).toEqual('application/json')
    expect(resFalse.body).toBeDefined()
    expect(resFalse.body.every(student => student.isActive === 0)).toBeTruthy()
    done()
  })

  test('GET /?course=cb[cc|si]&name=[STUDANTE%20NAME]', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&name=%FERREIRA%'))
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
      .get(encodeURI('/api/students/?sort=name'))
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
      .get(encodeURI('/api/students/?sort=registrationNumber'))
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
      .get(encodeURI('/api/students/?sort=name&order=DESC'))
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
      .get(encodeURI('/api/students/?sort=registrationNumber&order=DESC'))
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
      .get(encodeURI('/api/students/?sort=name&order=asc'))
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
    done()
  })

  test('GET /?course=cb[cc|si]&sort=parameter', async done => {
    const { token } = await testUtils.user('admin')
    const res1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&sort=name'))
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
      .get(encodeURI('/api/students/?course=cbsi&sort=registrationNumber'))
      .set('Authorization', `Bearer ${token}`)
    expect(res2.status).toEqual(200)
    expect(res2.type).toEqual('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body[0].name).toEqual('JOSE FERREIRA SILVA')
    expect(res2.body[1].name).toEqual('LAURA CARDOSO CASTRO')
    const res3 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&sort=crg&order=desc'))
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
      .get(encodeURI('/api/students/?course=cbsi&sort=crg'))
      .set('Authorization', `Bearer ${token}`)
    expect(res4.status).toEqual(200)
    expect(res4.type).toEqual('application/json')
    expect(res4.body).toBeDefined()
    expect(res4.body[0].name).toEqual('LAURA CARDOSO CASTRO')
    expect(res4.body[1].name).toEqual('JOSE FERREIRA SILVA')
    done()
  })

  test('GET /?course=cb[cc|si]&name=[STUDENT%20NAME]&sort=parameter', async done => {
    const { token } = await testUtils.user('admin')
    const res1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?course=cbcc&name=%SANTOS&sort=name'))
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(res1.body[1].name).toEqual('KAUAN CARVALHO SANTOS')
    const res2 = await chai
      .request(server.listen())
      .get(
        encodeURI(
          '/api/students/?course=cbcc&name=%SANTOS&sort=registrationNumber'
        )
      )
      .set('Authorization', `Bearer ${token}`)
    expect(res2.status).toEqual(200)
    expect(res2.type).toEqual('application/json')
    expect(res2.body).toBeDefined()
    expect(res2.body[0].name).toEqual('JULIAN BARBOSA SANTOS')
    expect(res2.body[1].name).toEqual('KAUAN CARVALHO SANTOS')
    done()
  })

  test('GET /?course=cb[cc|si]&name=[STUDENT%20NAME]&sort=parameter&order=parameter', async done => {
    const { token } = await testUtils.user('admin')
    const res1 = await chai
      .request(server.listen())
      .get(
        encodeURI(
          '/api/students/?course=cbcc&name=%SANTOS&sort=name&order=DESC'
        )
      )
      .set('Authorization', `Bearer ${token}`)
    expect(res1.status).toEqual(200)
    expect(res1.type).toEqual('application/json')
    expect(res1.body).toBeDefined()
    expect(res1.body[0].name).toEqual('KAUAN CARVALHO SANTOS')
    expect(res1.body[1].name).toEqual('JULIAN BARBOSA SANTOS')
    const res2 = await chai
      .request(server.listen())
      .get(
        encodeURI(
          '/api/students/?course=cbcc&name=%SANTOS&sort=registrationNumber&order=ASC'
        )
      )
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
      .get('/api/students/?sort=invalid')
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
      .get('/api/students/?sort=name&order=invalid')
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

  test('GET /?gmail=1', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/?gmail=1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body[0].email).toEqual('naosouativo@gmail.com')

    expect(res.body[1].email).toEqual('slug@gmail.com')

    expect(res.body[2].email).toEqual('dofuturo@gmail.com.br')
    done()
  })

  test('GET /?', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/?gmail=0')
      .set('Authorization', `Bearer ${token}`)
    expect(res.body[0].email).toEqual('notgoo@gmiau.com')

    expect(res.body[1].email).toEqual('youngboy@yahoo.com')

    expect(res.body[2].email).toEqual('naosouativo@gmail.com')

    expect(res.body[3].email).toEqual('slug@gmail.com')

    expect(res.body[4].email).toEqual('dofuturo@gmail.com.br')

    expect(res.body[5].email).toEqual('oldfashioned33@hotmail.com')

    expect(res.body[6].email).toEqual('uneccessary@ufpa.br')
    done()
  })

  test('GET /?email=[STUDENT-EMAIL]', async done => {
    const { token } = await testUtils.user('admin')
    const resStudent1 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?email=naosouativo@gmail.com'))
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
      .get(encodeURI('/api/students/?email=%@gmail.com%'))
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent2.status).toEqual(200)
    expect(resStudent2.type).toEqual('application/json')
    expect(resStudent2.body).toBeDefined()
    expect(
      resStudent2.body.every(student => student.email.includes('@gmail.com'))
    ).toBeTruthy()
    const resStudent3 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?email=slug%'))
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent3.status).toEqual(200)
    expect(resStudent3.type).toEqual('application/json')
    expect(resStudent3.body).toBeDefined()
    expect(
      resStudent3.body.every(student => student.email.startsWith('slug'))
    ).toBeTruthy()
    const resStudent4 = await chai
      .request(server.listen())
      .get(encodeURI('/api/students/?email=%@gmail.com'))
      .set('Authorization', `Bearer ${token}`)
    expect(resStudent4.status).toEqual(200)
    expect(resStudent4.type).toEqual('application/json')
    expect(resStudent4.body).toBeDefined()
    expect(
      resStudent4.body.every(student => student.email.endsWith('@gmail.com'))
    ).toBeTruthy()
    done()
  })
})
