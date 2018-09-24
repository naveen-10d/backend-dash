var express = require("express");
var router = express.Router();
var controller = require ('../../controllers/SyncService/SyncServiceController')

router.get("/getall",controller.getallsyncservice);

module.exports = router; 