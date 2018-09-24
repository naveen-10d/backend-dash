var ShipmentItemsService = require("../../services/ShipmentItem/ShipmentItemService")


module.exports.getallShipmentItems = function (req, res) {
    ShipmentItemsService.getallShipmentItems(function (response, status) {
        res.json(response);
        res.status(status);
    })
}


module.exports.getShipmentItemById = function (req, res) {
    var ShipmentItem_id = req.params.uuid;
    ShipmentItemsService.getShipmentItemById(ShipmentItem_id, function (response, status) {
        res.json(response);
        res.status(status);
    })
}