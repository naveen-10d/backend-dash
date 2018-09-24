var InventoryService = require("../../services/inventory/InventoryService");

module.exports.createinventory = function (req, res) {
    var InventoryDetails = req.body;
    console.log("i am in create all in", InventoryDetails)
    InventoryService.createinventory(InventoryDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getallinventories = function (req, res) {
    // console.log("i am in create all in",res);            
    InventoryService.getallinventories(function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getDataCount = function (req, res) {
    InventoryService.getDataCount(function (response, status) {
        res.status(status);
        res.json(response);
    })
}


module.exports.getInventryFilterValue = function (req, res) {
    InventoryService.getInventryFilterValue(function (response, status) {
        res.json(response);
        res.status(status);
    })
}


module.exports.getselectedfiltervalue = function (req, res) {
    var filterData = req.body;
    InventoryService.getselectedfiltervalue(filterData,function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getselectedfiltervaluebycode = function (req, res) {
    var filterData = req.body;
    var companyCode = req.params.code;
    InventoryService.getselectedfiltervaluebycode(companyCode,filterData,function (response, status) {
        res.json(response);
        res.status(status);
    })
}


module.exports.getInventoryFilterValueByCompanyCode = function (req, res) {
    var companyCode = req.params.code;
    InventoryService.getInventoryFilterValueByCompanyCode(companyCode, function (response, status) {
        res.status(status);
        res.json(response);
    })
}
module.exports.getInventoryByDateRange = function (req, res) {
    startDate = req.query.startDate;
    endDate = req.query.endDate;
    InventoryService.getInventoryByDateRange(startDate, endDate, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.exportAllInventory = function (req, res) {
    // style = req.query.style;
    InventoryService.exportAllInventory(function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.exportAllInventoryByCode = function (req, res) {
    code = req.query.code;
    style = req.query.style;
    InventoryService.exportAllInventoryByCode(code,style, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.getinventorybyActiveStatus = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    style = object.style;
    color = object.color;
    size = object.size;
    code = object.code;
    console.log('testing values in inventory $$$ controller ---- ', pageNumber, pageSize, sortLabel, sortDirection, search, style, color, size,code);
    InventoryService.getinventorybyActiveStatus(pageNumber, pageSize, sortLabel, sortDirection,
         search, style, color, size,code, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getinventorybycompanycode = function (req, res) {
    var object = req.body;
    pageNumber = object.pageNumber;
    pageSize = object.pageSize;
    sortLabel = object.sortLabel;
    sortDirection = object.sortDirection;
    search = object.search;
    style = object.style;
    color = object.color;
    size = object.size;
    companyCode = object.companyCode;
    InventoryService.getinventorybycompanycode(pageNumber, pageSize, sortLabel,
        sortDirection, search, style, color, size, companyCode, function (response, status) {
            res.json(response);
            res.status(status);
        })
}


module.exports.updateinventory = function (req, res) {
    var InventoryDetails = req.body;
    InventoryService.updateinventory(InventoryDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.deleteinventory = function (req, res) {
    var inventoryID = req.params.uuid;
    InventoryService.deleteinventory(inventoryID, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getinventorybyid = function (req, res) {
    var inventoryID = req.params.uuid;
    InventoryService.getinventorybyid(inventoryID, function (response, status) {
        res.json(response);
        res.status(status);
    })
}


// module.exports.getinventorybyfilter = function(req,res) {
//     var test = req.body;
//     console.log('@@@@ testing vlaue are ------ ', test);
// }
// module.exports.getinventorybyActiveStatus = function (req, res) {
//     pageNumber = req.query.pageNumber;
//     pageSize = req.query.pageSize;
//     sortLabel = req.query.sortLabel;
//     sortDirection = req.query.sortDirection;
//     search = req.query.search;
//     style = req.query.style;
//     color = req.query.color;
//     size = req.query.size;

//     console.log('testing values in inventory $$$ controller ---- ', pageNumber, pageSize, sortLabel, sortDirection, search, style, color, size);
//     InventoryService.getinventorybyActiveStatus(pageNumber, pageSize, sortLabel, sortDirection, search,style, color, size, function (response, status) {
//         res.json(response);
//         res.status(status);
//     })
// }



