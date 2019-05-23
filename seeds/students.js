const Student = require('../server/models/Student')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('students').del()

  const data = [
    {
      name: 'FELIPE SOUZA FERREIRA',
      registrationNumber: '201704940001',
      crg: 8.3,
      course: 'cbcc',
      email: 'null',
      isFit: false,
      isConcluding: false,
      isActive: true,
      isForming: true,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      prescribed: false,
      mailingList: 'none'
    },
    {
      name: 'LAURA CARDOSO CASTRO',
      registrationNumber: '201304940002',
      crg: 6.63,
      course: 'cbsi',
      email: 'null',
      isFit: false,
      isConcluding: true,
      isActive: false,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      prescribed: false,
      mailingList: 'none'
    },
    {
      name: 'JOSE FERREIRA SILVA',
      registrationNumber: '200504940003',
      crg: 8.3,
      course: 'cbsi',
      email: 'null',
      isFit: false,
      isConcluding: true,
      isActive: false,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      prescribed: false,
      mailingList: 'none'
    },
    {
      name: 'ENZO FERREIRA ALVES',
      registrationNumber: '201104940004',
      crg: 7.89,
      course: 'cbcc',
      email: 'null',
      isFit: false,
      isConcluding: false,
      isActive: true,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      prescribed: false,
      mailingList: 'none'
    },
    {
      name: 'KAUAN CARVALHO SANTOS',
      registrationNumber: '200604940005',
      crg: 7.897,
      course: 'cbcc',
      email: 'null',
      isFit: false,
      isConcluding: false,
      isActive: false,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: true,
      prescribed: false,
      mailingList: 'none'
    },
    {
      name: 'EDUARDO ALVES LIMA',
      registrationNumber: '201804940006',
      crg: 6.001,
      course: 'cbcc',
      email: 'null',
      isFit: false,
      isConcluding: false,
      isActive: true,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      prescribed: false,
      mailingList: 'none'
    },
    {
      name: 'JULIAN BARBOSA SANTOS',
      registrationNumber: '199604940007',
      crg: 8.3,
      course: 'cbcc',
      email: 'null',
      isFit: false,
      isConcluding: true,
      isActive: false,
      isForming: false,
      isGraduating: false,
      academicHighlight: false,
      cancelled: false,
      prescribed: false,
      mailingList: 'none'
    }
  ]

  return Promise.all(data.map(student => Student.forge(student).save()))
}
