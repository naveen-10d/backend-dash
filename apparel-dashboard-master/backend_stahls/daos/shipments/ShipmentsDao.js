var models = require("../../models")
var db = {};
var Sequelize = require('sequelize');
var confi = require('../../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
// var Cryptr = require('cryptr'),
// cryptr = new Cryptr('myTotalySecretKey');
// var decrypted_Password = cryptr.decrypt(config.password);
var sequelize = new Sequelize(config.name, config.username, config.password, config);
var statusCode = require('../../config/status');

module.exports.createShipments = function (ShipmentsDetails, callback) {
    models.Shipments.create(ShipmentsDetails).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getShipmentFilterValue = function (callback) {
    sequelize.query("SELECT PONumber, COUNT(*) From Shipments WHERE  PONumber NOT IN ('') \
    GROUP BY PONumber HAVING COUNT(*) >= 1 ORDER BY PONumber DESC", {
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            var filterData = {
                "Ponumber": data1,
            }
            callback(filterData, statusCode.ok);
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
}

module.exports.getShipmentFilterByCompanycode = function (companyCode, callback) {
    sequelize.query("SELECT PONumber, COUNT(*) From Shipments WHERE CompanyCode = $companyCode AND PONumber NOT IN ('') \
    GROUP BY PONumber HAVING COUNT(*) >= 1 ORDER BY PONumber DESC", {
            bind: {
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            var filterData = {
                "Ponumber": data1,
            }
            callback(filterData, statusCode.ok);
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
}

module.exports.getallShipments = function (pageNumber, pageSize, sortLabel, sortDirection, search, ponumber, startdate, enddate, callback) {

    if (ponumber.length === 0) {
        ponumber = [];
    }
    if (startdate === undefined) {
        startdate = [];
    }
    if (enddate === undefined) {
        enddate = [];
    }
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    var selectQuery = "SELECT * FROM Shipments";
    var countQuery = "SELECT COUNT(*)N'count' FROM Shipments";
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
    // console.log('affset and fetch values are ---- ', pageNumber, pageSize, offsetValue)
    if (search !== '') {
        console.log(' ### entering into search condition ')
        models.Shipments.count({
            where: {
                $or: [{
                    'PONumber': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipToName': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipToCity': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipToState': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'WayBill': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipDate': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipperNumber': {
                        like: '%' + search + '%'
                    }
                }
                ]
            }
        }).then(function (count) {
            models.Shipments.findAll({
                where: {
                    $or: [{
                        'PONumber': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipToName': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipToCity': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipToState': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'WayBill': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipperNumber': {
                            like: '%' + search + '%'
                        }
                    }
                    ]
                },
                offset: offsetValue,
                limit: parseInt(pageSize),
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [
                    {
                        model: models.TrackingInfo
                    },
                    {
                        model: models.ShipmentsItems
                    }
                ]
            }).then(function (response) {
                callback({
                    "count": count,
                    "response": response
                }, statusCode.ok)
            }).catch(function (error) {
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })
    } else {
        if (ponumber.length !== 0) {
            whereQuery = "WHERE PONumber IN (:ponumber)";
        } else if (startdate.length !== 0) {
            whereQuery = " WHERE CONVERT(DATE,ShipDate) IN (:startdate) "
        } else if (startdate.length !== 0 && enddate.length !== 0) {
            whereQuery = " WHERE CONVERT(DATE,ShipDate) BETWEEN (:startdate) AND (:enddate) "
        } else if (ponumber.length !== 0 && startdate.length !== 0 && enddate.length !== 0) {
            whereQuery = " WHERE PONumber IN (:ponumber) AND CONVERT(DATE,ShipDate) BETWEEN (:startdate) AND (:enddate) "
        } else {
            console.log('nothing if condition is called')
        }
        var countCompleteQuery = countQuery + " " + whereQuery
        var completeQuery = selectQuery + " " + whereQuery + " " + selectOffsetQuery
        // console.log('full of query are ---- ', countCompleteQuery, completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                sortLabel: sortLabel,
                offset: offsetValue,
                fetch: parseInt(pageSize),
                ponumber: ponumber,
                startdate: startdate,
                enddate: enddate

            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            // console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    sortLabel: sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(pageSize),
                    ponumber: ponumber,
                    startdate: startdate,
                    enddate: enddate

                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                // console.log('response length are ---- ', response.length);
                if (response.length != 0) {
                    callback({
                        "count": countResponse[0].count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Shipments", statusCode.no_content)
                }
            })
        })
    }
    // models.Shipments.findAll({
    //     order: [
    //         ['PONumber', 'DESC']
    //     ],
    // include: [
    //     {
    //         model: models.TrackingInfo
    //     },
    //     {
    //         model: models.ShipmentsItems
    //     }
    // ]
    // }).then(function (response) {
    //     if (response.length != 0) {
    //         callback(response, statusCode.ok)
    //     } else {
    //         callback("There is no Shipments")
    //     }

    // }).catch(function (error) {
    //     callback(error, statusCode.error)
    // })

}


module.exports.getallShipmentsOrganisation = function (pageNumber, pageSize, sortLabel, sortDirection, search, companyCode, ponumber, startdate, enddate, callback) {
    console.log('affset and fetch values are ---- ')
    if (startdate === undefined) {
        startdate = [];
    }
    if (enddate === undefined) {
        enddate = [];
    }

    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    var selectQuery = "SELECT * FROM Shipments";
    var countQuery = "SELECT COUNT(*)N'count' FROM Shipments";
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
    // console.log('affset and fetch values are ---- ', pageNumber, pageSize, offsetValue,companyCode)
    if (search !== '') {
        console.log(' ### entering into search condition ')
        models.Shipments.count({
            where: {
                CompanyCode: companyCode,
                $or: [{
                    'PONumber': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipToName': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipToCity': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipToState': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'WayBill': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipDate': {
                        like: '%' + search + '%'
                    }
                },
                {
                    'ShipperNumber': {
                        like: '%' + search + '%'
                    }
                }
                ]
            }
        }).then(function (count) {
            models.Shipments.findAll({
                where: {
                    CompanyCode: companyCode,
                    $or: [{
                        'PONumber': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipToName': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipToCity': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipToState': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'WayBill': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ShipperNumber': {
                            like: '%' + search + '%'
                        }
                    }
                    ]
                },
                offset: offsetValue,
                limit: parseInt(pageSize),
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [
                    {
                        model: models.TrackingInfo
                    },
                    {
                        model: models.ShipmentsItems
                    }
                ]
            }).then(function (response) {
                callback({
                    "count": count,
                    "response": response
                }, statusCode.ok)
            }).catch(function (error) {
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })
    } else {
        if (ponumber.length !== 0) {
            whereQuery = "WHERE CompanyCode =:companyCode AND PONumber IN (:ponumber)";
        } else if (startdate.length !== 0) {
            whereQuery = " WHERE CompanyCode = :companyCode AND CONVERT(DATE,ShipDate) IN (:startdate) "
        }
        else if (startdate.length !== 0 && enddate.length !== 0) {
            whereQuery = " WHERE CompanyCode = :companyCode AND CONVERT(DATE,ShipDate) BETWEEN (:startdate) AND (:enddate) "
        } else if (ponumber.length !== 0 && startdate.length !== 0 && enddate.length !== 0) {
            whereQuery = " WHERE CompanyCode = :companyCode AND PONumber IN (:ponumber) AND CONVERT(DATE,ShipDate) BETWEEN (:startdate) AND (:enddate) "
        }
        else {
            whereQuery = "WHERE CompanyCode = :companyCode"
            console.log('nothing if condition is called')
        }
        var countCompleteQuery = countQuery + " " + whereQuery
        var completeQuery = selectQuery + " " + whereQuery + " " + selectOffsetQuery
        console.log('full of query are ---- ', countCompleteQuery, completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                companyCode: companyCode,
                sortLabel: sortLabel,
                offset: offsetValue,
                fetch: parseInt(pageSize),
                ponumber: ponumber,
                startdate: startdate,
                enddate: enddate
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            // console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    companyCode: companyCode,
                    sortLabel: sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(pageSize),
                    ponumber: ponumber,
                    startdate: startdate,
                    enddate: enddate
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                // console.log('response length are ---- ', response.length);
                if (response.length != 0) {
                    callback({
                        "count": countResponse[0].count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Shipments", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('------Error----->>>>', error);
                callback(error, statusCode.error);
            })
        })
    }

    // models.Shipments.findAll({
    //     where: { CompanyCode: CompanyCode },
    //     order: [
    //         ['PONumber', 'DESC']
    //     ],
    //     include: [
    //         {
    //             model: models.TrackingInfo
    //         },
    //         {
    //             model: models.ShipmentsItems
    //         }
    //     ]
    // }).then(function (response) {
    //     if (response.length != 0) {
    //         callback(response, statusCode.ok)
    //     } else {
    //         callback("There is no Shipments")
    //     }

    // }).catch(function (error) {
    //     callback(error, statusCode.error)
    // })

}

module.exports.getShipmentsById = function (Shipment_id, callback) {
    console.log('entering into get shipment data @#@#$#####');
    models.Shipments.findOne({
        where: { ShipmentID: Shipment_id },
        order: [
            ['PONumber', 'DESC']
        ],
        include: [{
            model: models.ShipmentsItems,
        },
        {
            model: models.PackedBox,
            include: [{
                model: models.PackedItems
            }]
        }
        ]

    }).then(response => {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no Shipments", statusCode.no_content)
        }
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getPackedBoxById = function (PackedBox_id, callback) {
    models.PackedBox.findOne({

        where: { PackedBoxID: PackedBox_id },
        include: [{
            model: models.PackedItems
        },
        ]

    }).then(response => {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no PackedBox", statusCode.no_content)
        }
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.delete_Shipments = function (Shipment_id, callback) {
    models.Shipments.destroy({ where: { ShipmentID: Shipment_id } }).then(response => {
        callback(response, statusCode.error);
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.update_Shipments = function (ShipmentsDetails, callback) {
    models.Shipments.update(ShipmentsDetails, { where: { ShipmentID: ShipmentsDetails.ShipmentID } }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getPackedItemsById = function (shipmentId, callback) {
    sequelize.query("SELECT * FROM PackedItems INNER JOIN PackedBox ON \
PackedItems.PackedBoxID = PackedBox.PackedBoxID WHERE PackedBox.ShipmentID = $shipmentID",
        { bind: { shipmentID: shipmentId }, type: sequelize.QueryTypes.SELECT }).then(function (response) {
            callback(response, statusCode.ok);
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
}

module.exports.getShipmentByDate = function (startdate, enddate, callback) {
    sequelize.query("SELECT * FROM Shipments WHERE CONVERT(DATE,ShipDate) \
    BETWEEN $startdate AND $enddate", { bind: { startdate: startdate, enddate: enddate }, type: sequelize.QueryTypes.SELECT })
        .then(function (response) {
            callback(response, statusCode.ok);
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
}

module.exports.getPonumberByDate = function (startdate, enddate, callback) {
    if (startdate !== undefined) {
        console.log('------------Startdateonly----------->>>>', startdate);
        sequelize.query("SELECT PONumber FROM Shipments WHERE CONVERT(DATE,ShipDate) IN (:startdate)",
            { replacements: { startdate: startdate }, type: sequelize.QueryTypes.SELECT }).then(function (data1) {
                var filterData = {
                    "Ponumber": data1,
                }
                callback(filterData, statusCode.ok);
            }).catch(function (error) {
                console.log('-----------Error-------->>>>>', error);
                callback(error, statusCode.error);
            })
    } else {
        sequelize.query("SELECT PONumber FROM Shipments WHERE CONVERT(DATE,ShipDate) \
        BETWEEN $startdate AND $enddate", { bind: { startdate: startdate, enddate: enddate }, type: sequelize.QueryTypes.SELECT })
            .then(function (data1) {
                var filterData = {
                    "Ponumber": data1,
                }
                callback(filterData, statusCode.ok);
            }).catch(function (error) {
                callback(error, statusCode.error);
            })
    }
}


module.exports.getShipmentByDateCode = function (code, startdate, enddate, callback) {
    console.log('start date and end date in code ---- ', startdate, enddate, code);
    sequelize.query("SELECT * FROM Shipments WHERE CompanyCode = $companyCode AND \
     CONVERT(DATE,ShipDate)  \
     BETWEEN $startdate AND $enddate", { bind: { startdate: startdate, enddate: enddate, companyCode: code }, type: sequelize.QueryTypes.SELECT })
        .then(function (response) {
            callback(response, statusCode.ok);
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
}