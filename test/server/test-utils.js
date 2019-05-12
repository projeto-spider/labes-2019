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
