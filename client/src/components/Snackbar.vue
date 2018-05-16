<template>
  <v-snackbar
    top
    multi-line
    :color="color"
    v-model="show">
    {{message}}
    <v-btn flat color="" @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data () {
    return {
      show: false,
      message: '',
      color: 'error'
    }
  },
  created: function () {
    this.$store.watch(() => {
      const msg = this.$store.state.snack
      if (msg !== '') {
        this.show = true
        this.message = this.$store.state.snack
        this.color = this.$store.state.snackColor
        this.$store.dispatch('setSnack', {
          snack: '',
          color: 'error'
        })
      }
    })
  }
}
</script>
