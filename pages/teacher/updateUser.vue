<template>
  <UserForm form-type="update" />
</template>

<script>
import UserForm from '@/components/UserForm'
export default {
  name: 'UpdateUserTeacher',
  components: {
    UserForm
  },
  head() {
    return {
      title: 'Atualização de usuário'
    }
  }
}
</script>

<style></style>
