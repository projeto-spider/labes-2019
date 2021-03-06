/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const db = require('../../../server/db')
const useSeeds = require('../../use-seeds')
const Document = require('../../../server/models/Document')

jest.useFakeTimers()

describe('models/Document', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['students', 'documents'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('Create a Document', async done => {
    const document = await Document.forge({
      studentId: 1,
      type: 1,
      url: 'url_file'
    }).save()
    expect(document.id).toBeDefined()
    expect(document.attributes.studentId).toEqual(1)
    expect(document.attributes.type).toEqual(1)
    expect(document.attributes.url).toEqual('url_file')
    done()
  })
})
