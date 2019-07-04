<template>
  <b-field
    :label="inputLabel"
    :message="messageParams"
    :type="{
      [valid ? 'is-success' : 'is-danger']: dirty
    }"
  >
    <slot></slot>
  </b-field>
</template>

<script>
export default {
  name: 'InputValidation',
  props: {
    inputLabel: {
      type: String,
      default: ''
    },

    defaultMessage: {
      type: String,
      default: ''
    },

    validMessage: {
      type: String,
      default: ''
    },

    invalidMessage: {
      type: Array,
      default: () => []
    },

    valid: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dirty: false
    }
  },

  computed: {
    messageParams() {
      const obj = {}
      if (this.dirty) {
        if (this.valid) {
          obj[this.validMessage] = this.dirty
        } else {
          for (const msg of this.invalidMessage) {
            obj[msg] = this.dirty
          }
        }
      } else {
        obj[this.defaultMessage] = !this.dirty
      }
      return obj
    }
  }
}
</script>
