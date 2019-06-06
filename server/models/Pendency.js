const { bookshelf } = require('../db')

const Pendency = bookshelf.model('Pendency', {
  tableName: 'pendencies'
})

module.exports = Pendency
