/**
 * @jest-environment node
 */

const fs = require('fs')
const path = require('path')
const utils = require('../../server/utils')
const db = require('../../server/db')
const Student = require('../../server/models/Student')
const Document = require('../../server/models/Document')

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

    expect(felipe.mailingListToAdd).toEqual('active')
    expect(laura.mailingListToAdd).toEqual('active')
    expect(jose.mailingListToAdd).toEqual('concluding')
    expect(enzo.mailingListToAdd).toEqual('none')
    expect(kauan.mailingListToAdd).toEqual('active')
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

    expect(felipe.mailingList).toEqual('none')
    expect(laura.mailingList).toEqual('none')
    expect(jose.mailingList).toEqual('none')
    expect(enzo.mailingList).toEqual('none')
    expect(kauan.mailingList).toEqual('none')

    expect(felipe.mailingListToAdd).toEqual('active')
    expect(laura.mailingListToAdd).toEqual('active')
    expect(jose.mailingListToAdd).toEqual('concluding')
    expect(enzo.mailingListToAdd).toEqual('none')
    expect(kauan.mailingListToAdd).toEqual('active')

    expect(felipe.mailingListToRemove).toEqual('none')
    expect(laura.mailingListToRemove).toEqual('none')
    expect(jose.mailingListToRemove).toEqual('none')
    expect(enzo.mailingListToRemove).toEqual('none')
    expect(kauan.mailingListToRemove).toEqual('none')

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

    expect(felipeUpdated.mailingList).toEqual('none')
    expect(lauraUpdated.mailingList).toEqual('none')
    expect(joseUpdated.mailingList).toEqual('none')
    expect(enzoUpdated.mailingList).toEqual('none')
    expect(kauanUpdated.mailingList).toEqual('none')
    expect(eduardo.mailingList).toEqual('none')
    expect(julian.mailingList).toEqual('none')

    expect(felipeUpdated.mailingListToAdd).toEqual('active')
    expect(lauraUpdated.mailingListToAdd).toEqual('concluding')
    expect(joseUpdated.mailingListToAdd).toEqual('concluding')
    expect(enzoUpdated.mailingListToAdd).toEqual('active')
    expect(kauanUpdated.mailingListToAdd).toEqual('none')
    expect(eduardo.mailingListToAdd).toEqual('active')
    expect(julian.mailingListToAdd).toEqual('concluding')

    expect(felipeUpdated.mailingListToRemove).toEqual('none')
    expect(lauraUpdated.mailingListToRemove).toEqual('none')
    expect(joseUpdated.mailingListToRemove).toEqual('none')
    expect(enzoUpdated.mailingListToRemove).toEqual('none')
    expect(kauanUpdated.mailingListToRemove).toEqual('none')
    expect(eduardo.mailingListToRemove).toEqual('none')
    expect(julian.mailingListToRemove).toEqual('none')

    done()
  }, 100000)

  test('batchUpdateStudents with consolidated emails', async done => {
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
    const models = await Student.fetchAll()
    await Promise.all(
      models.map(model => {
        model.set('mailingList', model.get('mailingListToAdd'))
        model.set('mailingListToAdd', 'none')
        return model.save()
      })
    )
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

    expect(felipe.mailingList).toEqual('active')
    expect(laura.mailingList).toEqual('active')
    expect(jose.mailingList).toEqual('concluding')
    expect(enzo.mailingList).toEqual('none')
    expect(kauan.mailingList).toEqual('active')

    expect(felipe.mailingListToAdd).toEqual('none')
    expect(laura.mailingListToAdd).toEqual('none')
    expect(jose.mailingListToAdd).toEqual('none')
    expect(enzo.mailingListToAdd).toEqual('none')
    expect(kauan.mailingListToAdd).toEqual('none')

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

    expect(felipeUpdated.mailingList).toEqual('active')
    expect(lauraUpdated.mailingList).toEqual('active')
    expect(joseUpdated.mailingList).toEqual('concluding')
    expect(enzoUpdated.mailingList).toEqual('none')
    expect(kauanUpdated.mailingList).toEqual('active')
    expect(eduardo.mailingList).toEqual('none')
    expect(julian.mailingList).toEqual('none')

    expect(felipeUpdated.mailingListToAdd).toEqual('none')
    expect(lauraUpdated.mailingListToAdd).toEqual('concluding')
    expect(joseUpdated.mailingListToAdd).toEqual('none')
    expect(enzoUpdated.mailingListToAdd).toEqual('active')
    expect(kauanUpdated.mailingListToAdd).toEqual('none')
    expect(eduardo.mailingListToAdd).toEqual('active')
    expect(julian.mailingListToAdd).toEqual('concluding')

    expect(felipeUpdated.mailingListToRemove).toEqual('none')
    expect(lauraUpdated.mailingListToRemove).toEqual('active')
    expect(joseUpdated.mailingListToRemove).toEqual('none')
    expect(enzoUpdated.mailingListToRemove).toEqual('none')
    expect(kauanUpdated.mailingListToRemove).toEqual('active')
    expect(eduardo.mailingListToRemove).toEqual('none')
    expect(julian.mailingListToRemove).toEqual('none')

    done()
  }, 100000)

  test('batchUpdateStudents with a big CSV', async done => {
    const csvPath = path.join(__dirname, './fixtures/sigaa/big.csv')
    const csv = fs.readFileSync(csvPath, 'utf8')
    const data = utils.parseCsv(csv)
    const digested = utils.digestSigaaData(data)
    await utils.batchUpdateStudents(digested)

    const students = (await Student.fetchAll()).toJSON()

    expect(students.length).toEqual(335)

    done()
  }, 100000)

  test('updateStudentFitness', async done => {
    const studentsPromise = await Promise.all(
      [
        {
          name: 'ESSE CARA E BOM',
          registrationNumber: '2015121200',
          course: 'cbsi',
          cd: 1
        },
        {
          name: 'SEM CD',
          registrationNumber: '2015121201',
          course: 'cbsi',
          cd: 0
        },
        {
          name: 'SEM ATA',
          registrationNumber: '2015121202',
          course: 'cbsi',
          cd: 1
        },
        {
          name: 'SEM CD E SEM ATA',
          registrationNumber: '2015121203',
          course: 'cbsi',
          cd: 0
        },
        {
          name: 'SEM LAUDA',
          registrationNumber: '2015121204',
          course: 'cbsi',
          cd: 1
        },
        {
          name: 'SEM LAUDA E SEM CD',
          registrationNumber: '2015121205',
          course: 'cbsi',
          cd: 0
        },
        {
          name: 'SEM LAUDA E SEM ATA',
          registrationNumber: '2015121206',
          course: 'cbsi',
          cd: 1
        },
        {
          name: 'SEM LAUDA E SEM ATA E SEM CD',
          registrationNumber: '2015121221',
          course: 'cbsi',
          cd: 0
        }
      ].map(props => Student.forge(props).save())
    )

    const studentIdList = studentsPromise.reduce((studentIdList, student) => {
      studentIdList.push(student.get('id'))
      return studentIdList
    }, [])

    await Promise.all(
      [
        {
          studentId: studentIdList[0],
          type: 1,
          url: 'a'
        },
        {
          studentId: studentIdList[1],
          type: 1,
          url: 'b'
        },
        {
          studentId: studentIdList[4],
          type: 1,
          url: 'c'
        },
        {
          studentId: studentIdList[5],
          type: 1,
          url: 'd'
        },
        {
          studentId: studentIdList[0],
          type: 2,
          url: 'e'
        },
        {
          studentId: studentIdList[1],
          type: 2,
          url: 'f'
        },
        {
          studentId: studentIdList[2],
          type: 2,
          url: 'g'
        },
        {
          studentId: studentIdList[3],
          type: 2,
          url: 'h'
        }
      ].map(props => Document.forge(props).save())
    )

    const expectations = [
      { position: 0, isFit: true },
      { position: 1, isFit: false },
      { position: 2, isFit: false },
      { position: 3, isFit: false },
      { position: 4, isFit: false },
      { position: 5, isFit: false },
      { position: 6, isFit: false },
      { position: 7, isFit: false }
    ]

    for (const { position, isFit } of expectations) {
      const assertType = isFit ? 'toBeTruthy' : 'toBeFalsy'
      const student = await Student.where({
        id: studentIdList[position]
      }).fetch()
      const updated = await utils.updateStudentFitness(student)
      expect(updated.get('isFit'))[assertType]()
    }

    done()
  })
})
