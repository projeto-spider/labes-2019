const { solicitations } = require('../test/seeds')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('solicitations').del()

  return solicitations()
}
