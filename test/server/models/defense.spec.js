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

      evaluator1Name: 'Robert E. O. Speedwagon',
      evaluator1Title: 'doctor',
      evaluator1Type: 'internal',

      evaluator2Name: 'Narciso Anasui',
      evaluator2Title: 'master',
      evaluator2Type: 'external'
    }
    const defense = await Defense.forge(payload).save()
    expect(defense.id).toBeDefined()
    expect(defense.attributes.registrationNumbers).toEqual(
      payload.registrationNumbers
    )
    expect(defense.attributes.evaluator1Name).toEqual(payload.evaluator1Name)
    expect(defense.attributes.summary).toEqual(payload.summary)
    done()
  })
})
