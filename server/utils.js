const path = require('path')
const jwt = require('jsonwebtoken')
const enums = require('../shared/enums')
const config = require('./config')
const { knex } = require('./db')
const Student = require('./models/Student')
const Documents = require('./models/Document')
const Pendency = require('./models/Pendency')

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
  const columnSplitter = /,|;/
  const lines = str.split(/\n|\r\n/).filter(line => line)

  const [head, ...items] = lines

  const headerItens = head.split(columnSplitter)
  return items.map(item =>
    item.split(columnSplitter).reduce((acc, value, i) => {
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
 *     //   isForming: false,
 *     //   isGraduating: false,
 *     //   academicHighlight: false,
 *     //   cancelled: false,
 *     //   mailingListToAdd: 'active'
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
      isConcluding: false,
      isActive: true,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      mailingListToAdd: 'none'
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

    if (base.isConcluding) {
      base.mailingListToAdd = 'concluding'
    }

    if (base.isActive) {
      base.mailingListToAdd = 'active'
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
  const registrationNumbers = data.map(
    ({ registrationNumber }) => registrationNumber
  )
  return knex.transaction(async trx => {
    const studentsCollection = await Student.fetchAll({
      transacting: trx
    })
    const existingStudents = studentsCollection
      .toJSON()
      .filter(({ registrationNumber }) =>
        registrationNumbers.includes(registrationNumber)
      )
    const existingRegistrationNumbers = new Set(
      existingStudents.map(({ registrationNumber }) => registrationNumber)
    )
    const result = await Promise.all(
      data.map(student => {
        // New student
        if (!existingRegistrationNumbers.has(student.registrationNumber)) {
          return new Student(student).save(null, { transacting: trx })
        }

        // Old student
        const model = existingStudents.find(
          ({ registrationNumber }) =>
            registrationNumber === student.registrationNumber
        )
        const { id } = model
        const changedMailingList =
          student.mailingListToAdd !== model.mailingList
        const mailingListToAdd = changedMailingList
          ? student.mailingListToAdd
          : 'none'
        const mailingListToRemove = changedMailingList
          ? model.mailingList
          : model.mailingListToRemove

        // Client wants to force people that missed collation
        // to isGraduating. Don't give much thought here.
        if (model.missingCollation && student.isConcluding) {
          student.isConcluding = false
          student.isGraduating = true
        }

        const payload = { ...student, mailingListToAdd, mailingListToRemove }
        return Student.forge({ id }).save(payload, {
          patch: true,
          transacting: trx
        })
      })
    )

    await Promise.all(
      result
        .filter(student => student.get('isGraduating'))
        .map(student =>
          Pendency.where('studentId', student.get('id'))
            .destroy({
              transacting: trx
            })
            .catch(err => {
              if (err.message !== 'No Rows Deleted') {
                throw err
              }
            })
        )
    )

    return result
  })
}
/**
 * Injects the pagination headers from Bookshelf to a Koa context
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
    config.JWT_SECRET
  )
}

/*
 * Update Student isFit flag
 * @param {Student} student - Bookshelf model
 * @returns {Student} student - Bookshelf model
 */
exports.updateStudentFitness = async function updateStudentFitness(student) {
  const docTypes = (await Documents.where({ studentId: student.id }).fetchAll())
    .toJSON()
    .map(entry => entry.type)
  const hasCd = +student.get('cd') === 1 || student.get('cd') === true
  const hasAta = docTypes.includes(enums.documents.ATA)
  const hasLauda = docTypes.includes(enums.documents.LAUDA)
  const isFit = hasCd && hasAta && hasLauda

  const currentValue =
    +student.get('isFit') === 1 || student.get('isFit') === true
  const changed = currentValue !== isFit

  if (changed) {
    await student.save({ isFit })
  }

  return student
}

exports.fileName = function filename(dirStudents, studentFind, documentType) {
  return path.join(
    dirStudents,
    `${studentFind.get('registrationNumber')}-${
      enums.documents[documentType]
    }.pdf`
  )
}

/**
 * @param {Object} payload - Target object
 * @param {Array} knownProperties - Known keys list
 * @returns {valid:Boolean,invalidParams:Array}
 */
function validatePayload(payload, knownProperties) {
  const keysObject = Object.keys(payload)

  const invalidParams = keysObject.filter(key => !knownProperties.includes(key))
  const valid = invalidParams.length === 0

  return { valid, invalidParams }
}
exports.validatePayload = validatePayload

exports.validateQuery = function validateQuery(payload, knownProperties) {
  const newKnownProperties = ['token', ...knownProperties]
  return validatePayload(payload, newKnownProperties)
}

/**
 * @param {Array} payload - Target list
 * @param {Array} knownTypes - Known types list
 * @returns { valid:Boolean, invalidParams:Array }
 */
exports.validateType = function validateType(payload, knownTypes) {
  const invalidParams = payload.filter(
    value => !knownTypes.includes(typeof value)
  )
  const valid = invalidParams.length === 0
  return { valid, invalidParams }
}

exports.translate = function translate(info) {
  const translations = {
    cbcc: 'Ciência da Computação',
    cbsi: 'Sistemas de Informação',
    doctor: 'Dr(a). ',
    master: 'MSc. ',
    other: '',
    '1': 'Janeiro',
    '2': 'Fevereiro',
    '3': 'Março',
    '4': 'Abril',
    '5': 'Maio',
    '6': 'Junho',
    '7': 'Julho',
    '8': 'Agosto',
    '9': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro'
  }
  const result = translations[info]
  return result === undefined ? info : result
}
