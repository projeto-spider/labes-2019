<template>
  <div class="container">
    <div class="columns is-centered has-text-centered">
      <h1 class="title"><strong>Alunos Formandos</strong></h1>
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
      :show-concluding-certificate="true"
      @toggleComboBox="onToggleComboBox"
      @move="handleMove"
    >
      <template v-slot:top>
        <template>
          <b-tooltip
            v-if="!allCrgsReady"
            label="Alguns alunos estão sem CRG"
            position="is-bottom"
            animated
            multilined
          >
            <button
              class="button is-danger"
              :disabled="isAcademicHighlightSelected"
            >
              Eleger Destaque Acadêmico
            </button>
          </b-tooltip>

          <button
            v-else
            class="button is-primary"
            :disabled="isAcademicHighlightSelected"
            @click="openModal"
          >
            Eleger Destaque Acadêmico
          </button>
        </template>

        <template>
          <b-tooltip
            label="Cria lista de frequência da colação para alunos que defenderam"
            position="is-bottom"
            animated
            multilined
          >
            <a
              target="_blank"
              :href="
                `/api/students/${courseTag}/attendance-register?token=${token}`
              "
              class="button is-info"
            >
              Frequência da Colação
            </a>
          </b-tooltip>
        </template>
      </template>
    </SearchInput>
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
        <div v-if="academicHighlightCandidates.length !== 0">
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
        <div v-else class="has-text-centered">
          <p class="title">Não há candidatos a destaque acadêmico</p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '@/components/SearchInput'

export default {
  name: 'Forming',
  middleware: 'course',
  components: {
    SearchInput
  },
  head() {
    return {
      title: 'Formandos'
    }
  },
  data: () => ({
    allCrgsReady: false,
    isModalOpen: false,
    academicHighlightCandidates: [],
    isAcademicHighlightSelected: true
  }),
  computed: {
    ...mapState({
      courseTag: state => state.courseTag,
      token: state => state.auth.token
    })
  },
  created() {
    this.checkCrgsReady()
    this.checkAreThereAcademicHighlight()
  },

  methods: {
    checkAreThereAcademicHighlight() {
      const params = {
        academicHighlight: true,
        isGraduating: true,
        isFit: true
      }
      this.$services.students
        .fetchPage(params)
        .then(response => {
          this.isAcademicHighlightSelected = response.data.length !== 0
        })
        .catch(e => this.openErrorNotification(e))
    },
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
      this.$dialog.confirm({
        title: 'Selecionar Destaque Acadêmico',
        message:
          'Você tem certeza que quer <b>selecionar</b> o destaque acadêmico? Essa ação não pode ser desfeita.',
        confirmText: 'Selecionar',
        type: 'is-warning',
        hasIcon: true,
        onConfirm: () => {
          this.$toast.open('Destaque Acadêmico selecionado!')
          this.isModalOpen = false
          this.$services.students
            .updateAcademicHighlight(studentId)
            .then(res => {
              this.isAcademicHighlightSelected = true
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
        }
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
