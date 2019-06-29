const dotent = require('dotenv')

const env = process.env.NODE_ENV || 'development'

const silent = env !== 'production'

dotent.config({ silent })

const {
  HOST = '0.0.0.0',
  PORT = '3000',
  JWT_SECRET = 'my-secret',
  API_PAGE_SIZE = 10,
  DATABASE = 'sqlite',
  API_URL_BROWSER = '/',
  DATABASE_TYPE = 'sqlite',
  DATABASE_HOST = null,
  DATABASE_PORT = null,
  DATABASE_USER = null,
  DATABASE_PASS = null,
  DATABASE_NAME = null
} = process.env

module.exports = {
  HOST,
  PORT,
  JWT_SECRET,
  API_PAGE_SIZE,
  DATABASE,
  API_URL_BROWSER,
  DATABASE_TYPE,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASS,
  DATABASE_NAME
}
