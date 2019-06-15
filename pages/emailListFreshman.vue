<template>
  <email-component
    :mailing-list="'freshman'"
    :title="'Lista de Email - Calouros'"
  ></email-component>
</template>

<script>
import EmailComponent from '../components/emailListComponent'
export default {
  name: 'EmailListActive',
  middleware: ['auth', 'course'],
  components: {
    EmailComponent
  }
}
</script>

<style></style>
