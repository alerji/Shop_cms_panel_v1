const version = process.env.VUE_APP_VERSION // set this however you want to.

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  // publicPath:'https://panel.charlotte-perfume.ir/',
  publicPath: process.env.NODE_ENV === 'production'
      ? 'https://panel.charlotte-perfume.ir/'
      : '/',
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
       symlinks: false
    }
  },
  chainWebpack: config => {
    config.plugin('copy').tap(([options]) => {
      options[0].ignore.push('x_config.json')
      return [options]
    })
    config.output
        .filename(`js/[name].[hash:8].${version}.js`)
        .chunkFilename(`js/[name].[hash:8].${version}.js`)
  },
  css: {
    extract: {
      filename: `css/[name].[hash:8].${version}.css`,
      chunkFilename: `css/[name].[hash:8].${version}.css`
    }
  },
  transpileDependencies: [
    '@coreui/utils'
  ]
}
