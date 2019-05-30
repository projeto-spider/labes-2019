<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div class="columns is-centered">
      <div class="column is-10">
        <b-field horizontal class="box" label="Filtros: ">
          <b-checkbox v-model="nameFilter">Nome</b-checkbox>
          <b-checkbox v-model="registrationFilter">Matricula</b-checkbox>
          <b-checkbox v-model="emailFilter">Email</b-checkbox>
          <b-checkbox v-if="showCrgFilter" v-model="blankCrgFilter">
            Sem CRG
          </b-checkbox>
        </b-field>
        <b-input
          v-if="nameFilter"
          v-model="searchName"
          placeholder="Digite o nome"
          type="search"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <b-input
          v-if="registrationFilter"
          v-model="searchRegistration"
          placeholder="Digite a matricula"
          type="search"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <b-input
          v-if="emailFilter"
          v-model="searchEmail"
          placeholder="Digite o e-mail"
          type="email"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <br />
        <b-table
          :striped="isStriped"
          :hoverable="isHoverable"
          :data="tableData"
          :selected.sync="selectedStudent"
          :columns="columns"
          class="searchInputTable"
          focusable
          paginated
          backend-pagination
          :total="total"
          :per-page="perPage"
          backend-sorting
          :default-sort-direction="sortOrder"
          :default-sort="[sortField, sortOrder]"
          @page-change="onPageChange"
          @sort="onSort"
        ></b-table>
        <b-modal :active.sync="selectedStudent" has-modal-card>
          <student-combo-box
            v-if="comboBoxStudent"
            :student="comboBoxStudent"
            @student-put="getStudentsFilters"
          ></student-combo-box>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import pDebounce from 'p-debounce'
import studentComboBox from '../components/studentComboBox'
import { studentStatus } from './mixins/studentStatus'
export default {
  name: 'SearchInput',
  components: {
    studentComboBox
  },
  mixins: [studentStatus],
  props: {
    title: {
      type: String,
      default: () => "Page's title"
    },
    defaultCourse: {
      type: String,
      default: () => 'cbcc'
    },
    isActive: {
      type: Number,
      default: () => 0
    },
    isConcluding: {
      type: Number,
      default: () => NaN
    },
    isGraduating: {
      type: Number,
      default: () => NaN
    },
    showDefenseDate: {
      type: Boolean,
      default: () => false
    },
    isFit: {
      type: Number,
      default: () => NaN
    },
    isForming: {
      type: Number,
      default: () => NaN
    },
    defaultSortField: {
      type: String,
      default: () => 'name'
    },
    defaultSortOrder: {
      type: String,
      default: () => 'asc'
    },
    defaultPage: {
      type: Number,
      default: () => 1
    },
    defaultPerPage: {
      type: Number,
      default: () => 10
    },
    students: {
      type: Array,
      default: () => []
    },
    showCrgFilter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      studentsData: [],
      searchName: '',
      searchRegistration: '',
      searchEmail: '',
      isStriped: true,
      isHoverable: true,
      selectedStudent: null,
      columns: [
        {
          field: 'registrationNumber',
          label: 'Matrícula',
          sortable: true
        },
        {
          field: 'name',
          label: 'Nome',
          sortable: true
        },
        {
          field: 'email',
          label: 'Email'
        },
        {
          field: 'status',
          label: 'Status'
        }
      ],
      total: 0,
      totalPages: 0,
      page: 1,
      perPage: this.defaultPerPage,
      sortField: this.defaultSortField,
      sortOrder: this.defaultSortOrder,
      loading: false,
      nameFilter: false,
      registrationFilter: false,
      emailFilter: false,
      blankCrgFilter: false
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    }),
    tableData() {
      return this.studentsData.map(data => {
        const obj = Object.assign({}, data)
        obj.status = this.getStatus(data)
        return obj
      })
    },
    comboBoxStudent() {
      if (!this.selectedStudent) {
        return false
      }
      return this.studentsData.find(
        student => student.id === this.selectedStudent.id
      )
    }
  },
  watch: {
    searchName() {
      this.getStudentsFilters()
    },
    searchRegistration() {
      this.getStudentsFilters()
    },
    searchEmail() {
      this.getStudentsFilters()
    },
    blankCrgFilter() {
      this.getStudentsFilters()
    },
    courseTag() {
      this.getStudentsFilters()
    },
    students() {
      this.studentsData = [...this.students]
    },
    total() {
      if (+this.total === 0) {
        if (this.isActive) {
          this.$toast.open({
            message: 'Nenhum aluno(a) ativo(a) foi encontrado(a)!',
            type: 'is-warning'
          })
        } else {
          this.$toast.open({
            message: `Nenhum aluno(a) foi encontrado(a)!`,
            type: 'is-warning'
          })
        }
      }
    }
  },

  created() {
    this.getStudents()
  },

  methods: {
    getStudentsFilters: pDebounce(function getStudentsFilters() {
      this.getStudents()
    }, 500),

    getStudents() {
      this.loading = true
      function maybeParam(key, value) {
        return value && { [key]: `%${value}%` }
      }
      this.$axios
        .get('/api/students/', {
          params: {
            course: this.courseTag,
            page: this.page,
            sort: this.sortField,
            order: this.sortOrder === 'asc' ? 'ASC' : 'DESC',
            isActive: this.isActive !== 'AllStudents' ? this.isActive : null,
            isConcluding: !isNaN(this.isConcluding) ? this.isConcluding : null,
            isForming: !isNaN(this.isForming) ? this.isForming : null,
            isFit: this.isGraduating && !isNaN(this.isFit) ? this.isFit : null,
            isGraduating: !isNaN(this.isGraduating) ? this.isGraduating : null,
            ...maybeParam('name', this.searchName),
            ...maybeParam('registrationNumber', this.searchRegistration),
            ...maybeParam('email', this.searchEmail),
            ...(this.blankCrgFilter && { noCrg: true })
          }
        })
        .then(res => {
          this.studentsData = res.data
          this.total = res.headers['pagination-row-count']
          this.perPage = res.headers['pagination-page-size']
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar a lista de alunos.',
            type: 'is-danger'
          })
        })
    },

    onSort(filterField, order) {
      this.sortField = filterField
      this.sortOrder = order
      this.getStudents()
    },

    onPageChange(page) {
      this.page = page
      this.getStudents()
    }
  }
}
</script>

<style scoped>
.container {
  margin: 50px auto 50px auto;
}
</style>

<style>
.searchInputTable div.table-wrapper table tbody tr td:nth-child(2) span {
  cursor: pointer;
}
</style>
