<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-3 is-offset-1">
        <ModalPrescribedList></ModalPrescribedList>
      </div>

      <div class="column is-4">
        <h1 class="title"><strong>Alunos Formandos</strong></h1>
      </div>

      <div class="column is-3">
        <b-tooltip
          v-if="!allCrgsReady"
          label="Alguns alunos estão sem CRG"
          position="is-bottom"
          animated
        >
          <button class="button is-danger" disabled>
            Eleger Destaque Acadêmico
          </button>
        </b-tooltip>

        <button v-else class="button is-primary" @click="openModal">
          Eleger Destaque Acadêmico
        </button>
      </div>
    </div>
    <br />
    <SearchInput
      ref="fitGraduatingSearchInput"
      :default-course="courseTag"
      :title="'Graduandos Aptos'"
      :is-graduating="1"
      :is-active="1"
      :show-defense-date="true"
      :is-fit="1"
      :default-sort-field="'crg'"
      :default-sort-order="'desc'"
      :show-crg-filter="true"
      @toggleComboBox="onToggleComboBox"
    ></SearchInput>
    <br />
    <SearchInput
      :default-course="courseTag"
      :title="'Graduandos Não-Aptos'"
      :is-graduating="1"
      :is-active="1"
      :show-defense-date="true"
      :is-fit="0"
    ></SearchInput>
    <br />
    <SearchInput
      :default-course="courseTag"
      :title="'Formandos'"
      :is-active="1"
      :is-forming="1"
    ></SearchInput>

    <b-modal :active.sync="isModalOpen" :width="640" scroll="keep">
      <div class="card" style="padding: 25px;">
        <article
          v-for="student in academicHighlightCandidates"
          :key="student.id"
          class="media"
        >
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{ student.name }}</strong>
                <br />
                <strong>CRG: </strong><small>{{ student.crg }}</small>
              </p>
            </div>
          </div>
          <div class="media-right">
            <button
              class="button is-success"
              @click="selectAcademicHighlight(student)"
            >
              Confirmar
            </button>
          </div>
        </article>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '~/components/SearchInput'
import ModalPrescribedList from '~/components/ModalPrescribedList'

export default {
  name: 'Forming',
  middleware: 'course',
  components: {
    SearchInput,
    ModalPrescribedList
  },
  data: () => ({
    allCrgsReady: false,
    isModalOpen: false,
    academicHighlightCandidates: []
  }),
  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },
  created() {
    this.checkCrgsReady()
  },

  methods: {
    checkCrgsReady() {
      const params = {
        isActive: 1,
        isGraduating: 1,
        isFit: 1,
        noCrg: true
      }
      return this.$axios
        .$get('/api/students', { params })
        .then(body => {
          this.allCrgsReady = body.length === 0
        })
        .catch(() => {
          this.allCrgsReady = false
        })
    },

    openModal() {
      this.isModalOpen = true

      const params = {
        course: this.courseTag,
        isActive: 1,
        isGraduating: 1,
        isFit: 1,
        sort: 'crg',
        order: 'DESC'
      }
      this.$axios
        .$get('/api/students', { params })
        .then(students => {
          if (!students.length) {
            this.$toast.open({
              message: 'Falha ao carregar candidatos a destaque acadêmico.',
              type: 'is-danger'
            })
            this.isModalOpen = true
            return
          }

          const highestCrg = students[0].crg

          this.academicHighlightCandidates = students.filter(
            student => student.crg === highestCrg
          )
        })
        .catch(() => {
          this.isModalOpen = true
          this.$toast.open({
            message: 'Falha ao carregar candidatos a destaque acadêmico.',
            type: 'is-danger'
          })
        })
    },

    selectAcademicHighlight(student) {
      this.isModalOpen = false

      this.$axios
        .$put('/api/students/update-academic-highlight', { id: student.id })
        .then(() => {
          this.$toast.open({
            message: 'Destaque acadêmico selecionado!',
            type: 'is-success'
          })

          this.$refs.fitGraduatingSearchInput.getStudents()
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao selecionar destaque acadêmico.',
            type: 'is-danger'
          })
        })
    },

    onToggleComboBox() {
      this.checkCrgsReady()
    }
  }
}
</script>
