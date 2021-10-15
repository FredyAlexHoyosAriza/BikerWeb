<template>
  <!-- Tarjeta con un alto del 100% del view port height (vh) -->
  <v-card class="mx-auto overflow-hidden" height="100vh">
    <v-app-bar color="deep-purple" dark>
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>BikerWeb administration manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- Este boton no tendra aociado un href sino el metodo salir -->
      <v-btn text @click="logOut">
        <span class="mr-2">Salir</span>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item exact v-bind:to="{ name: 'Home' }">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item exact :to="{ name: 'Admin' }">
            <v-list-item-icon>
              <v-icon>mdi-key</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item>

          <v-list-item v-if="isAdmin" exact :to="{ name: 'Users' }">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Usuarios</v-list-item-title>
          </v-list-item>

          <v-list-item exact :to="{ name: 'Categories' }">
            <v-list-item-icon>
              <v-icon>mdi-folder-search</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Categorias</v-list-item-title>
          </v-list-item>

          <v-list-item exact :to="{ name: 'Articles' }">
            <v-list-item-icon>
              <v-icon>mdi-cart</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Articulos</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <!-- Solo se muestra el componente biker-user, cuando la ruta es 'Admin' -->
      <section
          v-show="['Admin'].includes($route.name)"
       class="mt-10">
        <biker-user/>
      </section>
      <router-view />
    </v-main>
  </v-card>
</template>

<script>
import decode from "jwt-decode";
import BikerUser from '../components/BikerUser.vue';
export default {
  components: { BikerUser },
  name: "Admin",
  data: () => ({
    drawer: false,
    group: null,
  }),

  methods: {
    logOut() {
      // Este metodo basicamente elimina el token del localStorage
      // y envia el usuario hacia una vista principal
      localStorage.removeItem("token"); // Al no existir un token, el usuario deja de estar autenticado
      // Ahora el usuario es enviado al Home
      this.$router.push({
        name: "Home",
      });
    },
  },

  computed: {
    isAdmin() {
      let nudeToken = decode(localStorage.getItem("token"));
      return nudeToken.rol === "administrador";
    },
  },
};
</script>

<style scoped>
</style>