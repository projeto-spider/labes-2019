<template>
  <div>
    <div v-if="title" class="columns is-centered has-text-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <slot></slot>
    <br />
    <div class="columns is-centered">
      <div class="column is-10">
        <b-field horizontal class="box" label="Filtros: ">
          <b-checkbox v-model="nameFilter">Nome</b-checkbox>
          <b-checkbox v-model="registrationFilter">Matrícula</b-checkbox>
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
          placeholder="Digite a matrícula"
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
          :row-class="row => !!row.academicHighlight && 'is-academic-highlight'"
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
        >
          <template slot-scope="props">
            <b-table-column
              v-for="(column, index) in columns"
              :key="index"
              :label="column.label"
              :sortable="column.sortable"
            >
              <b-tooltip
                v-if="!!props.row.academicHighlight && column.field === 'name'"
                :always="forceAcademicHighlightTooltip"
                label="Destaque acadêmico"
              >
                {{ props.row[column.field] }}
              </b-tooltip>
              <span v-else>{{ props.row[column.field] }}</span>
            </b-table-column>
          </template>
        </b-table>
        <b-modal
          :active.sync="activateModal"
          has-modal-card
          animation
          :on-cancel="emptySelected"
        >
          <StudentComboBox
            v-if="comboBoxStudent"
            :student="comboBoxStudent"
            @student-put="getStudentsFilters"
          ></StudentComboBox>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import pDebounce from 'p-debounce'
import StudentComboBox from '@/components/StudentComboBox'
import { studentStatus } from '@/components/mixins/studentStatus'
export default {
  name: 'SearchInput',
  components: {
    StudentComboBox
  },
  mixins: [studentStatus],
  props: {
    title: {
      type: String,
      default: ''
    },
    defaultCourse: {
      type: String,
      default: 'cbcc'
    },
    isActive: {
      type: Boolean,
      default: undefined
    },
    isConcluding: {
      type: Boolean,
      default: undefined
    },
    isGraduating: {
      type: Boolean,
      default: undefined
    },
    showDefenseDate: {
      type: Boolean,
      default: false
    },
    isFit: {
      type: Boolean,
      default: undefined
    },
    isForming: {
      type: Boolean,
      default: undefined
    },
    defaultSortField: {
      type: String,
      default: 'name'
    },
    defaultSortOrder: {
      type: String,
      default: 'asc',
      validator(value) {
        return ['asc', 'desc'].includes(value)
      }
    },
    defaultPage: {
      type: Number,
      default: 1
    },
    defaultPerPage: {
      type: Number,
      default: 10
    },
    students: {
      type: Array,
      default: () => []
    },
    mailingList: {
      type: String,
      default: undefined
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
      previousTotal: 0,
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
      blankCrgFilter: false,
      forceAcademicHighlightTooltip: false,
      activateModal: false
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
    },
    getParams() {
      const commonParams = {
        course: this.courseTag,
        page: this.page,
        sort: this.sortField,
        order: this.sortOrder,
        ...maybeParam('name', this.searchName),
        ...maybeParam('registrationNumber', this.searchRegistration),
        ...maybeParam('email', this.searchEmail)
      }
      if (this.isGraduating) {
        return {
          ...commonParams,
          isFit: this.isFit,
          isGraduating: true,
          ...(this.blankCrgFilter && { noCrg: true })
        }
      }
      return {
        ...commonParams,
        isActive: this.isActive,
        isConcluding: this.isConcluding,
        isForming: this.isForming,
        mailingList: this.mailingList
      }
    }
  },
  watch: {
    nameFilter() {
      if (!this.nameFilter) {
        this.searchName = ''
        this.getStudentsFilters()
      }
    },
    registrationFilter() {
      if (!this.registrationFilter) {
        this.searchRegistration = ''
        this.getStudentsFilters()
      }
    },
    emailFilter() {
      if (!this.emailFilter) {
        this.searchEmail = ''
        this.getStudentsFilters()
      }
    },
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
    selectedStudent() {
      if (this.selectedStudent !== null) {
        this.$emit('toggleComboBox')
        this.activateModal = true
      }
    },
    total() {
      if (+this.total === 0) {
        this.$toast.open({
          message: `${this.title}: Nenhum aluno(a) foi encontrado(a)!`,
          type: 'is-warning'
        })
      }
      if (this.total <= this.previousTotal) {
        this.activateModal = false
      }
    }
  },

  created() {
    this.$services.students
      .fetchPage(this.getParams)
      .then(res => {
        this.studentsData = res.data
        this.previousTotal = res.headers['pagination-row-count']
        this.perPage = res.headers['pagination-page-size']
        this.total = this.previousTotal
      })
      .catch(() => {
        this.$toast.open({
          message: `${this.title}: Falha ao carregar a lista de alunos.`,
          type: 'is-danger'
        })
      })
  },

  mounted() {
    this.$el.addEventListener('mouseover', this.onMouseOver)
  },

  beforeDestroy() {
    this.$el.removeEventListener('mouseover', this.onMouseOver)
  },

  methods: {
    emptySelected() {
      this.selectedStudent = null
    },
    getStudentsFilters: pDebounce(function getStudentsFilters() {
      this.getStudents()
      this.$emit('move')
    }, 500),
    getStudents() {
      this.loading = true
      this.$services.students
        .fetchPage(this.getParams)
        .then(res => {
          this.studentsData = res.data
          this.previousTotal = this.total
          this.total = res.headers['pagination-row-count']
          this.perPage = res.headers['pagination-page-size']
        })
        .catch(() => {
          this.$toast.open({
            message: `${this.title}: Falha ao carregar a lista de alunos.`,
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
    },

    onMouseOver(e) {
      if (e.target && e.target.closest) {
        this.forceAcademicHighlightTooltip = !!e.target.closest(
          '.is-academic-highlight'
        )
      }
    }
  }
}
function maybeParam(key, value) {
  return value && { [key]: `%${value}%` }
}
</script>

<style>
.searchInputTable div.table-wrapper table tbody tr td:nth-child(2) span {
  cursor: pointer;
}
tr.is-academic-highlight {
  background-color: #2ecc71 !important;
}
</style>
