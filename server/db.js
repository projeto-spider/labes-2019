const knexFactory = require('knex')
const bookshelfFactory = require('bookshelf')
const bookshelfSecurePassword = require('bookshelf-secure-password')
const knexFile = require('../knexfile')

const env = process.env.NODE_ENV || 'development'
const config = knexFile[env] || knexFile.development

const knex = knexFactory(config)
const bookshelf = bookshelfFactory(knex)
bookshelf.plugin('registry')
bookshelf.plugin('pagination')
bookshelf.plugin('visibility')
bookshelf.plugin(bookshelfSecurePassword)

exports.knex = knex
exports.bookshelf = bookshelf
