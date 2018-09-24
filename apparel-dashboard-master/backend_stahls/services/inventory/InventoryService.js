var InventoryDao = require("../../daos/inventory/InventoryDao")

var async = require("async")

module.exports.createinventory = function (InventoryDetails, callback) {
    console.log("i am in create  serviceall in", InventoryDetails)
    InventoryDao.createinventory(InventoryDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.getallinventories = function (callback) {
    InventoryDao.getallinventories(function (response, status) {
        callback(response, status);
    })
}

module.exports.getDataCount = function (callback) {
    InventoryDao.getDataCount(function (response, status) {
        callback(response, status);
    })
}


module.exports.getInventoryByDateRange = function (startDate, endDate, callback) {
    InventoryDao.getInventoryByDateRange(startDate, endDate, function (response, status) {
        callback(response, status);
    })
}

module.exports.exportAllInventory = function (callback) {
    InventoryDao.exportAllInventory(function (response, status) {
        callback(response, status);
    })
}

module.exports.exportAllInventoryByCode = function (code, style, callback) {
    console.log('entering into export all code in services ');
    InventoryDao.exportAllInventoryByCode(code, style, function (response, status) {
        callback(response, status);
    })
}

module.exports.getInventryFilterValue = function (callback) {
    InventoryDao.getInventryFilterValue(function (response, status) {
        callback(response, status);
    })
}

module.exports.getselectedfiltervalue = function (filterData, callback) {
    InventoryDao.getselectedfiltervalue(filterData, function (response, status) {
        callback(response, status);
    })
}

module.exports.getselectedfiltervaluebycode = function (filterData, companyCode, callback) {
    InventoryDao.getselectedfiltervaluebycode(filterData, companyCode, function (response, status) {
        callback(response, status);
    })
}

module.exports.getInventoryFilterValueByCompanyCode = function (companyCode, callback) {
    InventoryDao.getInventoryFilterValueByCompanyCode(companyCode, function (response, status) {
        callback(response, status);
    })
}


module.exports.getinventorybyActiveStatus = function (pageNumber, pageSize, sortLabel, sortDirection,
    search, style, color, size, code, callback) {
    InventoryDao.getinventorybyActiveStatus(pageNumber, pageSize, sortLabel,
        sortDirection, search, style, color, size, code,
        function (response, status) {
            callback(response, status);
        })
}


module.exports.getinventorybycompanycode = function (pageNumber, pageSize,
    sortLabel, sortDirection, search, style, color, size, companyCode, callback) {
    InventoryDao.getinventorybycompanycode(pageNumber, pageSize, sortLabel, sortDirection, search, style, color, size, companyCode, function (response, status) {
        callback(response, status);
    })
}


module.exports.updateinventory = function (InventoryDetails, callback) {
    InventoryDao.updateinventory(InventoryDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.deleteinventory = function (inventoryID, callback) {
    InventoryDao.deleteinventory(inventoryID, function (response, status) {
        callback(response, status);
    })
}

module.exports.getinventorybyid = function (inventoryID, callback) {
    InventoryDao.getinventorybyid(inventoryID, function (response, status) {
        callback(response, status);
    })
}