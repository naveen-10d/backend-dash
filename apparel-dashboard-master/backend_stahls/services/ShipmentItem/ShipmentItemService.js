var ShipmentItemsDao = require("../../daos/ShipmentItems/ShipmentItemsDao")


module.exports.getallShipmentItems = function (callback) {
    ShipmentItemsDao.getallShipmentItems(function (response, status) {
        callback(response, status)
    })
}


module.exports.getShipmentItemById = function (ShipmentItem_id, callback) {
    ShipmentItemsDao.getShipmentItemById(ShipmentItem_id, function (response, status) {
       callback(response, status)
    })
}