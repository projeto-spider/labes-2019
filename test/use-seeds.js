const {
  documents,
  pendencies,
  solicitations,
  students,
  subjects,
  users
} = require('./seeds')

const seeds = new Map([
  ['documents', documents],
  ['pendencies', pendencies],
  ['solicitations', solicitations],
  ['students', students],
  ['subjects', subjects],
  ['users', users]
])

const allNames = Array.from(seeds.keys())

module.exports = async function useSeeds(names = allNames) {
  for (const [key, fn] of seeds.entries()) {
    if (!names.includes(key)) {
      continue
    }

    await fn()
  }

  // return void
}
