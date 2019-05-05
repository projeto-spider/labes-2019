const path = require('path')

module.exports = {
  test: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, './test.sqlite3')
    },
    migrations: {
      directory: path.join(__dirname, './migrations')
    },
    useNullAsDefault: true
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, './dev.sqlite3')
    },
    migrations: {
      directory: path.join(__dirname, './migrations')
    },
    useNullAsDefault: true
  }
}
