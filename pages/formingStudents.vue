<template>
  <div class="container">
    <div class="columns is-centered has-text-centered">
      <h1 class="title"><strong>Alunos Formandos</strong></h1>
    </div>
    <div class="columns has-text-centered">
      <div class="column is-half">
        <ModalPrescribedList></ModalPrescribedList>
      </div>
      <div class="column is-half">
        <b-tooltip
          v-if="!allCrgsReady"
          label="Alguns alunos estão sem CRG"
          position="is-bottom"
          animated
          multilined
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
      title="Graduandos Aptos"
      :is-graduating="true"
      :is-active="true"
      :show-defense-date="true"
      :is-fit="true"
      :default-sort-field="'crg'"
      :default-sort-order="'desc'"
      :show-crg-filter="true"
      @toggleComboBox="onToggleComboBox"
      @move="handleMove"
    ></SearchInput>
    <br />
    <SearchInput
      ref="GraduatingSearchInput"
      :default-course="courseTag"
      title="Graduandos Não-Aptos"
      :is-graduating="true"
      :is-active="true"
      :show-defense-date="true"
      :is-fit="false"
      @move="handleMove"
    ></SearchInput>
    <br />
    <SearchInput
      :default-course="courseTag"
      title="Formandos"
      :is-active="true"
      :is-forming="true"
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
              @click="selectAcademicHighlight(student.id)"
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
import SearchInput from '@/components/SearchInput'
import ModalPrescribedList from '@/components/ModalPrescribedList'

export default {
  name: 'Forming',
  middleware: 'course',
  components: {
    SearchInput,
    ModalPrescribedList
  },
  head() {
    return {
      title: 'Formandos'
    }
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
        isActive: true,
        isGraduating: true,
        isFit: true,
        noCrg: true
      }
      return this.$services.students
        .fetchPage(params)
        .then(students => {
          this.allCrgsReady = students.data.length === 0
        })
        .catch(() => {
          this.allCrgsReady = false
        })
    },

    openModal() {
      this.isModalOpen = true

      const params = {
        course: this.courseTag,
        isActive: true,
        isGraduating: true,
        isFit: true,
        sort: 'crg',
        order: 'desc'
      }
      this.$services.students
        .fetchPage(params)
        .then(res => {
          if (!res.data.length) {
            this.$toast.open({
              message: 'Não há candidatos a destaque acadêmico.',
              type: 'is-danger'
            })
            this.isModalOpen = true
            return
          }

          const highestCrg = res.data[0].crg

          this.academicHighlightCandidates = res.data.filter(
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

    selectAcademicHighlight(studentId) {
      this.isModalOpen = false
      this.$services.students
        .updateAcademicHighlight(studentId)
        .then(res => {
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
    },
    handleMove() {
      const refs = [
        this.$refs.fitGraduatingSearchInput,
        this.$refs.GraduatingSearchInput
      ]

      for (const ref of refs) {
        if (ref && ref.getStudents) {
          ref.getStudents()
        }
      }
    }
  }
}
</script>
