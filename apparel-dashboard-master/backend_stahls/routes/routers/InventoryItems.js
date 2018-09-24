var express = require("express");
var router = express.Router();

var Controller = require('../../controllers/InventoryItems/InventoryItemsController');

router.post('/create', Controller.createinventoryitems);
router.get("/getall", Controller.getallinventoryitems);
router.get("/get/:uuid", Controller.getinventoryitembyid);
router.post('/getInventoryItemsByDateRange', Controller.getInventoryItemsByDateRange);
router.post('/getInventoryItemsByDateRangeCode', Controller.getInventoryItemsByDateRangeCode);


module.exports = router;