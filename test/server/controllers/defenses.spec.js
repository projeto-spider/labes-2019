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
const errors = require('../../../shared/errors')

jest.useFakeTimers()

describe('/api/defenses', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users', 'defenses'])
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
      evaluator2Type: 'external'
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

    const update = { status: 'done' }

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

    const update = { status: 'done' }

    const res = await chai
      .request(server.listen())
      .put(`/api/defenses/1221323123123123`)
      .set('Authorization', `Bearer ${token}`)
      .send(update)

    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')

    done()
  })

  test('GET /defenses get by role', async done => {
    const [admin, teacher] = await Promise.all(
      ['admin', 'teacher'].map(testUtils.user)
    )

    const payload1 = {
      userId: admin.user.id,
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
      userId: teacher.user.id,
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

    const defense = await Promise.all(
      [payload1, payload2].map(payload => Defense.forge(payload).save())
    )

    const resAdmin = await chai
      .request(server.listen())
      .get('/api/defenses/')
      .set('Authorization', `Bearer ${admin.token}`)

    expect(resAdmin.status).toEqual(200)
    expect(resAdmin.type).toEqual('application/json')
    expect(resAdmin.body).toBeDefined()
    expect(resAdmin.body.length).toEqual(2)

    const resTeacher = await chai
      .request(server.listen())
      .get('/api/defenses/')
      .set('Authorization', `Bearer ${teacher.token}`)

    expect(resTeacher.status).toEqual(200)
    expect(resTeacher.type).toEqual('application/json')
    expect(resTeacher.body).toBeDefined()
    expect(resTeacher.body.length).toEqual(1)
    expect(resTeacher.body[0].id).toEqual(defense[1].get('id'))

    done()
  })
})
