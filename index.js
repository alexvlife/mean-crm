const app = require('./app');

const PORT_DEFAULT = 5000;
const port = process.env.port || PORT_DEFAULT;


app.listen(port, () => {
  console.log(`Server has been started on ${port}`);
});
