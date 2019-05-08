/**
 * @jest-environment node
 */

const utils = require('../../server/utils')
const db = require('../../server/db')
const Student = require('../../server/models/Student')

const exampleSigaaCsv = `Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status
201704940001,2017,FELIPE SOUZA FERREIRA,111.111.111-11,1/29/1995,VITORIA DIAS ROCHA,Belém,CIENCIA DA COMPUTACAO,ATIVO
201304940002,2013,LAURA CARDOSO CASTRO,222.222.222-22,4/14/1992,BIANCA RIBEIRO ROCHA,Belém,SISTEMAS DE INFORMAÇÃO,FORMANDO
200504940003,2005,JOSE FERREIRA SILVA,333.333.333-33,11/16/1982,BIANCA ROCHA BARBOSA,Belém,SISTEMAS DE INFORMAÇÃO,CONCLUÍDO
201104940004,2011,ENZO FERREIRA ALVES,444.444.44-44,5/19/1991,CAMILA MARTINS BARBOSA,Belém,CIENCIA DA COMPUTACAO,CANCELADO
200604940005,2006,KAUAN CARVALHO SANTOS,555.555.555-55,6/22/1986,EVELYN SANTOS BARROS,Belém,CIENCIA DA COMPUTACAO,GRADUANDO`

const exampleSigaaCsvNext = `Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status
201704940001,2017,FELIPE SOUZA FERREIRA,111.111.111-11,1/29/1995,VITORIA DIAS ROCHA,Belém,CIENCIA DA COMPUTACAO,FORMANDO
201304940002,2013,LAURA CARDOSO CASTRO,222.222.222-22,4/14/1992,BIANCA RIBEIRO ROCHA,Belém,SISTEMAS DE INFORMAÇÃO,CONCLUÍDO
200504940003,2005,JOSE FERREIRA SILVA,333.333.333-33,11/16/1982,BIANCA ROCHA BARBOSA,Belém,SISTEMAS DE INFORMAÇÃO,CONCLUÍDO
201104940004,2011,ENZO FERREIRA ALVES,444.444.44-44,5/19/1991,CAMILA MARTINS BARBOSA,Belém,CIENCIA DA COMPUTACAO,ATIVO
200604940005,2006,KAUAN CARVALHO SANTOS,555.555.555-55,6/22/1986,EVELYN SANTOS BARROS,Belém,CIENCIA DA COMPUTACAO,CANCELADO
201804940006,2018,EDUARDO ALVES LIMA,666.666.666-66,11/1/1997,NICOLE ALMEIDA ARAUJO,Belém,CIENCIA DA COMPUTACAO,ATIVO
199604940007,1996,JULIAN BARBOSA SANTOS,777-777-777-77,11/9/1977,GABRIELA CARVALHO CARSOSO,Belém,CIENCIA DA COMPUTACAO,CONCLUÍDO`

describe('utils', () => {
  beforeEach(async done => {
    await db.knex.migrate.rollback()
    await db.knex.migrate.latest()
    await db.knex.seed.run()
    done()
  }, 100000)

  afterEach(() => {
    return db.knex.migrate.rollback()
  })

  test('parseCsv', () => {
    const example = `a,b,c
1,2,3`
    expect(utils.parseCsv(example)[0]).toEqual({ a: '1', b: '2', c: '3' })
  })

  test('digestSigaaData', () => {
    const data = utils.parseCsv(exampleSigaaCsv)
    const result = utils.digestSigaaData(data)

    expect(data[0]['Matrícula']).toEqual('201704940001')
    expect(data[3]['Matrícula']).toEqual('201104940004')

    const [felipe, laura, jose, enzo, kauan] = result

    expect(felipe.name).toEqual('FELIPE SOUZA FERREIRA')
    expect(laura.name).toEqual('LAURA CARDOSO CASTRO')
    expect(jose.name).toEqual('JOSE FERREIRA SILVA')
    expect(enzo.name).toEqual('ENZO FERREIRA ALVES')
    expect(kauan.name).toEqual('KAUAN CARVALHO SANTOS')

    expect(felipe.course).toEqual('cbcc')
    expect(laura.course).toEqual('cbsi')
    expect(jose.course).toEqual('cbsi')
    expect(enzo.course).toEqual('cbcc')
    expect(kauan.course).toEqual('cbcc')

    expect(felipe.registrationNumber).toEqual('201704940001')
    expect(laura.registrationNumber).toEqual('201304940002')
    expect(jose.registrationNumber).toEqual('200504940003')
    expect(enzo.registrationNumber).toEqual('201104940004')
    expect(kauan.registrationNumber).toEqual('200604940005')

    expect(felipe.isActive).toBeTruthy()
    expect(felipe.isGraduating).toBeFalsy()
    expect(felipe.isForming).toBeFalsy()
    expect(felipe.isConcluding).toBeFalsy()
    expect(felipe.cancelled).toBeFalsy()

    expect(laura.isActive).toBeTruthy()
    expect(laura.isGraduating).toBeFalsy()
    expect(laura.isForming).toBeTruthy()
    expect(laura.isConcluding).toBeFalsy()
    expect(laura.cancelled).toBeFalsy()

    expect(jose.isActive).toBeFalsy()
    expect(jose.isGraduating).toBeFalsy()
    expect(jose.isForming).toBeFalsy()
    expect(jose.isConcluding).toBeTruthy()
    expect(jose.cancelled).toBeFalsy()

    expect(enzo.isActive).toBeFalsy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isForming).toBeFalsy()
    expect(enzo.isConcluding).toBeFalsy()
    expect(enzo.cancelled).toBeTruthy()

    expect(kauan.isActive).toBeTruthy()
    expect(kauan.isForming).toBeFalsy()
    expect(kauan.isGraduating).toBeTruthy()
    expect(kauan.isConcluding).toBeFalsy()
    expect(kauan.cancelled).toBeFalsy()
  })

  test('batchUpdateStudents', async done => {
    /**
     * Find a student by it's registrationNumber
     *
     * @param {object[]} students - Object of student from the database
     * @param {string} registrationNumber - The wanted student's registrationNumber
     * @return {object} The student
     *
     * @example
     *
     *     const students = [{ registrationNumber: '123', name: 'test user' }]
     *     findByRegistrationNumber(students, '123')
     */
    function findByRegistrationNumber(students, registrationNumber) {
      return students.find(u => u.registrationNumber === registrationNumber)
    }

    const data = utils.parseCsv(exampleSigaaCsv)
    const digested = utils.digestSigaaData(data)
    await utils.batchUpdateStudents(digested)
    const students = (await Student.fetchAll()).toJSON()

    const [felipe, laura, jose, enzo, kauan] = [
      '201704940001',
      '201304940002',
      '200504940003',
      '201104940004',
      '200604940005'
    ].map(registrationNumber =>
      findByRegistrationNumber(students, registrationNumber)
    )

    expect(students.length).toEqual(5)

    expect(felipe.isActive).toBeTruthy()
    expect(felipe.isGraduating).toBeFalsy()
    expect(felipe.isForming).toBeFalsy()
    expect(felipe.isConcluding).toBeFalsy()
    expect(felipe.cancelled).toBeFalsy()

    expect(laura.isActive).toBeTruthy()
    expect(laura.isGraduating).toBeFalsy()
    expect(laura.isForming).toBeTruthy()
    expect(laura.isConcluding).toBeFalsy()
    expect(laura.cancelled).toBeFalsy()

    expect(jose.isActive).toBeFalsy()
    expect(jose.isGraduating).toBeFalsy()
    expect(jose.isForming).toBeFalsy()
    expect(jose.isConcluding).toBeTruthy()
    expect(jose.cancelled).toBeFalsy()

    expect(enzo.isActive).toBeFalsy()
    expect(enzo.isGraduating).toBeFalsy()
    expect(enzo.isForming).toBeFalsy()
    expect(enzo.isConcluding).toBeFalsy()
    expect(enzo.cancelled).toBeTruthy()

    expect(kauan.isActive).toBeTruthy()
    expect(kauan.isForming).toBeFalsy()
    expect(kauan.isGraduating).toBeTruthy()
    expect(kauan.isConcluding).toBeFalsy()
    expect(kauan.cancelled).toBeFalsy()

    const dataUpdated = utils.parseCsv(exampleSigaaCsvNext)
    const digestedUpdated = utils.digestSigaaData(dataUpdated)
    await utils.batchUpdateStudents(digestedUpdated)
    const studentsUpdated = (await Student.fetchAll()).toJSON()

    const [
      felipeUpdated,
      lauraUpdated,
      joseUpdated,
      enzoUpdated,
      kauanUpdated,
      eduardo,
      julian
    ] = [
      '201704940001',
      '201304940002',
      '200504940003',
      '201104940004',
      '200604940005',
      '201804940006',
      '199604940007'
    ].map(registrationNumber =>
      findByRegistrationNumber(studentsUpdated, registrationNumber)
    )

    expect(studentsUpdated.length).toEqual(7)

    expect(felipeUpdated.isActive).toBeTruthy()
    expect(felipeUpdated.isForming).toBeTruthy()
    expect(felipeUpdated.isGraduating).toBeFalsy()
    expect(felipeUpdated.isConcluding).toBeFalsy()
    expect(felipeUpdated.cancelled).toBeFalsy()

    expect(lauraUpdated.isActive).toBeFalsy()
    expect(lauraUpdated.isForming).toBeFalsy()
    expect(lauraUpdated.isGraduating).toBeFalsy()
    expect(lauraUpdated.isConcluding).toBeTruthy()
    expect(lauraUpdated.cancelled).toBeFalsy()

    expect(joseUpdated.isActive).toBeFalsy()
    expect(joseUpdated.isForming).toBeFalsy()
    expect(joseUpdated.isGraduating).toBeFalsy()
    expect(joseUpdated.isConcluding).toBeTruthy()
    expect(joseUpdated.cancelled).toBeFalsy()

    expect(enzoUpdated.isActive).toBeTruthy()
    expect(enzoUpdated.isGraduating).toBeFalsy()
    expect(enzoUpdated.isGraduating).toBeFalsy()
    expect(enzoUpdated.isConcluding).toBeFalsy()
    expect(enzoUpdated.cancelled).toBeFalsy()

    expect(kauanUpdated.isActive).toBeFalsy()
    expect(kauanUpdated.isGraduating).toBeFalsy()
    expect(kauanUpdated.isGraduating).toBeFalsy()
    expect(kauanUpdated.isConcluding).toBeFalsy()
    expect(kauanUpdated.cancelled).toBeTruthy()

    expect(eduardo.isActive).toBeTruthy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isGraduating).toBeFalsy()
    expect(eduardo.isConcluding).toBeFalsy()
    expect(eduardo.cancelled).toBeFalsy()

    expect(julian.isActive).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isGraduating).toBeFalsy()
    expect(julian.isConcluding).toBeTruthy()
    expect(julian.cancelled).toBeFalsy()

    done()
  }, 100000)
})
