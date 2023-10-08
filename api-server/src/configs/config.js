const dev = {
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