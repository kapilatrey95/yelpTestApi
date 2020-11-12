const environment = process.env.NODE_ENV ? process.env.NODE_ENV : "develop"
const config = require(`./config.${environment}.js`)

module.exports = config