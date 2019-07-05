<template>
  <UserForm form-type="update" />
</template>

<script>
import UserForm from '@/components/UserForm'

export default {
  name: 'UpdateUser',
  components: {
    UserForm
  },
  head() {
    return {
      title: 'Atualização usuário'
    }
  }
}
</script>

<style></style>
