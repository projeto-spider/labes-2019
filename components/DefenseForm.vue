<template>
  <form @submit.prevent="handleSubmit">
    <b-field
      v-if="showGradeInput && value.status !== 'pending'"
      label="Nota (necessária para poder finalizar)"
    >
      <b-input
        v-model="model.grade"
        :min="0"
        :max="10"
        :disabled="forceDisable || currentUser.role !== 'admin'"
        @blur="onGradeBlur"
      ></b-input>
    </b-field>

    <b-field label="Curso (para alterar, use a seleção no topo esquerdo)">
      <b-input :value="courseNameExtended" disabled></b-input>
    </b-field>

    <b-field v-for="(student, i) in model.students" :key="i" grouped>
      <b-field label="Nome do(a) Aluno(a)" expanded>
        <b-autocomplete
          v-model="model.students[i].name"
          :data="possibleCompletionStudents.students"
          :loading="possibleCompletionStudents.index === i"
          field="name"
          :disabled="forceDisable"
          @typing="name => getStudentCompletions(i, name)"
          @select="student => onSelectAutoCompleteStudent(i, student)"
        >
          <template slot="empty">
            <span>Nenhum estudante encontrado</span>
          </template>
        </b-autocomplete>
      </b-field>

      <b-field label="Matrícula do(a) Aluno(a)" expanded>
        <b-input
          v-model="model.students[i].registrationNumber"
          expanded
          required
          :disabled="true"
        ></b-input>
      </b-field>

      <b-field label="⠀">
        <div v-if="i === 0" class="control">
          <b-button
            class="button is-primary"
            native-type="button"
            :disabled="forceDisable || model.students.length > 1"
            @click="pushStudent"
          >
            Adicionar
          </b-button>
        </div>

        <div v-else class="control">
          <b-button
            class="button is-danger"
            native-type="button"
            :disabled="forceDisable"
            @click="removeStudent(i)"
          >
            Remover
          </b-button>
        </div>
      </b-field>
    </b-field>

    <b-field label="Local">
      <b-input
        v-model="model.local"
        required
        :disabled="forceDisable"
      ></b-input>
    </b-field>

    <b-field label="Data">
      <DatePicker
        v-model="model.date"
        :min-date="minDate"
        placeholder="Selecionar data"
        :disabled="forceDisable"
      />
    </b-field>

    <b-field label="Horário inicial">
      <TimePicker v-model="model.time" :disabled="forceDisable" />
    </b-field>

    <b-field label="Título TCC">
      <b-input
        v-model="model.title"
        required
        :disabled="forceDisable"
      ></b-input>
    </b-field>

    <b-field label="Palavras Chave">
      <b-input
        v-model="model.keywords"
        required
        :disabled="forceDisable"
      ></b-input>
    </b-field>

    <b-field label="Resumo">
      <b-input
        v-model="model.summary"
        maxlength="1600"
        type="textarea"
        required
        :disabled="forceDisable"
      ></b-input>
    </b-field>

    <h2 class="subtitle">Banca examinadora:</h2>

    <b-field grouped>
      <b-field label="Orientador(a)" expanded>
        <b-input
          v-model="model.advisorName"
          required
          :disabled="forceDisable"
        ></b-input>
      </b-field>
      <b-field label="Titulo">
        <b-select
          v-model="model.advisorTitle"
          required
          :disabled="forceDisable"
        >
          <option value="other">Outro</option>
          <option value="doctor">Doutor</option>
          <option value="master">Mestre</option>
        </b-select>
      </b-field>
      <b-field label="Tipo">
        <input-validation ref="advisorIpt" :valid="validateExternalAdvisor">
          <b-select
            v-model="model.advisorType"
            required
            :disabled="forceDisable"
            @blur="onBlur('advisorIpt')"
          >
            <option value="internal">Interno</option>
            <option value="external">Externo</option>
          </b-select>
        </input-validation>
      </b-field>
      <b-field class="centered" label="Professor">
        <b-checkbox
          v-model="model.advisorIsTeacher"
          class="is-teacher-checkbox"
          :disabled="forceDisable"
        >
        </b-checkbox>
      </b-field>
    </b-field>

    <b-field grouped>
      <b-field label="Coorientador(a) (Opcional)" expanded>
        <b-input
          v-model="model.coAdvisorName"
          :disabled="forceDisable"
        ></b-input>
      </b-field>
      <b-field label="Titulo">
        <b-select v-model="model.coAdvisorTitle" :disabled="forceDisable">
          <option value="other">Outro</option>
          <option value="doctor">Doutor</option>
          <option value="master">Mestre</option>
        </b-select>
      </b-field>
      <b-field label="Tipo">
        <input-validation ref="coAdvisorIpt" :valid="validateExternalAdvisor">
          <b-select
            v-model="model.coAdvisorType"
            :disabled="forceDisable"
            @blur="onBlur('coAdvisorIpt')"
          >
            <option value="internal">Interno</option>
            <option value="external">Externo</option>
          </b-select>
        </input-validation>
      </b-field>
      <b-field class="centered" label="Professor">
        <b-checkbox
          v-model="model.coAdvisorIsTeacher"
          class="is-teacher-checkbox"
          :disabled="forceDisable"
        >
        </b-checkbox>
      </b-field>
    </b-field>

    <b-field grouped>
      <b-field label="Avaliador(a) 1" expanded>
        <b-input
          v-model="model.evaluator1Name"
          required
          :disabled="forceDisable"
        ></b-input>
      </b-field>
      <b-field label="Titulo">
        <b-select
          v-model="model.evaluator1Title"
          required
          :disabled="forceDisable"
        >
          <option value="other">Outro</option>
          <option value="doctor">Doutor</option>
          <option value="master">Mestre</option>
        </b-select>
      </b-field>
      <b-field label="Tipo">
        <b-select
          v-model="model.evaluator1Type"
          required
          :disabled="forceDisable"
        >
          <option value="internal">Interno</option>
          <option value="external">Externo</option>
        </b-select>
      </b-field>
      <b-field class="centered" label="Professor">
        <b-checkbox
          v-model="model.evaluator1IsTeacher"
          class="is-teacher-checkbox"
          :disabled="forceDisable"
        >
        </b-checkbox>
      </b-field>
    </b-field>

    <b-field grouped>
      <b-field label="Avaliador(a) 2" expanded>
        <b-input
          v-model="model.evaluator2Name"
          required
          :disabled="forceDisable"
        ></b-input>
      </b-field>
      <b-field label="Titulo">
        <b-select
          v-model="model.evaluator2Title"
          required
          :disabled="forceDisable"
        >
          <option value="other">Outro</option>
          <option value="doctor">Doutor</option>
          <option value="master">Mestre</option>
        </b-select>
      </b-field>
      <b-field label="Tipo">
        <b-select
          v-model="model.evaluator2Type"
          required
          :disabled="forceDisable"
        >
          <option value="internal">Interno</option>
          <option value="external">Externo</option>
        </b-select>
      </b-field>
      <b-field class="centered" label="Professor">
        <b-checkbox
          v-model="model.evaluator2IsTeacher"
          class="is-teacher-checkbox"
          :disabled="forceDisable"
        >
        </b-checkbox>
      </b-field>
    </b-field>

    <b-field grouped>
      <b-field label="Avaliador(a) 3 (Opcional)" expanded>
        <b-input
          v-model="model.evaluator3Name"
          :disabled="forceDisable"
        ></b-input>
      </b-field>
      <b-field label="Titulo">
        <b-select v-model="model.evaluator3Title" :disabled="forceDisable">
          <option value="other">Outro</option>
          <option value="doctor">Doutor</option>
          <option value="master">Mestre</option>
        </b-select>
      </b-field>
      <b-field label="Tipo">
        <b-select v-model="model.evaluator3Type" :disabled="forceDisable">
          <option value="internal">Interno</option>
          <option value="external">Externo</option>
        </b-select>
      </b-field>
      <b-field class="centered" label="Professor">
        <b-checkbox
          v-model="model.evaluator3IsTeacher"
          class="is-teacher-checkbox"
          :disabled="forceDisable"
        >
        </b-checkbox>
      </b-field>
    </b-field>

    <div v-if="!forceDisable" class="control">
      <button
        class="button is-primary is-large"
        type="submit"
        :disabled="disableSendButton"
      >
        Enviar
      </button>
      <nuxt-link v-if="cancelRedirect" :to="cancelRedirect">
        <b-button type="is-danger is-large">Cancelar</b-button>
      </nuxt-link>
    </div>
  </form>
</template>

<style>
.centered {
  text-align: center;
  vertical-align: center;
}
</style>

<script>
import { mapState, mapGetters } from 'vuex'
import pDebounce from 'p-debounce'
import DatePicker from '@/components/DatePicker'
import TimePicker from '@/components/TimePicker'
import InputValidation from '@/components/InputValidation'

const defaultStudent = () => ({ name: '', registrationNumber: '' })
const defaultModel = () => {
  const today = new Date()
  return {
    grade: 0,
    students: [defaultStudent()],
    local: '',
    title: '',
    keywords: '',
    summary: '',
    date: `${today.getDay()}/${today.getMonth() + 1}/${today.getFullYear()}`,
    time: '00:00:00',

    advisorName: '',
    advisorTitle: 'other',
    advisorType: 'internal',
    advisorIsTeacher: false,

    coAdvisorName: '',
    coAdvisorTitle: 'other',
    coAdvisorType: 'internal',
    coAdvisorIsTeacher: false,

    evaluator1Name: '',
    evaluator1Title: 'other',
    evaluator1Type: 'internal',
    evaluator1IsTeacher: false,

    evaluator2Name: '',
    evaluator2Title: 'other',
    evaluator2Type: 'internal',
    evaluator2IsTeacher: false,

    evaluator3Name: '',
    evaluator3Title: 'other',
    evaluator3Type: 'internal',
    evaluator3IsTeacher: false
  }
}

export default {
  name: 'DefenseForm',

  components: {
    DatePicker,
    TimePicker,
    InputValidation
  },

  props: {
    value: {
      type: Object,
      required: true
    },

    original: {
      type: Object,
      default: null
    },

    forceDisable: {
      type: Boolean,
      default: false
    },

    showGradeInput: {
      type: Boolean,
      default: true
    },

    cancelRedirect: {
      type: [String, Boolean],
      default: false
    },

    onSubmit: {
      type: Function,
      default: () => {}
    }
  },

  data() {
    const today = new Date()
    return {
      model: defaultModel(),
      minDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      possibleCompletionStudents: {
        students: [],
        index: undefined
      }
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    }),

    ...mapGetters({ currentUser: 'auth/currentUser' }),

    courseNameExtended() {
      const enumName = {
        cbsi: 'Sistemas de Informação',
        cbcc: 'Ciência da Computação'
      }
      return enumName[this.courseTag] || ''
    },

    validateExternalAdvisor() {
      if (
        this.model.advisorType === 'external' &&
        this.model.coAdvisorType === 'external'
      ) {
        this.$toast.open({
          message:
            'Orientador ou coorientador podem ser externos, mas apenas um deles',
          type: 'is-danger'
        })
        return false
      }
      return true
    },

    disableSendButton() {
      return !this.validateExternalAdvisor
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
    onBlur(refName) {
      this.$refs[refName].dirty = true
    },

    reset() {
      this.model = defaultModel()
    },

    updateModel() {
      if (!this.original) {
        return
      }
      const studentNames = prepareArray(this.original.students)
      const registrationNumbers = prepareArray(
        this.original.registrationNumbers
      )
      const receivedStudents = studentNames.map((name, i) => ({
        name,
        registrationNumber: registrationNumbers[i]
      }))

      const students = receivedStudents.length
        ? receivedStudents
        : [defaultStudent()]

      Object.assign(this.model, defaultModel(), this.original, { students })
      this.$emit('input', this.preparePayload(this.model))
    },

    pushStudent() {
      this.model.students.push(defaultStudent())
    },

    removeStudent(i) {
      this.model.students.splice(i, 1)
    },

    handleSubmit() {
      const missingRegistrationNumbers = this.model.students.some(
        student => !student.registrationNumber
      )
      if (missingRegistrationNumbers) {
        this.$toast.open({
          message: 'Alguns alunos são inválidos.',
          type: 'is-warning'
        })
        return
      }

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
    },

    getStudentCompletions: pDebounce(function getStudentCompletions(i, name) {
      this.model.students[i].registrationNumber = ''
      return this.$services.students
        .fetchPage({
          name: `%${name}%`,
          noDefense: true
        })
        .then(res => {
          this.possibleCompletionStudents.students = res.data.filter(
            student =>
              !this.model.students.find(
                other => other.registrationNumber === student.registrationNumber
              )
          )
        })
    }, 500),

    onSelectAutoCompleteStudent(i, student) {
      this.possibleCompletionStudents.i = undefined
      this.possibleCompletionStudents.students = []

      if (!student) {
        return
      }

      this.model.students[i].name = student.name
      this.model.students[i].registrationNumber = student.registrationNumber
    },

    onGradeBlur(e) {
      let value =
        typeof e.target.value === 'string'
          ? +e.target.value.replace(',', '.')
          : +e.target.value

      if (typeof value !== 'number') {
        return
      }

      if (value !== Math.floor(value)) {
        value = Math.trunc(+value * 100) / 100
      }

      this.model.grade = Math.max(0, Math.min(10, value))
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

<style>
.is-teacher-checkbox {
  margin-top: 8px;
}
</style>
