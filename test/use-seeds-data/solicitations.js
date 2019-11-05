module.exports =
  process.env.NODE_ENV === 'production'
    ? []
    : [
        {
          name: 'Ana Goncalves Gomes',
          email: 'anagomes@example.com',
          registrationNumber: '201804940001',
          type: 'concluding',
          course: 'cbcc',
          admissionType: 'psufpa'
        },
        {
          name: 'Victor Silva Carvalho',
          email: 'victorsilva@example.com',
          registrationNumber: '201804940002',
          type: 'freshman',
          course: 'cbcc',
          admissionType: 'psufpa'
        },
        {
          name: 'Gabriela Dias Cunha',
          email: 'gabrieladias@example.com',
          registrationNumber: '201804940003',
          type: 'concluding',
          course: 'other',
          admissionType: 'other'
        },
        {
          name: 'Marisa Correia Castro',
          email: 'marisacastro@gmail.com',
          registrationNumber: '201804940023',
          type: 'freshman',
          course: 'cbsi',
          admissionType: 'sisu'
        },
        {
          name: 'Rodrigo Rodrigues Santos',
          email: 'rrsantos@ufpa.br',
          registrationNumber: '201604940012',
          type: 'concluding',
          course: 'cbsi',
          admissionType: 'other'
        }
      ]
