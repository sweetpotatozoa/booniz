const fetch = require('node-fetch')
require('dotenv').config()

const configs = {
  dbPassword: null,
  dbName: null,
  port: null,
}

if (process.env.NODE_ENV === 'development') {
  configs.dbName = process.env.DB_NAME_DEV
  configs.dbPassword = process.env.DB_PASSWORD_DEV
  configs.port = process.env.PORT_DEV

  configs.accessTokenSecret = process.env.ACCESS_TOKEN_DEV

  // db connection example
  configs.mainDbUri = `mongodb+srv://sxs0611:${configs.dbPassword}@clusterr.dhtbgi3.mongodb.net/${configs.dbName}?readPreference=secondaryPreferred&w=1`
} else if (process.env.NODE_ENV === 'production') {
  configs.dbName = process.env.DB_NAME_PROD
  configs.dbPassword = process.env.DB_PASSWORD_PROD
  configs.port = process.env.PORT_PROD

  configs.accessTokenSecret = process.env.ACCESS_TOKEN_PROD

  // db connection example
  configs.mainDbUri = `mongodb+srv://sxs0611:${configs.dbPassword}@clusterr.dhtbgi3.mongodb.net/${configs.dbName}?readPreference=secondaryPreferred&w=1`
}

module.exports = configs
