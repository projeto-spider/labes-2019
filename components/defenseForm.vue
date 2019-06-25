<template>
  <form @submit.prevent="handleSubmit">
    <b-field label="Curso (para alterar, use a seleção no topo esquerdo)">
      <b-input :value="courseNameExtended" disabled></b-input>
    </b-field>

    <b-field v-for="(student, i) in model.students" :key="i" grouped>
      <b-field label="Nome do(a) Aluno(a)" expanded>
        <b-input v-model="model.students[i].name" required></b-input>
      </b-field>

      <b-field label="Matrícula do(a) Aluno(a)" expanded>
        <b-input
          v-model="model.students[i].registrationNumber"
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
</template>

<script>
import { mapState } from 'vuex'
import Datepicker from './datepicker'
import Timepicker from './timepicker'

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
  name: 'DefenseForm',

  components: {
    Datepicker,
    Timepicker
  },

  props: {
    value: {
      type: Object,
      required: true
    },

    onSubmit: {
      type: Function,
      default: () => {}
    }
  },

  data: () => ({
    model: defaultModel()
  }),

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

  watch: {
    model: {
      deep: true,
      handler(value) {
        this.$emit('input', this.preparePayload(value))
      }
    }
  },

  created() {
    this.updateModel()
  },

  methods: {
    reset() {
      this.model = defaultModel()
    },

    updateModel() {
      if (!this.value) {
        return
      }
      const studentNames = prepareArray(this.value.students)
      const registrationNumbers = prepareArray(this.value.registrationNumbers)
      const receivedStudents = studentNames.map((name, i) => ({
        name,
        registrationNumber: registrationNumbers[i]
      }))

      const students = receivedStudents.length
        ? receivedStudents
        : [defaultStudent()]

      Object.assign(this.model, this.value, { students })
    },

    pushStudent() {
      this.model.students.push(defaultStudent())
    },

    removeStudent(i) {
      this.model.students.splice(i, 1)
    },

    handleSubmit() {
      const payload = this.preparePayload(this.model)
      return this.onSubmit(payload)
    },

    preparePayload(value) {
      const course = this.courseTag
      const students =
        value.students && value.students.map(x => x.name).join(', ')
      const registrationNumbers =
        value.students &&
        value.students.map(x => x.registrationNumber).join(', ')

      return { ...value, course, students, registrationNumbers }
    }
  }
}

function prepareArray(maybeArray) {
  if (Array.isArray(maybeArray)) {
    return maybeArray
  }

  if (typeof maybeArray === 'string') {
    return maybeArray.split(', ')
  }

  return []
}
</script>
