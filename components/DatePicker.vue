<template>
  <b-datepicker
    v-model="date"
    placeholder="Selecionar data"
    :month-names="[
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ]"
    :day-names="['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
    :first-day-of-week="0"
    :disabled="disabled"
    :max-date="maxDate"
    :min-date="minDate"
    @input="onInput"
  />
</template>

<script>
export default {
  name: 'Datepicker',

  props: {
    value: {
      type: String,
      default: '01/01/1970'
    },

    minDate: {
      type: Date,
      required: false,
      default: undefined
    },

    maxDate: {
      type: Date,
      required: false,
      default: undefined
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
        this.value && this.value.split
          ? new Date(
              Date.parse(
                this.value
                  .split('/')
                  .reverse()
                  .join('/')
              )
            )
          : null
    },

    onInput(date) {
      const string = date
        .toISOString()
        .slice(0, 10)
        .split('-')
        .reverse()
        .join('/')
      this.$emit('input', string)
    }
  }
}
</script>
