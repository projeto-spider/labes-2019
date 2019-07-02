const path = require('path')
const config = require('./server/config')

const migrations = {
  directory: path.join(__dirname, './migrations')
}

const useNullAsDefault = true

const sqlite = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, config.SQLITE_FILENAME)
  }
}

const otherDatabase = {
  client: config.DATABASE_TYPE,
  connection: {
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    user: config.DATABASE_USER,
    password: config.DATABASE_PASS,
    database: config.DATABASE_NAME
  }
}

const database = config.DATABASE_TYPE === 'sqlite' ? sqlite : otherDatabase

module.exports = {
  test: {
    ...database,
    migrations,
    useNullAsDefault,
    ...(database === sqlite && { connection: ':memory:' })
  },

  development: {
    ...database,
    migrations,
    useNullAsDefault
  },

  production: {
    ...database,
    migrations,
    useNullAsDefault
  }
}
