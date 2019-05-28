const { bookshelf } = require('../db')

const Subject = bookshelf.model('Subject', {
  tableName: 'subjects'
})

module.exports = Subject
