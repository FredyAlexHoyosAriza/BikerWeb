<template>
  <v-container>
    <!-- items: usuarios, categorias, articulos
      sort-by: nombre, correo, etc -->

    <!-- Los headers e itemsse traen dinamicamente de las variables headers e items
    respectivamente y que se encuentran en el data. Se tiene un orden por defecto
    por calorias. la clase elevation-1 sombrea el fondo y resalta el contenido -->
    <v-data-table
      :headers="headers"
      :items="users"
      sort-by="rol"
      class="elevation-1"
      :loading="loading"
      loading-text="Loading... Please wait a moment"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <h1
            style="margin-bottom: 2%; font-size: x-large"
            class="v-toolbar__title"
          >
            Users
          </h1>
          <!-- El divider es la barrita -->
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Add new user
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedUser.name"
                        label="Name"
                        :rules="[(v) => !!v || 'Name is required']"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        v-model="editedUser.rol"
                        :items="rols"
                        :rules="[(v) => !!v || 'Rol is required']"
                        label="Rol"
                        required
                      ></v-select>
                    </v-col>

                    <v-col v-if="editedIndex === -1" cols="12" sm="6" md="4">
                      <!-- :rules="[(v) => !!v || 'State is required']" -->
                      <v-select
                        v-model="editedUser.state"
                        :items="states"
                        label="State"
                      ></v-select>
                    </v-col>

                    <v-col v-if="editedIndex === -1" cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedUser.email"
                        label="E-mail"
                        :rules="emailRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedUser.password"
                        label="Password"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        name="input-10-1"
                        :rules="[(v) => !!v || 'Password is required']"
                        required
                        counter
                        @click:append="show1 = !show1"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="590px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to change this user
                state?</v-card-title
              >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete"
                  >Cancel</v-btn
                >
                <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                  >OK</v-btn
                >
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <!-- item toma el valor de cada uno los registros (filas) en el DT -->
        <v-row class="justify-content-center">
          <v-col cols="3">
            <v-icon medium class="mr-2" @click="editUser(item)">
              mdi-account-edit
            </v-icon>
          </v-col>
          <v-col cols="9">
            <v-switch
              v-model="item.state"
              small
              @click="deleteUser(item)"
              color="blue"
              :value="item.state === 1 ? false : true"
            ></v-switch>
            <!-- <v-icon v-if="item.state" medium @click="deleteUser(item)">
              mdi-toggle-switch
            </v-icon>
            <v-icon  v-else medium @click="deleteUser(item)">
              mdi-toggle-switch-off-outline
            </v-icon> -->
          </v-col>
        </v-row>
        <!-- <v-icon small class="mr-2" @click="editUser(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteUser(item)"> mdi-delete </v-icon> -->
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="list"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "UsersDT",
  data: () => ({
    rols: ["cliente", "vendedor", "gestor", "administrador"], // en minuscula deben estar
    states: [1, 0],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    // coneccion con v-on
    show1: false,
    loading: true,
    dialog: false,
    dialogDelete: false,
    headers: [
      // Los valores en los headers son los nombres de las llaves en los
      // campos de las colecciones que llegan desde la base de datos
      {
        text: "Name",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Rol", value: "rol" },
      { text: "E-mail", value: "email" },
      { text: "ID", value: "_id", sortable: false },
      { text: "State", value: "state" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    users: [],
    editedIndex: -1,
    editedUser: {
      name: "",
      rol: "gestor",
      email: "",
      _id: "",
      state: 1,
      password: "",
    },
    defaultUser: {
      name: "",
      rol: "gestor",
      email: "",
      _id: "",
      state: 1,
      password: "",
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add new user" : "Edit user";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.list();
  },

  methods: {
    list() {
      // Make a request for a user with a given ID
      axios
        .get("http://localhost:3000/api/usuario/list")
        .then((res) => {
          // handle success
          this.users = res.data;
          this.loading = false;
        })
        .catch(function (error) {
          // handle error
          // console.log(error);
          return error.message;
        });
    },

    editUser(item) {
      // Este metodo, toma los datos registrados en el formaulario y que pasan al DT,
      // ya sea como edicion o nuevo registro, y los guarda en editedUser.
      // Si item no existe, entonces, el indice siguen en -1
      this.editedIndex = this.users.indexOf(item);
      this.editedUser = Object.assign({}, item);
      this.dialog = true;
    },

    deleteUser(item) {
      this.editedIndex = this.users.indexOf(item);
      item.state = item.state ? 1 : 0;
      this.editedUser = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      // Are you sure you want to delete this item?
      // If the answer is yes this method is executed
      // this.users.splice(this.editedIndex, 1);
      // El switch de estado permite cambiar entre registro activado y desactivado.
      if (this.editedUser.state === 1) {
        axios
          .put("http://localhost:3000/api/usuario/activate", {
            // El campo email se envia como parametro unico para identicacion
            _id: this.editedUser._id,
            state: this.editedUser.state,
          })
          .then((res) => {
            // Se edita un registro (documento) existente, al reemplazar
            // el registro actual con su version editada
            // Object.assign(this.users[this.editedIndex], res.data);
            // EL metodo list trae la coleccion completa desde la BD
            // y se asigna al arreglo de registros (users) del DT
            // this.list();
          })
          .catch((error) => {
            // console.log(error);
            return error.message;
          });
      } else {
        axios
          .put("http://localhost:3000/api/usuario/deactivate", {
            // El campo email se envia como parametro unico para identicacion
            _id: this.editedUser._id,
            state: this.editedUser.state,
          })
          .then((res) => {
            // Object.assign(this.users[this.editedIndex], res.data);
            // this.list();
          })
          .catch((error) => {
            // console.log(error);
            return error.message;
          });
      }
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.list();
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedUser = Object.assign({}, this.defaultUser);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // Se edita un registro (documento) existente, al reemplazar
        // el registro actual con su version editada
        // Object.assign(this.users[this.editedIndex], this.editedUser);

        axios
          .put("http://localhost:3000/api/usuario/update", {
            // En el formaulario editar se permite la actualizacion de 3 campos.
            // El campo email se envia como parametro unico para identicacion
            name: this.editedUser.name,
            email: this.editedUser.email,
            password: this.editedUser.password,
            rol: this.editedUser.rol,
            // state: this.editedUser.state,
          })
          .then((res) => {
            // EL metodo list trae la coleccion completa desde la BD
            // y se asigna al arreglo de registros (users) del DT
            this.list();
          })
          .catch((error) => {
            // console.log(error);
            return error.message;
          });
      } else {
        // Puesto que se tiene un indice -1, se trata de un nuevo registro,
        // el cual se guarda a continuacion
        // this.users.push(this.editedUser);
        axios
          .post("http://localhost:3000/api/usuario/add", {
            name: this.editedUser.name,
            email: this.editedUser.email,
            password: this.editedUser.password,
            rol: this.editedUser.rol,
            state: this.editedUser.state,
            // Puesto que se trata de un nuevo registro
            // no se debe tomar el _id del editedUser
            // console.log(response);
          })
          .then((res) => {
            // Se empuja el nuevo registro desde la BD hasta el DT
            // this.users.push(res.data);
            // EL metodo list trae la coleccion completa desde la BD
            // y se asigna al arreglo de registros (users) del DT
            this.list();
          })
          .catch((error) => {
            // console.log(error);
            return error.message;
          });
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.v-toolbar__title {
  margin-bottom: 300px;
  font-size: large;
}
</style>