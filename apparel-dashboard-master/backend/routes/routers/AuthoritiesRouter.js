var express = require("express");
var router = express.Router();
var controller = require("../../controllers/authority/AuthoritiesController")


router.post("/create", controller.create_authority);
router.get("/getall",controller.getallauthority);
router.get("/get/:uuid",controller.getauthorityById);
router.put("/update",controller.update_authority);
router.delete("/delete/:uuid",controller.delete_authority);

module.exports = router;