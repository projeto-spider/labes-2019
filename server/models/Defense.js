const { bookshelf } = require('../db')

const booleanFields = [
  'advisorIsTeacher',
  'coAdvisorIsTeacher',
  'evaluator1IsTeacher',
  'evaluator2IsTeacher',
  'evaluator3IsTeacher'
]

const Defense = bookshelf.model('Defense', {
  tableName: 'defenses',

  // When you receive from database
  parse,
  // When you're going to convert to JSON
  serialize: parse
})

module.exports = Defense

function parse(received) {
  const attributes = { ...this.attributes, ...received }

  // SQLite have numbers as booleans
  for (const key of booleanFields) {
    if (attributes[key] !== undefined) {
      attributes[key] = Boolean(attributes[key])
    }
  }

  return attributes
}
