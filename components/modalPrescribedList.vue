<template>
  <div>
    <a
      class="button is-normal is-primary is-modal"
      @click.stop.prevent="openModal"
      >Gerar lista de prescrição</a
    >
    <div class="modal" :class="{ 'is-active': isActive }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Alunos na lista de prescrição:</p>
          <button
            class="delete"
            aria-label="close"
            @click.stop.prevent="openModal"
          ></button>
        </header>
        <section class="modal-card-body">
          {{ prescribedList }}
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click.stop.prevent="openModal">
            fechar
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalPrescribedList',

  data() {
    return {
      isActive: false,
      prescribedList: ''
    }
  },

  methods: {
    openModal() {
      this.isActive = !this.isActive
      this.$axios
        .get('/api/students/?prescribed=1')
        .then(res => {
          this.prescribedList = res.data.prescribed
        })
        .catch(() => {
          this.$toast.open({
            message: 'Erro ao carregar lista de prescrição',
            type: 'is-danger'
          })
        })
    }
  }
}
</script>

<style scoped></style>
