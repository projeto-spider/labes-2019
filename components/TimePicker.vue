<template>
  <b-timepicker
    v-model="date"
    placeholder="Selecionar hora"
    hour-format="24"
    :disabled="disabled"
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'Datepicker',

  props: {
    value: {
      type: String,
      default: '00:00:00'
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    date: new Date()
  }),

  watch: {
    value() {
      this.updateDate()
    }
  },

  created() {
    this.updateDate()
  },

  methods: {
    updateDate() {
      this.date =
        this.value && typeof this.value === 'string'
          ? new Date(Date.parse('1970-01-01T' + this.value))
          : null
    },

    onInput(date) {
      const hours = date.getHours()
      const minutes = date.getMinutes()
      const seconds = date.getSeconds()
      const string = [hours, minutes, seconds]
        .map(x => String(x).padStart(2, '0'))
        .join(':')
      this.$emit('input', string)
    }
  }
}
</script>
