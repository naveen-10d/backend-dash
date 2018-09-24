var express = require("express");
var router = express.Router();
var controller = require("../../controllers/ticket/TicketAttachmentController");


router.post("/upload/:uuid", controller.uploadfile);
router.get("/getall",controller.getalluploadfile);
router.get("/getbyid/:uuid",controller.getuploadfilebyid);
router.delete("/delete/:uuid",controller.deleteuploadfile);


module.exports = router;