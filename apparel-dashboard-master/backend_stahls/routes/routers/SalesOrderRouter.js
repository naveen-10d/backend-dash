var express = require("express");
var router = express.Router();
var controller = require("../../controllers/salesOrder/SalesOrderController");


router.post("/create", controller.createSalesOrder);
router.get("/get/:orderId", controller.getSalesOrderById);
router.delete("/delete/:orderId", controller.delete_SalesOrder);
router.put("/update", controller.update_SalesOrder);
router.put("/getNotificationDetails", controller.getAllSalesOrderDetails);
router.get("/getSalesOrderFilterValue", controller.getSalesOrderFilterValue);
router.post("/getSalesOrderFilterValueData", controller.getSalesOrderFilterValueData);
router.get("/getSalesOrderFilterValueByCode/:code", controller.getSalesOrderFilterValueByCode);
router.post("/getSalesOrderFilterValueDataByCode/:code", controller.getSalesOrderFilterValueDataByCode);
router.post("/getall", controller.getAllSalesOrders);
router.post("/getExportSalesOrder",controller.getExportSalesOrder);
router.post("/getExportSalesOrderByCode",controller.getExportSalesOrderByCode);
router.post("/Org/getall", controller.getSalesOrderByCompanyCode);
router.get("/getCountByStatusName", controller.getCountByStatusName);
router.post("/getSalesOrderByStatusName", controller.getSalesOrderByStatusName)
router.post("/Org/getSalesOrderByStatusName", controller.getSalesOrderByStatusNameCompanyCode)
router.get("/getStatusNameCountByCode/:code", controller.getStatusNameCountByCode);
router.get("/getOrderAndItems/:orderId",controller.getOrderAndItemsById);
module.exports = router;