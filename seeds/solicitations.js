const Solicitation = require('../server/models/Solicitation')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('solicitations').del()

  const data = [
    {
      name: 'Ana Goncalves Gomes',
      email: 'anagomes@example.com',
      registrationNumber: '201804940001',
      type: 'concluding'
    },
    {
      name: 'Victor Silva Carvalho',
      email: 'victorsilva@example.com',
      registrationNumber: '201804940002',
      type: 'freshman'
    },
    {
      name: 'Gabriela Dias Cunha',
      email: 'gabrieladias@example.com',
      registrationNumber: '201804940003',
      type: 'concluding'
    },
    {
      name: 'Marisa Correia Castro',
      email: 'marisacastro@gmail.com',
      registrationNumber: '201804940023',
      type: 'freshman'
    },
    {
      name: 'Rodrigo Rodrigues Santos',
      email: 'rrsantos@ufpa.br',
      registrationNumber: '201604940012',
      type: 'concluding'
    }
  ]

  return Promise.all(
    data.map(solicitations => Solicitation.forge(solicitations).save())
  )
}
