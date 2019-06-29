import User from '../../server/models/User'
import utils from '../../server/utils'
/**
 * Get an User and it's JWT
 * @param  {string} username - Username
 * @param  {number} exp - Expiration time for the token in seconds
 * @return {object} User and token
 */
export async function user(username, exp) {
  const user = await User.where({ username }).fetch()
  const token = utils.signToken(user, exp)

  return { user, token }
}

/**
 * Wipe a knex SQLite database
 * @param  {Knex} knex
 * @return {Promise}
 */
export function wipe(knex) {
  return knex('sqlite_master')
    .where('type', 'table')
    .then(tables =>
      knex.transaction(trx =>
        Promise.all(
          tables.map(({ name }) =>
            knex(name)
              .transacting(trx)
              .truncate()
          )
        )
      )
    )
}
