var PurchaseOrderItemsService = require("../../services/purchase_orders_items/PurchaseOrderServiceItems");

module.exports.createpurchaseorderitem = function (req, res) {
    var PurchaseOrderItemsDetails = req.body;
    console.log("i am in create all in",PurchaseOrderItemsDetails)
    PurchaseOrderItemsService.createpurchaseorderitems(PurchaseOrderItemsDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getallpurchaseordersitems = function (req, res) {
    PurchaseOrderItemsService.getallpurchaseordersitems(function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getpurchaseorderitemsbyid = function (req, res) {
    var purchaseorderItemsID = req.params.ReceiveItemID;
    PurchaseOrderItemsService.getpurchaseorderitemsbyid(purchaseorderItemsID, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.updatepurchaseorderitems = function (req, res) {
    var PurchaseOrderItemsDetails = req.body;
    PurchaseOrderItemsService.updatepurchaseorderitem(PurchaseOrderItemsDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.deletepurchaseorderitems = function (req, res) {
    var purchaseorderItemsID = req.params.ReceiveItemID;
    PurchaseOrderItemsService.deletepurchaseorderitem(purchaseorderItemsID, function (response, status) {
        res.json(response);
        res.status(status);
    })
}
 

 
