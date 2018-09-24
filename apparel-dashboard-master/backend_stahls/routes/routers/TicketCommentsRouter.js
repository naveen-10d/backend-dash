var express = require("express");
var router = express.Router();
var controller = require("../../controllers/ticket/TicketCommentsController");

router.post("/create", controller.create_Ticketcomments);
router.get("/getall/:ticketId",controller.getall_ticketcomments);
router.get("/getTicketsByComment/:text", controller.getTicketsByComment)
router.get("/getTicketsByCommentCode/:text/:code", controller.getTicketsByCommentCode)

module.exports = router; 