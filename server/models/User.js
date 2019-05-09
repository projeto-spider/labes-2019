const { bookshelf } = require('../db')

const User = bookshelf.model('User', {
  tableName: 'users',
  hasSecurePassword: 'passwordDigest',
  hidden: ['password', 'passwordDigest']
})

module.exports = User
