<template>
  <div class="container">
    <UserForm form-type="update" />
  </div>
</template>

<script>
import UserForm from '@/components/UserForm'
export default {
  name: 'UpdateUserTeacher',
  layout: 'defaultTeacher',
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
