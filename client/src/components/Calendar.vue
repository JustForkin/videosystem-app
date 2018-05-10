<template>
  <v-calendar
    is-double-paned>
  </v-calendar>
  <v-date-picker
    mode='single'
    v-model='selectedValue'>
  </v-date-picker>
</template>

<script>
export default {
  data() {
    return {
      selectedValue: new Date()
    }
  }
}
</script>
