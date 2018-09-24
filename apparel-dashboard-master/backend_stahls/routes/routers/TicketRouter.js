var express = require("express");
var router = express.Router();
var controller = require("../../controllers/ticket/TicketController")


router.post("/create", controller.create_Ticket);
router.get("/getall", controller.getall_ticket);
router.get("/get/:uuid", controller.getticketById);
router.get("/getbyorg/:uuid", controller.getticketByOrgId);
router.get("/getbyuser/:uuid", controller.getticketByUserId);
router.put("/update", controller.update_ticket);
router.put("/Reopenticket", controller.Removeassigneduser);
router.delete("/delete/:uuid", controller.delete_ticket);
router.get("/getbystatus/:status", controller.getticketByStatus);
router.get("/getFilterByOrgId/:id", controller.getFilterByOrgId);
router.get("/getFilter", controller.getFilterValue);
router.post("/getAllTickets", controller.getAllTicket);
router.post("/getAllTicketByOrgId", controller.getAllTicketByOrgId);
router.post("/searchByOrgId", controller.searchDetailsByOrgId);
router.post("/search", controller.searchDetails);
module.exports = router;