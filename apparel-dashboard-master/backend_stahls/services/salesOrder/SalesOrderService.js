var SalesOrderDao = require("../../daos/salesOrder/SalesOrderDao")

module.exports.createSalesOrder = function (SalesOrderDetails, callback) {
    SalesOrderDao.createSalesOrder(SalesOrderDetails, function (response, status) {
        callback(response, status);
    })
}

// module.exports.getallSalesOrder = function (callback) {
//     SalesOrderDao.getallSalesOrder(function(response){
//         callback(response, status)
//     })
// }



module.exports.getSalesOrderById = function (orderId, callback) {
    SalesOrderDao.getSalesOrderById(orderId, function (response, status) {
        callback(response, status)
    })
}

// module.exports.getallSalesOrderOrg = function (CompanyCode, callback) {
//     SalesOrderDao.getallSalesOrderOrg(CompanyCode,function(response){
//         callback(response, status)
//     })
// }

module.exports.delete_SalesOrder = function (orderId, callback) {
    SalesOrderDao.delete_SalesOrder(orderId, function () {
        callback();
    });
}

module.exports.getAllSalesOrderDetails = function (loggedOutDate, callback) {
    SalesOrderDao.getAllSalesOrderDetails(loggedOutDate, function (response, status) {
        callback(response, status);
    })
}

module.exports.update_SalesOrder = function (SalesOrderDetails, callback) {
    SalesOrderDao.update_SalesOrder(SalesOrderDetails, function (response, status) {
        callback(response, status)
    });
}

//newly added

module.exports.getOrderAndItemsById = function (orderId, callback) {
    SalesOrderDao.getOrderAndItemsById(orderId, function (response, status) {
        callback(response, status);
    })
}

module.exports.getSalesOrderFilterValue = function (callback) {
    SalesOrderDao.getSalesOrderFilterValue(function (response, status) {
        callback(response, status);
    })
}

module.exports.getSalesOrderFilterValueData = function (filterData, callback) {
    SalesOrderDao.getSalesOrderFilterValueData(filterData, function (response, status) {
        callback(response, status);
    })
}

module.exports.getSalesOrderFilterValueByCode = function (companyCode, callback) {
    SalesOrderDao.getSalesOrderFilterValueByCode(companyCode, function (response, status) {
        callback(response, status);
    })
}

module.exports.getSalesOrderFilterValueDataByCode = function (companyCode, filterData, callback) {
    SalesOrderDao.getSalesOrderFilterValueDataByCode(companyCode, filterData, function (response, status) {
        callback(response, status);
    })
}

module.exports.getCountByStatusName = function (callback) {
    SalesOrderDao.getCountByStatusName(function (response, status) {
        callback(response, status);
    })
}

module.exports.getStatusNameCountByCode = function (companyCode, callback) {
    SalesOrderDao.getStatusNameCountByCode(companyCode, function (response, status) {
        callback(response, status);
    })
}

module.exports.getAllSalesOrders = function (pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, callback) {
    SalesOrderDao.getAllSalesOrders(pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, function (response, status) {
        callback(response, status);
    })
}


module.exports.getSalesOrderByCompanyCode = function (pageNumber, pageSize,
    sortLabel, sortDirection, search, location, ticketCount, status, styleOption, companyCode, callback) {
    SalesOrderDao.getSalesOrderByCompanyCode(pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, companyCode, function (response, status) {
        callback(response, status);
    })
}

module.exports.getSalesOrderByStatusName = function (pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, statusName, callback) {
    SalesOrderDao.getSalesOrderByStatusName(pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, statusName, function (response, status) {
        callback(response, status);
    })
}

module.exports.getSalesOrderByStatusNameCompanyCode = function (pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, statusName, companyCode, callback) {
    SalesOrderDao.getSalesOrderByStatusNameCompanyCode(pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, statusName, companyCode, function (response, status) {
        callback(response, status);
    })
}

module.exports.getExportSalesOrder = function (startDate, endDate, callback) {
    SalesOrderDao.getExportSalesOrder(startDate, endDate, function (response, status) {
        callback(response, status)
    })
}
module.exports.getExportSalesOrderByCode = function (startDate, endDate, code, callback) {
    SalesOrderDao.getExportSalesOrderByCode(startDate, endDate, code, function (response, status) {
        callback(response, status)
    })
}