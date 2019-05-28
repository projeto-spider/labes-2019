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
    },
    {
      name: 'Marisa Correia Castro',
      email: 'marisacastro@gmail.com',
      registrationNumber: '201804940023'
    },
    {
      name: 'Rodrigo Rodrigues Santos',
      email: 'rrsantos@ufpa.br',
      registrationNumber: '201604940012'
    }
  ]

  return Promise.all(
    data.map(solicitations => Solicitation.forge(solicitations).save())
  )
}
