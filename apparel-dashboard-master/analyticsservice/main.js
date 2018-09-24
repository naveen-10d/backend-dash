const express = require("express");
const path = require("path");
const logger = require("morgan");
const bodyParser = require('body-parser');
var cors = require('cors')
const fs = require('fs');
const models = require("./models")
const router = require("./routes/routes");
const clientPath = path.resolve(__dirname, "client");

var app = express();
app.use(bodyParser.json({ limit: '50mb' }))
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(cors({credentials: true, origin: true}))



app.use("/", express.static(clientPath));
app.use("/analytics",router);
app.all('*', function (req, res) {
  res.status(200).sendFile(path.join(__dirname, '/client/index.html'));
});

//sequelize Connection Estsblishment
models.sequelize.sync().then(function () {
  var server = app.listen(8080, function () {
    server.address().port
  });
});
