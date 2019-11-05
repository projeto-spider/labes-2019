module.exports =
  process.env.NODE_ENV === 'production'
    ? [
        {
          username: 'secretaria',
          fullName: 'Secretaria',
          password: 'secretaria',
          role: 'admin',
          email: 'secretaria@domain.com'
        }
      ]
    : [
        {
          username: 'admin',
          fullName: 'Administrador',
          password: 'admin',
          role: 'admin',
          email: 'admin@domain.com'
        },
        {
          username: 'user',
          password: 'user',
          fullName: 'Usuário Qualquer',
          role: 'admin',
          email: 'user@domain.com'
        },
        {
          username: 'teacher',
          password: 'teacher',
          fullName: 'Professor',
          role: 'teacher',
          email: 'teacher@domain.com'
        }
      ]
