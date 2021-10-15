<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <!-- Aqui se llama a un metdo de verificacion de email -->
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <!-- :rules="[rules.required, rules.min]" 
    hint="At least 8 characters" -->
    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      name="input-10-1"
      label="Password"
      counter
      @click:append="show1 = !show1"
    ></v-text-field>

    <!-- block: comportamiento de bloque -->
    <v-btn block :disabled="!valid" color="success" class="mr-4" @click="login">
      Login
    </v-btn>

    <!-- plain: el boton se ve como un texto opaco -->
    <v-btn block plain color="error" class="mr-4" @click="reset">
      Reset Form
    </v-btn>
  </v-form>
</template>

<script>
import axios from "axios";
export default {
  name: "TheLogin",
  data: () => ({
    // coneccion con estas variables a traves de v-model
    valid: true,
    password: "",
    email: "",
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    // coneccion con v-on
    show1: false,
    // error message
    errMsg: "",
  }),

  methods: {
    login() {
      // Aqui nos conectamos con el backend; llamando al metodo asociado al path '/login',
      // para ello hacemos uso del metodo post de la libreria axios, el cual hace uso de 2
      // parametros: url de la peticion, y el body de la peticion, para el cual se requiere
      // el email capturado del input email, y el password capturado del input password. Las
      // llaves de los campos, en este caso email y password, deben ser las mismas que se
      // establecieron en el modelo usuario en el backend, es decir, email y password. Si la
      // peticion es exitosa, la datos retornados estaran en el campo data de la respuesta,
      // es decir, en res.data
      axios
        .post('http://localhost:3000/api/usuario/login', {
          email: this.email,
          password: this.password
        })
        .then(res => {
          // data corresponde a la data enviada desde el backend
          //(usuario, token)
          return res.data;
        })
        .then(data => {
          // El token se encuentra guardado en data.tokenReturn
          localStorage.setItem("token", data.tokenReturn);
          // Luego de verificar email y password, se empja la navegacion a la ruta correspondiente,
          // es decir el area administrativa, es decir: '/admin'.
          this.$router.push({ name: "Admin" });
          // Con this.$router.push({name:'Admin'}) se accede al metodo push del router que redirije
          // hacia el route record '/admin'
        })
        .catch(err => {
          // Aqui hacemos que en la parte baja del formulario se inprima que se ha producido un error.
          // Este tipo de mensaje tambien puede ser construido con un alert.
          // A continuacion utilizamos un metodo de los array para revisar lo que nos llega,
          // En el array se envian los status code y si alguno de estos existe en el arugmento de
          // includes, entonces se retorna true y sino retorna false. Tambien se podria entregar
          // en mensaje de error distinto dependiendo de los codigos de error que lleguen
          err.message
          this.errMsg = "";
          // if ([401, 404].includes(err.response.status)) {
          //   this.errMsg = "email o contraseña erroneos";
          // } else {
          //   this.errMsg = "Ocurrió un error interno, intente de nuevo en unos minutos";
          // }
        });
    },
    reset() {
      this.$refs.form.reset();
    },
    // resetValidation() {
    //   this.$refs.form.resetValidation();
    // },
  },
};
</script>

<style scoped>
</style>