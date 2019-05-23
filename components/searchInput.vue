<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div class="columns is-centered">
      <div class="column is-half">
        <b-field horizontal class="box" label="Filtros: ">
          <b-checkbox v-model="nameFilter">Nome</b-checkbox>
          <b-checkbox v-model="registrationFilter">Matricula</b-checkbox>
          <b-checkbox v-model="emailFilter">Email</b-checkbox>
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
          :hoverable="isHoverabble"
          :data="studentsData"
          :selected.sync="selectedStudent"
          :columns="columns"
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
            v-if="selectedStudent"
            :student="selectedStudent"
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
export default {
  name: 'SearchInput',
  components: {
    studentComboBox
  },
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
      default: () => 0
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
      emailFilter: false
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
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
    courseTag() {
      this.getStudentsFilters()
    },
    students() {
      this.studentsData = [...this.students]
    }
  },

  afterMounted() {
    if (this.students.length < 1 && this.defaultFilters.isActive === 1) {
      this.$toast.open({
        message: 'Não há alunos ativos neste curso',
        type: 'is-danger'
      })
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
            isConcluding: this.isConcluding || null,
            ...maybeParam('name', this.searchName),
            ...maybeParam('registrationNumber', this.searchRegistration),
            ...maybeParam('email', this.searchEmail)
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
template {
  overflow-y: hidden;
}

.container {
  margin: 50px auto 50px auto;
}
</style>
