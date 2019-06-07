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
          <div v-if="lenList" class="list">
            <a
              v-for="student in studentsData"
              :key="student.id"
              class="list-item"
            >
              <div class="level">
                <div class="level-left">{{ student.name }}</div>
                <div class="level-right">
                  <span class="tag is-white">{{
                    displayStatus[studentsData.indexOf(student)]
                  }}</span>
                </div>
              </div>
            </a>
          </div>
          <div v-else>
            <strong> Não há alunos na lista de prescrição </strong>
          </div>
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
import { studentStatus } from './mixins/studentStatus'
export default {
  name: 'ModalPrescribedList',

  mixins: [studentStatus],

  data() {
    return {
      isActive: false,
      studentsData: []
    }
  },

  computed: {
    displayStatus() {
      return this.studentsData.map(data => {
        return this.getStatus(data)
      })
    },
    lenList() {
      return this.studentsData.length > 0
    }
  },

  methods: {
    openModal() {
      this.isActive = !this.isActive
      this.$axios
        .get('/api/students/?prescribed=1')
        .then(res => {
          this.studentsData = res.data
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

<style scoped>
a {
  color: #363b47;
}
</style>
