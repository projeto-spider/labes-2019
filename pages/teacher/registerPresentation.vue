<template>
  <div class="container">
    <section class="section">
      <h1 class="title">Formulario para defesa de TCC</h1>

      <div class="box">
        <h2 class="subtitle">Dados da defesa:</h2>

        <form @submit.prevent="onSubmit">
          <b-field label="Curso (para alterar, use a seleção no topo esquerdo)">
            <b-input :value="courseNameExtended" disabled></b-input>
          </b-field>

          <b-field v-for="(student, i) in model.students" :key="i" grouped>
            <b-field label="Nome do(a) Aluno(a)" expanded>
              <b-input v-model="student.name" required></b-input>
            </b-field>

            <b-field label="Matrícula do(a) Aluno(a)" expanded>
              <b-input
                v-model="student.registrationNumber"
                expanded
                required
              ></b-input>
            </b-field>

            <b-field label="⠀">
              <div v-if="i === 0" class="control">
                <b-button
                  class="button is-primary"
                  native-type="button"
                  @click="pushStudent()"
                >
                  Adicionar
                </b-button>
              </div>

              <div v-else class="control">
                <b-button
                  class="button is-danger"
                  native-type="button"
                  @click="removeStudent(i)"
                >
                  Remover
                </b-button>
              </div>
            </b-field>
          </b-field>

          <b-field label="Local">
            <b-input v-model="model.local" required></b-input>
          </b-field>

          <b-field label="Data">
            <datepicker v-model="model.date" placeholder="Selecionar data" />
          </b-field>

          <b-field label="Horário inicial">
            <timepicker v-model="model.time" />
          </b-field>

          <b-field label="Título TCC">
            <b-input v-model="model.title" required></b-input>
          </b-field>

          <b-field label="Palavras Chave">
            <b-input v-model="model.keywords" required></b-input>
          </b-field>

          <b-field label="Resumo">
            <b-input
              v-model="model.summary"
              maxlength="400"
              type="textarea"
              required
            ></b-input>
          </b-field>

          <h2 class="subtitle">Banco examinadora:</h2>

          <b-field grouped>
            <b-field label="Orientador(a)" expanded>
              <b-input v-model="model.advisorName" required></b-input>
            </b-field>
            <b-field label="Titulo">
              <b-select v-model="model.advisorTitle" required>
                <option value="other">Outro</option>
                <option value="doctor">Doutor</option>
                <option value="master">Mestre</option>
              </b-select>
            </b-field>
            <b-field label="Tipo">
              <b-select v-model="model.advisorType" required>
                <option value="internal">Membro Interno</option>
                <option value="external">Membro Externo</option>
              </b-select>
            </b-field>
          </b-field>

          <b-field grouped>
            <b-field label="Coorientador(a) (Opcional)" expanded>
              <b-input v-model="model.coAdvisorName"></b-input>
            </b-field>
            <b-field label="Titulo">
              <b-select v-model="model.coAdvisorTitle">
                <option value="other">Outro</option>
                <option value="doctor">Doutor</option>
                <option value="master">Mestre</option>
              </b-select>
            </b-field>
            <b-field label="Tipo">
              <b-select v-model="model.coAdvisorType">
                <option value="internal">Membro Interno</option>
                <option value="external">Membro Externo</option>
              </b-select>
            </b-field>
          </b-field>

          <b-field grouped>
            <b-field label="Avaliador(a) 1" expanded>
              <b-input v-model="model.evaluator1Name" required></b-input>
            </b-field>
            <b-field label="Titulo">
              <b-select v-model="model.evaluator1Title" required>
                <option value="other">Outro</option>
                <option value="doctor">Doutor</option>
                <option value="master">Mestre</option>
              </b-select>
            </b-field>
            <b-field label="Tipo">
              <b-select v-model="model.evaluator1Type" required>
                <option value="internal">Membro Interno</option>
                <option value="external">Membro Externo</option>
              </b-select>
            </b-field>
          </b-field>

          <b-field grouped>
            <b-field label="Avaliador(a) 2" expanded>
              <b-input v-model="model.evaluator2Name" required></b-input>
            </b-field>
            <b-field label="Titulo">
              <b-select v-model="model.evaluator2Title" required>
                <option value="other">Outro</option>
                <option value="doctor">Doutor</option>
                <option value="master">Mestre</option>
              </b-select>
            </b-field>
            <b-field label="Tipo">
              <b-select v-model="model.evaluator2Type" required>
                <option value="internal">Membro Interno</option>
                <option value="external">Membro Externo</option>
              </b-select>
            </b-field>
          </b-field>

          <b-field grouped>
            <b-field label="Avaliador(a) 3 (Opcional)" expanded>
              <b-input v-model="model.evaluator3Name"></b-input>
            </b-field>
            <b-field label="Titulo">
              <b-select v-model="model.evaluator3Title">
                <option value="other">Outro</option>
                <option value="doctor">Doutor</option>
                <option value="master">Mestre</option>
              </b-select>
            </b-field>
            <b-field label="Tipo">
              <b-select v-model="model.evaluator3Type">
                <option value="internal">Membro Interno</option>
                <option value="external">Membro Externo</option>
              </b-select>
            </b-field>
          </b-field>

          <div class="control">
            <b-button type="is-primary is-large" native-type="submit">
              Enviar
            </b-button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { errorsHandler } from '../../components/mixins/errors'
import Datepicker from '../../components/datepicker'
import Timepicker from '../../components/timepicker'

const defaultStudent = () => ({ name: '', registrationNumber: '' })

const defaultModel = () => ({
  students: [defaultStudent()],
  local: '',
  title: '',
  keywords: '',
  summary: '',
  date: '01/01/2020',
  time: '00:00:00',

  advisorName: '',
  advisorTitle: 'other',
  advisorType: 'internal',

  coAdvisorName: '',
  coAdvisorTitle: 'other',
  coAdvisorType: 'internal',

  evaluator1Name: '',
  evaluator1Title: 'other',
  evaluator1Type: 'internal',

  evaluator2Name: '',
  evaluator2Title: 'other',
  evaluator2Type: 'internal',

  evaluator3Name: '',
  evaluator3Title: 'other',
  evaluator3Type: 'internal'
})

export default {
  name: 'RegisterPresentation',
  layout: 'defaultTeacher',
  components: {
    Datepicker,
    Timepicker
  },
  mixins: [errorsHandler],
  middleware: ['course'],
  data() {
    return {
      course: this.courseTag,
      model: defaultModel()
    }
  },
  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    }),
    courseNameExtended() {
      const enumName = {
        cbsi: 'Sistemas de Informação',
        cbcc: 'Ciência da Computação'
      }
      return enumName[this.courseTag] || ''
    }
  },

  methods: {
    pushStudent() {
      this.model.students.push(defaultStudent())
    },

    removeStudent(i) {
      this.model.students.splice(i, 1)
    },

    onSubmit() {
      const course = this.courseTag
      const students = this.model.students.map(x => x.name).join(', ')
      const registrationNumbers = this.model.students
        .map(x => x.registrationNumber)
        .join(', ')

      const payload = { ...this.model, course, students, registrationNumbers }

      const endpoint = '/api/defenses'
      return this.$axios
        .$post(endpoint, payload)
        .then(() => {
          this.$toast.open({
            message: 'Solicitação realizada com sucesso!',
            type: 'is-success'
          })

          this.model = defaultModel()
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
