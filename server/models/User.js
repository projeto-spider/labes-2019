const { bookshelf } = require('../db')

const User = bookshelf.model('User', {
  tableName: 'users',
  hidden: ['password']
})

module.exports = User
