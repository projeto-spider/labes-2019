const Document = require('../server/models/Document')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('documents').del()

  const data = [
    {
      studentId: 1,
      type: 1,
      url: 'url/file1'
    },
    {
      studentId: 1,
      type: 2,
      url: 'url/file2'
    },
    {
      studentId: 2,
      type: 3,
      url: 'url/file3'
    },
    {
      studentId: 20,
      type: 1,
      url: 'url/file4'
    }
  ]

  return Promise.all(data.map(document => Document.forge(document).save()))
}
