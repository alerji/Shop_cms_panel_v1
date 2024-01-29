const version = '3.8.5' // set this however you want to.

module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  configureWebpack: {
    //Necessary to run npm link https://webpack.js.org/configuration/resolve/#resolve-symlinks
    resolve: {
       symlinks: false
    }
  },
  chainWebpack: config => {
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
