var PurchaseOrdersDao = require("../../daos/purchase_orders_items/PurchaseOrderItemDao")

var async = require("async")

module.exports.createpurchaseorderitems = function (PurchaseOrderItemsDetails, callback) {
    console.log("i am in create  serviceall in", PurchaseOrderItemsDetails)
    PurchaseOrdersDao.createpurchaseorderitems(PurchaseOrderItemsDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.getallpurchaseordersitems = function (callback) {
    PurchaseOrdersDao.getallpurchaseordersitems(function (response, status) {
        callback(response, status);
    })
}

module.exports.getpurchaseorderitemsbyid = function (purchaseorderItemsID, callback) {
    PurchaseOrdersDao.getpurchaseorderitemsbyid(purchaseorderItemsID, function (response, status) {
        callback(response, status);
    })
}

module.exports.updatepurchaseorderitem = function (PurchaseOrderItemsDetails, callback) {
    PurchaseOrdersDao.updatepurchaseorderitem(PurchaseOrderItemsDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.deletepurchaseorderitem = function (purchaseorderItemsID, callback) {
    PurchaseOrdersDao.deletepurchaseorderitem(purchaseorderItemsID, function (response, status) {
        callback(response, status);
    })
}