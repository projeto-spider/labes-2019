/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const db = require('../../../server/db')
const useSeeds = require('../../use-seeds')
const Defense = require('../../../server/models/Defense')

jest.useFakeTimers()

describe('models/Defense', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['students', 'defenses'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('Create a Defense', async done => {
    const payload = {
      userId: 3, // teacher
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
      advisorIsTeacher: true,

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',
      evaluator1IsTeacher: false,

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external',
      evaluator2IsTeacher: true
    }
    const defense = await Defense.forge(payload).save()
    expect(defense.get('id')).toBeDefined()
    expect(defense.get('registrationNumbers')).toEqual(
      payload.registrationNumbers
    )
    expect(defense.get('evaluator1Name')).toEqual(payload.evaluator1Name)
    expect(defense.get('summary')).toEqual(payload.summary)
    expect(defense.get('advisorIsTeacher')).toBe(true)
    expect(defense.get('evaluator1IsTeacher')).toBe(false)
    expect(defense.get('evaluator2IsTeacher')).toBe(true)
    done()
  })

  test('Force booleans', async done => {
    const defense = await Defense.forge({
      userId: 3, // teacher
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
      advisorIsTeacher: true,

      coAdvisorName: 'Jonathan Joestar',
      coAdvisorTitle: 'doctor',
      coAdvisorType: 'internal',
      coAdvisorIsTeacher: false,

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',
      evaluator1IsTeacher: false,

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external',
      evaluator2IsTeacher: true,

      evaluator3Name: 'Narciso Anasui',
      evaluator3Title: 'master',
      evaluator3Type: 'external',
      evaluator3IsTeacher: true
    }).save()

    const booleanFields = [
      'advisorIsTeacher',
      'coAdvisorIsTeacher',
      'evaluator1IsTeacher',
      'evaluator2IsTeacher',
      'evaluator3IsTeacher'
    ]

    const obj = JSON.parse(JSON.stringify(defense))

    for (const field of booleanFields) {
      expect(typeof defense.get(field)).toBe('boolean')
      expect(typeof obj[field]).toBe('boolean')
    }

    done()
  })
})
