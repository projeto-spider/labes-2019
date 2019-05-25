const Solicitation = require('../server/models/Solicitation')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('solicitations').del()

  const data = [
    {
      reason: 'example reason 1',
      name: 'Ana Goncalves Gomes',
      email: 'anagomes@example.com',
      registrationNumber: '201804940001'
    },
    {
      reason: 'example reason 2',
      name: 'Victor Silva Carvalho',
      email: 'victorsilva@example.com',
      registrationNumber: '201804940002'
    },
    {
      reason: 'example reason 3',
      name: 'Gabriela Dias Cunha',
      email: 'gabrieladias@example.com',
      registrationNumber: '201804940003'
    }
  ]

  return Promise.all(
    data.map(solicitations => Solicitation.forge(solicitations).save())
  )
}
