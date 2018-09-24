var Inventoryitemservice = require('../../services/InventoryItems/InventoryItemService');

module.exports.createinventoryitems = function (req, res) {
    var InventoryItems = req.body;
    Inventoryitemservice.inventoryitem(InventoryItems, function (response, status) {
        res.json(response);
        res.status(status);
    });

}
module.exports.getallinventoryitems = function (req, res) {

    Inventoryitemservice.getallinventoryitems(function (response, status) {
        res.json(response);
        res.status(status);
    });
}
module.exports.getinventoryitembyid = function (req, res) {

    var inventoryitemid = req.params.uuid;
    Inventoryitemservice.getinventoryitembyid(inventoryitemid, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getInventoryItemsByDateRange = function (req, res) {
    var object = req.body;
    style = object.style;
    startDate = object.startDate;
    endDate = object.endDate;
    Inventoryitemservice.getInventoryItemsByDateRange(style, startDate, endDate, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.getInventoryItemsByDateRangeCode = function (req, res) {
    var object = req.body;
    var code = object.code;
    var style = object.style;
    var startDate = object.startDate;
    var endDate = object.endDate;
    console.log('entering into get inventour details in controller are ----- ', code, startDate, endDate);
    Inventoryitemservice.getInventoryItemsByDateRangeCode(code, style, startDate, endDate, function (response, status) {
        res.status(status);
        res.json(response);
    })
}