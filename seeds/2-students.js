const { students } = require('../test/seeds')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('students').del()

  return students()
}
