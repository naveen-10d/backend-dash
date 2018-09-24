var InvoicesService = require("../../services/invoices/InvoicesService")
/**
 * Create Invoices 
 * @param {InvoicesDetaisl} req 
 * @param {Create The Invoices Also With Reports,Groups } res 
 */
module.exports.createInvoices = function (req, res) {
    var InvoicesDetails = req.body;
    InvoicesService.createInvoices(InvoicesDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

// /**
//  * Getting List Of Invoices 
//  * @param {GetAll} req 
//  * @param {Getting The List Of Invoices Details From Invoices} res 
//  */
// module.exports.getallInvoices = function (req, res) {
//     InvoicesService.getallInvoices(function (response, status) {
//         res.json(response);
//         res.status(status);
//     })
// }


//get all salesorder
module.exports.getallInvoices = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    item = object.item;
    status = object.status;

    console.log('testing values in invoice $$$ controller ---- ', pageNumber, pageSize, sortLabel, sortDirection, search, item, status);
    InvoicesService.getallInvoices(pageNumber, pageSize, sortLabel, sortDirection, search, item, status, function (response, status) {
        res.json(response);
        res.status(status);
    })
}




// module.exports.getallInvoicesByOrg = function(req, res) {
//     var companyCode = req.params.companyCode;
//     InvoicesService.getallInvoicesByOrg(companyCode,function(response){
//         res.json(response);
//         res.status(status);
//     })
// }


//get filter values
module.exports.getInvoicesFilterValue = function (req, res) {
    //var filterData = req.body;
    InvoicesService.getInvoicesFilterValue(function (response, status) {
        res.json(response);
        res.status(status);
    })
}

//get filter values Data
module.exports.getInvoicesFilterValueData = function (req, res) {
    var filterData = req.body;
    InvoicesService.getInvoicesFilterValueData(filterData, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

//get filter values by company code
module.exports.getInvoicesFilterValueByCode = function (req, res) {
    var companyCode = req.params.code;
    InvoicesService.getInvoicesFilterValueByCode(companyCode, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

//get filter values Data by company code
module.exports.getInvoicesFilterValueDataByCode = function (req, res) {
    var companyCode = req.params.code;
    var filterData = req.body;
    InvoicesService.getInvoicesFilterValueDataByCode(companyCode, filterData, function (response, status) {
        res.status(status);
        res.json(response);
    })
}


module.exports.getallInvoicesByOrg = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    item = object.item;
    status = object.status;
    companyCode = object.companyCode;
    InvoicesService.getallInvoicesByOrg(pageNumber, pageSize, sortLabel,
        sortDirection, search, item, status, companyCode,
        function (response, status) {
            res.json(response);
            res.status(status);
        })
}


/**
 * Getting List of Invoices Based On InvoicesId
 * @param {InvoicesiD} req 
 * @param {Getting Particular Invoices Details Based On InvoicesId} res 
 */
module.exports.getInvoicesById = function (req, res) {
    var Invoice_id = req.params.uuid;
    InvoicesService.getInvoicesById(Invoice_id, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Delete The Particular Invoices Based on InvoicesId
 * @param {InvoicesId} req 
 * @param {Delete Paticular Invoices Details Form Invoices Based on InvoicesId} res 
 */
module.exports.delete_Invoices = function (req, res) {
    var Invoice_id = req.params.uuid;
    InvoicesService.delete_Invoices(Invoice_id, function () {
        res.status(204);
        res.end();
    });
}

/**
 * Update Particular Invoices
 * @param {InvoicesId} req 
 * @param {Update Particular Invoices Details Based On It's InvoicesId} res 
 */
module.exports.update_Invoices = function (req, res) {
    var InvoicesDetails = req.body;
    InvoicesService.update_Invoices(InvoicesDetails, function (response, status) {
        res.json(response);
        res.status(status);
    });
}