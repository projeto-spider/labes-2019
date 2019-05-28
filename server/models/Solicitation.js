const { bookshelf } = require('../db')

const Solicitation = bookshelf.model('Solicitation', {
  tableName: 'solicitations'
})

module.exports = Solicitation
