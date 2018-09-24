var express = require("express");
var routers = require("./routers");

var api = express.Router();

api.use("/Ticket", routers.TicketRouter);
api.use("/Order", routers.OrderRouter);

module.exports = api;
