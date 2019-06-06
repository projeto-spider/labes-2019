const Pendency = require('../server/models/Pendency')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('pendencies').del()

  const data = [
    {
      studentId: 1,
      subjectId: 1
    },
    {
      studentId: 1,
      subjectId: 2
    },
    {
      studentId: 1,
      subjectId: 3
    },
    {
      studentId: 2,
      subjectId: 1
    },
    {
      studentId: 3,
      subjectId: 1
    },
    {
      studentId: 3,
      subjectId: 3
    },
    {
      studentId: 5,
      subjectId: 6
    }
  ]

  return Promise.all(data.map(pendency => Pendency.forge(pendency).save()))
}
