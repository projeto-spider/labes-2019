const { bookshelf } = require('../db')

const Setting = bookshelf.model('Setting', {
  tableName: 'settings',

  initialize() {
    this.on('saving', this.onSaving)
  },

  onSaving(model, attrs) {
    if (model.hasChanged('value')) {
      const update = attrs.value || model.get('value')
      const value = JSON.stringify(update)
      model.set('value', value)
    }
  },

  // When you receive from database
  parse,
  // When you're going to convert to JSON
  serialize: parse
})

module.exports = Setting

function parse(received) {
  const attributes = { ...this.attributes, ...received }

  try {
    const parsed = JSON.parse(attributes.value)
    attributes.value = parsed
  } catch (err) {
    attributes.value = undefined
  }

  return attributes
}
