<template>
  <div>
    <a
      class="button is-normal is-primary is-modal"
      @click.stop.prevent="openModal"
    >
      Gerar lista de prescrição
    </a>
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
              v-for="(student, index) in studentsData"
              :key="student.id"
              class="list-item"
            >
              <div class="level">
                <div class="level-left">{{ student.name }}</div>
                <div class="level-left">{{ student.registrationNumber }}</div>
                <div class="level-right">
                  <span class="tag is-white">{{ displayStatus[index] }}</span>
                </div>
              </div>
            </a>
          </div>
          <div v-else>
            <strong> Não há alunos na lista de prescrição </strong>
          </div>
          <ul>
            <li v-for="(page, index) in total" :key="index" class="link ">
              <a class="has-text-primary" @click="nextPage(page)">{{ page }}</a>
            </li>
          </ul>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click.stop.prevent="openModal">
            Fechar
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { studentStatus } from '@/components/mixins/studentStatus'
import { errorsHandler } from '@/components/mixins/errors'
export default {
  name: 'ModalPrescribedList',

  mixins: [studentStatus, errorsHandler],

  data() {
    return {
      isActive: false,
      studentsData: [],
      currentPage: 1,
      total: 0,
      perPage: 0
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
      this.nextPage(1)
    },
    nextPage(page) {
      this.$services.students
        .fetchPage({ prescribed: true, page: page })
        .then(res => {
          this.studentsData = res.data
          this.total = res.headers['pagination-row-count']
          this.perPage = res.headers['pagination-page-size']
        })
        .catch(e => {
          this.openErrorNotification(e)
        })
    }
  }
}
</script>

<style scoped>
a {
  color: #363b47;
}
.link {
  display: inline-block;
}
</style>
