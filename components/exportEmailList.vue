<template>
  <div>
    <a
      v-if="isActive"
      class="button is-normal is-primary is-modal"
      @click.stop.prevent="openModal"
      >Gerar lista de E-mail</a
    >
    <div class="modal" :class="acitve">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Lista gerada:</p>
          <button
            class="delete"
            aria-label="close"
            @click.stop.prevent="openModal"
          ></button>
        </header>
        <section class="modal-card-body">
          {{ emailList }}
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click.stop.prevent="doCopy">
            Copiar
          </button>
          <button class="button" @click.stop.prevent="openModal">
            Cancelar
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportEmailList',
  props: {
    isActive: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      acitve: {
        'is-active': false
      },
      emailList: 'email list'
    }
  },

  methods: {
    openModal() {
      this.acitve['is-active'] = !this.acitve['is-active']
      this.$axios
        .get('/api/students/actives-mailing-list')
        .then(res => {
          this.emailList = res.data.mailingList
        })
        .catch(() => {
          this.$toast.open({
            message: 'Erro ao carregar lista de emails',
            type: 'is-danger'
          })
        })
    },
    doCopy() {
      try {
        const el = document.createElement('textarea')
        el.value = this.emailList
        el.setAttribute('readonly', '')
        el.style = { position: 'absolute', left: '-9999px' }
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        this.$toast.open({ message: 'Copiado!', type: 'is-success' })
      } catch (e) {
        this.$toast.open({ message: 'Erro ao copiar!', type: 'is-danger' })
      }
    }
  }
}
</script>

<style scoped>
.is-modal {
  margin-top: 50px;
  margin-left: 100px;
  margin-bottom: -100px;
}

@media screen and (max-width: 940px) {
  .is-modal {
    margin-left: 250px;
    margin-bottom: -50px;
  }
}
</style>
