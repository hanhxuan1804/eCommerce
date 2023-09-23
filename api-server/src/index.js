const app = require('./app');
const { connect } = require('./models');
const { PORT } = require('./configs/config');

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });