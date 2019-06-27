<template>
  <div class="container">
    <AdmissionForm :mailing-list="'concluding'"></AdmissionForm>
  </div>
</template>

<script>
import AdmissionForm from '~/components/AdmissionForm'

export default {
  name: 'ConcludingAdmission',
  layout: 'admissionLayout',
  components: {
    AdmissionForm
  }
}
</script>
