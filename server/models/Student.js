const { bookshelf } = require('../db')

const Student = bookshelf.model('Student', {
  tableName: 'students'
})

module.exports = Student
