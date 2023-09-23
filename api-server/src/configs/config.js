module.exports = {
  port: process.env.PORT || 3000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || 'my-database',
    user: process.env.DB_USER || '',
    pass: process.env.DB_PASS || '',
  },
  secret: process.env.SECRET || 'my-secret-key',
};