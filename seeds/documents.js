const Document = require('../server/models/Document')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('documents').del()

  const data = [
    {
      studentID: 1,
      type: 1,
      URL: 'url/file1'
    },
    {
      studentID: 1,
      type: 2,
      URL: 'url/file2'
    },
    {
      studentID: 2,
      type: 3,
      URL: 'url/file3'
    },
    {
      studentID: 20,
      type: 1,
      URL: 'url/file4'
    }
  ]

  return Promise.all(data.map(document => Document.forge(document).save()))
}
