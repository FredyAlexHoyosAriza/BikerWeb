<template>
  <v-card class="mx-auto" max-width="1150">
    <v-img src="\motoCieloAzul.jpg" height="400px"></v-img>

    <v-card-title>
      Welcome {{ welcome.rol }} {{ welcome.name }}!!!
    </v-card-title>

    <v-card-subtitle> Freely use the tools at your disposal </v-card-subtitle>

    <v-card-actions>
      <v-btn color="orange lighten-2" text> Explore </v-btn>

      <v-spacer></v-spacer>

      <v-btn icon @click="show = !show">
        <v-icon>{{ show ? "mdi-chevron-up" : "mdi-chevron-down" }}</v-icon>
      </v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show">
        <v-divider></v-divider>

        <v-card-text> Have a great day!!!. </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>
    <!-- <v-container><img src="\motoCieloAzul.jpg" alt="" height="400px" width="1150px"></v-container> -->
<script>
import decode from "jwt-decode";
export default {
  name: "BikerUser",
  data: () => ({
    show: false,
  }),
  computed: {
      welcome() {
          let token = decode(localStorage.getItem('token'));
          return token
      }
  },
};
</script>