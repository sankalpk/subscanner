const express = require('express');
const basicAuth = require('express-basic-auth')

const app = express();
const port = 4000;
const username: string = process.env.USERNAME || 'admin';
const password: string = process.env.PASSWORD || 'password';

app.use(basicAuth({
  users: { [username]: password },
  challenge: true,
}))

app.use(express.static(__dirname + '/../build'))

app.listen(port, () => {
  console.log(`Listening on port: ${port}.`);
});