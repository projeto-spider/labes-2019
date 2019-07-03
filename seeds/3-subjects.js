const { subjects } = require('../test/seeds')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('subjects').del()

  return subjects()
}
