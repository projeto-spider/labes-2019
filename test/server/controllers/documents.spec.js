/**
 * @jest-environment node
 */
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const fse = require('fs-extra')
const rimraf = require('rimraf')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
jest.setTimeout(10000)

const testUtils = require('../test-utils')
const useSeeds = require('../../use-seeds')
const server = require('../../../server')
const db = require('../../../server/db')
const errors = require('../../../shared/errors')
const enums = require('../../../shared/enums')
const Document = require('../../../server/models/Document')

const mk = promisify(fs.mkdir)
const write = promisify(fs.writeFile)
const access = promisify(fs.access)
const rimrafSync = promisify(rimraf)

jest.useFakeTimers()

describe('/api/documents', () => {
  beforeAll(async () => {
    await db.knex.migrate.latest()
  }, 100000)
  beforeEach(async () => {
    await useSeeds(['users', 'documents', 'students'])
  }, 100000)
  afterEach(async () => {
    await testUtils.wipe(db.knex)
  }, 100000)

  test('GET /students/:studentId/documents', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/documents')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.every(document => document.studentId === 1)).toBeTruthy()
    done()
  })

  test('GET /students/:studentId/documents/:documentId', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/documents/2')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(200)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.id).toEqual(2)
    expect(res.body.studentId).toEqual(1)
    done()
  })

  test('DELETE /students/:studentId/documents/:documentId', async done => {
    const dir = path.join(__dirname, '../../../storage/201704940001')
    const file = path.join(dir, '201704940001-ATA.pdf')
    await mk(dir, { recursive: true })
    await write(file, '')
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .del('/api/students/1/documents/1')
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(204)
    expect(res.body).toEqual({})
    expect(await fse.pathExists(file)).toBe(false)
    done()
  })

  test('GET /students/:invalid/documents', async done => {
    const { token } = await testUtils.user('admin')
    const resChar = await chai
      .request(server.listen())
      .get('/api/students/aaaa/documents')
      .set('Authorization', `Bearer ${token}`)
    expect(resChar.status).toEqual(404)
    expect(resChar.type).toEqual('application/json')
    expect(resChar.body).toBeDefined()
    expect(resChar.body.code).toEqual(errors.NOT_FOUND)
    const resId = await chai
      .request(server.listen())
      .get('/api/students/10000/documents')
      .set('Authorization', `Bearer ${token}`)
    expect(resId.status).toEqual(404)
    expect(resId.type).toEqual('application/json')
    expect(resId.body).toBeDefined()
    expect(resId.body.code).toEqual(errors.NOT_FOUND)
    const resCharDoc = await chai
      .request(server.listen())
      .get('/api/students/1/documents/a')
      .set('Authorization', `Bearer ${token}`)
    expect(resCharDoc.status).toEqual(404)
    expect(resCharDoc.type).toEqual('application/json')
    expect(resCharDoc.body).toBeDefined()
    expect(resCharDoc.body.code).toEqual(errors.NOT_FOUND)
    const resIdDoc = await chai
      .request(server.listen())
      .get('/api/students/1/documents/39383321')
      .set('Authorization', `Bearer ${token}`)
    expect(resIdDoc.status).toEqual(404)
    expect(resIdDoc.type).toEqual('application/json')
    expect(resIdDoc.body).toBeDefined()
    expect(resIdDoc.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  function pdfFixture(name) {
    return path.join(__dirname, '../fixtures/pdf', name)
  }

  test('POST /:studentId/documents', async done => {
    const { token } = await testUtils.user('admin')
    const dirUploads = path.join(__dirname, '../../../storage/')
    try {
      await access(dirUploads)
      await rimrafSync(dirUploads)
    } catch (e) {}
    const res = await chai
      .request(server.listen())
      .post('/api/students/1/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('documentType', enums.documents.ATA)
      .attach('file', pdfFixture('test.pdf'), 'test.pdf')
      .type('form')
    expect(res.status).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    const resView = await chai
      .request(server.listen())
      .get('/api/students/1/documents/1/view')
      .set('Authorization', `Bearer ${token}`)
    expect(resView.status).toEqual(200)
    expect(resView.type).toEqual('application/pdf')
    expect(resView.body).toBeDefined()
    done()
  })

  test('POST /:studentId/documents invalid documentType', async done => {
    const { token } = await testUtils.user('admin')
    const dirUploads = path.join(__dirname, '../../../storage/')
    try {
      await access(dirUploads)
      await rimrafSync(dirUploads)
    } catch (e) {}
    const res = await chai
      .request(server.listen())
      .post('/api/students/1/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('documentType', 333)
      .attach('file', pdfFixture('test.pdf'), 'test.pdf')
      .type('form')
    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  test('POST /:studentId/documents studentId invalid', async done => {
    const { token } = await testUtils.user('admin')
    const dirUploads = path.join(__dirname, '../../../storage/')
    try {
      await access(dirUploads)
      await rimrafSync(dirUploads)
    } catch (e) {}
    const res = await chai
      .request(server.listen())
      .post('/api/students/10000/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('documentType', enums.documents.LAUDA)
      .attach('file', pdfFixture('test.pdf'), 'test.pdf')
      .type('form')
    expect(res.status).toEqual(404)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.NOT_FOUND)
    done()
  })

  test('POST /:studentId/documents file type invalid', async done => {
    const { token } = await testUtils.user('admin')
    const dirUploads = path.join(__dirname, '../../../storage/')
    try {
      await access(dirUploads)
      await rimrafSync(dirUploads)
    } catch (e) {}
    const res = await chai
      .request(server.listen())
      .post('/api/students/1/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('documentType', enums.documents.ATA)
      .attach('file', pdfFixture('file_invalid.txt'), 'file_invalid.txt')
      .type('form')
    expect(res.status).toEqual(400)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    expect(res.body.code).toEqual(errors.UPLOAD_FILE_TYPE_INVALID)
    done()
  })

  test('POST /:studentId/documents (update student)', async done => {
    const { token } = await testUtils.user('admin')
    const dirUploads = path.join(__dirname, '../../../storage/')
    try {
      await access(dirUploads)
      await rimrafSync(dirUploads)
    } catch (e) {}
    const resInsertDocument = await chai
      .request(server.listen())
      .post('/api/students/2/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('documentType', enums.documents.LAUDA)
      .attach('file', pdfFixture('test.pdf'), 'test.pdf')
      .type('form')
    expect(resInsertDocument.status).toEqual(201)
    expect(resInsertDocument.type).toEqual('application/json')
    expect(resInsertDocument.body).toBeDefined()

    const doc = await Document.forge({
      studentId: 2,
      type: enums.documents.LAUDA
    }).fetch()

    const resView1 = await chai
      .request(server.listen())
      .get(`/api/students/2/documents/${doc.get('id')}/view`)
      .set('Authorization', `Bearer ${token}`)
    expect(resView1.status).toEqual(200)
    expect(resView1.type).toEqual('application/pdf')
    expect(resView1.body).toBeDefined()
    const resUpdateStudent = await chai
      .request(server.listen())
      .put('/api/students/2')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'ATUALIZA NOME DO ESTUDANTE',
        crg: 5
      })
    expect(resUpdateStudent.status).toEqual(200)
    expect(resUpdateStudent.type).toEqual('application/json')
    expect(resUpdateStudent.body).toBeDefined()
    expect(resUpdateStudent.body.id).toEqual(2)
    expect(resUpdateStudent.body.name).toEqual('ATUALIZA NOME DO ESTUDANTE')
    expect(resUpdateStudent.body.crg).toEqual(5)
    const resView2 = await chai
      .request(server.listen())
      .get(`/api/students/2/documents/${doc.get('id')}/view`)
      .set('Authorization', `Bearer ${token}`)
    expect(resView2.status).toEqual(200)
    expect(resView2.type).toEqual('application/pdf')
    expect(resView2.body).toBeDefined()
    done()
  })

  test('GET /students/:studentId/documents/:documentId?invalid=1 invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/documents/2')
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

  test('GET /students/:studentId/documents?invalid=1 invalid query', async done => {
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .get('/api/students/1/documents')
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

  test('POST /:studentId/documents?invalid=1 invalid query/body', async done => {
    const { token } = await testUtils.user('admin')
    const dirUploads = path.join(__dirname, '../../../storage/')
    if (fs.existsSync(dirUploads)) {
      rimraf.sync(dirUploads)
    }
    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/1/documents')
        .query({ invalidQuery: 1 })
        .set('Authorization', `Bearer ${token}`)
        .field('documentType', enums.documents.ATA)
        .attach('file', pdfFixture('test.pdf'), 'test.pdf')
        .type('form')
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toBe(errors.INVALID_QUERY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalidQuery')
    }
    {
      const res = await chai
        .request(server.listen())
        .post('/api/students/1/documents')
        .set('Authorization', `Bearer ${token}`)
        .field('invalidBody', enums.documents.ATA)
        .attach('file', pdfFixture('test.pdf'), 'test.pdf')
        .type('form')
      expect(res.status).toEqual(400)
      expect(res.type).toEqual('application/json')
      expect(res.body).toBeDefined()
      expect(res.body.code).toBe(errors.INVALID_BODY)
      expect(res.body.invalidParams.length).toBe(1)
      expect(res.body.invalidParams).toContainEqual('invalidBody')
    }
    done()
  })

  test('POST /:studentId/documents invalid query on view', async done => {
    const { token } = await testUtils.user('admin')
    const dirUploads = path.join(__dirname, '../../../storage/')
    if (fs.existsSync(dirUploads)) {
      rimraf.sync(dirUploads)
    }
    const res = await chai
      .request(server.listen())
      .post('/api/students/1/documents')
      .set('Authorization', `Bearer ${token}`)
      .field('documentType', enums.documents.ATA)
      .attach('file', pdfFixture('test.pdf'), 'test.pdf')
      .type('form')
    expect(res.status).toEqual(201)
    expect(res.type).toEqual('application/json')
    expect(res.body).toBeDefined()
    const resView = await chai
      .request(server.listen())
      .get('/api/students/1/documents/1/view')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(resView.status).toEqual(400)
    expect(resView.type).toEqual('application/json')
    expect(resView.body).toBeDefined()
    expect(resView.body.code).toBe(errors.INVALID_QUERY)
    expect(resView.body.invalidParams.length).toBe(1)
    expect(resView.body.invalidParams).toContainEqual('invalid')
    done()
  })

  test('DELETE /students/:studentId/documents/:documentId?invalid=1 invalid query', async done => {
    const dir = path.join(__dirname, '../../../storage/201704940001')
    const file = path.join(dir, '201704940001-ATA.pdf')
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(file)
    const { token } = await testUtils.user('admin')
    const res = await chai
      .request(server.listen())
      .del('/api/students/1/documents/1')
      .query({ invalid: 1 })
      .set('Authorization', `Bearer ${token}`)
    expect(res.status).toEqual(400)
    expect(res.body).toBeDefined()
    expect(res.body.code).toBe(errors.INVALID_QUERY)
    expect(res.body.invalidParams.length).toBe(1)
    expect(res.body.invalidParams).toContainEqual('invalid')
    done()
  })
})
