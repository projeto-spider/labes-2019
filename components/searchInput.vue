<template>
  <div>
    <br />
    <br />
    <div class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="field is-grouped">
          <p class="control is-expanded">
            <input
              v-model="search"
              class="input"
              type="text"
              placeholder=" Buscar alunos"
            />
          </p>
        </div>
        <table class="table">
          <thead v-if="search" class="thead">
            <tr>
              <th v-for="(value, index) in thead" :key="index">{{ value }}</th>
            </tr>
          </thead>
          <tbody v-if="search" class="tbody">
            <tr v-for="(student, index) in filteredList" :key="index">
              <td>{{ student.registrationNumber }}</td>
              <td>{{ student.name }}</td>
              <td>{{ student.email }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchInput',
  // props: ['title', 'students', 'thead'],
  props: {
    title: {
      type: String,
      default: () => "Page's title"
    },
    students: {
      type: Array,
      default: () => []
    },
    thead: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return { search: '' }
  },
  computed: {
    filteredList() {
      return this.students.filter(student => {
        return (
          student.name.toLowerCase().includes(this.search.toLowerCase()) ||
          student.email.toLowerCase().includes(this.search.toLowerCase()) ||
          student.registrationNumber
            .toLowerCase()
            .includes(this.search.toLowerCase())
        )
      })
    }
  }
}
</script>
