var models = require("../../models")

var Sequelize = require('sequelize');
var confi = require('../../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);
var asyncLoop = require('node-async-loop');
var statusCode = require('../../config/status');

module.exports.createInvoices = function (InvoicesDetails, callback) {
    models.Invoices.create(InvoicesDetails).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

// module.exports.getallInvoices = function (callback) { 
//     models.Invoices.findAll({
//         order:[
//             ['InvoiceNumber','DESC']
//         ],
//         include: [
//             {
//                 model: models.InvoiceDetails,
//                 include: [
//                     {
//                         model: models.Shipments
//                     }
//                 ]
//             }
//         ]

//         }).then(function (response) {
//         if (response.length != 0) {

//             var count = 0;
//             response.forEach((element, i) => {

//                 if(element.dataValues.PONumber!==null){
//                 models.SalesOrder.findOne({ where: {PONumber: element.dataValues.PONumber} }).then(Order => {
//                                 count++;
//                                 if(Order){
//                                   element.dataValues.SalesOrder=Order;
//                                 }else{element.dataValues.SalesOrder={};}
//                                 if (count === response.length) {
//                                             callback(response)
//                                 } 
//                     })
//                 }else{element.dataValues.SalesOrder={};}
//             });

//         } else {
//             callback("There is no Invoice")
//         }

//     }).catch(function (error) {
//         callback(error)
//     })

// }






//get Invoices by active status
module.exports.getallInvoices = function (pageNumber, pageSize, sortLabel, sortDirection, search, item, status, callback) {
    console.log('entering into get all invoices are ------ ');
    if (item === "undefined") {
        console.log('getall invoice ----- item')
        location = []
    }

    if (status === "undefined") {
        status = []
    }

    console.log('get all invoice item status ----- ', item, status, sortDirection)
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    var selectQuery = "SELECT * FROM Invoices";
    var countQuery = "SELECT COUNT(*)N'count' FROM Invoices";
    var selectOffsetQuery;
    var others = true;
    if (sortDirection == 'asc') {
        selectOffsetQuery = "ORDER BY :sortLabel ASC OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    } else {
        selectOffsetQuery = "ORDER BY :sortLabel DESC OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    }
    var completeQuery = '',
        whereQuery = '',
        countCompleteQuery = '';
    console.log('affset and fetch values are ---- ', pageNumber, pageSize, offsetValue)
    if (search !== '') {
        whereQuery = " WHERE  InvoiceNumber LIKE :name \
        OR InvoiceDate LIKE :name \
        OR TotalPrice LIKE :name \
        OR ShipmentID IN (SELECT ShipmentID FROM Shipments INNER JOIN SalesOrder ON \
        Shipments.OrderID = SalesOrder.OrderID WHERE SalesOrder.OrderID LIKE :name OR SalesOrder.StatusName LIKE :name)"
        var countCompleteQuery = countQuery + " " + whereQuery;
        var completeQuery = "SELECT uuid," + sortLabel + "  FROM Invoices " + " " + whereQuery + " " + selectOffsetQuery;

        sequelize.query(countCompleteQuery, {
            replacements: {
                name: "%" + search + "%"
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    sortLabel: sortLabel,
                    name: "%" + search + "%",
                    offset: offsetValue,
                    fetch: parseInt(pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (invoiceUuid) {
                console.log('response length are ---- ', invoiceUuid);

                var uuid = [];
                if (invoiceUuid.length > 0) {
                    invoiceUuid.forEach(element => {
                        uuid.push(element.uuid);
                    })
                } else {
                    uuid.push('');
                }
                console.log('ticket uuid values are -uuid---- ', invoiceUuid, uuid);
                models.Invoices.findAll({
                    where: {
                        uuid: {
                            $in: [uuid]
                        }
                    },
                    order: [
                        [sortLabel, sortDirection]
                    ],
                    include: [{
                        model: models.InvoiceDetails,
                        include: [{
                            model: models.Shipments,
                        }]
                    }]
                }).then(function (response) {
                    if (response.length != 0) {

                        var count = 0;
                        asyncLoop(response, (element, next) => {
                            models.SalesOrder.findOne({
                                where: {
                                    PONumber: element.PONumber
                                }
                            }).then(order => {
                                if (order) {
                                    element.dataValues.SalesOrder = order;
                                } else {
                                    element.dataValues.SalesOrder = {};
                                }
                                next();
                            }).catch(error => {
                                next();
                            })
                        }, function (err) {
                            if (err) {
                                callback(err, statusCode.error)
                            } else {
                                console.log("$$$$$ final callback")
                                callback({
                                    "count": countResponse[0].count,
                                    "response": response
                                }, statusCode.ok);
                            }
                        })

                    } else {
                        callback({
                            "count": 0,
                            "response": []
                        }, statusCode.ok);
                    }
                }).catch(function (error) {
                    console.log("after get all ticket in dao error ---- ", error);
                    callback(error, statusCode.error)
                })

            })
        })
    } else {

        if (item.length !== 0 && status.length === 0) {
            whereQuery = "WHERE ShipmentID IN (:shipmentId)";
        } else if (item.length === 0 && status.length !== 0) {
            whereQuery = "WHERE ShipmentID IN (SELECT ShipmentID FROM Shipments INNER JOIN SalesOrder ON \
                Shipments.OrderID = SalesOrder.OrderID WHERE SalesOrder.StatusName IN (:statusName))";
        } else if (item.length !== 0 && status.length !== 0) {
            whereQuery = "WHERE ShipmentID IN (SELECT ShipmentID FROM Shipments INNER JOIN SalesOrder ON \
                Shipments.OrderID = SalesOrder.OrderID WHERE SalesOrder.StatusName IN (:statusName)) \
               AND ShipmentID IN (:shipmentId)";
        } else {
            // callback([])
            console.log('nothing if condition is called')
        }
        var countCompleteQuery = countQuery + " " + whereQuery
        var completeQuery = selectQuery + " " + whereQuery + " " + selectOffsetQuery
        console.log('count  query --------> ', countCompleteQuery);
        console.log('get all  query --------> ', completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                shipmentId: item,
                statusName: status,
                sortLabel: sortLabel,
                offset: offsetValue,
                fetch: parseInt(pageSize)
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are -------> ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    shipmentId: item,
                    statusName: status,
                    sortLabel: sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                console.log('response length are ---- ', response.length);
                if (response.length != 0) {
                    // callback({
                    //     "count": countResponse[0].count,
                    //     "response": response
                    // });

                    var count = 0;
                    var count2 = 0;
                    response.forEach((element, i) => {

                        if (element.PONumber !== null) {
                            models.SalesOrder.findOne({
                                where: {
                                    PONumber: element.PONumber
                                }
                            }).then(Order => {
                                count++;
                                if (Order) {
                                    element.SalesOrder = Order;
                                } else {
                                    element.SalesOrder = {};
                                }
                                if (count === response.length) {


                                    response.forEach((element, i) => {

                                        if (element.ShipmentID !== null) {
                                            models.InvoiceDetails.findAll({
                                                where: {
                                                    ShipmentID: element.ShipmentID
                                                },
                                                include: [{
                                                    model: models.Shipments
                                                }]
                                            }).then(Details => {
                                                count2++;
                                                if (Details) {
                                                    element.InvoiceDetails = Details;
                                                } else {
                                                    element.InvoiceDetails = [];
                                                }
                                                if (count2 === response.length) {

                                                    callback({
                                                        "count": countResponse[0].count,
                                                        "response": response
                                                    }, statusCode.ok);
                                                }
                                            })
                                        } else {
                                            element.InvoiceDetails = [];
                                        }
                                    });




                                }
                            })
                        } else {
                            element.SalesOrder = {};
                        }
                    });


                } else {
                    callback("There is no Invoice", statusCode.no_content)
                }
            })
        })

    }
}


module.exports.getallInvoicesByOrg = function (pageNumber, pageSize,
    sortLabel, sortDirection, search, item, status, companyCode, callback) {

    console.log('entering into get all invoices by org id ------ ');
    if (item === "undefined") {
        console.log('getall invoice ----- item')
        location = []
    }

    if (status === "undefined") {
        status = []
    }

    console.log('get all invoice item status ----- ', item, status, sortDirection)
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    var selectQuery = "SELECT * FROM Invoices";
    var countQuery = "SELECT COUNT(*)N'count' FROM Invoices";
    var selectOffsetQuery;
    var others = true;
    if (sortDirection == 'asc') {
        selectOffsetQuery = "ORDER BY :sortLabel ASC OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    } else {
        selectOffsetQuery = "ORDER BY :sortLabel DESC OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    }
    var completeQuery = '',
        whereQuery = '',
        countCompleteQuery = '';
    console.log('affset and fetch values are ---- ', pageNumber, pageSize, offsetValue)
    if (search !== '') {
        whereQuery = " WHERE  CompanyCode IN (:code) AND  (InvoiceNumber LIKE :name \
        OR InvoiceDate LIKE :name \
        OR TotalPrice LIKE :name \
        OR ShipmentID IN (SELECT ShipmentID FROM Shipments INNER JOIN SalesOrder ON \
        Shipments.OrderID = SalesOrder.OrderID WHERE SalesOrder.OrderID LIKE :name OR SalesOrder.StatusName LIKE :name))"
        var countCompleteQuery = countQuery + " " + whereQuery;
        var completeQuery = "SELECT uuid," + sortLabel + "  FROM Invoices " + " " + whereQuery + " " + selectOffsetQuery;

        sequelize.query(countCompleteQuery, {
            replacements: {
                code: companyCode,
                name: "%" + search + "%"
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    code: companyCode,
                    sortLabel: sortLabel,
                    name: "%" + search + "%",
                    offset: offsetValue,
                    fetch: parseInt(pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (invoiceUuid) {
                console.log('response length are ---- ', invoiceUuid);

                var uuid = [];
                if (invoiceUuid.length > 0) {
                    invoiceUuid.forEach(element => {
                        uuid.push(element.uuid);
                    })
                } else {
                    uuid.push('');
                }
                console.log('ticket uuid values are -uuid---- ', invoiceUuid, uuid);
                models.Invoices.findAll({
                    where: {
                        uuid: {
                            $in: [uuid]
                        }
                    },
                    order: [
                        [sortLabel, sortDirection]
                    ],
                    include: [{
                        model: models.InvoiceDetails,
                        include: [{
                            model: models.Shipments,
                        }]
                    }]
                }).then(function (response) {
                    if (response.length != 0) {

                        var count = 0;
                        asyncLoop(response, (element, next) => {
                            models.SalesOrder.findOne({
                                where: {
                                    PONumber: element.PONumber
                                }
                            }).then(order => {
                                if (order) {
                                    element.dataValues.SalesOrder = order;
                                } else {
                                    element.dataValues.SalesOrder = {};
                                }
                                next();
                            }).catch(error => {
                                next();
                            })
                        }, function (err) {
                            if (err) {
                                callback(err)
                            } else {
                                console.log("$$$$$ final callback")
                                callback({
                                    "count": countResponse[0].count,
                                    "response": response
                                },statusCode.ok);
                            }
                        })

                    } else {
                        callback({
                            "count": 0,
                            "response": []
                        },statusCode.no_content);
                    }
                }).catch(function (error) {
                    console.log("after get all ticket in dao error ---- ", error);
                    callback(error, statusCode.error);
                })

            })
        })
    } else {

        if (item.length !== 0 && status.length === 0) {
            whereQuery = "WHERE ShipmentID IN (:shipmentId) AND CompanyCode IN (:companyCode)";
        } else if (item.length === 0 && status.length !== 0) {
            whereQuery = "WHERE ShipmentID IN (SELECT ShipmentID FROM Shipments INNER JOIN SalesOrder ON \
                    Shipments.OrderID = SalesOrder.OrderID WHERE SalesOrder.StatusName IN (:statusName)) AND CompanyCode IN (:companyCode)";
        } else if (item.length !== 0 && status.length !== 0) {
            whereQuery = "WHERE ShipmentID IN (SELECT ShipmentID FROM Shipments INNER JOIN SalesOrder ON \
                    Shipments.OrderID = SalesOrder.OrderID WHERE SalesOrder.StatusName IN (:statusName)) \
                   AND ShipmentID IN (:shipmentId) AND CompanyCode IN (:companyCode)";
        } else {
            // callback([])
            console.log('nothing if condition is called')
        }
        var countCompleteQuery = countQuery + " " + whereQuery
        var completeQuery = selectQuery + " " + whereQuery + " " + selectOffsetQuery
        console.log('count  query --------> ', countCompleteQuery);
        console.log('get all  query --------> ', completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                shipmentId: item,
                statusName: status,
                companyCode: companyCode,
                sortLabel: sortLabel,
                offset: offsetValue,
                fetch: parseInt(pageSize)
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are -------> ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    shipmentId: item,
                    statusName: status,
                    companyCode: companyCode,
                    sortLabel: sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                console.log('response length are ---- ', response.length);
                if (response.length != 0) {
                    // callback({
                    //     "count": countResponse[0].count,
                    //     "response": response
                    // });

                    var count = 0;
                    var count2 = 0;
                    response.forEach((element, i) => {

                        if (element.PONumber !== null) {
                            models.SalesOrder.findOne({
                                where: {
                                    PONumber: element.PONumber
                                }
                            }).then(Order => {
                                count++;
                                if (Order) {
                                    element.SalesOrder = Order;
                                } else {
                                    element.SalesOrder = {};
                                }
                                if (count === response.length) {


                                    response.forEach((element, i) => {

                                        if (element.ShipmentID !== null) {
                                            models.InvoiceDetails.findAll({
                                                where: {
                                                    ShipmentID: element.ShipmentID
                                                },
                                                include: [{
                                                    model: models.Shipments
                                                }]
                                            }).then(Details => {
                                                count2++;
                                                if (Details) {
                                                    element.InvoiceDetails = Details;
                                                } else {
                                                    element.InvoiceDetails = [];
                                                }
                                                if (count2 === response.length) {

                                                    callback({
                                                        "count": countResponse[0].count,
                                                        "response": response
                                                    }, statusCode.ok);
                                                }
                                            })
                                        } else {
                                            element.InvoiceDetails = [];
                                        }
                                    });




                                }
                            })
                        } else {
                            element.SalesOrder = {};
                        }
                    });


                } else {
                    callback("There is no Invoice", statusCode.no_content)
                }
            })
        })

    }
}










// module.exports.getallInvoicesByOrg = function(companyCode,callback) {
//     models.Invoices.findAll({
//         where:{CompanyCode:companyCode},
//         order:[
//             ['InvoiceNumber','DESC']
//         ],
//         include: [
//             {
//                 model: models.InvoiceDetails,
//                 include: [
//                     {
//                         model: models.Shipments
//                     }
//                 ]
//             }
//             // {
//             //     model: models.SalesOrder,
//             // }
//         ]

//         }).then(function (response) {
//         if (response.length != 0) {

//             var count = 0;
//             response.forEach((element, i) => {

//                 if(element.dataValues.PONumber!==null){
//                 models.SalesOrder.findOne({ where: {PONumber: element.dataValues.PONumber} }).then(Order => {
//                                 count++;
//                                 if(Order){
//                                   element.dataValues.SalesOrder=Order;
//                                 }else{element.dataValues.SalesOrder={};}
//                                 if (count === response.length) {
//                                             callback(response)
//                                 } 
//                     })
//                 }else{element.dataValues.SalesOrder={};}
//             });

//         } else {
//             callback("There is no Invoice")
//         }

//     }).catch(function (error) {
//         callback(error)
//     })
// }





module.exports.getInvoicesFilterValue = function (callback) {
    // sequelize.query("SELECT ShipCount, COUNT(*) From Invoices WHERE  ShipCount NOT IN ('') \
    // GROUP BY ShipCount HAVING COUNT(*) >= 1 ORDER BY ShipCount DESC;", {
    //     type: sequelize.QueryTypes.SELECT
    // }).then(function (data1) {
    sequelize.query("SELECT DISTINCT ShipmentID,COUNT(*)N'count' FROM InvoiceDetails GROUP BY ShipmentID", {
        type: sequelize.QueryTypes.SELECT
    }).then(function (data1) {

        sequelize.query("SELECT StatusName FROM SalesOrder WHERE OrderID IN (SELECT Shipments.OrderID FROM Shipments INNER JOIN \
            Invoices ON Shipments.ShipmentID = Invoices.ShipmentID) GROUP BY StatusName", {
            type: sequelize.QueryTypes.SELECT
        }).then(function (data2) {
            var filterData = {
                "item": data1,
                "status": data2
            }
            console.log("filter data---------------->", filterData)
            callback(filterData, statusCode.ok);
        })

    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

module.exports.getInvoicesFilterValueByCode = function (code, callback) {
    sequelize.query("SELECT DISTINCT ShipmentID,COUNT(*)N'count' FROM InvoiceDetails WHERE CompanyCode IN (:code)  GROUP BY ShipmentID", {
        replacements: {
            code: code
        },
        type: sequelize.QueryTypes.SELECT
    }).then(function (data1) {

        sequelize.query("SELECT StatusName FROM SalesOrder WHERE OrderID IN (SELECT Shipments.OrderID FROM Shipments INNER JOIN \
            Invoices ON Shipments.ShipmentID = Invoices.ShipmentID WHERE Invoices.CompanyCode IN (:code)) GROUP BY StatusName", {
            replacements: {
                code: code
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data2) {
            var filterData = {
                "item": data1,
                "status": data2
            }
            console.log("filter data---------------->", filterData)
            callback(filterData, statusCode.ok);
        })

    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}



module.exports.getSalesOrderFilterValueData = function (filterData, callback) {

    //console.log("array data------------------>",filterData); 
    var filterArr = []

    filterData.forEach(element => {
        if (element.value !== null && element.value[0] !== undefined) {
            filterArr.push(element)
        }
    });

    if (filterArr.length == 1) {

        // console.log("selected 111111111111111111111------------------>");

        sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value: filterArr[0].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {



            sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                                GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
                replacements: {
                    value: filterArr[0].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data4) {
                var filterData = {
                    "location": data1,
                    "ticket": data2,
                    "status": data3,
                    "styleoption": data4
                }
                callback(filterData, statusCode.ok);
            })

        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    }

}




module.exports.getInvoicesById = function (Invoice_id, callback) {
    models.Invoices.findOne({

        where: {
            uuid: Invoice_id
        },
        order: [
            ['InvoiceNumber', 'DESC']
        ],
        // include: [
        // {
        //     model: models.OrderItems
        // }]

    }).then(response => {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no Invoice", statusCode.no_content)
        }
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.delete_Invoices = function (Invoice_id, callback) {
    models.Invoices.destroy({
        where: {
            uuid: Invoice_id
        }
    }).then(response => {
        callback(response, statusCode.ok);
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.update_Invoices = function (InvoicesDetails, callback) {
    models.Invoices.update(InvoicesDetails, {
        where: {
            uuid: InvoicesDetails.uuid
        }
    }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}