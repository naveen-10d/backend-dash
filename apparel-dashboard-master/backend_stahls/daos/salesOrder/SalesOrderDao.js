var models = require("../../models")
var Sequelize = require('sequelize');
var confi = require('../../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);
var statusCode = require('../../config/status');

module.exports.createSalesOrder = function (SalesOrderDetails, callback) {
    console.log("--- >>  display the is --> ", SalesOrderDetails)
    models.SalesOrder.create(SalesOrderDetails).then(function (response) {
        callback(response, statusCode.created);
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

module.exports.getExportSalesOrder = function (startDate, endDate, callback) {
    models.SalesOrder.findAll({
        where: {
            OrderDate: {
                $between: [startDate, endDate]
            }
        },
        order: [
            ['OrderDate', 'DESC']
        ],
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok);
        } else {
            callback([], statusCode.no_content);
        }

    }).catch(function (error) {
        callback(error, statusCode.error);
    })

}
module.exports.getExportSalesOrderByCode = function (startDate, endDate, code, callback) {
    models.SalesOrder.findAll({
        where: {
            CompanyCode: code,
            OrderDate: {
                $between: [startDate, endDate]
            }
        },
        order: [
            ['OrderDate', 'DESC']
        ],
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok);
        } else {
            callback([], statusCode.no_content);
        }

    }).catch(function (error) {
        callback(error, statusCode.error);
    })

}

module.exports.getSalesOrderById = function (orderId, callback) {
    console.log("entering into get sales order #@#@#@# ")
    models.SalesOrder.findOne({

        where: {
            OrderID: orderId
        },
        order: [
            ['OrderDate', 'DESC']
        ],
        include: [{
                model: models.SalesOrderItems,
                include: [{
                    model: models.SalesOrderDetails
                }],

            },
            {
                model: models.Tickets,
                as: 'Ticket',
                include: [{
                    model: models.Users,
                    as: 'assigned_to',
                }, {
                    model: models.Users,
                    as: 'created_by',
                }]
            },
            {
                model: models.Shipments,
            }
        ]

    }).then(response => {
        if (response.length != 0) {
            callback(response, statusCode.ok);
        } else {
            callback("There is no Order", statusCode.no_content);
        }
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}


module.exports.delete_SalesOrder = function (orderId, callback) {
    models.SalesOrder.destroy({
        where: {
            OrderID: orderId
        }
    }).then(response => {
        callback();
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.update_SalesOrder = function (SalesOrderDetails, callback) {
    models.SalesOrder.update(SalesOrderDetails, {
        where: {
            uuid: SalesOrderDetails.uuid
        }
    }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}


//newly added


module.exports.getOrderAndItemsById = function (orderId, callback) {
    models.SalesOrder.find({
        where: {
            OrderID: orderId
        },
        include: [{
            model: models.SalesOrderItems,
            attributes: ['StyleOption']
        }]
    }).then(function (response) {
        callback(response, statusCode.ok);
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

//get SalesOrder filter values without styleoption and companycode
module.exports.getSalesOrderFilterValue = function (callback) {
    sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') \
    GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
        type: sequelize.QueryTypes.SELECT
    }).then(function (data1) {


        sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') \
            GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
            type: sequelize.QueryTypes.SELECT
        }).then(function (data2) {

            sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') \
                    GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                type: sequelize.QueryTypes.SELECT
            }).then(function (data3) {

                sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') \
                    GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
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
            })
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

            sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                        GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
                replacements: {
                    value: filterArr[0].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {

                sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                                GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                    replacements: {
                        value: filterArr[0].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {

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
                })
            })

        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    } else if (filterArr.length == 2) {

        //console.log("selected 2222222222222222------------------>");

        sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {

            sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                        GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {

                sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                                GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {

                    sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                                GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value
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
                })
            })

        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    } else if (filterArr.length == 3) {
        //console.log("selected 33333333333------------------>");

        sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                AND " + filterArr[2].filter + " IN (:value3) GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                value3: filterArr[2].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {

            sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                    AND " + filterArr[2].filter + " IN (:value3)  GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    value3: filterArr[2].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {

                sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                        AND " + filterArr[2].filter + " IN (:value3)      GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        value3: filterArr[2].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {

                    sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                            AND " + filterArr[2].filter + " IN (:value3)   GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            value3: filterArr[2].value
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
                })
            })

        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    }


}


//get SalesOrder filter values without style option with companycode
module.exports.getSalesOrderFilterValueDataByCode = function (companyCode, filterData, callback) {


    var filterArr = []

    filterData.forEach(element => {
        if (element.value !== null && element.value[0] !== undefined) {
            filterArr.push(element)
        }
    });

    if (filterArr.length == 1) {

        // console.log("selected 111111111111111111111------------------>");

        sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
        AND CompanyCode = :companyCode GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value: filterArr[0].value,
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {

            sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
            AND CompanyCode = :companyCode GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
                replacements: {
                    value: filterArr[0].value,
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {

                sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                AND CompanyCode = :companyCode GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                    replacements: {
                        value: filterArr[0].value,
                        companyCode: companyCode
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {

                    sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                    AND CompanyCode = :companyCode  GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
                        replacements: {
                            value: filterArr[0].value,
                            companyCode: companyCode
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
                })
            })

        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    } else if (filterArr.length == 2) {

        //console.log("selected 2222222222222222------------------>");

        sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
        AND CompanyCode = :companyCode GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {

            sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
            AND CompanyCode = :companyCode  GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {

                sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                AND CompanyCode = :companyCode     GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        companyCode: companyCode
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {

                    sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                    AND CompanyCode = :companyCode GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            companyCode: companyCode
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
                })
            })

        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    } else if (filterArr.length == 3) {
        //console.log("selected 33333333333------------------>");

        sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
        AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                value3: filterArr[2].value,
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {

            sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
            AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    value3: filterArr[2].value,
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {

                sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        value3: filterArr[2].value,
                        companyCode: companyCode
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {

                    sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                    AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            value3: filterArr[2].value,
                            companyCode: companyCode
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
                })
            })

        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    }



}



//get SalesOrder filter values without style option with companycode
module.exports.getSalesOrderFilterValueByCode = function (companyCode, callback) {
    sequelize.query("SELECT CompanyCode, COUNT(*) From SalesOrder WHERE  CompanyCode NOT IN ('') AND CompanyCode = $companyCode \
    GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
        bind: {
            companyCode: companyCode
        },
        type: sequelize.QueryTypes.SELECT
    }).then(function (data1) {


        sequelize.query("SELECT Tickets, COUNT(*) From SalesOrder WHERE  Tickets NOT IN ('') AND CompanyCode = $companyCode \
            GROUP BY Tickets HAVING COUNT(*) >= 1 ORDER BY Tickets DESC;", {
            bind: {
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data2) {

            sequelize.query("SELECT StatusName, COUNT(*) From SalesOrder WHERE  StatusName NOT IN ('') AND CompanyCode = $companyCode \
                    GROUP BY StatusName HAVING COUNT(*) >= 1 ORDER BY StatusName DESC;", {
                bind: {
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data3) {
                sequelize.query("SELECT Comments7, COUNT(*) From SalesOrder WHERE  Comments7 NOT IN ('') AND CompanyCode = $companyCode \
                GROUP BY Comments7 HAVING COUNT(*) >= 1 ORDER BY Comments7 DESC;", {
                    bind: {
                        companyCode: companyCode
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

            })


        })

    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

module.exports.getCountByStatusName = function (callback) {
    sequelize.query("SELECT StatusName,Count(*) N'StatusCount' \
    FROM \
    SalesOrder \
    GROUP BY StatusName \
    HAVING \
    COUNT(*) > 1 ORDER BY StatusName DESC", {
        type: sequelize.QueryTypes.SELECT
    }).then(function (response) {
        callback(response, statusCode.ok);
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

module.exports.getStatusNameCountByCode = function (companyCode, callback) {
    sequelize.query("SELECT StatusName,Count(*) N'StatusCount' \
    FROM \
    SalesOrder WHERE CompanyCode = $companyCode \
    GROUP BY StatusName \
    HAVING \
    COUNT(*) > 1 ORDER BY StatusName DESC", {
        bind: {
            companyCode: companyCode
        },
        type: sequelize.QueryTypes.SELECT
    }).then(function (response) {
        callback(response, statusCode.ok);
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

//get SalesOrder by active status
module.exports.getAllSalesOrders = function (pageNumber, pageSize, sortLabel, sortDirection, search, location, ticketCount, status, styleOption, callback) {
    if (location === "undefined") {
        console.log('getall order ----- location')
        location = []
    }
    if (ticketCount === "undefined") {
        ticketCount = []
    }
    if (status === "undefined") {
        status = []
    }
    if (styleOption === "undefined") {
        styleOption = []
    }
    console.log('get all sales order location ticket status ----- ', location, ticketCount, status, styleOption, sortLabel, sortDirection)
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    var selectQuery = "SELECT * FROM SalesOrder";
    var countQuery = "SELECT COUNT(*)N'count' FROM SalesOrder";
    var selectOffsetQuery;
    var others = true;
    if (sortLabel != 'OrderNumber') {
        selectOffsetQuery = "ORDER BY :sortLabel  " + sortDirection.toUpperCase() + ", OrderNumber " + sortDirection.toUpperCase() + "  OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    } else {
        selectOffsetQuery = "ORDER BY :sortLabel  " + sortDirection.toUpperCase() + "  OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    }
    var completeQuery = '',
        whereQuery = '',
        countCompleteQuery = '';
    console.log('affset and fetch values are ---- ', pageNumber, pageSize, offsetValue)
    if (search !== '') {
        console.log(' ### entering into search condition ')
        models.SalesOrder.count({
            where: {
                $or: [{
                        'OrderNumber': {
                            like: '%' + search + '%'
                        }
                    },
                    //{ '$Comment.body$': { like: '%' + search + '%' } }
                    {
                        'CompanyCode': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'PONumber': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'OrderDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'RequiredDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ForecastFinish': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'Tickets': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StatusName': {
                            like: '%' + search + '%'
                        }
                    }
                ]
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                where: {
                    $or: [{
                            'OrderNumber': {
                                like: '%' + search + '%'
                            }
                        },
                        //{ '$Comment.body$': { like: '%' + search + '%' } }
                        {
                            'CompanyCode': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'PONumber': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'OrderDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'RequiredDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'ForecastFinish': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'Tickets': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StatusName': {
                                like: '%' + search + '%'
                            }
                        }
                    ]
                },
                offset: offsetValue,
                limit: parseInt(pageSize),
                order: [
                    [sortLabel, sortDirection]
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
        if (location.length !== 0 && ticketCount.length !== 0 && status.length !== 0 && styleOption.length != 0) {
            whereQuery = " WHERE CompanyCode IN (:code) AND Tickets IN (:ticket) AND StatusName IN (:status) AND Comments7 IN (:styleOption)"
        } //two filter values with location
        else if (location.length !== 0 && ((ticketCount.length !== 0 && status.length === 0 && styleOption.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && styleOption.length === 0) ||
                (status.length == 0 && ticketCount.length == 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into location two way filter', location, ticketCount, status);
            if (ticketCount.length != 0) {
                whereQuery = "WHERE CompanyCode IN (:code) AND Tickets IN (:ticket)"
            } else if (status.length != 0) {
                whereQuery = "WHERE CompanyCode IN (:code) AND StatusName IN (:status)"
            } else {
                whereQuery = "WHERE CompanyCode IN (:code) AND Comments7 IN (:styleOption)"
            }
        } // three filter values with location
        else if (location.length !== 0 && ((ticketCount.length !== 0 && status.length !== 0 && styleOption.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && styleOption.length !== 0) ||
                (status.length === 0 && ticketCount.length !== 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into location there way filter', location, ticketCount, status);
            if (ticketCount.length != 0 && status.length != 0) {
                whereQuery = "WHERE CompanyCode IN (:code) AND Tickets IN (:ticket) AND StatusName IN (:status)"
            } else if (status.length != 0 && styleOption.length != 0) {
                whereQuery = "WHERE CompanyCode IN (:code) AND StatusName IN (:status) AND Comments7 IN (:styleOption)"
            } else {
                whereQuery = "WHERE CompanyCode IN (:code) AND Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } //two filter values with Tickets
        else if (ticketCount.length !== 0 && ((location.length !== 0 && status.length === 0 && styleOption.length === 0) ||
                (status.length !== 0 && location.length === 0 && styleOption.length === 0) ||
                (status.length == 0 && location.length == 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into ticket counts two way filter', location, ticketCount, status);
            if (location.length != 0) {
                whereQuery = "WHERE Tickets IN (:ticket) AND CompanyCode IN (:code)"
            } else if (status.length != 0) {
                whereQuery = "WHERE Tickets IN (:ticket) AND StatusName IN (:status)"
            } else {
                whereQuery = "WHERE Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } // three filter values with Tickets
        else if (ticketCount.length !== 0 && ((location.length !== 0 && status.length !== 0 && styleOption.length === 0) ||
                (status.length !== 0 && location.length === 0 && styleOption.length !== 0) ||
                (status.length === 0 && location.length !== 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into ticket counts three way filter', location, ticketCount, status);
            if (location.length != 0 && status.length != 0) {
                whereQuery = "WHERE Tickets IN (:ticket) AND CompanyCode IN (:code) AND StatusName IN (:status)"
            } else if (status.length != 0 && styleOption.length != 0) {
                whereQuery = "WHERE Tickets IN (:ticket) AND StatusName IN (:status) AND Comments7 IN (:styleOption)"
            } else {
                whereQuery = "WHERE Tickets IN (:ticket) AND Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } //two filter values with statusName
        else if (status.length !== 0 && ((ticketCount.length !== 0 && location.length === 0 && styleOption.length === 0) ||
                (location.length !== 0 && ticketCount.length === 0 && styleOption.length === 0) ||
                (location.length == 0 && ticketCount.length == 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into status two way filter', location, ticketCount, status);
            if (ticketCount.length != 0) {
                whereQuery = "WHERE StatusName IN (:status) AND Tickets IN (:ticket)"
            } else if (location.length != 0) {
                whereQuery = "WHERE StatusName IN (:status) AND CompanyCode IN (:code)"
            } else {
                whereQuery = "WHERE StatusName IN (:status) AND Comments7 IN (:styleOption)"
            }
        } // three filter values with statusName
        else if (status.length !== 0 && ((ticketCount.length !== 0 && location.length !== 0 && styleOption.length === 0) ||
                (location.length !== 0 && ticketCount.length === 0 && styleOption.length !== 0) ||
                (location.length === 0 && ticketCount.length !== 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into status name two way filter', location, ticketCount, status);
            if (ticketCount.length != 0 && location.length != 0) {
                whereQuery = "WHERE StatusName IN (:status) AND Tickets IN (:ticket) AND CompanyCode IN (:code)"
            } else if (location.length != 0 && styleOption.length != 0) {
                whereQuery = "WHERE StatusName IN (:status) AND CompanyCode IN (:code) AND Comments7 IN (:styleOption)"
            } else {
                whereQuery = "WHERE StatusName IN (:status) AND Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } //two filter values with style option
        else if (styleOption.length !== 0 && ((ticketCount.length !== 0 && status.length === 0 && location.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && location.length === 0) ||
                (status.length == 0 && ticketCount.length == 0 && location.length !== 0))) {
            // var statement;
            console.log('entering into style option two way filter', location, ticketCount, status);
            if (ticketCount.length != 0) {
                whereQuery = "WHERE Comments7 IN (:styleOption) AND Tickets IN (:ticket)"
            } else if (status.length != 0) {
                whereQuery = "WHERE Comments7 IN (:styleOption) AND StatusName IN (:status)"
            } else {
                whereQuery = "WHERE Comments7 IN (:styleOption) AND CompanyCode IN (:code)"
            }
        } // three filter values with location
        else if (styleOption.length !== 0 && ((ticketCount.length !== 0 && status.length !== 0 && location.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && location.length !== 0) ||
                (status.length === 0 && ticketCount.length !== 0 && location.length !== 0))) {
            // var statement;
            console.log('entering into style option there way filter', location, ticketCount, status);
            if (ticketCount.length != 0 && status.length != 0) {
                whereQuery = "WHERE Comments7 IN (:styleOption) AND Tickets IN (:ticket) AND StatusName IN (:status)"
            } else if (status.length != 0 && location.length != 0) {
                whereQuery = "WHERE Comments7 IN (:styleOption) AND StatusName IN (:status) AND CompanyCode IN (:code)"
            } else {
                whereQuery = "WHERE Comments7 IN (:styleOption) AND Tickets IN (:ticket) AND CompanyCode IN (:code)"
            }
        } else if (location.length !== 0 && ticketCount.length === 0 && status.length === 0 && styleOption.length === 0) {
            whereQuery = "WHERE CompanyCode IN (:code)";
        } else if (ticketCount.length !== 0 && location.length === 0 && status.length === 0 && styleOption.length === 0) {
            whereQuery = "WHERE Tickets IN (:ticket)";
        } else if (status.length !== 0 && ticketCount.length === 0 && location.length === 0 && styleOption.length === 0) {
            whereQuery = "WHERE StatusName IN (:status)";
        } else if (styleOption.length !== 0 && ticketCount.length === 0 && status.length === 0 && location.length === 0) {
            whereQuery = "WHERE Comments7 IN (:styleOption)";
        } else {
            // callback([])
            console.log('nothing if condition is called')
        }
        var countCompleteQuery = countQuery + " " + whereQuery
        var completeQuery = selectQuery + " " + whereQuery + " " + selectOffsetQuery
        console.log('full of query are ---- ', countCompleteQuery, completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                code: location,
                ticket: ticketCount,
                status: status,
                styleOption: styleOption,
                sortLabel: sortLabel,
                offset: offsetValue,
                fetch: parseInt(pageSize)
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    code: location,
                    ticket: ticketCount,
                    status: status,
                    styleOption: styleOption,
                    sortLabel: sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                console.log('response length are ---- ', response.length);
                if (response.length != 0) {
                    // var sortedValue =
                    // var sortedValue = response.sort(function (a, b) {
                    //         console.log('@@@@ entering into respones sort')
                    //         return b.OrderNumber - a.OrderNumber;
                    //     })
                    // console.log('sorted values are ----- ', sortedValue);
                    callback({
                        "count": countResponse[0].count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Order", statusCode.no_content)
                }
            })
        })

    }
}

//getActiveSalesOrder by company code
module.exports.getSalesOrderByCompanyCode = function (pageNumber, pageSize, sortLabel,
    sortDirection, search, location, ticketCount, status, styleOption, companyCode, callback) {
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    var selectQuery = "SELECT * FROM SalesOrder";
    var countQuery = "SELECT COUNT(*)N'count' FROM SalesOrder";
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
        console.log(' ### entering into search condition ')
        models.SalesOrder.count({
            where: {
                CompanyCode: companyCode,
                $or: [{
                        'OrderNumber': {
                            like: '%' + search + '%'
                        }
                    },
                    //{ '$Comment.body$': { like: '%' + search + '%' } }
                    {
                        'CompanyCode': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'PONumber': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'OrderDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'RequiredDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ForecastFinish': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'Tickets': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StatusName': {
                            like: '%' + search + '%'
                        }
                    }
                ]
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                where: {
                    CompanyCode: companyCode,
                    $or: [{
                            'OrderNumber': {
                                like: '%' + search + '%'
                            }
                        },
                        //{ '$Comment.body$': { like: '%' + search + '%' } }
                        {
                            'CompanyCode': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'PONumber': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'OrderDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'RequiredDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'ForecastFinish': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'Tickets': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StatusName': {
                                like: '%' + search + '%'
                            }
                        }
                    ]
                },
                offset: offsetValue,
                limit: parseInt(pageSize),
                order: [
                    [sortLabel, sortDirection]
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
        if (location.length !== 0 && ticketCount.length !== 0 && status.length !== 0 && styleOption.length != 0) {
            whereQuery = " WHERE CompanyCode = :companyCode AND CompanyCode IN (:code) AND Tickets IN (:ticket) AND StatusName IN (:status) AND Comments7 IN (:styleOption)"
        } //two filter values with location
        else if (location.length !== 0 && ((ticketCount.length !== 0 && status.length === 0 && styleOption.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && styleOption.length === 0) ||
                (status.length == 0 && ticketCount.length == 0 && styleOption.length !== 0))) {
            if (ticketCount.length != 0) {
                whereQuery = "WHERE CompanyCode = :companyCode AND  CompanyCode IN (:code) AND Tickets IN (:ticket)"
            } else if (status.length != 0) {
                whereQuery = "WHERE CompanyCode = :companyCode AND  CompanyCode IN (:code) AND StatusName IN (:status)"
            } else {
                whereQuery = "WHERE CompanyCode = :companyCode AND  CompanyCode IN (:code) AND Comments7 IN (:styleOption)"
            }
        } // three filter values with location
        else if (location.length !== 0 && ((ticketCount.length !== 0 && status.length !== 0 && styleOption.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && styleOption.length !== 0) ||
                (status.length === 0 && ticketCount.length !== 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into location there way filter', location, ticketCount, status);
            if (ticketCount.length != 0 && status.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  CompanyCode IN (:code) AND Tickets IN (:ticket) AND StatusName IN (:status)"
            } else if (status.length != 0 && styleOption.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  CompanyCode IN (:code) AND StatusName IN (:status) AND Comments7 IN (:styleOption)"
            } else {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  CompanyCode IN (:code) AND Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } //two filter values with Tickets
        else if (ticketCount.length !== 0 && ((location.length !== 0 && status.length === 0 && styleOption.length === 0) ||
                (status.length !== 0 && location.length === 0 && styleOption.length === 0) ||
                (status.length == 0 && location.length == 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into ticket counts two way filter', location, ticketCount, status);
            if (location.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Tickets IN (:ticket) AND CompanyCode IN (:code)"
            } else if (status.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Tickets IN (:ticket) AND StatusName IN (:status)"
            } else {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } // three filter values with Tickets
        else if (ticketCount.length !== 0 && ((location.length !== 0 && status.length !== 0 && styleOption.length === 0) ||
                (status.length !== 0 && location.length === 0 && styleOption.length !== 0) ||
                (status.length === 0 && location.length !== 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into ticket counts three way filter', location, ticketCount, status);
            if (location.length != 0 && status.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Tickets IN (:ticket) AND CompanyCode IN (:code) AND StatusName IN (:status)"
            } else if (status.length != 0 && styleOption.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Tickets IN (:ticket) AND StatusName IN (:status) AND Comments7 IN (:styleOption)"
            } else {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Tickets IN (:ticket) AND Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } //two filter values with statusName
        else if (status.length !== 0 && ((ticketCount.length !== 0 && location.length === 0 && styleOption.length === 0) ||
                (location.length !== 0 && ticketCount.length === 0 && styleOption.length === 0) ||
                (location.length == 0 && ticketCount.length == 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into status two way filter', location, ticketCount, status);
            if (ticketCount.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  StatusName IN (:status) AND Tickets IN (:ticket)"
            } else if (location.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  StatusName IN (:status) AND CompanyCode IN (:code)"
            } else {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  StatusName IN (:status) AND Comments7 IN (:styleOption)"
            }
        } // three filter values with statusName
        else if (status.length !== 0 && ((ticketCount.length !== 0 && location.length !== 0 && styleOption.length === 0) ||
                (location.length !== 0 && ticketCount.length === 0 && styleOption.length !== 0) ||
                (location.length === 0 && ticketCount.length !== 0 && styleOption.length !== 0))) {
            // var statement;
            console.log('entering into status name two way filter', location, ticketCount, status);
            if (ticketCount.length != 0 && location.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  StatusName IN (:status) AND Tickets IN (:ticket) AND CompanyCode IN (:code)"
            } else if (location.length != 0 && styleOption.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  StatusName IN (:status) AND CompanyCode IN (:code) AND Comments7 IN (:styleOption)"
            } else {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  StatusName IN (:status) AND Tickets IN (:ticket) AND Comments7 IN (:styleOption)"
            }
        } //two filter values with style option
        else if (styleOption.length !== 0 && ((ticketCount.length !== 0 && status.length === 0 && location.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && location.length === 0) ||
                (status.length == 0 && ticketCount.length == 0 && location.length !== 0))) {
            // var statement;
            console.log('entering into style option two way filter', location, ticketCount, status);
            if (ticketCount.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Comments7 IN (:styleOption) AND Tickets IN (:ticket)"
            } else if (status.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Comments7 IN (:styleOption) AND StatusName IN (:status)"
            } else {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Comments7 IN (:styleOption) AND CompanyCode IN (:code)"
            }
        } // three filter values with location
        else if (styleOption.length !== 0 && ((ticketCount.length !== 0 && status.length !== 0 && location.length === 0) ||
                (status.length !== 0 && ticketCount.length === 0 && location.length !== 0) ||
                (status.length === 0 && ticketCount.length !== 0 && location.length !== 0))) {
            // var statement;
            console.log('entering into style option there way filter', location, ticketCount, status);
            if (ticketCount.length != 0 && status.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Comments7 IN (:styleOption) AND Tickets IN (:ticket) AND StatusName IN (:status)"
            } else if (status.length != 0 && location.length != 0) {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Comments7 IN (:styleOption) AND StatusName IN (:status) AND CompanyCode IN (:code)"
            } else {
                whereQuery = "WHERE  CompanyCode = :companyCode AND  Comments7 IN (:styleOption) AND Tickets IN (:ticket) AND CompanyCode IN (:code)"
            }
        } else if (location.length !== 0 && ticketCount.length === 0 && status.length === 0 && styleOption.length === 0) {
            whereQuery = "WHERE  CompanyCode = :companyCode AND  CompanyCode IN (:code)";
        } else if (ticketCount.length !== 0 && location.length === 0 && status.length === 0 && styleOption.length === 0) {
            whereQuery = "WHERE  CompanyCode = :companyCode AND  Tickets IN (:ticket)";
        } else if (status.length !== 0 && ticketCount.length === 0 && location.length === 0 && styleOption.length === 0) {
            whereQuery = "WHERE  CompanyCode = :companyCode AND  StatusName IN (:status)";
        } else if (styleOption.length !== 0 && ticketCount.length === 0 && status.length === 0 && location.length === 0) {
            whereQuery = "WHERE  CompanyCode = :companyCode AND  Comments7 IN (:styleOption)";
        } else {
            // callback([])
            whereQuery = "WHERE CompanyCode = :companyCode"
            console.log('nothing if condition is called')
        }
        var countCompleteQuery = countQuery + " " + whereQuery
        var completeQuery = selectQuery + " " + whereQuery + " " + selectOffsetQuery
        console.log('full of query are ---- ', countCompleteQuery, completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                companyCode: companyCode,
                code: location,
                ticket: ticketCount,
                status: status,
                styleOption: styleOption,
                sortLabel: sortLabel,
                offset: offsetValue,
                fetch: parseInt(pageSize)
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    companyCode: companyCode,
                    code: location,
                    ticket: ticketCount,
                    status: status,
                    styleOption: styleOption,
                    sortLabel: sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (response) {
                console.log('response length are ---- ', response.length);
                if (response.length != 0) {
                    callback({
                        "count": countResponse[0].count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Order", statusCode.error)
                }
            })
        })

    }
}


module.exports.getSalesOrderByStatusName = function (pageNumber, pageSize, sortLabel, sortDirection, search, location,
    ticketCount, status, styleOption, statusName, callback) {
    if (location == undefined) {
        location = []
    }
    if (ticketCount == undefined) {
        ticketCount = []
    }
    if (status == undefined) {
        status = []
    }
    if (styleOption == undefined) {
        styleOption = []
    }
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    console.log('entering into SalesOrder statname  in dao --offsetValues--- ', pageNumber, pageSize, offsetValue);
    if (search === '' && (location.length === 0 && ticketCount.length === 0 && status.length === 0 && styleOption.length === 0)) {
        console.log('!!!! entering into if part')
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })
    } else if (search !== '') {
        console.log("@#@#@## entering into else part ")
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                $or: [{
                        'OrderNumber': {
                            like: '%' + search + '%'
                        }
                    },
                    //{ '$Comment.body$': { like: '%' + search + '%' } }
                    {
                        'CompanyCode': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'PONumber': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'OrderDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'RequiredDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ForecastFinish': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'Tickets': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StatusName': {
                            like: '%' + search + '%'
                        }
                    }
                ]
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                where: {
                    StatusName: statusName,
                    $or: [{
                            'OrderNumber': {
                                like: '%' + search + '%'
                            }
                        },
                        //{ '$Comment.body$': { like: '%' + search + '%' } }
                        {
                            'CompanyCode': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'PONumber': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'OrderDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'RequiredDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'ForecastFinish': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'Tickets': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StatusName': {
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
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]

            }).then(function (response) {
                callback({
                    "count": count,
                    "response": response
                }, statusCode.ok)
            }).catch(function (error) {
                console.log('search find all error are --- ', error);
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            console.log('search count error are --- ', error);
            callback(error, statusCode.error)
        })
    } else if (location.length !== 0 && ticketCount.length !== 0 && status.length !== 0) {
        console.log('entering into all filter value a----- ', location, ticketCount, status);
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                $and: {
                    CompanyCode: {
                        $in: [location]
                    },
                    Tickets: {
                        $in: [ticketCount]
                    },
                    StatusName: {
                        $in: [status]
                    }
                }
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    $and: {
                        CompanyCode: {
                            $in: [location]
                        },
                        Tickets: {
                            $in: [ticketCount]
                        },
                        StatusName: {
                            $in: [status]
                        }
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('all filter with companycode count --- ', count);
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count --- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            console.log('error in count --- ', error)
            callback(error, statusCode.error)
        })
    } else if (location.length !== 0 && ((ticketCount.length !== 0 && status.length === 0) || (status.length !== 0 && ticketCount.length === 0))) {
        // var statement;
        console.log('entering into location filter', location, ticketCount, status);
        if (ticketCount.length !== 0) {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        $and: {
                            CompanyCode: {
                                $in: [location]
                            },
                            Tickets: {
                                $in: [ticketCount]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('location ticket count filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            $and: {
                                StatusName: statusName,
                                CompanyCode: {
                                    $in: [location]
                                },
                                Tickets: {
                                    $in: [ticketCount]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value location filter values SSSS  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        } else {
            console.log('entering into else part')
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        $and: {
                            CompanyCode: {
                                $in: [location]
                            },
                            StatusName: {
                                $in: [status]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            $and: {
                                StatusName: statusName,
                                CompanyCode: {
                                    $in: [location]
                                },
                                StatusName: {
                                    $in: [status]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value location filter values SSSS  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
            // statement = '$and: { StyleNumber: { $in: [location] }, GarmentSize: { $in: [status] } }';
        }
    } else if (ticketCount.length !== 0 && ((location.length !== 0 && status.length === 0) || (status.length !== 0 && location.length === 0))) {
        console.log('entering into ticketCount filter values CCCCC ----- ', location, ticketCount, status);
        if (location.length !== 0) {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        $and: {
                            Tickets: {
                                $in: [ticketCount]
                            },
                            CompanyCode: {
                                $in: [location]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            $and: {
                                Tickets: {
                                    $in: [ticketCount]
                                },
                                CompanyCode: {
                                    $in: [location]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values CCCCC  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    console.log('error in count =---- ', error);
                    callback(error, statusCode.error);
                })
        } else {
            console.log('entering into else part ')
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        $and: {
                            Tickets: {
                                $in: [ticketCount]
                            },
                            StatusName: {
                                $in: [status]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            $and: {
                                Tickets: {
                                    $in: [ticketCount]
                                },
                                StatusName: {
                                    $in: [status]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values CCCCC  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    console.log('error in count =---- ', error);

                    callback(error, statusCode.error);
                })
        }
    } else if (status.length !== 0 && ((location.length === 0 && ticketCount.length !== 0) || (location.length !== 0 && ticketCount.length === 0))) {
        console.log('entering into status filter values SSSSize ----- ', location, ticketCount, status);
        if (location.length !== 0) {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        $and: {
                            StatusName: {
                                $in: [status]
                            },
                            CompanyCode: {
                                $in: [location]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            $and: {
                                StatusName: {
                                    $in: [status]
                                },
                                CompanyCode: {
                                    $in: [location]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values statuseeee  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        } else {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        $and: {
                            StatusName: {
                                $in: [status]
                            },
                            Tickets: {
                                $in: [ticketCount]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            $and: {
                                StatusName: {
                                    $in: [status]
                                },
                                Tickets: {
                                    $in: [ticketCount]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values statuseeee  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        }
    } else if (location.length !== 0 && ticketCount.length === 0 && status.length === 0) {
        console.log('~~~~ entering into location option in SalesOrder dao  ', location);
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                CompanyCode: {
                    $in: [location]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    CompanyCode: {
                        $in: [location]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else if (ticketCount.length !== 0 && location.length === 0 && status.length === 0) {
        console.log('~~~~ entering into ticketCount option in SalesOrder dao  ', ticketCount);
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                Tickets: {
                    $in: [ticketCount]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    Tickets: {
                        $in: [ticketCount]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else if (status.length !== 0 && location.length === 0 && ticketCount.length === 0) {
        console.log('~~~~ entering into status option in SalesOrder dao  ', status);
        models.SalesOrder.count({
            StatusName: statusName,
            where: {
                StatusName: {
                    $in: [status]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    StatusName: {
                        $in: [status]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else {
        callback([], statusCode.no_content)
        console.log('nothing if condition is called')
    }

}



module.exports.getSalesOrderByStatusNameCompanyCode = function (pageNumber, pageSize, sortLabel, sortDirection, search, location,
    ticketCount, status, styleOption, statusName, companyCode, callback) {
    if (location == undefined) {
        location = []
    }
    if (ticketCount == undefined) {
        ticketCount = []
    }
    if (status == undefined) {
        status = []
    }
    if (styleOption == undefined) {
        styleOption = []
    }
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    console.log('entering into SalesOrder statname companycode in dao --offsetValues--- ', pageNumber, pageSize, offsetValue);
    if (search === '' && (location.length === 0 && ticketCount.length === 0 && status.length === 0 && styleOption.length === 0)) {
        console.log('!!!! entering into if part')
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                CompanyCode: companyCode
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    CompanyCode: companyCode
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })
    } else if (search !== '') {
        console.log("@#@#@## entering into else part ")
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                CompanyCode: companyCode,
                $or: [{
                        'OrderNumber': {
                            like: '%' + search + '%'
                        }
                    },
                    //{ '$Comment.body$': { like: '%' + search + '%' } }
                    {
                        'CompanyCode': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'PONumber': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'OrderDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'RequiredDate': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'ForecastFinish': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'Tickets': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StatusName': {
                            like: '%' + search + '%'
                        }
                    }
                ]
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                where: {
                    StatusName: statusName,
                    CompanyCode: companyCode,
                    $or: [{
                            'OrderNumber': {
                                like: '%' + search + '%'
                            }
                        },
                        //{ '$Comment.body$': { like: '%' + search + '%' } }
                        {
                            'CompanyCode': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'PONumber': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'OrderDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'RequiredDate': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'ForecastFinish': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'Tickets': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StatusName': {
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
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]

            }).then(function (response) {
                callback({
                    "count": count,
                    "response": response
                }, statusCode.ok)
            }).catch(function (error) {
                console.log('search find all error are --- ', error);
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            console.log('search count error are --- ', error);
            callback(error, statusCode.error)
        })
    } else if (location.length !== 0 && ticketCount.length !== 0 && status.length !== 0) {
        console.log('entering into all filter value a----- ', location, ticketCount, status);
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                CompanyCode: companyCode,
                $and: {
                    CompanyCode: {
                        $in: [location]
                    },
                    Tickets: {
                        $in: [ticketCount]
                    },
                    StatusName: {
                        $in: [status]
                    }
                }
            }
        }).then(function (count) {
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    CompanyCode: companyCode,
                    $and: {
                        CompanyCode: {
                            $in: [location]
                        },
                        Tickets: {
                            $in: [ticketCount]
                        },
                        StatusName: {
                            $in: [status]
                        }
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('all filter with companycode count --- ', count);
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count --- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            console.log('error in count --- ', error)
            callback(error, statusCode.error)
        })
    } else if (location.length !== 0 && ((ticketCount.length !== 0 && status.length === 0) || (status.length !== 0 && ticketCount.length === 0))) {
        // var statement;
        console.log('entering into location filter', location, ticketCount, status);
        if (ticketCount.length !== 0) {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        CompanyCode: companyCode,
                        $and: {
                            CompanyCode: {
                                $in: [location]
                            },
                            Tickets: {
                                $in: [ticketCount]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('location ticket count filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            $and: {
                                StatusName: statusName,
                                CompanyCode: companyCode,
                                CompanyCode: {
                                    $in: [location]
                                },
                                Tickets: {
                                    $in: [ticketCount]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value location filter values SSSS  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        } else {
            console.log('entering into else part')
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        CompanyCode: companyCode,
                        $and: {
                            CompanyCode: {
                                $in: [location]
                            },
                            StatusName: {
                                $in: [status]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            $and: {
                                StatusName: statusName,
                                CompanyCode: companyCode,
                                CompanyCode: {
                                    $in: [location]
                                },
                                StatusName: {
                                    $in: [status]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value location filter values SSSS  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
            // statement = '$and: { StyleNumber: { $in: [location] }, GarmentSize: { $in: [status] } }';
        }
    } else if (ticketCount.length !== 0 && ((location.length !== 0 && status.length === 0) || (status.length !== 0 && location.length === 0))) {
        console.log('entering into ticketCount filter values CCCCC ----- ', location, ticketCount, status);
        if (location.length !== 0) {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        CompanyCode: companyCode,
                        $and: {
                            Tickets: {
                                $in: [ticketCount]
                            },
                            CompanyCode: {
                                $in: [location]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            CompanyCode: companyCode,
                            $and: {
                                Tickets: {
                                    $in: [ticketCount]
                                },
                                CompanyCode: {
                                    $in: [location]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values CCCCC  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    console.log('error in count =---- ', error);
                    callback(error, statusCode.error);
                })
        } else {
            console.log('entering into else part ')
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        CompanyCode: companyCode,
                        $and: {
                            Tickets: {
                                $in: [ticketCount]
                            },
                            StatusName: {
                                $in: [status]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            CompanyCode: companyCode,
                            $and: {
                                Tickets: {
                                    $in: [ticketCount]
                                },
                                StatusName: {
                                    $in: [status]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values CCCCC  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    console.log('error in count =---- ', error);

                    callback(error, statusCode.error);
                })
        }
    } else if (status.length !== 0 && ((location.length === 0 && ticketCount.length !== 0) || (location.length !== 0 && ticketCount.length === 0))) {
        console.log('entering into status filter values SSSSize ----- ', location, ticketCount, status);
        if (location.length !== 0) {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        CompanyCode: companyCode,
                        $and: {
                            StatusName: {
                                $in: [status]
                            },
                            CompanyCode: {
                                $in: [location]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            CompanyCode: companyCode,
                            $and: {
                                StatusName: {
                                    $in: [status]
                                },
                                CompanyCode: {
                                    $in: [location]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values statuseeee  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.error)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        } else {
            models.SalesOrder.count({
                    where: {
                        StatusName: statusName,
                        CompanyCode: companyCode,
                        $and: {
                            StatusName: {
                                $in: [status]
                            },
                            Tickets: {
                                $in: [ticketCount]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.SalesOrder.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: statusName,
                            CompanyCode: companyCode,
                            $and: {
                                StatusName: {
                                    $in: [status]
                                },
                                Tickets: {
                                    $in: [ticketCount]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.SalesOrderItems,
                            attributes: ['StyleOption']
                        }]
                    }).then(function (response) {
                        console.log('response value ticketCount filter values statuseeee  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no SalesOrder", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        }
    } else if (location.length !== 0 && ticketCount.length === 0 && status.length === 0) {
        console.log('~~~~ entering into location option in SalesOrder dao  ', location);
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                CompanyCode: companyCode,
                CompanyCode: {
                    $in: [location]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    CompanyCode: companyCode,
                    CompanyCode: {
                        $in: [location]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else if (ticketCount.length !== 0 && location.length === 0 && status.length === 0) {
        console.log('~~~~ entering into ticketCount option in SalesOrder dao  ', ticketCount);
        models.SalesOrder.count({
            where: {
                StatusName: statusName,
                CompanyCode: companyCode,
                Tickets: {
                    $in: [ticketCount]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    CompanyCode: companyCode,
                    Tickets: {
                        $in: [ticketCount]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder")
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else if (status.length !== 0 && location.length === 0 && ticketCount.length === 0) {
        console.log('~~~~ entering into status option in SalesOrder dao  ', status);
        models.SalesOrder.count({
            StatusName: statusName,
            CompanyCode: companyCode,
            where: {
                StatusName: {
                    $in: [status]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.SalesOrder.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: statusName,
                    CompanyCode: companyCode,
                    StatusName: {
                        $in: [status]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.SalesOrderItems,
                    attributes: ['StyleOption']
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no SalesOrder", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else {
        callback([], statusCode.no_content)
        console.log('nothing if condition is called')
    }

}