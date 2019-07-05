exports.up = function(knex, Promise) {
  return knex.schema.createTable('solicitations', table => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table
      .string('email')
      .notNullable()
      .unique()
    table.string('registrationNumber').nullable()
    table.enum('type', ['freshman', 'concluding']).defaultTo('freshman')
    table
      .enum('course', ['Ciência da Computação', 'Sistemas de Informação'])
      .notNullable()
    table
      .enum('admissionType', ['Processo Seletivo UFPa', 'SiSU'])
      .notNullable()
  })
}

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('solicitations')
}
