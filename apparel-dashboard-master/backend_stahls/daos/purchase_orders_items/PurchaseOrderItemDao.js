var models = require("../../models")
var statusCode = require('../../config/status');


module.exports.createpurchaseorderitems = function (PurchaseOrderItemsDetails, callback) {
    models.VendorReceiveDetails.create(PurchaseOrderItemsDetails).then(function (response) {
        console.log("i am in dao  in",PurchaseOrderItemsDetails)
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getallpurchaseordersitems = function (callback) {
    models.VendorReceiveDetails.findAll({
       
    }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getpurchaseorderitemsbyid = function (purchaseorderItemsID, callback) {
    models.VendorReceiveDetails.findById(purchaseorderItemsID, {
       
    }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

 
module.exports.deletepurchaseorderitem = function (purchaseorderItemsID, callback) {
    models.VendorReceiveDetails.destroy({ where: { ReceiveItemID: purchaseorderItemsID } }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.updatepurchaseorderitem = function (PurchaseOrderItemsDetails, callback) {
    models.VendorReceiveDetails.update(PurchaseOrderItemsDetails, { where: { ReceiveItemID: PurchaseOrderItemsDetails.ReceiveItemID } }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}