const Student = require('../../models/Student')

/**
 * @param {String} registrationNumbersString - Comma separated registrationNumbers
 * @returns { students: Student[], invalidRegistrationNumbers: string[] }
 */
module.exports = async function registrationNumbersToStudents(
  registrationNumbersString
) {
  const registrationNumbers = registrationNumbersString
    .split(',')
    .map(string => string.trim())

  const students = await Promise.all(
    registrationNumbers.map(registrationNumber =>
      Student.forge({ registrationNumber }).fetch()
    )
  )

  const invalidRegistrationNumbers = registrationNumbers.filter(
    (_, i) => !students[i]
  )

  return { students, invalidRegistrationNumbers }
}
