<template>
  <div class="container">
    <admission :mailing-list="'freshman'"></admission>
  </div>
</template>

<script>
import admission from '~/components/admission'

export default {
  name: 'FreshmenAdmission',
  layout: 'admissionLayout',
  components: {
    admission
  }
}
</script>
