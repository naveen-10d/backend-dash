var ShipmentsDao = require("../../daos/shipments/ShipmentsDao")

module.exports.createShipments = function (ShipmentsDetails, callback) {
    ShipmentsDao.createShipments(ShipmentsDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.getShipmentFilterValue = function (callback) {
    ShipmentsDao.getShipmentFilterValue(function (response, status) {
        callback(response, status);
    })
}


module.exports.getShipmentFilterByCompanycode = function (companyCode, callback) {
    ShipmentsDao.getShipmentFilterByCompanycode(companyCode, function (response, status) {
        callback(response, status);
    })
}


module.exports.getallShipments = function (pageNumber, pageSize, sortLabel, sortDirection, search, ponumber, startdate, enddate, callback) {
    ShipmentsDao.getallShipments(pageNumber, pageSize, sortLabel, sortDirection, search, ponumber, startdate, enddate, function (response, status) {
        callback(response, status)
    })
}


module.exports.getallShipmentsOrganisation = function (pageNumber, pageSize, sortLabel, sortDirection, search, companyCode, ponumber, startdate, enddate, callback) {
    ShipmentsDao.getallShipmentsOrganisation(pageNumber, pageSize, sortLabel, sortDirection, search, companyCode, ponumber, startdate, enddate, function (response, status) {
        callback(response, status)
    })
}


module.exports.getShipmentsById = function (Shipment_id, callback) {
    ShipmentsDao.getShipmentsById(Shipment_id, function (response, status) {
        callback(response, status)
    })
}

module.exports.getPackedBoxById = function (PackedBox_id, callback) {
    ShipmentsDao.getPackedBoxById(PackedBox_id, function (response, status) {
        callback(response, status)
    })
}

module.exports.delete_Shipments = function (Shipment_id, callback) {
    ShipmentsDao.delete_Shipments(Shipment_id, function () {
        callback();
    });
}

module.exports.update_Shipments = function (ShipmentsDetails, callback) {
    ShipmentsDao.update_Shipments(ShipmentsDetails, function (response, status) {
        callback(response, status)
    });
}

module.exports.getPackedItemsById = function (shipmentId, callback) {
    ShipmentsDao.getPackedItemsById(shipmentId, function (response, status) {
        callback(response, status);
    })
}

module.exports.getShipmentByDate = function (startdate, enddate, callback) {
    ShipmentsDao.getShipmentByDate(startdate, enddate, function (response, status) {
        callback(response, status);
    })
}

module.exports.getPonumberByDate = function (startdate, enddate, callback) {
    ShipmentsDao.getPonumberByDate(startdate, enddate, function (response, status) {
        callback(response, status);
    })
}

module.exports.getShipmentByDateCode = function (code, startdate, enddate, callback) {
    ShipmentsDao.getShipmentByDateCode(code, startdate, enddate, function (response, status) {
        callback(response, status);
    })
}