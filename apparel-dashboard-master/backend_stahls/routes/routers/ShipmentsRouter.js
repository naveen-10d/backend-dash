var express = require("express");
var router = express.Router();
var controller = require("../../controllers/shipments/ShipmentsController");


router.post("/create", controller.createShipments);
router.post("/getall", controller.getallShipments);
router.get("/get/:shipmentId", controller.getShipmentsById);
router.delete("/delete/:shipmentId", controller.delete_Shipments);
router.put("/update", controller.update_Shipments);
router.post("/Org/getall", controller.getallShipmentsOrganisation);
router.get("/get/packedBoxItem/:packedBoxId", controller.getPackedBoxById);
router.get('/getpackeditem/:shipmentId', controller.getPackedItemsById);
router.post('/getShipmentByDate', controller.getShipmentByDate);
router.post('/getPonumberByDate', controller.getPonumberByDate);
router.post('/getShipmentByDateCode', controller.getShipmentByDateCode);
router.get("/getShipmentFilterValue", controller.getShipmentFilterValue);
router.get("/getShipmentFilterByCompanycode/:code", controller.getShipmentFilterByCompanycode);

module.exports = router;