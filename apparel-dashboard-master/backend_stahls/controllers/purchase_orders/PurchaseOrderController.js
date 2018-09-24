var PurchaseOrderService = require("../../services/purchaseorder/PurchaseOrderService");

module.exports.createpurchaseorder = function (req, res) {
    var PurchaseOrderDetails = req.body;
    console.log("i am in create all in", PurchaseOrderDetails)
    PurchaseOrderService.createpurchaseorder(PurchaseOrderDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getallpurchaseorders = function (req, res) {
    PurchaseOrderService.getallpurchaseorders(function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getAllPurchaseOrderByOrg = function (req, res) {
    var companyCode = req.params.companyCode;
    PurchaseOrderService.getAllPurchaseOrderByOrg(companyCode, function (response, status) {
        res.json(response);
        res.status(status);
    })
}
module.exports.getpurchaseorderbyid = function (req, res) {
    var purchaseorderID = req.params.ReceiveID;
    PurchaseOrderService.getpurchaseorderbyid(purchaseorderID, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.updatepurchaseorder = function (req, res) {
    var PurchaseOrderDetails = req.body;
    PurchaseOrderService.updatepurchaseorder(PurchaseOrderDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.deletepurchaseorder = function (req, res) {
    var purchaseorderID = req.params.ReceiveID;
    PurchaseOrderService.deletepurchaseorder(purchaseorderID, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getFilterValue = function (req, res) {
    var object = req.body;
    locationFilter = object.location;
    customerFilter = object.customer;
    statusFilter = object.status;
    PurchaseOrderService.getFilterValue(locationFilter, customerFilter, statusFilter, function (response, status) {
        res.json(response);
        res.status(status);
    })
}