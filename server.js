const express = require('express');

const path = require('path');
const app = express();
app.use(require('prerender-node').set('prerenderToken', 'ewobdKjLLVJDRhYFfs5J'));

// app.get('/ping', function (req, res) {
//     return res.send('pong');
// });
//
// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(process.env.PORT || 8080);