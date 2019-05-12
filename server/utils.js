const { knex } = require('./db')
const jwt = require('jsonwebtoken')
/**
 * Given a CSV file with header make an Array of objects
 *
 * @param {string} str - CSV String
 * @return {object[]} An object based on the CSV
 *
 * @example
 *
 *     const csv = `a,b,c
 * 1,2,3`
 *     parseCsv(csv) // [ { a: 1, b: 2, c: 3 } ]
 */
exports.parseCsv = function parseCsv(str) {
  const lines = str.replace('\r\n', '\n').split('\n')

  if (!lines[lines.length - 1]) {
    lines.splice(-1, 1)
  }

  const [head, ...items] = lines

  const headerItens = head.split(',')
  return items.map(item =>
    item.split(',').reduce((acc, value, i) => {
      const prop = headerItens[i]
      acc[prop] = value
      return acc
    }, {})
  )
}

/**
 * Convert an object from SIGAA's CSV (see parseCsv) into
 * proper objects to insert in the table students.
 *
 * @param {object[]} data - Array of objects from SIGAA's CSV
 * @return {object[]} Array of objects ready to insert in the database
 *
 * @example
 *
 *     const csv = `Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status
 * 201704940001,2017,FELIPE SOUZA FERREIRA,111.111.111-11,1/29/1995,VITORIA DIAS ROCHA,Belém,CIENCIA DA COMPUTACAO,ATIVO`
 *     const data = parseCsv(csv)
 *     digestSigaaData(data)
 *     // [{
 *     //   name: 'FELIPE SOUZA FERREIRA',
 *     //   course: 'cbcc',
 *     //   registrationNumber: '201704940001',
 *     //   isFit: false,
 *     //   isConcluding: false,
 *     //   isActive: true,
 *     //   evidence: false,
 *     //   isForming: false,
 *     //   isGraduating: false,
 *     //   academicHighlight: false,
 *     //   cancelled: false,
 *     //   prescribed: false
 *     // }]
 */
exports.digestSigaaData = function digestSigaaData(data) {
  function getCourse(student) {
    return student.Curso === 'CIENCIA DA COMPUTACAO' ? 'cbcc' : 'cbsi'
  }

  function getName(student) {
    return student.Nome
  }

  function getRegistrationNumber(student) {
    return student['Matrícula']
  }

  function getFlags(student) {
    const base = {
      isFit: false,
      isConcluding: false,
      isActive: true,
      evidence: false,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      prescribed: false
    }

    const translateStatus = {
      FORMANDO: 'isForming',
      // We have no evidence GRADUANDO is the real string (Issue #8)
      GRADUANDO: 'isGraduating',
      CONCLUÍDO: 'isConcluding',
      CANCELADO: 'cancelled'
    }

    const keyToOpen = translateStatus[student.Status]
    if (keyToOpen) {
      base[keyToOpen] = true
    }

    const inactive = base.isConcluding || base.cancelled
    if (inactive) {
      base.isActive = false
    }

    return base
  }

  return data.map(student => ({
    name: getName(student),
    course: getCourse(student),
    registrationNumber: getRegistrationNumber(student),
    ...getFlags(student)
  }))
}

/**
 * Batch upsert (insert new, update old) student data
 *
 * @param {object[]} data - Valid objects of student rows
 * @return {Promise} Knex promise
 *
 * @example
 *
 *
 *     const csv = `Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status
 * 201704940001,2017,FELIPE SOUZA FERREIRA,111.111.111-11,1/29/1995,VITORIA DIAS ROCHA,Belém,CIENCIA DA COMPUTACAO,ATIVO`
 *     const data = parseCsv(csv)
 *     const digested = digestSigaaData(data)
 *     await batchUpdateStudents(digested)
 */
exports.batchUpdateStudents = function batchUpdateStudents(data) {
  return knex.transaction(async trx => {
    await Promise.all(
      chunks(data, 20).map(chunk => {
        const query = `
        INSERT INTO
          students (name, registrationNumber, course, isFit, isConcluding, isActive, isForming, isGraduating, academicHighlight, cancelled, prescribed)
        VALUES
          ${chunk.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ')}
        ON CONFLICT
          (registrationNumber)
        DO UPDATE SET
          course = excluded.course,
          isFit = excluded.isFit,
          isConcluding = excluded.isConcluding,
          isActive = excluded.isActive,
          isForming = excluded.isForming,
          isGraduating = excluded.isGraduating,
          academicHighlight = excluded.academicHighlight,
          cancelled = excluded.cancelled,
          prescribed = excluded.prescribed
      `

        const bindings = chunk
          .map(student => [
            student.name,
            student.registrationNumber,
            student.course,
            student.isFit,
            student.isConcluding,
            student.isActive,
            student.isForming,
            student.isGraduating,
            student.academicHighlight,
            student.cancelled,
            student.prescribed
          ])
          .reduce((acc, x) => acc.concat(x), [])

        return trx.raw(query, bindings)
      })
    )
  })
}
/**
 * Injects the pagination headers from Bookshelft to a Koa context
 *
 * @param   {Context} ctx - Koa context
 * @param   {CollectionBase} collectionBase - Result from Bookshelf query
 * @returns {void}
 */
exports.paginateContext = function paginateContext(ctx, collectionBase) {
  const { pagination } = collectionBase
  ctx.set('Pagination-Page', pagination.page)
  ctx.set('Pagination-Page-Size', pagination.pageSize)
  ctx.set('Pagination-Row-Count', pagination.rowCount)
  ctx.set('Pagination-Page-Count', pagination.pageCount)
  ctx.body = collectionBase.toJSON()
}

/**
 * Separate arry in array of arrays (size = chunkSize)
 *
 * @param   {Array} xs - Elements
 * @param   {number} chunkSize - Size of nested array
 * @returns {Array}
 * @example
 *
 *
 *          const xs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
 *          chunks(xs, 3)
 *          // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
 */
function chunks(xs, chunkSize) {
  const length = Math.ceil(xs.length / chunkSize)

  return Array.from({ length }, (_, i) =>
    xs.slice(i * chunkSize, i * chunkSize + chunkSize)
  )
}

exports.chunks = chunks

/*
 * Generate JWT for user
 * @param  {User} user - Bookshelf model
 * @return {string} Token
 *
 * @example
 *
 *    const token = signToken(user)
 *    // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
exports.signToken = function signToken(
  user,
  // 24 hours default exp
  exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24
) {
  return jwt.sign(
    {
      user,
      exp
    },
    'my-secret'
  )
}
