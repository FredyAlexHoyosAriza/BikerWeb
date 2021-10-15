<template>
  <v-container>
    <!-- items: usuarios, categorias, articulos
      sort-by: nombre, correo, etc -->

    <!-- Los headers e itemsse traen dinamicamente de las variables headers e items
    respectivamente y que se encuentran en el data. Se tiene un orden por defecto
    por calorias. la clase elevation-1 sombrea el fondo y resalta el contenido -->
    <v-data-table
      :headers="headers"
      :items="categories"
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
            Categories
          </h1>
          <!-- El divider es la barrita -->
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                Add new category
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="8">
                      <v-select
                        v-model="editedCategory.name"
                        :items="tipos"
                        :rules="[(v) => !!v || 'Name is required']"
                        label="Name"
                        required
                      ></v-select>
                    </v-col>

                    <v-col v-if="editedIndex === -1" cols="12" sm="4">
                      <!-- :rules="[(v) => !!v || 'State is required']" -->
                      <v-select
                        v-model="editedCategory.state"
                        :items="states"
                        label="State"
                      ></v-select>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        v-model="editedCategory.description"
                        :rules="[v => !!v || 'Description is required']"
                        label="Description"
                        required
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
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5"
                >Are you sure you want to change this category
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
            <v-icon medium class="mr-2" @click="editCategory(item)">
              mdi-pencil
            </v-icon>
          </v-col>
          <v-col cols="9">
            <v-switch
              v-model="item.state"
              small
              @click="deleteCategory(item)"
              color="blue"
              :value="item.state === 1 ? false : true"
            ></v-switch>
            <!-- <v-icon v-if="item.state" medium @click="deleteCategory(item)">
              mdi-toggle-switch
            </v-icon>
            <v-icon  v-else medium @click="deleteCategory(item)">
              mdi-toggle-switch-off-outline
            </v-icon> -->
          </v-col>
        </v-row>
        <!-- <v-icon small class="mr-2" @click="editCategory(item)"> mdi-pencil </v-icon>
        <v-icon small @click="deleteCategory(item)"> mdi-delete </v-icon> -->
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
  name: "CategoriesDT",
  data: () => ({
    tipos: ["ciclomotor", "cruiser", "scooter", "motocroos", "enduro", "chopper", "trial"], // en minuscula deben estar
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
      { text: "Description", value: "description" },
      { text: "ID", value: "_id", sortable: false },
      { text: "State", value: "state" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    categories: [],
    editedIndex: -1,
    editedCategory: {
      name: "",
      description: "",
      _id: "",
      state: 1,
    },
    defaultCategory: {
      name: "",
      description: "",
      _id: "",
      state: 1,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Add new category" : "Edit category";
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
      // Make a request for a category with a given ID
      axios
        .get("http://localhost:3000/api/categoria/list")
        .then((res) => {
          // handle success
          this.categories = res.data;
          this.loading = false;
        })
        .catch(function (error) {
          // handle error
          // console.log(error);
          return error.message;
        });
    },

    editCategory(item) {
      // Este metodo, toma los datos registrados en el formaulario y que pasan al DT,
      // ya sea como edicion o nuevo registro, y los guarda en editedCategory.
      // Si item no existe, entonces, el indice siguen en -1
      this.editedIndex = this.categories.indexOf(item);
      this.editedCategory = Object.assign({}, item);
      this.dialog = true;
    },

    deleteCategory(item) {
      this.editedIndex = this.categories.indexOf(item);
      item.state = item.state ? 1 : 0;
      this.editedCategory = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      // Are you sure you want to delete this item?
      // If the answer is yes this method is executed
      // this.categories.splice(this.editedIndex, 1);
      // El switch de estado permite cambiar entre registro activado y desactivado.
      if (this.editedCategory.state === 1) {
        axios
          .put("http://localhost:3000/api/categoria/activate", {
            // El campo email se envia como parametro unico para identicacion
            _id: this.editedCategory._id,
            state: this.editedCategory.state,
          })
          .then((res) => {
            // Se edita un registro (documento) existente, al reemplazar
            // el registro actual con su version editada
            // Object.assign(this.categories[this.editedIndex], res.data);
            // EL metodo list trae la coleccion completa desde la BD
            // y se asigna al arreglo de registros (categories) del DT
            // this.list();
          })
          .catch((error) => {
            // console.log(error);
            return error.message;
          });
      } else {
        axios
          .put("http://localhost:3000/api/categoria/deactivate", {
            // El campo email se envia como parametro unico para identicacion
            _id: this.editedCategory._id,
            state: this.editedCategory.state,
          })
          .then((res) => {
            // Object.assign(this.categories[this.editedIndex], res.data);
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
        this.editedCategory = Object.assign({}, this.defaultCategory);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.list();
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedCategory = Object.assign({}, this.defaultCategory);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        // Se edita un registro (documento) existente, al reemplazar
        // el registro actual con su version editada
        // Object.assign(this.categories[this.editedIndex], this.editedCategory);

        axios
          .put("http://localhost:3000/api/categoria/update", {
            // En el formaulario editar se permite la actualizacion de 2 campos.
            // El campo _id se envia como parametro unico para identificacion
            _id: this.editedCategory._id,
            name: this.editedCategory.name,
            description: this.editedCategory.description,
            // state: this.editedCategory.state,
          })
          .then((res) => {
            // EL metodo list trae la coleccion completa desde la BD
            // y se asigna al arreglo de registros (categories) del DT
            this.list();
          })
          .catch((error) => {
            // console.log(error);
            return error.message;
          });
      } else {
        // Puesto que se tiene un indice -1, se trata de un nuevo registro,
        // el cual se guarda a continuacion
        // this.categories.push(this.editedCategory);
        axios
          .post("http://localhost:3000/api/categoria/add", {
            name: this.editedCategory.name,
            description: this.editedCategory.description,
            state: this.editedCategory.state,
            // Puesto que se trata de un nuevo registro
            // no se debe tomar el _id del editedCategory
            // console.log(response);
          })
          .then((res) => {
            // Se empuja el nuevo registro desde la BD hasta el DT
            // this.categories.push(res.data);
            // EL metodo list trae la coleccion completa desde la BD
            // y se asigna al arreglo de registros (categories) del DT
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
  /* margin-bottom: 300px;
  font-size: large; */
}
</style>