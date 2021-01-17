const app = require('./app');

const port = process.env.PORT || 8080;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`port: ${port}`);
  /* eslint-enable no-console */
});
