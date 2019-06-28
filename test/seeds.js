const Document = require('../server/models/Document')
const Pendency = require('../server/models/Pendency')
const Solicitation = require('../server/models/Solicitation')
const Student = require('../server/models/Student')
const Subject = require('../server/models/Subject')
const User = require('../server/models/User')
const { knex } = require('../server/db')

// Use alphabetical order
const data = {
  documents: require('./use-seeds-data/documents'),
  pendencies: require('./use-seeds-data/pendencies'),
  solicitations: require('./use-seeds-data/solicitations'),
  students: require('./use-seeds-data/students'),
  subjects: require('./use-seeds-data/subjects'),
  users: require('./use-seeds-data/users')
}

function documents() {
  return makeSeed(Document, data.documents)
}

function pendencies() {
  return makeSeed(Pendency, data.pendencies)
}

function solicitations() {
  return makeSeed(Solicitation, data.solicitations)
}

function students() {
  return makeSeed(Student, data.students)
}

function subjects() {
  return makeSeed(Subject, data.subjects)
}

function users() {
  return makeSeed(User, data.users)
}

function makeSeed(model, data) {
  return knex.transaction(trx => {
    return Promise.all(
      data.map((item, i) =>
        model.forge({}).save({ ...item, id: i + 1 }, { transacting: trx })
      )
    )
  })
}

exports.documents = documents
exports.pendencies = pendencies
exports.solicitations = solicitations
exports.students = students
exports.subjects = subjects
exports.users = users
