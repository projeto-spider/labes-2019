/**
 * @jest-environment node
 */

const chai = require('chai')
const chaiHttp = require('chai-http')
chai.use(chaiHttp)

const testUtils = require('../test-utils')
const db = require('../../../server/db')
const Setting = require('../../../server/models/Setting')

jest.useFakeTimers()

describe('Setting', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('Create a Setting', async done => {
    const setting = await Setting.forge({
      key: 'x',
      value: 'y'
    }).save()
    expect(setting.id).toBeDefined()
    expect(setting.get('key')).toBe('x')
    expect(setting.get('value')).toBe('y')
    done()
  })

  test('Test values', async done => {
    {
      const { id } = await Setting.forge({
        key: 'string',
        value: 'Ora Ora Ora'
      }).save()
      const setting = await Setting.forge({ id }).fetch()
      expect(setting.get('value')).toBe('Ora Ora Ora')
    }

    {
      const { id } = await Setting.forge({
        key: 'number',
        value: '10'
      }).save()
      const setting = await Setting.forge({ id }).fetch()
      expect(setting.get('value')).toBe('10')
    }

    {
      const { id } = await Setting.forge({
        key: 'array',
        value: '[1, 2, 3]'
      }).save()
      const setting = await Setting.forge({ id }).fetch()
      expect(setting.get('value')).toEqual('[1, 2, 3]')
    }

    {
      const { id } = await Setting.forge({
        key: 'object',
        value: '{ x: 1 }'
      }).save()
      const setting = await Setting.forge({ id }).fetch()
      expect(setting.get('value')).toEqual('{ x: 1 }')
    }

    {
      const { id } = await Setting.forge({
        key: 'null',
        value: 'null'
      }).save()
      const setting = await Setting.forge({ id }).fetch()
      expect(setting.get('value')).toBe('null')
    }

    done()
  })
})
