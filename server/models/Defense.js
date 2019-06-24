const { bookshelf } = require('../db')

const Defense = bookshelf.model('Defense', {
  tableName: 'defenses'
})

module.exports = Defense
