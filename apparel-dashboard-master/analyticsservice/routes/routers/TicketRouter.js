var express = require("express");
var router = express.Router();
var controller = require("../../controllers/TicketController")
var OrgController = require("../../controllers/TicketOrgController")

router.get("/priorityticket/:days", controller.getpriorityticket)

router.get("/Org/priorityticket/:days/:code", OrgController.getpriorityticket)

module.exports = router;