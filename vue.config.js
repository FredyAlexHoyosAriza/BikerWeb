module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
  ? '/biker-web/'
  : '/',
  transpileDependencies: [
    'vuetify'
  ]
}
