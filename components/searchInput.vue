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
              placeholder="Buscar alunos"
            />
          </p>
          <p class="control">
            <a class="button is-primary">Buscar</a>
          </p>
        </div>
        <table class="table">
          <thead class="thead">
            <tr>
              <th v-for="(value, index) in thead" :key="index">{{ value }}</th>
            </tr>
          </thead>
          <tbody class="tbody">
            <tr v-for="(student, index) in students" :key="index">
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
  props: ['title', 'students', 'thead'],
  data() {
    return { search: '' }
  }
}
</script>
