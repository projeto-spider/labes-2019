/**
 * @jest-environment node
 */
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

const testUtils = require('../test-utils')
const server = require('../../../server')
const db = require('../../../server/db')
const Defense = require('../../../server/models/Defense')
const errors = require('../../../shared/errors')

jest.useFakeTimers()

describe('/api/documents', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

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
})
