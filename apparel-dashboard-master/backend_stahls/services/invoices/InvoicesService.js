var InvoicesDao = require("../../daos/invoices/InvoicesDao")

module.exports.createInvoices = function (InvoicesDetails, callback) {
    InvoicesDao.createInvoices(InvoicesDetails, function (response, status) {
        callback(response, status);
    })
}

// module.exports.getallInvoices = function (callback) {
//     InvoicesDao.getallInvoices(function(response){
//         callback(response, status)
//     })
// }

// module.exports.getallInvoicesByOrg = function(companyCode , callback) {
//     InvoicesDao.getallInvoicesByOrg(companyCode , function(response){
//         callback(response, status);
//     })
// }


module.exports.getallInvoices = function (pageNumber, pageSize, sortLabel, sortDirection, search, item, status, callback) {
    InvoicesDao.getallInvoices(pageNumber, pageSize, sortLabel, sortDirection, search, item, status, function (response, status) {
        callback(response, status);
    })
}


module.exports.getallInvoicesByOrg = function (pageNumber, pageSize,
    sortLabel, sortDirection, search, item, status, companyCode, callback) {
    InvoicesDao.getallInvoicesByOrg(pageNumber, pageSize, sortLabel, sortDirection,
        search, item, status, companyCode,
        function (response, status) {
            callback(response, status);
        })
}




module.exports.getInvoicesFilterValue = function (callback) {
    InvoicesDao.getInvoicesFilterValue(function (response, status) {
        //console.log("entering into response of get invice fileter are =---- ", response);
        callback(response, status);
    })
}

module.exports.getInvoicesFilterValueData = function (filterData, callback) {
    InvoicesDao.getInvoicesFilterValueData(filterData, function (response, status) {
        callback(response, status);
    })
}

module.exports.getInvoicesFilterValueByCode = function (companyCode, callback) {
    InvoicesDao.getInvoicesFilterValueByCode(companyCode, function (response, status) {
        callback(response, status);
    })
}

module.exports.getInvoicesFilterValueDataByCode = function (companyCode, filterData, callback) {
    InvoicesDao.getInvoicesFilterValueDataByCode(companyCode, filterData, function (response, status) {
        callback(response, status);
    })
}



module.exports.getInvoicesById = function (Invoice_id, callback) {
    InvoicesDao.getInvoicesById(Invoice_id, function (response, status) {
        callback(response, status)
    })
}

module.exports.delete_Invoices = function (Invoice_id, callback) {
    InvoicesDao.delete_Invoices(Invoice_id, function () {
        callback();
    });
}

module.exports.update_Invoices = function (InvoicesDetails, callback) {
    InvoicesDao.update_Invoices(InvoicesDetails, function (response, status) {
        callback(response, status)
    });
}