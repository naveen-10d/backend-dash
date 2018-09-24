var PurchaseOrdersDao = require("../../daos/purchaseorders/PurchaseOrdersDao")

var async = require("async")

module.exports.createpurchaseorder = function (PurchaseOrderDetails, callback) {
    console.log("i am in create  serviceall in", PurchaseOrderDetails)
    PurchaseOrdersDao.createpurchaseorder(PurchaseOrderDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.getallpurchaseorders = function (callback) {
    PurchaseOrdersDao.getallpurchaseorders(function (response, status) {
        callback(response, status);
    })
}
module.exports.getAllPurchaseOrderByOrg = function (companyCode, callback) {
    PurchaseOrdersDao.getAllPurchaseOrderByOrg(companyCode, function (response, status) {
        callback(response, status);
    })
}

module.exports.getpurchaseorderbyid = function (purchaseorderID, callback) {
    PurchaseOrdersDao.getpurchaseorderbyid(purchaseorderID, function (response, status) {
        callback(response, status);
    })
}

module.exports.updatepurchaseorder = function (PurchaseOrderDetails, callback) {
    PurchaseOrdersDao.updatepurchaseorder(PurchaseOrderDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.deletepurchaseorder = function (purchaseorderID, callback) {
    PurchaseOrdersDao.deletepurchaseorder(purchaseorderID, function (response, status) {
        callback(response, status);
    })
}

module.exports.getFilterValue = function (locationFilter, customerFilter, statusFilter, callback) {
    PurchaseOrdersDao.getFilterValue(locationFilter, customerFilter, statusFilter, function (response, status) {
        callback(response, status);
    })
}