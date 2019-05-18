const User = require('../server/models/User')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('users').del()

  const data = [
    {
      username: 'admin',
      password: 'admin',
      role: 'admin',
      email: 'admin@domain.com'
    },
    {
      username: 'user',
      password: 'user',
      role: 'admin',
      email: 'user@domain.com'
    },
    {
      username: 'teacher',
      password: 'teacher',
      role: 'teacher',
      email: 'teacher@domain.com'
    }
  ]

  return Promise.all(data.map(user => User.forge(user).save()))
}
