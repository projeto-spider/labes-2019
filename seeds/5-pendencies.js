const { pendencies } = require('../test/seeds')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('pendencies').del()

  return pendencies()
}
