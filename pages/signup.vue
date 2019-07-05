<template>
  <UserForm form-type="signup" />
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
