<template>
  <section class="container">
    <div v-if="showSelectBox" class="container">
      <div class="card">
        <div class="card-content">
          <section class="section has-text-centered">
            <p class="title">O que você deseja fazer?</p>
          </section>
        </div>
        <footer class="card-footer">
          <p class="card-footer-item">
            <a class="button is-primary" @click="toggleUpdate('updateMyUser')">
              Atualizar meu usuário
            </a>
          </p>
          <p class="card-footer-item">
            <a class="button is-info" @click="toggleUpdate('updateOtherUser')">
              Atualizar outro usuário
            </a>
          </p>
        </footer>
      </div>
    </div>
    <div v-if="updateOtherUser" class="container">
      <div class="box">
        <b-field label="Nome do usuário" expanded>
          <b-autocomplete
            v-model="username"
            :data="possibleCompletionUsers.users"
            field="username"
            @typing="getUserCompletions"
            @select="user => onSelectedUser(user)"
          >
            <template slot="empty">
              <span>Nenhum usuário encontrado</span>
            </template>
          </b-autocomplete>
        </b-field>
        <div v-if="selectedUser" class="has-text-centered">
          <p class="title">
            Dados do usuário
          </p>
          <p class="subtitle">
            <strong>Nome de usuário</strong>: {{ selectedUser.username }}
          </p>
          <p class="subtitle">
            <strong>E-mail</strong>: {{ selectedUser.email }}
          </p>
        </div>
        <br />
        <div class="has-text-centered">
          <button class="button is-success" @click="openFormOtherUser">
            Atualizar usuário
          </button>
        </div>
      </div>
    </div>
    <UserForm v-if="updateMyUser" form-type="update">
      <button class="button is-danger" @click="returnSelect('myUser')">
        Voltar
      </button>
    </UserForm>
    <UserForm v-else-if="otherUser" :user="selectedUser" form-type="update">
      <button class="button is-danger" @click="returnSelect('otherUser')">
        Voltar
      </button>
    </UserForm>
  </section>
</template>

<script>
import pDebounce from 'p-debounce'
import UserForm from '@/components/UserForm'

export default {
  name: 'UpdateUser',
  components: {
    UserForm
  },
  head() {
    return {
      title: 'Atualização de usuário'
    }
  },
  data() {
    return {
      updateMyUser: false,
      showSelectBox: true,
      updateOtherUser: false,
      otherUser: false,
      username: '',
      selectedUser: '',
      possibleCompletionUsers: {
        users: [],
        index: undefined
      }
    }
  },
  methods: {
    getUserCompletions: pDebounce(function getUserCompletions(name) {
      return this.$services.users
        .fetchPage({ username: `%${name}%`, page: false })
        .then(res => {
          this.possibleCompletionUsers.users = res.data
        })
    }, 500),
    onSelectedUser(user) {
      this.selectedUser = user
    },
    toggleUpdate(type) {
      if (type === 'updateMyUser') {
        this.updateMyUser = true
        this.showSelectBox = false
      }
      if (type === 'updateOtherUser') {
        this.updateOtherUser = true
        this.showSelectBox = false
      }
    },
    openFormOtherUser() {
      if (this.selectedUser !== '') {
        this.otherUser = true
        this.showSelectBox = false
        this.updateOtherUser = false
      } else {
        this.$toast.open({
          message: 'Nenhum usuário selecionado',
          type: 'is-danger'
        })
      }
    },
    returnSelect(page) {
      if (page === 'myUser') {
        this.updateMyUser = false
        this.showSelectBox = true
      }
      if (page === 'otherUser') {
        this.updateOtherUser = false
        this.otherUser = false
        this.showSelectBox = true
      }
    }
  }
}
</script>

<style></style>
