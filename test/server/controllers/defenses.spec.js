/**
 * @jest-environment node
 */
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

const testUtils = require('../test-utils')
const useSeeds = require('../../use-seeds')
const server = require('../../../server')
const db = require('../../../server/db')
const Defense = require('../../../server/models/Defense')
const Student = require('../../../server/models/Student')
const errors = require('../../../shared/errors')

jest.useFakeTimers()
jest.setTimeout(10000)

describe('/api/defenses', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users', 'defenses', 'students'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('GET /defenses', async done => {
    const { token } = await testUtils.user('admin')

    const payload = {
      userId: 1,
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const defense = await Defense.forge(payload).save()

    const res = await chai
      .request(server.listen())
      .get('/api/defenses/')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.length).toBeDefined()
    expect(res.body[0].id).toEqual(defense.get('id'))

    done()
  })

  test('GET /defenses filters', async done => {
    const { token } = await testUtils.user('admin')

    const pendingPayload = {
      userId: 1,
      status: 'pending',
      course: 'cbsi',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const donePayload = {
      userId: 1,
      status: 'done',
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'JOSE FERREIRA SILVA, KAUAN CARVALHO SANTOS',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external',
      grade: 5.0
    }

    const defenses = await Promise.all([
      Defense.forge(pendingPayload).save(),
      Defense.forge(donePayload).save()
    ])

    {
      const res = await chai
        .request(server.listen())
        .get('/api/defenses/')
        .query({ status: 'done' })
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(1)
      expect(res.body[0].id).toEqual(defenses[1].get('id'))
      expect(res.body.every(item => item.status === 'done')).toBeTruthy()
    }

    {
      const res = await chai
        .request(server.listen())
        .get('/api/defenses/')
        .query({ course: 'cbsi' })
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(1)
      expect(res.body[0].id).toEqual(defenses[0].get('id'))
      expect(res.body.every(item => item.course === 'cbsi')).toBeTruthy()
    }

    {
      const res = await chai
        .request(server.listen())
        .get('/api/defenses/')
        .query({ query: '%FELIPE%' })
        .set('Authorization', `Bearer ${token}`)

      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(1)
      expect(res.body[0].id).toEqual(defenses[0].get('id'))
    }

    done()
  })

  test('POST /defenses', async done => {
    const { token } = await testUtils.user('teacher')

    const payload = {
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const res = await chai
      .request(server.listen())
      .post('/api/defenses')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(res.status).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.id).toBeDefined()

    const defense = await Defense.where('id', res.body.id).fetch()

    expect(defense.get('id')).toEqual(res.body.id)
    expect(defense.get('registrationNumbers')).toEqual(
      payload.registrationNumbers
    )
    expect(defense.get('evaluator1Name')).toEqual(payload.evaluator1Name)
    expect(defense.get('summary')).toEqual(payload.summary)
    expect(defense.get('status')).toEqual('pending')

    const students = await Promise.all(
      ['201704940001', '201304940002'].map(registrationNumber =>
        Student.forge({ registrationNumber }).fetch()
      )
    )

    for (const student of students) {
      expect(student.get('defenseId')).toBe(res.body.id)
    }

    done()
  })

  test('POST /defenses to student with defense', async done => {
    const { token } = await testUtils.user('teacher')

    {
      const payload = {
        course: 'cbcc',
        registrationNumbers: '201304940002',
        students: 'LAURA CARDOSO CASTRO',
        local: 'Auditório do ICEN',
        title: 'Fundamentos da Comunicação Analógica',
        keywords: 'Fundamental, comunicacional, analógico',
        summary: 'Sumário fundamentacional',

        advisorName: 'Jonathan Joestar',
        advisorTitle: 'doctor',
        advisorType: 'internal',

        evaluator1Name: 'Robert E. O. Speedwagon',
        evaluator1Title: 'doctor',
        evaluator1Type: 'internal',

        evaluator2Name: 'Narciso Anasui',
        evaluator2Title: 'master',
        evaluator2Type: 'external'
      }

      const res = await chai
        .request(server.listen())
        .post('/api/defenses')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.status).toEqual(201)
    }

    const payload = {
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const res = await chai
      .request(server.listen())
      .post('/api/defenses')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(res.status).toEqual(422)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.STUDENT_HAS_DEFENSE)
    expect(res.body.registrationNumbers.length).toBe(1)
    expect(res.body.registrationNumbers).toContainEqual('201304940002')

    done()
  })

  test('POST /defenses with invalid numbers', async done => {
    const { token } = await testUtils.user('teacher')

    const payload = {
      course: 'cbcc',
      registrationNumbers: '221704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const res = await chai
      .request(server.listen())
      .post('/api/defenses')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(res.status).toEqual(422)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.INVALID_REGISTRATION_NUMBERS)
    expect(res.body.registrationNumbers.length).toBe(1)
    expect(res.body.registrationNumbers).toContainEqual('221704940001')

    done()
  })

  test('POST /defenses missing some fields', async done => {
    const { token } = await testUtils.user('teacher')

    const payload = {
      course: 'cbcc',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const res = await chai
      .request(server.listen())
      .post('/api/defenses')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_REQUEST)
    done()
  })

  test('PUT /defenses', async done => {
    const { token } = await testUtils.user('admin')

    const payload = {
      userId: 1,
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const defense = await Defense.forge(payload).save()

    const update = { status: 'done', grade: 5.0 }

    const res = await chai
      .request(server.listen())
      .put(`/api/defenses/${defense.get('id')}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)

    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.id).toBeDefined()
    expect(res.body.status).toEqual(update.status)

    done()
  })

  test('PUT /defenses for invalid id', async done => {
    const { token } = await testUtils.user('admin')

    const update = { status: 'done', grade: 5.0 }

    const res = await chai
      .request(server.listen())
      .put(`/api/defenses/1221323123123123`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)

    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')

    done()
  })

  test('PUT /defenses with one that already has defense', async done => {
    const admin = await testUtils.user('admin')
    const teacher = await testUtils.user('teacher')

    const defensePayload = ({ registrationNumbers, students }) => ({
      course: 'cbcc',
      registrationNumbers,
      students,
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    })

    const defenses = await Promise.all(
      [
        {
          registrationNumbers: '201704940001',
          students: 'FELIPE SOUZA FERREIRA'
        },
        {
          registrationNumbers: '201304940002',
          students: 'LAURA CARDOSO CASTRO'
        }
      ].map(args =>
        chai
          .request(server.listen())
          .post('/api/defenses')
          .set('Authorization', `Bearer ${teacher.token}`)
          .send(defensePayload(args))
          .then(res => res.body)
      )
    )

    for (const defense of defenses) {
      const payload = {
        registrationNumbers: '201704940001, 201304940002',
        students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO'
      }
      const res = await chai
        .request(server.listen())
        .put(`/api/defenses/${defense.id}`)
        .set('Authorization', `Bearer ${admin.token}`)
        .send(payload)

      expect(res.status).toEqual(422)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toBe(errors.STUDENT_HAS_DEFENSE)
      expect(res.body.registrationNumbers.length).toBe(1)
    }

    done()
  })

  test('PUT /defenses with invalid numbers', async done => {
    const admin = await testUtils.user('admin')
    const teacher = await testUtils.user('teacher')

    const defensePayload = ({ registrationNumbers, students }) => ({
      course: 'cbcc',
      registrationNumbers,
      students,
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    })

    const defense = await chai
      .request(server.listen())
      .post('/api/defenses')
      .set('Authorization', `Bearer ${teacher.token}`)
      .send(
        defensePayload({
          registrationNumbers: '201704940001',
          students: 'FELIPE SOUZA FERREIRA'
        })
      )
      .then(res => res.body)

    const payload = {
      registrationNumbers: '201704940001, 221304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO'
    }
    const res = await chai
      .request(server.listen())
      .put(`/api/defenses/${defense.id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send(payload)

    expect(res.status).toEqual(422)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.INVALID_REGISTRATION_NUMBERS)
    expect(res.body.registrationNumbers.length).toBe(1)
    expect(res.body.registrationNumbers).toContainEqual('221304940002')

    done()
  })

  test('GET /defenses get by role', async done => {
    const [admin, teacher] = await Promise.all(
      ['admin', 'teacher'].map(username => testUtils.user(username))
    )

    const payload1 = {
      userId: admin.user.get('id'),
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const payload2 = {
      userId: teacher.user.get('id'),
      course: 'cbcc',
      registrationNumbers: '200504940003, 201104940004',
      students: 'JOSE FERREIRA SILVA, ENZO FERREIRA ALVES',
      local: 'Auditório do ICEN',
      title: 'Um título aqui',
      keywords: 'Teste, Assunto',
      summary: 'Sumário fundamentacional',

      advisorName: 'Um Orientador',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const defenses = await Promise.all(
      [payload1, payload2].map(payload => Defense.forge(payload).save())
    )

    {
      const res = await chai
        .request(server.listen())
        .get('/api/defenses/')
        .set('Authorization', `Bearer ${admin.token}`)

      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(2)
    }

    {
      const res = await chai
        .request(server.listen())
        .get('/api/defenses/')
        .set('Authorization', `Bearer ${teacher.token}`)

      expect(res.status).toEqual(200)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.length).toEqual(1)
      expect(res.body[0].id).toEqual(defenses[1].get('id'))
    }

    done()
  })

  test('POST /defenses?invalid=1 invalid param/body', async done => {
    const { token } = await testUtils.user('teacher')
    {
      const payload = {
        course: 'cbcc',
        registrationNumbers: '201704940001, 201304940002',
        students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
        local: 'Auditório do ICEN',
        title: 'Fundamentos da Comunicação Analógica',
        keywords: 'Fundamental, comunicacional, analógico',
        summary: 'Sumário fundamentacional',

        advisorName: 'Jonathan Joestar',
        advisorTitle: 'doctor',
        advisorType: 'internal',

        evaluator1Name: 'Robert E. O. Speedwagon',
        evaluator1Title: 'doctor',
        evaluator1Type: 'internal',

        evaluator2Name: 'Narciso Anasui',
        evaluator2Title: 'master',
        evaluator2Type: 'external'
      }

      const res = await chai
        .request(server.listen())
        .post('/api/defenses')
        .query({ invalid: 1 })
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
      expect(res.status).toBe(400)
      expect(res.type).toBe('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_QUERY)
      expect(res.body.invalidParams).toBeDefined()
      expect(res.body.invalidParams.length).toEqual(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    {
      const payload = {
        course: 'cbcc',
        registrationNumbers: '201704940001, 201304940002',
        students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
        local: 'Auditório do ICEN',
        title: 'Fundamentos da Comunicação Analógica',
        keywords: 'Fundamental, comunicacional, analógico',
        summary: 'Sumário fundamentacional',

        advisorName: 'Jonathan Joestar',
        advisorTitle: 'doctor',
        advisorType: 'internal',

        evaluator1Name: 'Robert E. O. Speedwagon',
        evaluator1Title: 'doctor',
        evaluator1Type: 'internal',

        evaluator2Name: 'Narciso Anasui',
        evaluator2Title: 'master',
        evaluator2Type: 'external',

        invalid1: 1,
        invalid2: 2
      }

      const res = await chai
        .request(server.listen())
        .post('/api/defenses')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)
      expect(res.status).toBe(400)
      expect(res.type).toBe('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_BODY)
      expect(res.body.invalidParams).toBeDefined()
      expect(res.body.invalidParams.length).toEqual(2)
      expect(res.body.invalidParams).toContainEqual('invalid1')
      expect(res.body.invalidParams).toContainEqual('invalid2')
    }

    done()
  })

  test('PUT /defenses?invalid=1 invalid param/body', async done => {
    const { token } = await testUtils.user('admin')
    {
      const payload = {
        userId: 1,
        course: 'cbcc',
        registrationNumbers: '201704940001, 201304940002',
        students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
        local: 'Auditório do ICEN',
        title: 'Fundamentos da Comunicação Analógica',
        keywords: 'Fundamental, comunicacional, analógico',
        summary: 'Sumário fundamentacional',
        advisorName: 'Jonathan Joestar',
        advisorTitle: 'doctor',
        advisorType: 'internal',
        evaluator1Name: 'Robert E. O. Speedwagon',
        evaluator1Title: 'doctor',
        evaluator1Type: 'internal',
        evaluator2Name: 'Narciso Anasui',
        evaluator2Title: 'master',
        evaluator2Type: 'external'
      }

      const defense = await Defense.forge(payload).save()

      const update = { status: 'done', grade: 5.0 }

      const res = await chai
        .request(server.listen())
        .put(`/api/defenses/${defense.get('id')}`)
        .query({ invalid: 1 })
        .set('Authorization', `Bearer ${token}`)
        .send(update)

      expect(res.status).toBe(400)
      expect(res.type).toBe('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_QUERY)
      expect(res.body.invalidParams).toBeDefined()
      expect(res.body.invalidParams.length).toEqual(1)
      expect(res.body.invalidParams).toContainEqual('invalid')
    }
    {
      const payload = {
        userId: 1,
        course: 'cbcc',
        registrationNumbers: '201704940001, 201304940002',
        students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
        local: 'Auditório do ICEN',
        title: 'Fundamentos da Comunicação Analógica',
        keywords: 'Fundamental, comunicacional, analógico',
        summary: 'Sumário fundamentacional',
        advisorName: 'Jonathan Joestar',
        advisorTitle: 'doctor',
        advisorType: 'internal',
        evaluator1Name: 'Robert E. O. Speedwagon',
        evaluator1Title: 'doctor',
        evaluator1Type: 'internal',
        evaluator2Name: 'Narciso Anasui',
        evaluator2Title: 'master',
        evaluator2Type: 'external'
      }

      const defense = await Defense.forge(payload).save()

      const update = {
        status: 'done',
        invalid1: 1,
        invalid2: 2,
        grade: 5.0
      }

      const res = await chai
        .request(server.listen())
        .put(`/api/defenses/${defense.get('id')}`)
        .set('Authorization', `Bearer ${token}`)
        .send(update)

      expect(res.status).toBe(400)
      expect(res.type).toBe('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toEqual(errors.INVALID_BODY)
      expect(res.body.invalidParams).toBeDefined()
      expect(res.body.invalidParams.length).toEqual(2)
      expect(res.body.invalidParams).toContainEqual('invalid1')
      expect(res.body.invalidParams).toContainEqual('invalid2')
    }
    done()
  })

  test('GET /defenses invalid params', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .get('/api/defenses/')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(400)
    expect(res.type).toBe('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_QUERY)
    expect(res.body.invalidParams).toBeDefined()
    expect(res.body.invalidParams.length).toEqual(1)
    expect(res.body.invalidParams).toContainEqual('invalid')

    done()
  })

  test('GET /defenses/:id/pdf/:files', async done => {
    const { token } = await testUtils.user('admin')

    const payload = {
      userId: 2,
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      date: '05/05/2010',
      time: '03:40:00',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external',

      passed: true,
      grade: 10.0
    }

    await Defense.forge(payload).save()

    const resAll = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf')
      .set('Authorization', `Bearer ${token}`)
    expect(resAll.status).toEqual(200)
    expect(resAll.type).toEqual('application/pdf')
    expect(resAll.body).toBeDefined()

    const resAta = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/ata')
      .set('Authorization', `Bearer ${token}`)
    expect(resAta.status).toEqual(200)
    expect(resAta.type).toEqual('application/pdf')
    expect(resAta.body).toBeDefined()

    const resCd = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/cd')
      .set('Authorization', `Bearer ${token}`)
    expect(resCd.status).toEqual(200)
    expect(resCd.type).toEqual('application/pdf')
    expect(resCd.body).toBeDefined()

    const resCertification = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/certificado1')
      .set('Authorization', `Bearer ${token}`)
    expect(resCertification.status).toEqual(200)
    expect(resCertification.type).toEqual('application/pdf')
    expect(resCertification.body).toBeDefined()

    const resInvalidCert1 = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/certificado5')
      .set('Authorization', `Bearer ${token}`)
    expect(resInvalidCert1.status).toEqual(404)
    expect(resInvalidCert1.type).toEqual('application/json')
    expect(resInvalidCert1.body.code).toEqual(errors.NOT_FOUND)

    const resInvalidCert2 = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/certificado5')
      .set('Authorization', `Bearer ${token}`)
    expect(resInvalidCert2.status).toEqual(404)
    expect(resInvalidCert2.type).toEqual('application/json')
    expect(resInvalidCert2.body.code).toEqual(errors.NOT_FOUND)

    const resCredentials = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/credenciamento4')
      .set('Authorization', `Bearer ${token}`)
    expect(resCredentials.status).toEqual(200)
    expect(resCredentials.type).toEqual('application/pdf')
    expect(resCredentials.body).toBeDefined()

    const resInvalidCred = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/credenciamento2')
      .set('Authorization', `Bearer ${token}`)
    expect(resInvalidCred.status).toEqual(404)
    expect(resInvalidCred.type).toEqual('application/json')
    expect(resInvalidCred.body.code).toEqual(errors.NOT_FOUND)

    const resPublishing = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/divulgacao')
      .set('Authorization', `Bearer ${token}`)
    expect(resPublishing.status).toEqual(200)
    expect(resPublishing.type).toEqual('application/pdf')
    expect(resPublishing.body).toBeDefined()

    const resInvalid1 = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf/lalilulelo')
      .set('Authorization', `Bearer ${token}`)
    expect(resInvalid1.status).toEqual(400)
    expect(resInvalid1.body).toBeDefined()
    expect(resInvalid1.body.param).toEqual('lalilulelo')
    expect(resInvalid1.body.code).toEqual(errors.INVALID_REQUEST)

    const resInvalid2 = await chai
      .request(server.listen())
      .get('/api/defenses/lalilulelo')
      .set('Authorization', `Bearer ${token}`)
    expect(resInvalid2.status).toEqual(404)
    expect(resInvalid2.body).toBeDefined()
    expect(resInvalid2.body.code).toEqual(errors.NOT_FOUND)

    done()
  })

  test('GET /defenses/:id/pdf invalid query', async done => {
    const { token } = await testUtils.user('admin')

    const res = await chai
      .request(server.listen())
      .get('/api/defenses/1/pdf')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.INVALID_QUERY)
    expect(res.body.invalidParams).toBeDefined()
    expect(res.body.invalidParams.length).toEqual(1)
    expect(res.body.invalidParams).toContainEqual('invalid')

    done()
  })

  test('GET /defenses/:id', async done => {
    const { token } = await testUtils.user('admin')

    const payload = {
      userId: 1,
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const defense = await Defense.forge(payload).save()

    const res = await chai
      .request(server.listen())
      .get(`/api/defenses/${defense.get('id')}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.id).toEqual(defense.get('id'))

    done()
  })

  test('GET /defenses/:id 404', async done => {
    const { token } = await testUtils.user('admin')

    const payload = {
      userId: 1,
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    await Defense.forge(payload).save()

    const res = await chai
      .request(server.listen())
      .get(`/api/defenses/20000`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.NOT_FOUND)

    done()
  })

  test('PUT /defenses/:id done without grade', async done => {
    const { token } = await testUtils.user('admin')

    const payload = {
      userId: 1,
      course: 'cbcc',
      registrationNumbers: '201704940001, 201304940002',
      students: 'FELIPE SOUZA FERREIRA, LAURA CARDOSO CASTRO',
      local: 'Auditório do ICEN',
      title: 'Fundamentos da Comunicação Analógica',
      keywords: 'Fundamental, comunicacional, analógico',
      summary: 'Sumário fundamentacional',

      advisorName: 'Jonathan Joestar',
      advisorTitle: 'doctor',
      advisorType: 'internal',

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }

    const defense = await Defense.forge(payload).save()

    const update = { status: 'done' }

    const res = await chai
      .request(server.listen())
      .put(`/api/defenses/${defense.get('id')}`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)

    expect(res.status).toEqual(422)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.MISSING_GRADE)

    done()
  })
})
