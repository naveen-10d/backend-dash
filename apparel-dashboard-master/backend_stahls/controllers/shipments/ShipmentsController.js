var ShipmentsService = require("../../services/shipments/ShipmentsService")
/**
 * Create Shipments 
 * @param {ShipmentsDetaisl} req 
 * @param {Create The Shipments Also With Reports,Groups } res 
 */
module.exports.createShipments = function (req, res) {
    var ShipmentsDetails = req.body;
    ShipmentsService.createShipments(ShipmentsDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getShipmentFilterValue = function (req, res) {
    ShipmentsService.getShipmentFilterValue(function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getShipmentFilterByCompanycode = function (req, res) {
    var companyCode = req.params.code;
    console.log('testing values in SalesOrder $$$ controller ---- ', companyCode);
    ShipmentsService.getShipmentFilterByCompanycode(companyCode, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Getting List Of Shipments 
 * @param {GetAll} req 
 * @param {Getting The List Of Shipments Details From Shipments} res 
 */
module.exports.getallShipments = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    ponumber = object.ponumber;
    startdate = object.startdate;
    enddate = object.enddate;

    // console.log('testing values in SalesOrder $$$ controller ---- ', pageNumber, pageSize, sortLabel, sortDirection, search,ponumber,startdate,enddate);
    ShipmentsService.getallShipments(pageNumber, pageSize, sortLabel, sortDirection, search, ponumber, startdate, enddate, function (response, status) {
        res.json(response);
        res.status(status);
    })
}


/**
 * Getting List Of Shipments 
 * @param {GetAllByOrg} req 
 * @param {Getting The List Of Shipments based on CompanyCode Details From Shipments} res 
 */
module.exports.getallShipmentsOrganisation = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    companyCode = object.companyCode;
    ponumber = object.ponumber;
    startdate = object.startDate;
    enddate = object.endDate;
    console.log('testing values in SalesOrder $$$ controller ---- ', pageNumber, pageSize, sortLabel, sortDirection, search, companyCode, ponumber, startdate, enddate);
    ShipmentsService.getallShipmentsOrganisation(pageNumber, pageSize, sortLabel, sortDirection, search, companyCode, ponumber, startdate, enddate, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Getting List of Shipments Based On ShipmentsId
 * @param {ShipmentsiD} req 
 * @param {Getting Particular Shipments Details Based On ShipmentsId} res 
 */
module.exports.getShipmentsById = function (req, res) {
    var Shipment_id = req.params.shipmentId;
    ShipmentsService.getShipmentsById(Shipment_id, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Getting List of PackedItems Based On PackedBoxId
 * @param {PackedBox_id} req 
 * @param {Getting Particular packedBox Details Based On PackedBoxId} res 
 */
module.exports.getPackedBoxById = function (req, res) {
    var PackedBox_id = req.params.packedBoxId;
    ShipmentsService.getPackedBoxById(PackedBox_id, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Delete The Particular Shipments Based on ShipmentsId
 * @param {ShipmentsId} req 
 * @param {Delete Paticular Shipments Details Form Shipments Based on ShipmentsId} res 
 */
module.exports.delete_Shipments = function (req, res) {
    var Shipment_id = req.params.shipmentId;
    ShipmentsService.delete_Shipments(Shipment_id, function () {
        res.status(204);
        res.end();
    });
}

/**
 * Update Particular Shipments
 * @param {ShipmentsId} req 
 * @param {Update Particular Shipments Details Based On It's ShipmentsId} res 
 */
module.exports.update_Shipments = function (req, res) {
    var ShipmentsDetails = req.body;
    ShipmentsService.update_Shipments(ShipmentsDetails, function (response, status) {
        res.json(response);
        res.status(status);
    });
}

module.exports.getPackedItemsById = function (req, res) {
    var shipmentId = req.params.shipmentId;
    ShipmentsService.getPackedItemsById(shipmentId, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.getShipmentByDate = function (req, res) {
    var object = req.body
    startdate = object.startDate;
    enddate = object.endDate;
    ShipmentsService.getShipmentByDate(startdate, enddate, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.getPonumberByDate = function (req, res) {
    var object = req.body
    startdate = object.startDate;
    enddate = object.endDate;
    console.log('------------Startdateonly----------->>>>', startdate);
    ShipmentsService.getPonumberByDate(startdate, enddate, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.getShipmentByDateCode = function (req, res) {
    var object = req.body
    var code = object.code;
    var startdate = object.startDate;
    var enddate = object.endDate;
    ShipmentsService.getShipmentByDateCode(code, startdate, enddate, function (response, status) {
        res.json(response);
        res.status(status);
    })
}