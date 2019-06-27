<template>
  <div class="container">
    <section class="section">
      <h1 class="title">Formulario para defesa de TCC</h1>

      <div class="box">
        <h2 class="subtitle">Dados da defesa:</h2>

        <DefenseForm ref="form" v-model="model" :on-submit="onSubmit" />
      </div>
    </section>
  </div>
</template>

<script>
import { errorsHandler } from '@/components/mixins/errors'
import DefenseForm from '@/components/DefenseForm'

export default {
  name: 'RegisterPresentation',
  layout: 'defaultTeacher',
  components: {
    DefenseForm
  },
  mixins: [errorsHandler],
  middleware: ['course'],

  data() {
    return {
      model: {}
    }
  },

  methods: {
    onSubmit(payload) {
      const endpoint = '/api/defenses'
      return this.$axios
        .$post(endpoint, payload)
        .then(() => {
          this.$toast.open({
            message: 'Solicitação realizada com sucesso!',
            type: 'is-success'
          })

          if (this.$refs.form && this.$refs.form.reset) {
            this.$refs.form.reset()
          }
        })
        .catch(error => this.openErrorNotification(error.response.data.code))
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
