<template>
  <div class="card">
    <header class="card-header">
      <b-icon pack="fas" icon="user" class="icon"></b-icon>
      <span class="card-header-title">{{ student.name }}</span>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="columns">
          <div class="column is-half">
            <strong>Nome</strong>: {{ student.name }} <br />
            <strong>Matrícula</strong>: {{ student.registrationNumber }} <br />
            <strong>E-mail</strong>: {{ student.email }} <br />
            <strong>Status</strong>: {{ displayStatus }} <br />
            <strong>CRG</strong>: <b-input :disabled="!canEdit"></b-input>
            <br />
            <strong>Pendências</strong>:
            <b-input :disabled="!canEdit"></b-input> <br />
          </div>
          <div class="column is-half">
            <div class="box">
              <p class="title is-4">
                Documentos
              </p>
              <b-field horizontal label="Ata">
                <b-checkbox :disabled="!canEdit"></b-checkbox>
                <a :href="documents[0].url">
                  <b-icon icon="file-pdf"></b-icon>
                </a>
              </b-field>
              <b-field horizontal label="Lauda">
                <b-checkbox :disabled="!canEdit"></b-checkbox>
                <a :href="documents[0].URL">
                  <b-icon icon="file-pdf"></b-icon>
                </a>
              </b-field>
              <b-field horizontal label="CD">
                <b-checkbox :disabled="!canEdit"></b-checkbox>
                <a :href="documents[0].URL">
                  <b-icon icon="file-pdf"></b-icon>
                </a>
              </b-field>
              <strong>Lista</strong>:
              <a>Lista</a>
            </div>
          </div>
        </div>
      </div>
      <b-field grouped position="is-centered">
        <b-field>
          <b-button class="is-primary" @click="toggleEdit"> Editar</b-button>
        </b-field>
        <b-field>
          <b-button class="is-primary"> Submeter</b-button>
        </b-field>
      </b-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentComboBox',
  props: {
    student: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      canEdit: false,
      documents: [
        {
          id: 1,
          studentID: 10,
          type: 2,
          URL: 'url do documento'
        },
        {
          id: 1,
          studentID: 10,
          type: 3,
          URL: 'url do documento'
        }
      ]
    }
  },
  computed: {
    displayStatus() {
      return '"Sei não, hein?"'
    },
    mappedDocuments() {
      // TODO
      return null
    }
  },
  created() {
    // this.$axios
    //   .get(`/api/documents/${this.student.id}`)
    //   .then(res => {
    //     this.documents = res.data
    //   })
    //   .catch(() => {
    //     this.$toast.open({
    //       message: 'Falha ao carregar os documentos do aluno',
    //       type: 'is-danger'
    //     })
    //   })
  },

  methods: {
    toggleEdit() {
      this.canEdit = !this.canEdit
    }
  }
}
</script>

<style scoped>
.card-header {
  align-items: center;
}

.icon {
  margin-left: 1em;
}
</style>
