var express = require("express");
var router = express.Router();
var controller = require("../../controllers/ticket/TicketHistoryController");

router.post("/create", controller.update_Tickethistory);
router.get("/get/:uuid",controller.getall_Tickethistory);

module.exports = router; 