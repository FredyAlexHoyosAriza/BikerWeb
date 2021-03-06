import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import decode from "jwt-decode";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin', // Administracion
    // route level code-splitting
    // this generates a separate chunk (admin.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    meta: {
      requiresAuth: true,
      // Administrador: true // Ruta solo habilitada para el rol administrador disponible en
    },                       // el token, el cual se guardo en el localStorage desde TheLogin
    // los route records pueden tener hijos: /admin/user, /admin/category, /admin/article
    // Se retira el '/' en la ruta, puesto que esta es anidada, y con el '/' se
    // indica que se parte desde la ruta raiz
    children: [
      {
        path: 'users', // /admin/user
        name: 'Users',
        // La ruta a una vista es lo apropiado
        component: () => import(/* webpackChunkName: "usuarios" */ '../components/UsersDT.vue'),
        meta: {
          // ruta solo disponible para el rol administrador
          Administrator: true
          // Es posible modificar este campo a traves de gestor
        }
      },
      {
        path: 'categories', // /admin/category
        name: 'Categories',
        component: () => import(/* webpackChunkName: "categorias" */ '../components/CategoriesDT.vue')
      },
      {
        path: 'articles', // /admin/articles
        name: 'Articles',
        component: () => import(/* webpackChunkName: "articulos" */ '../components/ArticlesDT.vue')
      }
    ]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Los metodos que usen el router deben aparecer luego de la instancion del
// router sino no funcionaran

// beforeEach: es un hook del ciclo de vida de un componente Vue.
// La siguienet funcion, revisa cada route record y busca si existe un atributo
// meta que contenga un campo requiresAuth: true
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    // Para verificar si hay autenticacion se consulta un token
    // Sobre el que ademas se hace una verificacion con el metodo decode, el
    // cual  decodifica el token y revisa que sea valido. El metodo decode se
    // encuentra dentro del paquete jwt-decode, el cual se debe tener instaladao
    // El presente proyecto se creo con el gestor de paquetes yarn (no npm), por
    // ello el paquete jwt-decode debe instalarse con la instruccion yarn add jwt-decode
    // let nudeToken = decode(localStorage.getItem('token'));
    // Se decidio utilizar el token directamente y hacer internamente el decode
    let token = localStorage.getItem('token');
    if (!token) {
      next({
        // Si el token no existe se vuelve al route record 'Login'
        name: 'Login',
      })
    } else {
      // Si el token existe se permite el acceso a la ruta ('/admin' en este caso)
      // Siempre y cuando el rol dentro del token sea de administrador, para ello
      // revisamos el token
      if (to.matched.some(record => record.meta.Administrator)) {
        // Si no se ingresa un token valido en decode retorna un campo vacio o undefined
        // Para ingresar dentro de este if se requiere un intento acceso a la ruta usuario
        console.log('intento de acceso a /user');
        if (decode(token).rol === "administrador") {
          console.log('acceso exitoso /user');
          next();
        } else {
          // Existe un token pero con rol diferente de Administrador,
          // por ello, regrese a la pantalla 'Admin'
          next({
            name: 'Admin'
          })
        }
      } else {
        next();
      }
    }
  } else {
    // Sino el campo requiresAuth no existe o es false, entonces se accede a la ruta
    next() // make sure to always call next()!
  }
})

export default router
