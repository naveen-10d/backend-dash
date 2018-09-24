var express = require("express");
var router = express.Router();
var controller = require("../../controllers/OrdersController")
var OrgController = require("../../controllers/OrdersOrgController")

router.get("/shipment", controller.getOrderShipped)
router.get("/recevied",controller.getOrderReceived)
router.get("/receviedToday",controller.getOrderReceivedToday)
router.get("/shipmentToday", controller.getOrderShippedToday)
router.get("/receviedBarGraph/:days",controller.getOrderReceivedGraph)
router.get("/shipmentBarGraph/:days",controller.getOrderShippedGraph)
router.get("/forcasted/:days",controller.getOrderForcastedGraph)
router.get("/topSelling/:days",controller.getOrdertopSelling)

router.get("/onTime",controller.getOrderonTime)
router.get("/onTimeToday",controller.getOrderonTimeToday)
router.get("/onTimeShipped/:days",controller.getOrderonTimeShipped)
router.get("/onTimeForecast/:days",controller.getOrderonTimeForecast)


router.get("/Org/shipment/:code", OrgController.getOrderShipped)
router.get("/Org/recevied/:code",OrgController.getOrderReceived)
router.get("/Org/receviedToday/:code",OrgController.getOrderReceivedToday)
router.get("/Org/shipmentToday/:code", OrgController.getOrderShippedToday)
router.get("/Org/receviedBarGraph/:days/:code",OrgController.getOrderReceivedGraph)
router.get("/Org/shipmentBarGraph/:days/:code",OrgController.getOrderShippedGraph)
router.get("/Org/forcasted/:days/:code",OrgController.getOrderForcastedGraph)
router.get("/Org/topSelling/:days/:code",OrgController.getOrdertopSelling)

router.get("/Org/onTime/:code",OrgController.getOrderonTime)
router.get("/Org/onTimeToday/:code",OrgController.getOrderonTimeToday)
router.get("/Org/onTimeShipped/:days/:code",OrgController.getOrderonTimeShipped)
router.get("/Org/onTimeForecast/:days/:code",OrgController.getOrderonTimeForecast)




module.exports = router;