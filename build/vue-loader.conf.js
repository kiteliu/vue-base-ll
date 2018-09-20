'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction ? config.build.productionSourceMap : config.dev.cssSourceMap
// const px2rem = require('postcss-px2rem')

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction,
    usePostCSS: true
  }),
  postcss: [
    require('autoprefixer')({
      browsers: ["last 2 versions",
      "Android > 4",
      "iOS > 8",
      "ie > 8"]
    })
  ],
  // postcss: [px2rem({
  //   baseDpr: 2,             // base device pixel ratio (default: 2)
  //   threeVersion: false,    // whether to generate @1x, @2x and @3x version (default: false)
  //   remVersion: true,       // whether to generate rem version (default: true)
  //   remUnit: 75,            // rem unit value (default: 75)
  //   remPrecision: 4         // rem precision (default: 6)
  // })],
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
