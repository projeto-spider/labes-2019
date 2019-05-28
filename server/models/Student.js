const { bookshelf } = require('../db')

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
  }
})

module.exports = Student
