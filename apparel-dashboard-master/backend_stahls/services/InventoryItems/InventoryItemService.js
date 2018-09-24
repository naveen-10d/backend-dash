var InventoryItemDao = require('../../daos/InventoryItems/InventoryItemDao');

module.exports.inventoryitem = function (InventoryItems, callback) {
    InventoryItemDao.itemdao(InventoryItems, function (response, status) {
        callback(response, status);
    });
}
module.exports.getallinventoryitems = function (callback) {
    InventoryItemDao.getallinventoryitems(function (response, status) {
        callback(response, status);
    })
}
module.exports.getinventoryitembyid = function (inventoryitemid, callback) {
    InventoryItemDao.getinventoryitembyid(inventoryitemid, function (response, status) {
        callback(response, status);
    })
}
module.exports.getInventoryItemsByDateRange = function (style, startDate, endDate, callback) {
    InventoryItemDao.getInventoryItemsByDateRange(style, startDate, endDate, function (response, status) {
        callback(response, status);
    })
}

module.exports.getInventoryItemsByDateRangeCode = function (code, style, startDate, endDate, callback) {
    InventoryItemDao.getInventoryItemsByDateRangeCode(code, style, startDate, endDate, function (response, status) {
        callback(response, status);
    })
}