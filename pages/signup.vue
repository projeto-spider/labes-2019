<template>
  <div class="container">
    <UserForm form-type="signup" />
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'

export default {
  name: 'SignUp',
  components: {
    UserForm
  },
  head() {
    return {
      title: 'Cadastrar usuário'
    }
  }
}
</script>
