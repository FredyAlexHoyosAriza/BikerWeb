<template>
  <div id="nav">
    <router-link v-bind:to="{ name: 'Home' }">Home</router-link> |
    <router-link :to="{ name: 'About' }">About</router-link> |
    <router-link :to="{ name: 'Login' }">Login</router-link>
    <!-- | <router-link :to="{ name: 'Admin' }">Admin</router-link> v-if="isNotLogged" v-else -->
  </div>
</template>

<script>
export default {
  name: "TheNavigation",
  computed: {
    isNotLogged() {
      return localStorage.getItem('token') === null;
    }
  },
};
</script>

<style scoped>
#nav {
  display: flex;
  padding: 30px;
  justify-content: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 0 30px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
