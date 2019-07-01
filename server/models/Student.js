const { bookshelf } = require('../db')

const booleanFields = [
  'isFit',
  'isConcluding',
  'isActive',
  'isForming',
  'isGraduating',
  'academicHighlight',
  'cancelled',
  'recordSigned',
  'termPaper'
]

const Student = bookshelf.model('Student', {
  tableName: 'students',

  initialize() {
    this.on('saving', this.onSaving)
  },

  onSaving(model, attrs) {
    if (model.hasChanged('crg')) {
      const update = attrs.crg || model.get('crg')
      const crg = +update.toFixed(3)
      model.set('crg', crg)
    }
  },

  // When you receive from database
  parse,
  // When you're going to convert to JSON
  serialize: parse
})

module.exports = Student

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
