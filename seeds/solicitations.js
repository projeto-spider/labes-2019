const Solicitation = require('../server/models/Solicitation')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('solicitations').del()

  const data = [
    {
      name: 'Ana Goncalves Gomes',
      email: 'anagomes@example.com',
      registrationNumber: '201804940001'
    },
    {
      name: 'Victor Silva Carvalho',
      email: 'victorsilva@example.com',
      registrationNumber: '201804940002'
    },
    {
      name: 'Gabriela Dias Cunha',
      email: 'gabrieladias@example.com',
      registrationNumber: '201804940003'
    }
  ]

  return Promise.all(
    data.map(solicitations => Solicitation.forge(solicitations).save())
  )
}
