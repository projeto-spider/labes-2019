const { users } = require('../test/seeds')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('users').del()

  return users()
}
