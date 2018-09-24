var express = require("express");
var router = express.Router();
var controller = require("../../controllers/mailing/MailController");

router.post("/send", controller.createMail);

router.get("/getAll/group", controller.getallMail);
router.post("/create/group", controller.addMail);
router.put("/update/group", controller.updateMail);
router.delete("/delete/group/:uuid", controller.deleteMail);

module.exports = router;