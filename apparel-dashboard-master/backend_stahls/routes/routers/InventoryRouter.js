var express = require("express");
var router = express.Router();

var controller = require("../../controllers/inventory/InventoryController");

router.post("/create", controller.createinventory);
router.get("/getall", controller.getallinventories);
router.get("/get/:uuid", controller.getinventorybyid);
router.put("/update", controller.updateinventory);
router.delete("/delete/:uuid", controller.deleteinventory);
router.get("/getCount",controller.getDataCount);
router.get("/getInventoryFilterValue", controller.getInventryFilterValue);
router.get("/getInventoryFilterValueByCode/:code", controller.getInventoryFilterValueByCompanyCode);
router.get("/getInventoryByDateRange", controller.getInventoryByDateRange);
router.get("/exportAllInventoryByCode", controller.exportAllInventoryByCode);
router.get("/exportAllInventory", controller.exportAllInventory);
router.post("/getallactiveinventory", controller.getinventorybyActiveStatus);
// router.post("/getallactiveinventory/filter", controller.getinventorybyfilter);
router.post("/getinventorybycompanycode", controller.getinventorybycompanycode);
router.post("/filterinventory",controller.getselectedfiltervalue);
router.post('/Filtervaluebycompanycode/:code',controller.getselectedfiltervaluebycode)

module.exports = router;