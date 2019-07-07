const { bookshelf } = require('../db')

const Setting = bookshelf.model('Setting', {
  tableName: 'settings'
})

module.exports = Setting
