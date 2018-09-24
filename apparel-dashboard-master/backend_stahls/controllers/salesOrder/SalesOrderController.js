var SalesOrderService = require("../../services/salesOrder/SalesOrderService")
/**
 * Create SalesOrder 
 * @param {SalesOrderDetaisl} req 
 * @param {Create The SalesOrder Also With Reports,Groups } res 
 */
module.exports.createSalesOrder = function (req, res) {
    var SalesOrderDetails = req.body;
    SalesOrderService.createSalesOrder(SalesOrderDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Getting List of SalesOrder Based On SalesOrderId
 * @param {SalesOrderiD} req 
 * @param {Getting Particular SalesOrder Details Based On SalesOrderId} res 
 */
module.exports.getSalesOrderById = function (req, res) {
    var orderId = req.params.orderId;
    SalesOrderService.getSalesOrderById(orderId, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Delete The Particular SalesOrder Based on SalesOrderId
 * @param {SalesOrderId} req 
 * @param {Delete Paticular SalesOrder Details Form SalesOrder Based on SalesOrderId} res 
 */
module.exports.delete_SalesOrder = function (req, res) {
    var orderId = req.params.orderId;
    SalesOrderService.delete_SalesOrder(orderId, function () {
        res.status(204);
        res.end();
    });
}

/**
 * Update Particular SalesOrder
 * @param {SalesOrderId} req 
 * @param {Update Particular SalesOrder Details Based On It's SalesOrderId} res 
 */
module.exports.update_SalesOrder = function (req, res) {
    var SalesOrderDetails = req.body;
    SalesOrderService.update_SalesOrder(SalesOrderDetails, function (response, status) {
        res.json(response);
        res.status(status);
    });
}


module.exports.getAllSalesOrderDetails = function (req, res) {
    var userDetails = req.body;
    SalesOrderService.getAllSalesOrderDetails(userDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

//newly added


module.exports.getOrderAndItemsById = function (req, res) {
    var orderId = req.params.orderId;
    SalesOrderService.getOrderAndItemsById(orderId, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

//get filter values
module.exports.getSalesOrderFilterValue = function (req, res) {
    SalesOrderService.getSalesOrderFilterValue(function (response, status) {
        res.json(response);
        res.status(status);
    })
}

//get filter values Data
module.exports.getSalesOrderFilterValueData = function (req, res) {
    var filterData = req.body;
    SalesOrderService.getSalesOrderFilterValueData(filterData, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

//get filter values by company code
module.exports.getSalesOrderFilterValueByCode = function (req, res) {
    var companyCode = req.params.code;
    SalesOrderService.getSalesOrderFilterValueByCode(companyCode, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

//get filter values Data by company code
module.exports.getSalesOrderFilterValueDataByCode = function (req, res) {
    var companyCode = req.params.code;
    var filterData = req.body;
    SalesOrderService.getSalesOrderFilterValueDataByCode(companyCode, filterData, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

//get count by status name 
module.exports.getCountByStatusName = function (req, res) {
    SalesOrderService.getCountByStatusName(function (response, status) {
        res.status(status);
        res.json(response);
    })
}



module.exports.getStatusNameCountByCode = function (req, res) {
    var companyCode = req.params.code;
    SalesOrderService.getStatusNameCountByCode(companyCode, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

//get all salesorder
module.exports.getAllSalesOrders = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    location = object.location;
    ticketCount = object.ticketCount;
    status = object.status;
    styleOption = object.styleOption;

    console.log('testing values in SalesOrder $$$ controller ---- ', pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption);
    SalesOrderService.getAllSalesOrders(pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

//get all salesorder by company code
module.exports.getSalesOrderByCompanyCode = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    location = object.location;
    ticketCount = object.ticketCount;
    status = object.status;
    styleOption = object.styleOption;
    companyCode = object.companyCode;
    SalesOrderService.getSalesOrderByCompanyCode(pageNumber, pageSize, sortLabel,
        sortDirection, search, location, ticketCount, status, styleOption, companyCode,
        function (response, status) {
            res.json(response);
            res.status(status);
        })
}

module.exports.getSalesOrderByStatusName = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    location = object.location;
    ticketCount = object.ticketCount;
    status = object.status;
    styleOption = object.styleOption;
    statusName = object.statusName;
    SalesOrderService.getSalesOrderByStatusName(pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, statusName, function (response, status) {
        res.status(status);
        res.json(response);
    })
}


module.exports.getSalesOrderByStatusNameCompanyCode = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    location = object.location;
    ticketCount = object.ticketCount;
    status = object.status;
    styleOption = object.styleOption;
    statusName = object.statusName;
    companyCode = object.companyCode;
    SalesOrderService.getSalesOrderByStatusNameCompanyCode(pageNumber, pageSize, sortLabel, sortDirection, search,
        location, ticketCount, status, styleOption, statusName, companyCode,
        function (response, status) {
            res.status(status);
            res.json(response);
        })
}

module.exports.getExportSalesOrder = function (req, res) {
    var object = req.body
    var startDate = object.startDate;
    var endDate = object.endDate;
    console.log('export date range in sales order controller ', startDate, endDate);
    SalesOrderService.getExportSalesOrder(startDate, endDate, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getExportSalesOrderByCode = function (req, res) {
    var object = req.body
    var startDate = object.startDate;
    var endDate = object.endDate;
    var code = object.code;
    console.log('export date range in sales order code controller ', startDate, endDate, code);
    SalesOrderService.getExportSalesOrderByCode(startDate, endDate, code, function (response, status) {
        res.json(response);
        res.status(status);
    })
}