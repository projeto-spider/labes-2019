const Document = require('../server/models/Document')
const Pendency = require('../server/models/Pendency')
const Solicitation = require('../server/models/Solicitation')
const Student = require('../server/models/Student')
const Subject = require('../server/models/Subject')
const User = require('../server/models/User')

// Use alphabetical order
const data = {
  documents: require('./use-seeds-data/documents'),
  pendencies: require('./use-seeds-data/pendencies'),
  solicitations: require('./use-seeds-data/solicitations'),
  students: require('./use-seeds-data/students'),
  subjects: require('./use-seeds-data/subjects'),
  users: require('./use-seeds-data/users')
}

const seeds = new Map([
  ['documents', documents],
  ['pendencies', pendencies],
  ['solicitations', solicitations],
  ['students', students],
  ['subjects', subjects],
  ['users', users]
])

const allNames = Array.from(seeds.keys())

module.exports = async function useSeeds(names = allNames) {
  for (const [key, fn] of seeds.entries()) {
    if (!names.includes(key)) {
      continue
    }

    await fn()
  }

  // return void
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
  return Promise.all(data.map((item, i) => model.forge(item).save()))
}
