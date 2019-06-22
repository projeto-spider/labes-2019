<template>
  <div>
    <div v-if="title" class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div class="columns is-centered">
      <div class="column is-10">
        <b-input
          v-model="searchStudentName"
          placeholder="   Digite o nome"
          type="search"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <br />
        <b-table
          :striped="true"
          :hoverable="true"
          :data="tccDefenses"
          :selected.sync="selectedDefense"
          :columns="columns"
          class="searchInputTable scrollable"
          focusable
        >
        </b-table>
        <b-modal :active.sync="selectedDefense" has-modal-card>
          <div class="card widescreen">
            <div class="card-content">
              <div class="content">
                <div class="columns">
                  <div class="column is-half">
                    <header class="card-header">
                      <b-icon pack="fas" icon="info" size="is-small"></b-icon>
                      <p class="card-header-title">Informações da defesa</p>
                    </header>
                  </div>
                </div>
                <div class="columns scrollable-modal">
                  <div class="column is-left is-half">
                    <p>Informações da defesa</p>
                    <b-field label="Curso">
                      <b-input v-model="course"></b-input>
                    </b-field>
                    <b-field label="Matrícula(s)">
                      <b-input
                        v-for="stud in tccStudents"
                        :key="stud.id"
                        v-model="stud.name"
                      ></b-input>
                    </b-field>
                    <b-field label="Local">
                      <b-input v-model="defenseLocal"></b-input>
                    </b-field>
                    <b-field label="Data">
                      <b-datepicker
                        v-model="defenseDate"
                        placeholder="Escolha uma data..."
                      ></b-datepicker>
                    </b-field>
                    <b-field label="Hora">
                      <b-timepicker
                        v-model="defenseTime"
                        placeholder="Escolha um horário..."
                      ></b-timepicker>
                    </b-field>
                    <b-field label="Título do TCC">
                      <b-input v-model="tccTitle"></b-input>
                    </b-field>
                    <b-field label="Palavras-chave">
                      <b-input v-model="keywords"></b-input>
                    </b-field>
                    <b-field label="Resumo">
                      <b-input maxlength="500" type="textarea"></b-input>
                    </b-field>
                    <b-field label="Orientador(a)">
                      <b-input v-model="advisor"></b-input>
                    </b-field>
                    <b-field label="Co-orientador(a)">
                      <b-input v-model="coAdvisor"></b-input>
                    </b-field>
                    <b-field label="Avaliador 1">
                      <b-input v-model="eval1"></b-input>
                    </b-field>
                    <b-field label="Avaliador 2">
                      <b-input v-model="eval2"></b-input>
                    </b-field>
                    <b-field label="Avaliador 3">
                      <b-input v-model="eval3"></b-input>
                    </b-field>
                  </div>
                  <div class="column is-right is-half">
                    <p>Documentos gerados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import http from 'http'
export default {
  name: 'TccDefenseSearch',
  props: {
    publish: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      tccDefenses: [],
      selectedDefense: null,
      searchStudentName: '',
      course: '',
      registration: '',
      tccStudents: [],
      defenseLocal: '',
      defenseDate: null,
      defenseTime: null,
      tccTitle: '',
      keywords: '',
      abstract: '',
      advisor: '',
      coAdvisor: '',
      eval1: '',
      eval2: '',
      eval3: '',
      columns: [
        {
          field: 'advisor',
          label: 'Orientador'
        },
        {
          field: 'registration',
          label: 'Matrícula'
        },
        {
          field: 'name',
          label: 'Nome'
        },
        {
          field: 'defenseDate',
          label: 'Data'
        },
        {
          field: 'defenseTime',
          label: 'Hora'
        },
        {
          field: 'defenseLocal',
          label: 'Local'
        }
      ]
    }
  },
  created() {
    http.get('http://localhost:3341/defenses', res => {
      let body = ''
      res.on('data', data => {
        body += data
      })
      res.on('end', () => {
        this.tccDefenses = JSON.parse(body)
      })
    })
  }
}
</script>

<style scoped>
.widescreen {
  width: 100vw;
}

.card-header {
  align-items: center;
}

.icon {
  margin-left: 1em;
}

.scrollable {
  overflow-y: scroll;
  height: 200px;
}

.scrollable-modal {
  overflow-y: scroll;
  height: 500px;
}
</style>
