'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"https://www.taffy531.club:443/ams-uic"', //本地联调
  //BASE_API:"https://uic.pb-station.com/ams-uic" //WHG联调
})