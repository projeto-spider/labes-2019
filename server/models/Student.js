const { bookshelf } = require('../db')

const booleanFields = [
  'isFit',
  'isConcluding',
  'isActive',
  'isForming',
  'isGraduating',
  'academicHighlight',
  'cancelled',
  'prescribed',
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

  parse() {
    const attributes = { ...this.attributes }

    for (const key of booleanFields) {
      if (attributes[key] !== undefined) {
        attributes[key] = Boolean(attributes[key])
      }
    }

    return attributes
  }
})

module.exports = Student
