var models = require("../../models")
var statusCode = require("../../config/status");

module.exports.getallShipmentItems = function (callback) {
    models.ShipmentsItems.findAll({
        include: [{
            model: models.Shipments
        }]
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no ShipmentItems", statusCode.no_content)
        }

    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}


module.exports.getShipmentItemById = function (ShipmentItem_id, callback) {
    models.ShipmentsItems.findOne({
        where: {
            uuid: ShipmentItem_id
        },
        include: [{
            model: models.Shipments
        }]
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no ShipmentItem", statusCode.no_content)
        }

    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}