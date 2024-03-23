const dev = {
  appname: "eCommerceAPI",
  api: {
    version: process.env.DEV_API_VERSION || "v1",
    url: process.env.DEV_API_URL || "http://localhost:3001/v1/api",
  },
  port: process.env.DEV_PORT || 3000,
  dbstring: process.env.DEV_DB_STRING || 'mongodb://localhost:27017/eCommerce',
  nodemailercfg: {
    email: process.env.DEV_NODEMAILER_EMAIL || 'xxx',
    password: process.env.DEV_NODEMAILER_PASSWORD || 'xxx',
  },
  secretstring: process.env.DEV_SECRET || 'secret',
  appuserroles: {
    user: "001",
    admin: "000",
    shop: "002",
  },
  reqheader: {
    APIKEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-refresh-token"
  },
};

const prod ={
  appname: "eCommerceAPI",
  api: {
    version: process.env.PROD_API_VERSION || "v1",
    url: process.env.PROD_API_URL || "http://localhost:3001/v1/api",
  },
  port: process.env.PROD_PORT || 3000,
  dbstring: process.env.PROD_DB_STRING || 'mongodb://localhost:27017/eCommerce',
  nodemailercfg: {
    email: process.env.PROD_NODEMAILER_EMAIL || 'xxx',
    password: process.env.PROD_NODEMAILER_PASSWORD || 'xxx',
  },
  secretstring: process.env.PROD_SECRET || 'secret',
  appuserroles: {
    user: "001",
    admin: "000",
    shop: "002",
  },
  reqheader: {
    APIKEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-refresh-token"
  },
};

const config ={dev, prod};
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];