var express = require("express");
var router = express.Router();
var controller = require("../../controllers/organization/OrganizationController");


router.post("/create", controller.creeateOrganization);
router.get("/getall",controller.getallOrganization);
router.get("/get/:uuid",controller.getOrganizationById);
router.delete("/delete/:uuid",controller.delete_Organisation);
router.put("/update",controller.update_Organisation);

module.exports = router;