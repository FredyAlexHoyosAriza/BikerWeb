<template>
  <v-app>
    <!-- <v-app-bar
      app
      color="green"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar> -->

    <!-- Que se muestren los route records que no sean 'Admin' -->
    <header v-show="!['Admin', 'Users', 'Categories', 'Articles'].includes($route.name)">
      <!-- En Vuetify el v-app-bar, seria lo equivalente a un header sin Vuetify -->
      <the-navigation />
    </header>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import TheNavigation from "./components/TheNavigation.vue";

export default {
  components: { TheNavigation },
  name: "App",

  data: () => ({
    //
  }),
};
</script>
