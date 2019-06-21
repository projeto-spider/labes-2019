<template>
  <email-component
    :mailing-list="'active'"
    :title="'Lista de Email - Ativos'"
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
