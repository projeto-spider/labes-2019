const { bookshelf } = require('../db')

const Document = bookshelf.model('Document', {
  tableName: 'documents'
})

module.exports = Document
