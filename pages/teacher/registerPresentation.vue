<template>
  <div class="container">
    <h1 class="title has-text-centered">Formulário para Defesa de TCC</h1>
    <section class="section">
      <div class="box">
        <h2 class="subtitle">Dados da defesa:</h2>

        <DefenseForm
          ref="form"
          v-model="model"
          :on-submit="onSubmit"
          cancel-redirect="/teacher/home"
          :show-grade-input="false"
        />
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
      return this.$services.defenses
        .create(payload)
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
