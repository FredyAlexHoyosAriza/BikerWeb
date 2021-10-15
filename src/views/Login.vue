<template>
  <v-container>
    <div class="login">
      <the-login />
    </div>
  </v-container>
</template>

<script>
import TheLogin from "../components/TheLogin.vue";
export default {
  name: "Login",
  components: { TheLogin },
  beforeCreate() {
    if (localStorage.getItem('token')) {
      // se accede al metodo push del router que redirije
      // hacia el route record '/admin'
      this.$router.push({
        name: 'Admin'
      })
    }
  }
};
</script>

<style scoped>
</style>