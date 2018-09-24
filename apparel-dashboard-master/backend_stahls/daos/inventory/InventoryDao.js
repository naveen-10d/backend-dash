var models = require("../../models")
var Sequelize = require('sequelize');
var confi = require('../../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);
var statusCode = require('../../config/status');


module.exports.createinventory = function (InventoryDetails, callback) {
    models.FinishedGoods.create(InventoryDetails).then(function (response) {
        console.log("i am in dao  in", InventoryDetails)
        callback(response, statusCode.created)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getallinventories = function (callback) {
    console.log("i am in dao  in", models.Inventory);
    models.FinishedGoods.findAll({
        order: [
            ['StyleNumber', 'DESC']
        ],
        include: [{
            model: models.FinishedGoodsAdjustment
        }]
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no Inventory", statusCode.no_content)
        }
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}


module.exports.getDataCount = function (callback) {
    models.FinishedGoods.count().then(function (response) {
        callback(response, statusCode.ok);
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

//get inventory by date range
module.exports.getInventoryByDateRange = function (startDate, endDate, callback) {
    sequelize.query("SELECT * from FinishedGoods WHERE CONVERT(DATE,DataExportDate) \
     BETWEEN $startDate AND $endDate", {
            bind: {
                startDate: startDate,
                endDate: endDate
            },
            type: sequelize.QueryTypes.SELECT
        })
        .then(function (response) {
            callback(response, statusCode.ok)
        }).catch(function (error) {
            callback(error, statusCode.error)
        })
}

// export all inventory 
module.exports.exportAllInventory = function (callback) {
    // console.log('entering into expot all inventory by code ', style);
    models.FinishedGoods.findAll({}).then(function (response) {
        // callback(response);
        if (response.length != 0) {
            callback(response, statusCode.ok);
        } else {
            callback([], statusCode.no_content);
        }
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

//export all inventory by code
module.exports.exportAllInventoryByCode = function (code, style, callback) {
    console.log('entering into expot all inventory by code ');

    models.FinishedGoods.findAll({
        where: {
            CompanyCode: code,
            StyleNumber: style
        }
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
module.exports.getselectedfiltervalue = function (filterData, callback) {
    var filterArr = []

    filterData.forEach(element => {
        if (element.value !== null && element.value[0] !== undefined) {
            filterArr.push(element)
        }
    });

    if (filterArr.length == 1) {

        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
        GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value: filterArr[0].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
            GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value: filterArr[0].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
            GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value: filterArr[0].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                                GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value: filterArr[0].value
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
                        }
                        callback(filterData, statusCode.ok);
                    })
                })
            })
        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    } else if (filterArr.length == 2) {
        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
        GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)  \
            GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)  \
            GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                                GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
                        }
                        callback(filterData, statusCode.ok);
                    })
                })
            })
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
    } else if (filterArr.length == 3) {
        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
        AND " + filterArr[2].filter + " IN (:value3) GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                value3: filterArr[2].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                AND " + filterArr[2].filter + " IN (:value3) GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    value3: filterArr[2].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)\
                        AND " + filterArr[2].filter + " IN (:value3) GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        value3: filterArr[2].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)\
                                AND " + filterArr[2].filter + " IN (:value3) GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            value3: filterArr[2].value
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
                        }
                        callback(filterData, statusCode.ok);
                    })
                })
            })
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
    } else if (filterArr.length == 4) {
        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)\
        AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                value3: filterArr[2].value,
                value4: filterArr[3].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    value3: filterArr[2].value,
                    value4: filterArr[3].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                        AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        value3: filterArr[2].value,
                        value4: filterArr[3].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                                AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            value3: filterArr[2].value,
                            value4: filterArr[3].value
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
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


module.exports.getselectedfiltervaluebycode = function (companyCode, filterData, callback) {
    var filterArr = []

    filterData.forEach(element => {
        if (element.value !== null && element.value[0] !== undefined) {
            filterArr.push(element)
        }
    });

    if (filterArr.length == 1) {

        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
        AND CompanyCode = :companyCode GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value: filterArr[0].value,
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                AND CompanyCode = :companyCode GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value: filterArr[0].value,
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                        AND CompanyCode = :companyCode GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value: filterArr[0].value,
                        companyCode: companyCode
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value) \
                                AND CompanyCode = :companyCode GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value: filterArr[0].value,
                            companyCode: companyCode
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
                        }
                        callback(filterData, statusCode.ok);
                    })
                })
            })
        }).catch(function (error) {
            callback(error, statusCode.error);
        })

    } else if (filterArr.length == 2) {
        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
        AND CompanyCode = :companyCode GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)  \
                AND CompanyCode = :companyCode GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)  \
                        AND CompanyCode = :companyCode GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        companyCode: companyCode
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                                AND CompanyCode = :companyCode GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            companyCode: companyCode
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
                        }
                        callback(filterData, statusCode.ok);
                    })
                })
            })
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
    } else if (filterArr.length == 3) {
        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
        AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                value3: filterArr[2].value,
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    value3: filterArr[2].value,
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)\
                        AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        value3: filterArr[2].value,
                        companyCode: companyCode
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)\
                                AND " + filterArr[2].filter + " IN (:value3) AND CompanyCode = :companyCode GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            value3: filterArr[2].value,
                            companyCode: companyCode
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
                        }
                        callback(filterData, statusCode.ok);
                    })
                })
            })
        }).catch(function (error) {
            callback(error, statusCode.error);
        })
    } else if (filterArr.length == 4) {
        sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE  CompanyCode NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2)\
        AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
            replacements: {
                value1: filterArr[0].value,
                value2: filterArr[1].value,
                value3: filterArr[2].value,
                value4: filterArr[3].value
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data1) {
            sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE  StyleNumber NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
                replacements: {
                    value1: filterArr[0].value,
                    value2: filterArr[1].value,
                    value3: filterArr[2].value,
                    value4: filterArr[3].value
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data2) {
                sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE  StyleColor NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                        AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
                    replacements: {
                        value1: filterArr[0].value,
                        value2: filterArr[1].value,
                        value3: filterArr[2].value,
                        value4: filterArr[3].value
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data3) {
                    sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE  GarmentSize NOT IN ('') AND " + filterArr[0].filter + " IN (:value1) AND " + filterArr[1].filter + " IN (:value2) \
                                AND " + filterArr[2].filter + " IN (:value3) AND " + filterArr[3].filter + " IN(:value4) GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                        replacements: {
                            value1: filterArr[0].value,
                            value2: filterArr[1].value,
                            value3: filterArr[2].value,
                            value4: filterArr[3].value
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (data4) {
                        var filterData = {
                            "code": data1,
                            "style": data2,
                            "color": data3,
                            "size": data4
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

//get inventory filter values without companycode
module.exports.getInventryFilterValue = function (callback) {
    sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods WHERE StatusName = 'Active' AND StyleNumber NOT IN ('') \
    GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC", {
        type: sequelize.QueryTypes.SELECT
    }).then(function (data1) {


        sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods WHERE StatusName = 'Active' AND StyleColor NOT IN ('') \
            GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
            type: sequelize.QueryTypes.SELECT
        }).then(function (data2) {

            sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods WHERE StatusName = 'Active' AND GarmentSize NOT IN ('') \
                    GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                type: sequelize.QueryTypes.SELECT
            }).then(function (data3) {

                sequelize.query("SELECT CompanyCode, COUNT(*) From FinishedGoods WHERE StatusName = 'Active' AND CompanyCode NOT IN ('') \
                            GROUP BY CompanyCode HAVING COUNT(*) >= 1 ORDER BY CompanyCode DESC;", {
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data4) {
                    var filterData = {
                        "style": data1,
                        "color": data2,
                        "size": data3,
                        "code": data4
                    }
                    callback(filterData, statusCode.ok);
                })
            })

        })

    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

//get inventory filter values with companycode
module.exports.getInventoryFilterValueByCompanyCode = function (companyCode, callback) {
    sequelize.query("SELECT StyleNumber, COUNT(*) From FinishedGoods where StatusName = 'Active' AND CompanyCode = $companyCode AND StyleNumber NOT IN ('') \
    GROUP BY StyleNumber HAVING COUNT(*) >= 1 ORDER BY StyleNumber DESC;", {
        bind: {
            companyCode: companyCode
        },
        type: sequelize.QueryTypes.SELECT
    }).then(function (data1) {


        sequelize.query("SELECT StyleColor, COUNT(*) From FinishedGoods where StatusName = 'Active' AND CompanyCode = $companyCode AND StyleColor NOT IN ('') \
            GROUP BY StyleColor HAVING COUNT(*) >= 1 ORDER BY StyleColor DESC;", {
            bind: {
                companyCode: companyCode
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (data2) {

            sequelize.query("SELECT GarmentSize, COUNT(*) From FinishedGoods where StatusName = 'Active' AND CompanyCode = $companyCode AND GarmentSize NOT IN ('')  \
                    GROUP BY GarmentSize HAVING COUNT(*) >= 1 ORDER BY GarmentSize DESC;", {
                bind: {
                    companyCode: companyCode
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (data3) {
                var filterData = {
                    "style": data1,
                    "color": data2,
                    "size": data3
                }
                callback(filterData, statusCode.ok);
            })


        })

    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}



//get inventory by active status
module.exports.getinventorybyActiveStatus = function (pageNumber, pageSize, sortLabel,
    sortDirection, search, style, color, size, code, callback) {
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    // var selectQuery = "SELECT * FROM FinishedGoods";
    // var offsetQuery = "ORDER BY :sortLabel :sortDirection OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    // var completeQuery = '',
    //     whereQuery = '';
    var selectQuery = "SELECT * FROM FinishedGoods";
    var countQuery = "SELECT COUNT(*)N'count' FROM FinishedGoods";
    var selectOffsetQuery;
    var others = true;
    if (sortDirection == 'asc') {
        selectOffsetQuery = "ORDER BY :sortLabel ASC OFFSET :offset ROWS FETCH NEXT :fetch ROWS ONLY";
    } else {
        selectOffsetQuery = "ORDER BY :sortLabel DESC OFFSET :offset ROWS FETCH NEXT :fetch ROWS ONLY";
    }
    var completeQuery = '',
        whereQuery = '',
        countCompleteQuery = '';

    console.log('entering into inventory active data in dao --offsetValues--- ', pageNumber, pageSize, offsetValue, code);
    if (search !== '') {
        console.log("@#@#@## entering into else part ")
        models.FinishedGoods.count({
            where: {
                StatusName: 'Active',
                $or: [{
                        'StyleNumber': {
                            like: '%' + search + '%'
                        }
                    },
                    //{ '$Comment.body$': { like: '%' + search + '%' } }
                    {
                        'StyleColor': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'GarmentSize': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StyleOption': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StyleName': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantityOnHand': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantityAllocated': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'AdjustedQuantityOnHand': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantitySeconds': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantityThirds': {
                            like: '%' + search + '%'
                        }
                    }
                ]
            }
        }).then(function (count) {
            models.FinishedGoods.findAll({
                where: {
                    StatusName: 'Active',
                    $or: [{
                            'StyleNumber': {
                                like: '%' + search + '%'
                            }
                        },
                        //{ '$Comment.body$': { like: '%' + search + '%' } }
                        {
                            'StyleColor': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'GarmentSize': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StyleOption': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StyleName': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantityOnHand': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantityAllocated': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'AdjustedQuantityOnHand': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantitySeconds': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantityThirds': {
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
                    model: models.FinishedGoodsAdjustment
                }]

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
        if (style.length !== 0 && color.length !== 0 && size.length !== 0 && code.length !== 0) {
            console.log('entering into all filter values true ----- ', style, color, size, code);
            whereQuery = " WHERE StatusName = :statusName AND CompanyCode IN (:code) AND StyleNumber IN (:style) AND StyleColor IN (:color) AND GarmentSize IN (:size)"
        } // two filter values comparison of styleNumber
        else if (style.length !== 0 && ((color.length === 0 && size.length !== 0 && code.length == 0) ||
                (color.length !== 0 && code.length == 0 && size.length === 0) ||
                (color.length == 0 && code.length != 0 && size.length === 0))) {
            console.log('entering into style number two filter values', code, style, color, size)
            if (code.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleNumber IN (:style) AND CompanyCode IN (:code)"
            } else if (color.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleNumber in (:style) AND StyleColor IN (:color)"
            } else if (size.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleNumber in (:style) AND GarmentSize IN (:size)"
            }

        } // three filter values comparison of styleNumber
        else if (style.length !== 0 && ((color.length === 0 && size.length !== 0 && code.length != 0) ||
                (color.length !== 0 && code.length !== 0 && size.length === 0) ||
                (color.length != 0 && code.length == 0 && size.length != 0))) {
            console.log('entering into style number three filter values ', code, style, color, size);
            if (code.length !== 0 && color.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND (CompanyCode IN (:code) AND StyleNumber in (:style) AND StyleColor IN (:color))"
            } else if (code.length !== 0 && size.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND StyleNumber in (:style) AND GarmentSize IN (:size)"
            } else if (color.length !== 0 && size.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleNumber in (:style) AND StyleColor IN (:color) AND GarmentSize IN (:size)"
            }
        }
        // two filter values comparison of style color
        else if (color.length !== 0 && ((style.length === 0 && size.length !== 0 && code.length == 0) ||
                (style.length !== 0 && code.length == 0 && size.length === 0) ||
                (style.length == 0 && code.length != 0 && size.length === 0))) {
            console.log('entering into style color two filter values', code, style, color, size);
            if (code.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleColor IN (:color) AND CompanyCode IN (:code)"
            } else if (style.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleColor IN (:color) AND StyleNumber IN (:style)"
            } else if (size.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleColor IN (:color) AND GarmentSize IN (:size)"
            }

        } // three filter values comparison of style color
        else if (color.length !== 0 && ((style.length === 0 && size.length !== 0 && code.length != 0) ||
                (style.length !== 0 && code.length !== 0 && size.length === 0) ||
                (style.length != 0 && code.length == 0 && size.length != 0))) {
            console.log('entering into style color three filter values ', code, style, color, size);
            if (code.length !== 0 && style.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND (CompanyCode IN (:code) AND StyleColor IN (:color) AND StyleNumber IN (:style))"
            } else if (code.length !== 0 && size.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND StyleColor IN (:color) AND GarmentSize IN (:size)"
            } else if (style.length !== 0 && size.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND StyleColor IN (:color) AND StyleNumber IN (:style) AND GarmentSize IN (:size)"
            }
        } // two filter values comparison of Garment size
        else if (size.length !== 0 && ((color.length === 0 && style.length !== 0 && code.length == 0) ||
                (color.length !== 0 && code.length == 0 && style.length === 0) ||
                (color.length == 0 && code.length != 0 && style.length === 0))) {
            console.log('entering into garment size two filter values', code, style, color, size);
            if (code.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND GarmentSize IN (:size) AND CompanyCode IN (:code)"
            } else if (color.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND GarmentSize IN (:size) AND StyleColor IN (:color)"
            } else if (style.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND GarmentSize IN (:size) AND StyleNumber IN (:style)"
            }

        } // three filter values comparison of Garment size
        else if (size.length !== 0 && ((color.length === 0 && style.length !== 0 && code.length != 0) ||
                (color.length !== 0 && code.length !== 0 && style.length === 0) ||
                (color.length != 0 && code.length == 0 && style.length != 0))) {
            console.log('entering into garment size three filter values ', code, style, color, size);
            if (code.length !== 0 && color.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND (CompanyCode IN (:code) AND GarmentSize IN (:size) AND StyleColor IN (:color))"
            } else if (code.length !== 0 && style.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND GarmentSize IN (:size) AND StyleNumber IN (:style)"
            } else if (color.length !== 0 && style.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND GarmentSize IN (:size) AND StyleColor IN (:color) AND StyleNumber IN (:style)"
            }
        }
        // two filter values comparison of code
        else if (code.length !== 0 && ((color.length === 0 && size.length !== 0 && style.length == 0) ||
                (color.length !== 0 && style.length == 0 && size.length === 0) ||
                (color.length == 0 && style.length != 0 && size.length === 0))) {
            console.log('entering into code two filter values', code, style, color, size);
            if (style.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND StyleNumber IN (:style)"
            } else if (color.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND StyleColor IN (:color)"
            } else if (size.length != 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND GarmentSize IN (:size)"
            }

        } // three filter values comparison of code
        else if (code.length !== 0 && ((color.length === 0 && size.length !== 0 && style.length != 0) ||
                (color.length !== 0 && style.length !== 0 && size.length === 0) ||
                (color.length != 0 && style.length == 0 && size.length != 0))) {
            console.log('entering into code three filter values ', code, style, color, size);
            if (style.length !== 0 && color.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND (CompanyCode IN (:code) AND StyleNumber in (:style) AND StyleColor IN (:color))"
            } else if (style.length !== 0 && size.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND StyleNumber in (:style) AND GarmentSize IN (:size)"
            } else if (color.length !== 0 && size.length !== 0) {
                whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code) AND StyleColor IN (:color) AND GarmentSize IN (:size)"
            }


        } //style number single filter
        else if (style.length !== 0 && color.length === 0 && size.length === 0 && code.length === 0) {
            console.log('entering into style number single filter ', code, style, color, size);
            whereQuery = "WHERE StatusName = :statusName AND StyleNumber IN (:style)"
        } //style color single filter
        else if (color.length !== 0 && style.length === 0 && size.length === 0 && code.length === 0) {
            console.log('entering into style color single filter ', code, style, color, size);
            whereQuery = "WHERE StatusName = :statusName AND StyleColor IN (:color)"
        } // Garment size single filter
        else if (size.length !== 0 && color.length === 0 && style.length === 0 && code.length === 0) {
            console.log('entering into garment size single filter ', code, style, color, size);
            whereQuery = "WHERE StatusName = :statusName AND GarmentSize IN (:size)"
        } // code single filter
        else if (code.length !== 0 && color.length === 0 && size.length === 0 && style.length === 0) {
            console.log('entering into style number single filter ', code, style, color, size);
            whereQuery = "WHERE StatusName = :statusName AND CompanyCode IN (:code)"
        } else {
            console.log('nothing if condition is called')
        }
        var countCompleteQuery = countQuery + " " + whereQuery
        var completeQuery = selectQuery + " " + whereQuery + " " + selectOffsetQuery
        console.log('full of query are ---- ', countCompleteQuery, completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                code: code,
                style: style,
                color: color,
                size: size,
                statusName: 'Active'
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    code: code,
                    style: style,
                    color: color,
                    size: size,
                    statusName: 'Active',
                    sortLabel: sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (FinishedGoodsUuid) {
                // console.log('FinishedGoodsUuid length are ---- ', FinishedGoodsUuid);
                var uuid = [];
                if (FinishedGoodsUuid.length > 0) {
                    FinishedGoodsUuid.forEach(element => {
                        uuid.push(element.uuid);
                    })
                } else {
                    uuid.push('');
                }
                // find all finishedGoods including FinishedGoodsAdjustment based on Uuid 
                models.FinishedGoods.findAll({
                    where: {
                        uuid: {
                            $in: [uuid]
                        }
                    },
                    include: [{
                        model: models.FinishedGoodsAdjustment
                    }]
                }).then(function (response) {
                    if (response.length != 0) {
                        // callback(response)
                        callback({
                            "count": countResponse[0].count,
                            "response": response
                        }, statusCode.ok);
                    } else {
                        callback("There is no Inventory", statusCode.no_content)
                    }
                    // console.log("after get all ticket in dao --- ", response);
                }).catch(function (error) {
                    console.log("after get all ticket in dao error ---- ", error);
                    callback(error, statusCode.error)
                })
                // if (response.length != 0) {
                //     callback({
                //         "count": countResponse[0].count,
                //         "response": response
                //     });
                // } else {
                //     callback("There is no Inventory")
                // }
            })
        })

    }

}


// //get inventory by active status
// module.exports.getinventorybyActiveStatus = function (pageNumber, pageSize, sortLabel,
//     sortDirection, search, style, color, size, code, callback) {
//     var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
//     var selectQuery = "SELECT * FROM FinishedGoods";
//     var offsetQuery = "ORDER BY :sortLabel :sortDirection OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
//     var completeQuery = '',
//         whereQuery = '';
//     console.log('entering into inventory active data in dao --offsetValues--- ', pageNumber, pageSize, offsetValue, code);
//     if (search === '' && (style.length === 0 && color.length === 0 && size.length === 0 && code.length === 0)) {
//         console.log('!!!! entering into if part')
//         models.FinishedGoods.count({
//             where: {
//                 StatusName: 'Active'
//             }
//         }).then(function (count) {
//             models.FinishedGoods.findAll({
//                 offset: offsetValue,
//                 limit: parseInt(pageSize),
//                 where: {
//                     StatusName: 'Active'
//                 },
//                 order: [
//                     [sortLabel, sortDirection]
//                 ],
//                 include: [{
//                     model: models.FinishedGoodsAdjustment
//                 }]
//             }).then(function (response) {
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             }).catch(function (error) {
//                 callback(error)
//             })
//         }).catch(function (error) {
//             callback(error)
//         })
//     } else if (search !== '') {
//         console.log("@#@#@## entering into else part ")
//         models.FinishedGoods.count({
//             where: {
//                 StatusName: 'Active',
//                 $or: [{
//                         'StyleNumber': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     //{ '$Comment.body$': { like: '%' + search + '%' } }
//                     {
//                         'StyleColor': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'GarmentSize': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'StyleOption': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'StyleName': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'QuantityOnHand': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'QuantityAllocated': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'AdjustedQuantityOnHand': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'QuantitySeconds': {
//                             like: '%' + search + '%'
//                         }
//                     },
//                     {
//                         'QuantityThirds': {
//                             like: '%' + search + '%'
//                         }
//                     }
//                 ]
//             }
//         }).then(function (count) {
//             models.FinishedGoods.findAll({
//                 where: {
//                     StatusName: 'Active',
//                     $or: [{
//                             'StyleNumber': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         //{ '$Comment.body$': { like: '%' + search + '%' } }
//                         {
//                             'StyleColor': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'GarmentSize': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'StyleOption': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'StyleName': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'QuantityOnHand': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'QuantityAllocated': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'AdjustedQuantityOnHand': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'QuantitySeconds': {
//                                 like: '%' + search + '%'
//                             }
//                         },
//                         {
//                             'QuantityThirds': {
//                                 like: '%' + search + '%'
//                             }
//                         }
//                     ]
//                 },
//                 offset: offsetValue,
//                 limit: parseInt(pageSize),
//                 order: [
//                     [sortLabel, sortDirection]
//                 ],
//                 include: [{
//                     model: models.FinishedGoodsAdjustment
//                 }]

//             }).then(function (response) {
//                 callback({
//                     "count": count,
//                     "response": response
//                 })
//             }).catch(function (error) {
//                 callback(error)
//             })
//         }).catch(function (error) {
//             callback(error)
//         })
//     } else if (style.length !== 0 && color.length !== 0 && size.length !== 0 && code.length !== 0) {
//         console.log('entering into all filter values true ----- ', style, color, size, code);
//         // models.FinishedGoods.count({
//         //         where: {
//         //             StatusName: 'Active',
//         //             $and: {
//         //                 StyleNumber: {
//         //                     $in: [style]
//         //                 },
//         //                 StyleColor: {
//         //                     $in: [color]
//         //                 },
//         //                 GarmentSize: {
//         //                     $in: [size]
//         //                 },
//         //                 CompanyCode: {
//         //                     $in: [code]
//         //                 }
//         //             }
//         //         }
//         //     })
//         //     .then(function (count) {
//         //         console.log('all filter values count are ---- ', count);
//         //         models.FinishedGoods.findAll({
//         //             offset: offsetValue,
//         //             limit: parseInt(pageSize),
//         //             where: {
//         //                 StatusName: 'Active',
//         //                 $and: {
//         //                     StyleNumber: {
//         //                         $in: [style]
//         //                     },
//         //                     StyleColor: {
//         //                         $in: [color]
//         //                     },
//         //                     GarmentSize: {
//         //                         $in: [size]
//         //                     },
//         //                     CompanyCode: {
//         //                         $in: [code]
//         //                     }
//         //                 }
//         //             },
//         //             order: [
//         //                 [sortLabel, sortDirection]
//         //             ],
//         //             include: [{
//         //                 model: models.FinishedGoodsAdjustment
//         //             }]
//         //         }).then(function (response) {
//         //             console.log('response value of all filter valeus are  -- ', response.length)
//         //             if (response.length != 0) {
//         //                 callback({
//         //                     "count": count,
//         //                     "response": response
//         //                 });
//         //             } else {
//         //                 callback("There is no Inventory")
//         //             }
//         //         }).catch(function (error) {
//         //             console.log('error in count ---- ', error)
//         //             callback(error)
//         //         })
//         //     }).catch(function (error) {
//         //         callback(error);
//         //     })
//         sequelize.query("SELECT COUNT(*) FROM FinishedGoods WHERE CompanyCode IN (:code) AND \
//          StyleNumber in (:style) \
//          AND StyleColor IN (:color) \
//          AND GarmentSize IN (:size) \
//          ORDER BY :sortLabel :sortDirection \
//          OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY ", {
//             replacements: {
//                 code: code,
//                 style: style,
//                 color: color,
//                 size: size,
//                 sortLabel: sortLabel,
//                 sortDirection: sortDirection,
//                 offset: offsetValue,
//                 fetch: parseInt(pageSize)
//             },
//             type: sequelize.QueryTypes.SELECT
//         }).then(function (count) {
//             console.log("all filter count values are ------- ", count);
//             sequelize.query("SELECT * FROM FinishedGoods WHERE CompanyCode IN (:code) AND \
//          StyleNumber in (:style) \
//          AND StyleColor IN (:color) \
//          AND GarmentSize IN (:size) \
//          ORDER BY :sortLabel :sortDirection \
//          OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY", {
//                 replacements: {
//                     code: code,
//                     style: style,
//                     color: color,
//                     size: size,
//                     sortLabel: sortLabel,
//                     sortDirection: sortDirection,
//                     offset: offsetValue,
//                     fetch: parseInt(pageSize)
//                 },
//                 type: sequelize.QueryTypes.SELECT
//             }).then(function (response) {
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             })
//         })
//     } // two filter values comparison
//     else if (style.length !== 0 && ((color.length === 0 && size.length !== 0 && code.length == 0) ||
//             (color.length !== 0 && code.length == 0 && size.length === 0) ||
//             (color.length == 0 && code.length != 0 && size.length === 0))) {
//         // var statement;
//         console.log('entering into style filter values SSSS ---statement-- ', style, color, size);

//         if (code.length != 0) {
//             whereQuery = "WHERE CompanyCode IN (:code) AND StyleNumber in (:style)"
//         } else if (color.length != 0) {
//             whereQuery = "WHERE StyleNumber in (:style) AND StyleColor IN (:color)"
//         } else if (size.length != 0) {
//             whereQuery = "WHERE StyleNumber in (:style) AND GarmentSize IN (:size)"
//         }
//         completeQuery = selectQuery + " " + whereQuery;
//         console.log('complete query structure values are ------ ', completeQuery);

//         sequelize.query(completeQuery, {
//             replacements: {
//                 code: code,
//                 style: style,
//                 color: color,
//                 size: size
//             },
//             type: sequelize.QueryTypes.SELECT
//         }).then(function (count) {
//             console.log("styleNumber count values are ------- ", count);
//             sequelize.query(completeQuery, {
//                 replacements: {
//                     code: code,
//                     style: style,
//                     color: color,
//                     size: size
//                 },
//                 type: sequelize.QueryTypes.SELECT
//             }).then(function (response) {
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             })
//         })
//     } // three filter values comparison
//     else if (style.length !== 0 && ((color.length === 0 && size.length !== 0 && code.length != 0) ||
//             (color.length !== 0 && code.length !== 0 && size.length === 0) ||
//             (color.length != 0 && code.length == 0 && size.length != 0))) {
//         // var statement;
//         console.log('entering into style filter values threefilter values ---statement-- ', style, color, size);

//         if (code.length !== 0 && color.length !== 0) {
//             whereQuery = "WHERE (CompanyCode IN (:code) AND StyleNumber in (:style) AND StyleColor IN (:color))"
//         } else if (code.length !== 0 && size.length !== 0) {
//             whereQuery = "WHERE CompanyCode IN (:code) AND StyleNumber in (:style) AND GarmentSize IN (:size)"
//         } else if (color.length !== 0 && size.length !== 0) {
//             whereQuery = "WHERE StyleNumber in (:style) AND StyleColor IN (:color) AND GarmentSize IN (:size)"
//         }
//         completeQuery = selectQuery + " " + whereQuery;
//         console.log('complete query structure values are ------ ', completeQuery);

//         sequelize.query(completeQuery, {
//             replacements: {
//                 code: code,
//                 style: style,
//                 color: color,
//                 size: size
//             },
//             type: sequelize.QueryTypes.SELECT
//         }).then(function (count) {
//             console.log("styleNumber count values are ------- ", count);
//             sequelize.query(completeQuery, {
//                 replacements: {
//                     code: code,
//                     style: style,
//                     color: color,
//                     size: size
//                 },
//                 type: sequelize.QueryTypes.SELECT
//             }).then(function (response) {
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             })
//         })
//     } else if (color.length !== 0 && ((style.length === 0 && code.length === 0 && size.length !== 0) ||
//             (style.length !== 0 && code.length === 0 && size.length === 0) ||
//             (style.length === 0 && code.length !== 0 && size.length === 0))) {
//         console.log('entering into color filter values CCCCC ----- ', style, color, size);
//         if (style.length !== 0) {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             StyleColor: {
//                                 $in: [color]
//                             },
//                             StyleNumber: {
//                                 $in: [style]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 StyleColor: {
//                                     $in: [color]
//                                 },
//                                 StyleNumber: {
//                                     $in: [style]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value color filter values CCCCC  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         }
//         if (code.length != 0) {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             StyleColor: {
//                                 $in: [color]
//                             },
//                             CompanyCode: {
//                                 $in: [code]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 StyleColor: {
//                                     $in: [color]
//                                 },
//                                 CompanyCode: {
//                                     $in: [code]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value style filter values SSSS  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         } else {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             StyleColor: {
//                                 $in: [color]
//                             },
//                             GarmentSize: {
//                                 $in: [size]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 StyleColor: {
//                                     $in: [color]
//                                 },
//                                 GarmentSize: {
//                                     $in: [size]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value color filter values CCCCC  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         }
//         // models.FinishedGoods.count({ where: { StatusName: 'Active', $and: { StyleColor: { $in: [color] }, $or: { StyleNumber: { $in: [style] }, GarmentSize: { $in: [size] } } } } })
//         //     .then(function (count) {
//         //         console.log('all filter values count are ---- ', count);
//         //         models.FinishedGoods.findAll({
//         //             offset: offsetValue, limit: parseInt(pageSize),
//         //             where: { StatusName: 'Active', $and: { StyleColor: { $in: [color] }, $or: { StyleNumber: { $in: [style] }, GarmentSize: { $in: [size] } } } },
//         //             order: [
//         //                 [sortLabel, sortDirection]
//         //             ],
//         //             include: [{
//         //                 model: models.FinishedGoodsAdjustment
//         //             }]
//         //         }).then(function (response) {
//         //             console.log('response value color filter values CCCCC  -- ', response.length)
//         //             if (response.length != 0) {
//         //                 callback({ "count": count, "response": response });
//         //             } else {
//         //                 callback("There is no Inventory")
//         //             }
//         //         }).catch(function (error) {
//         //             console.log('error in count ---- ', error)
//         //             callback(error)
//         //         })
//         //     }).catch(function (error) {
//         //         callback(error);
//         //     })
//     } else if (size.length !== 0 && ((color.length === 0 && code.length === 0 && style.length !== 0) ||
//             (color.length !== 0 && code.length === 0 && style.length === 0) ||
//             (color.length === 0 && code.length !== 0 && style.length === 0))) {
//         //need to work
//         console.log('entering into size if condition ----- ', style, color, size);
//         if (style.length !== 0) {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             GarmentSize: {
//                                 $in: [size]
//                             },
//                             StyleNumber: {
//                                 $in: [style]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 GarmentSize: {
//                                     $in: [size]
//                                 },
//                                 StyleNumber: {
//                                     $in: [style]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value color filter values sizeeeee  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         }
//         if (code.length != 0) {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             GarmentSize: {
//                                 $in: [size]
//                             },
//                             CompanyCode: {
//                                 $in: [code]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 GarmentSize: {
//                                     $in: [size]
//                                 },
//                                 CompanyCode: {
//                                     $in: [code]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value style filter values SSSS  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         } else {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             GarmentSize: {
//                                 $in: [size]
//                             },
//                             StyleColor: {
//                                 $in: [color]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 GarmentSize: {
//                                     $in: [size]
//                                 },
//                                 StyleColor: {
//                                     $in: [color]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value color filter values sizeeeee  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         }
//         // models.FinishedGoods.count({ where: { StatusName: 'Active', $or: { $and: { StyleNumber: { $in: [style] }, StyleColor: { $in: [color] } }, $and: { StyleNumber: { $in: [style] }, GarmentSize: { $in: [size] } } } } })
//         //     .then(function (count) {
//         //         console.log('all filter values count are ---- ', count);
//         //         models.FinishedGoods.findAll({
//         //             offset: offsetValue, limit: parseInt(pageSize),
//         //             where: { StatusName: 'Active', $or: { $and: { StyleNumber: { $in: [style] }, StyleColor: { $in: [color] } }, $and: { StyleNumber: { $in: [style] }, GarmentSize: { $in: [size] } } } },
//         //             order: [
//         //                 [sortLabel, sortDirection]
//         //             ],
//         //             include: [{
//         //                 model: models.FinishedGoodsAdjustment
//         //             }]
//         //         }).then(function (response) {
//         //             console.log('response value style filter values SSSSize  -- ', response.length)
//         //             if (response.length != 0) {
//         //                 callback({ "count": count, "response": response });
//         //             } else {
//         //                 callback("There is no Inventory")
//         //             }
//         //         }).catch(function (error) {
//         //             console.log('error in count ---- ', error)
//         //             callback(error)
//         //         })
//         //     }).catch(function (error) {
//         //         callback(error);
//         //     })
//     }
//     // code else part
//     else if (code.length !== 0 && ((color.length === 0 && size.length === 0 && style.length !== 0) ||
//             (color.length !== 0 && size.length === 0 && style.length === 0) ||
//             (color.length === 0 && size.length !== 0 && style.length === 0))) {
//         //need to work
//         console.log('entering into size filter values SSSSize ----- ', style, color, size);
//         if (style.length !== 0) {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             CompanyCode: {
//                                 $in: [code]
//                             },
//                             StyleNumber: {
//                                 $in: [style]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 CompanyCode: {
//                                     $in: [code]
//                                 },
//                                 StyleNumber: {
//                                     $in: [style]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value color filter values sizeeeee  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         }
//         if (size.length != 0) {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             GarmentSize: {
//                                 $in: [size]
//                             },
//                             CompanyCode: {
//                                 $in: [code]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 GarmentSize: {
//                                     $in: [size]
//                                 },
//                                 CompanyCode: {
//                                     $in: [code]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value style filter values SSSS  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         } else {
//             models.FinishedGoods.count({
//                     where: {
//                         StatusName: 'Active',
//                         $and: {
//                             CompanyCode: {
//                                 $in: [code]
//                             },
//                             StyleColor: {
//                                 $in: [color]
//                             }
//                         }
//                     }
//                 })
//                 .then(function (count) {
//                     console.log('all filter values count are ---- ', count);
//                     models.FinishedGoods.findAll({
//                         offset: offsetValue,
//                         limit: parseInt(pageSize),
//                         where: {
//                             StatusName: 'Active',
//                             $and: {
//                                 CompanyCode: {
//                                     $in: [code]
//                                 },
//                                 StyleColor: {
//                                     $in: [color]
//                                 }
//                             }
//                         },
//                         order: [
//                             [sortLabel, sortDirection]
//                         ],
//                         include: [{
//                             model: models.FinishedGoodsAdjustment
//                         }]
//                     }).then(function (response) {
//                         console.log('response value color filter values sizeeeee  -- ', response.length)
//                         if (response.length != 0) {
//                             callback({
//                                 "count": count,
//                                 "response": response
//                             });
//                         } else {
//                             callback("There is no Inventory")
//                         }
//                     }).catch(function (error) {
//                         console.log('error in count ---- ', error)
//                         callback(error)
//                     })
//                 }).catch(function (error) {
//                     callback(error);
//                 })
//         }
//         // models.FinishedGoods.count({ where: { StatusName: 'Active', $or: { $and: { StyleNumber: { $in: [style] }, StyleColor: { $in: [color] } }, $and: { StyleNumber: { $in: [style] }, GarmentSize: { $in: [size] } } } } })
//         //     .then(function (count) {
//         //         console.log('all filter values count are ---- ', count);
//         //         models.FinishedGoods.findAll({
//         //             offset: offsetValue, limit: parseInt(pageSize),
//         //             where: { StatusName: 'Active', $or: { $and: { StyleNumber: { $in: [style] }, StyleColor: { $in: [color] } }, $and: { StyleNumber: { $in: [style] }, GarmentSize: { $in: [size] } } } },
//         //             order: [
//         //                 [sortLabel, sortDirection]
//         //             ],
//         //             include: [{
//         //                 model: models.FinishedGoodsAdjustment
//         //             }]
//         //         }).then(function (response) {
//         //             console.log('response value style filter values SSSSize  -- ', response.length)
//         //             if (response.length != 0) {
//         //                 callback({ "count": count, "response": response });
//         //             } else {
//         //                 callback("There is no Inventory")
//         //             }
//         //         }).catch(function (error) {
//         //             console.log('error in count ---- ', error)
//         //             callback(error)
//         //         })
//         //     }).catch(function (error) {
//         //         callback(error);
//         //     })
//     } else if (style.length !== 0 && color.length === 0 && size.length === 0 && code.length === 0) {
//         console.log('~~~~ entering into style option in inventory dao  ', style);

//         // sequelize.query("SELECT COUNT(*) N'count' from FinishedGoods  WHERE StyleNumber IN ($styles)", { bind: { styles: "'MT73707','MJ83059'" }, type: sequelize.QueryTypes.SELECT })
//         //     .then(function (countResponse) {
//         //         console.log('count values are ----- ', countResponse[0].count);
//         //         sequelize.query("SELECT * from FinishedGoods  WHERE StyleNumber IN ($styles)", { bind: { styles: "'MT73707','MJ83059'" }, type: sequelize.QueryTypes.SELECT })
//         //             .then(function (response) {
//         //                 if (response.length != 0) {
//         //                     callback({ "count": countResponse[0].count, "response": response });
//         //                 } else {
//         //                     callback("There is no Inventory")
//         //                 }
//         //             }).catch(function (error) {
//         //                 callback(error);
//         //             })
//         //     }).catch(function (error) {
//         //         callback(error);
//         //     })

//         models.FinishedGoods.count({
//             where: {
//                 StatusName: 'Active',
//                 StyleNumber: {
//                     $in: [style]
//                 }
//             }
//         }).then(function (count) {
//             console.log('#### count values are ----- ', count);
//             models.FinishedGoods.findAll({
//                 offset: offsetValue,
//                 limit: parseInt(pageSize),
//                 where: {
//                     StatusName: 'Active',
//                     StyleNumber: {
//                         $in: [style]
//                     }
//                 },
//                 order: [
//                     [sortLabel, sortDirection]
//                 ],
//                 include: [{
//                     model: models.FinishedGoodsAdjustment
//                 }]
//             }).then(function (response) {
//                 console.log('response value are -- ', response.length)
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             }).catch(function (error) {
//                 console.log('error in count ---- ', error)
//                 callback(error)
//             })
//         }).catch(function (error) {
//             callback(error)
//         })

//     } else if (color.length !== 0 && style.length === 0 && size.length === 0 && code.length === 0) {
//         console.log('~~~~ entering into color option in inventory dao  ', color);
//         models.FinishedGoods.count({
//             where: {
//                 StatusName: 'Active',
//                 StyleColor: {
//                     $in: [color]
//                 }
//             }
//         }).then(function (count) {
//             console.log('#### count values are ----- ', count);
//             models.FinishedGoods.findAll({
//                 offset: offsetValue,
//                 limit: parseInt(pageSize),
//                 where: {
//                     StatusName: 'Active',
//                     StyleColor: {
//                         $in: [color]
//                     }
//                 },
//                 order: [
//                     [sortLabel, sortDirection]
//                 ],
//                 include: [{
//                     model: models.FinishedGoodsAdjustment
//                 }]
//             }).then(function (response) {
//                 console.log('response value are -- ', response.length)
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             }).catch(function (error) {
//                 console.log('error in count ---- ', error)
//                 callback(error)
//             })
//         }).catch(function (error) {
//             callback(error)
//         })

//     } else if (size.length !== 0 && style.length === 0 && color.length === 0 && code.length === 0) {
//         console.log('~~~~ entering into size option in inventory dao  ', style);
//         models.FinishedGoods.count({
//             where: {
//                 StatusName: 'Active',
//                 GarmentSize: {
//                     $in: [size]
//                 }
//             }
//         }).then(function (count) {
//             console.log('#### count values are ----- ', count);
//             models.FinishedGoods.findAll({
//                 offset: offsetValue,
//                 limit: parseInt(pageSize),
//                 where: {
//                     StatusName: 'Active',
//                     GarmentSize: {
//                         $in: [size]
//                     }
//                 },
//                 order: [
//                     [sortLabel, sortDirection]
//                 ],
//                 include: [{
//                     model: models.FinishedGoodsAdjustment
//                 }]
//             }).then(function (response) {
//                 console.log('response value are -- ', response.length)
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             }).catch(function (error) {
//                 console.log('error in count ---- ', error)
//                 callback(error)
//             })
//         }).catch(function (error) {
//             callback(error)
//         })

//     } else if (code.length !== 0 && size.length === 0 && style.length === 0 && color.length === 0) {
//         console.log('~~~~ entering into code option in inventory dao  ', style);
//         models.FinishedGoods.count({
//             where: {
//                 StatusName: 'Active',
//                 CompanyCode: {
//                     $in: [code]
//                 }
//             }
//         }).then(function (count) {
//             console.log('#### count values are ----- ', count);
//             models.FinishedGoods.findAll({
//                 offset: offsetValue,
//                 limit: parseInt(pageSize),
//                 where: {
//                     StatusName: 'Active',
//                     CompanyCode: {
//                         $in: [code]
//                     }
//                 },
//                 order: [
//                     [sortLabel, sortDirection]
//                 ],
//                 include: [{
//                     model: models.FinishedGoodsAdjustment
//                 }]
//             }).then(function (response) {
//                 console.log('response value are -- ', response.length)
//                 if (response.length != 0) {
//                     callback({
//                         "count": count,
//                         "response": response
//                     });
//                 } else {
//                     callback("There is no Inventory")
//                 }
//             }).catch(function (error) {
//                 console.log('error in count ---- ', error)
//                 callback(error)
//             })
//         }).catch(function (error) {
//             callback(error)
//         })

//     } else {
//         console.log('nothing if condition is called')
//     }

// }



//getActiveInventory by company code
module.exports.getinventorybycompanycode = function (pageNumber, pageSize, sortLabel,
    sortDirection, search, style, color, size, companyCode, callback) {
    var offsetValue = parseInt(pageSize) * (parseInt(pageNumber));
    console.log('entering into inventory active data in dao --offsetValues--- ', pageNumber, pageSize, offsetValue);
    if (search === '' && (style.length === 0 && color.length === 0 && size.length === 0)) {
        console.log('!!!! entering into if part')
        models.FinishedGoods.count({
            where: {
                StatusName: 'Active',
                CompanyCode: companyCode
            }
        }).then(function (count) {
            models.FinishedGoods.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: 'Active',
                    CompanyCode: companyCode
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.FinishedGoodsAdjustment
                }]
            }).then(function (response) {
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Inventory", statusCode.no_content)
                }
            }).catch(function (error) {
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })
    } else if (search !== '') {
        console.log("@#@#@## entering into else part ")
        models.FinishedGoods.count({
            where: {
                StatusName: 'Active',
                CompanyCode: companyCode,
                $or: [{
                        'StyleNumber': {
                            like: '%' + search + '%'
                        }
                    },
                    //{ '$Comment.body$': { like: '%' + search + '%' } }
                    {
                        'StyleColor': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'GarmentSize': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StyleOption': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'StyleName': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantityOnHand': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantityAllocated': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'AdjustedQuantityOnHand': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantitySeconds': {
                            like: '%' + search + '%'
                        }
                    },
                    {
                        'QuantityThirds': {
                            like: '%' + search + '%'
                        }
                    }
                ]
            }
        }).then(function (count) {
            models.FinishedGoods.findAll({
                where: {
                    StatusName: 'Active',
                    CompanyCode: companyCode,
                    $or: [{
                            'StyleNumber': {
                                like: '%' + search + '%'
                            }
                        },
                        //{ '$Comment.body$': { like: '%' + search + '%' } }
                        {
                            'StyleColor': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'GarmentSize': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StyleOption': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'StyleName': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantityOnHand': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantityAllocated': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'AdjustedQuantityOnHand': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantitySeconds': {
                                like: '%' + search + '%'
                            }
                        },
                        {
                            'QuantityThirds': {
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
                    model: models.FinishedGoodsAdjustment
                }]

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
    } else if (style.length !== 0 && color.length !== 0 && size.length !== 0) {
        console.log('entering into all filter values true ----- ', style, color, size);
        models.FinishedGoods.count({
                where: {
                    StatusName: 'Active',
                    CompanyCode: companyCode,
                    $and: {
                        StyleNumber: {
                            $in: [style]
                        },
                        StyleColor: {
                            $in: [color]
                        },
                        GarmentSize: {
                            $in: [size]
                        }
                    }
                }
            })
            .then(function (count) {
                console.log('all filter values count are ---- ', count);
                models.FinishedGoods.findAll({
                    offset: offsetValue,
                    limit: parseInt(pageSize),
                    where: {
                        StatusName: 'Active',
                        CompanyCode: companyCode,
                        $and: {
                            StyleNumber: {
                                $in: [style]
                            },
                            StyleColor: {
                                $in: [color]
                            },
                            GarmentSize: {
                                $in: [size]
                            }
                        }
                    },
                    order: [
                        [sortLabel, sortDirection]
                    ],
                    include: [{
                        model: models.FinishedGoodsAdjustment
                    }]
                }).then(function (response) {
                    console.log('response value of all filter valeus are  -- ', response.length)
                    if (response.length != 0) {
                        callback({
                            "count": count,
                            "response": response
                        }, statusCode.ok);
                    } else {
                        callback("There is no Inventory", statusCode.no_content)
                    }
                }).catch(function (error) {
                    console.log('error in count ---- ', error)
                    callback(error, statusCode.error)
                })
            }).catch(function (error) {
                callback(error, statusCode.error);
            })
    } else if (style.length !== 0 && ((color.length === 0 && size.length !== 0) || (color.length !== 0 && size.length === 0))) {
        // var statement;
        console.log('entering into style filter values SSSS ---statement-- ', style, color, size);
        if (color.length !== 0) {
            console.log('entering into if part')
            // statement = '$and: { StyleNumber: { $in: [style] }, StyleColor: { $in: [color] } }';
            models.FinishedGoods.count({
                    where: {
                        StatusName: 'Active',
                        CompanyCode: companyCode,
                        $and: {
                            StyleNumber: {
                                $in: [style]
                            },
                            StyleColor: {
                                $in: [color]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.FinishedGoods.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: 'Active',
                            CompanyCode: companyCode,
                            $and: {
                                StyleNumber: {
                                    $in: [style]
                                },
                                StyleColor: {
                                    $in: [color]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.FinishedGoodsAdjustment
                        }]
                    }).then(function (response) {
                        console.log('response value style filter values SSSS  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no Inventory", statusCode.no_content)
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
            models.FinishedGoods.count({
                    where: {
                        StatusName: 'Active',
                        CompanyCode: companyCode,
                        $and: {
                            StyleNumber: {
                                $in: [style]
                            },
                            GarmentSize: {
                                $in: [size]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.FinishedGoods.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: 'Active',
                            CompanyCode: companyCode,
                            $and: {
                                StyleNumber: {
                                    $in: [style]
                                },
                                GarmentSize: {
                                    $in: [size]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.FinishedGoodsAdjustment
                        }]
                    }).then(function (response) {
                        console.log('response value style filter values SSSS  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no Inventory", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
            // statement = '$and: { StyleNumber: { $in: [style] }, GarmentSize: { $in: [size] } }';
        }
    } else if (color.length !== 0 && ((style.length === 0 && size.length !== 0) || (style.length !== 0 && size.length === 0))) {
        console.log('entering into color filter values CCCCC ----- ', style, color, size);
        if (style.length !== 0) {
            models.FinishedGoods.count({
                    where: {
                        StatusName: 'Active',
                        CompanyCode: companyCode,
                        $and: {
                            StyleColor: {
                                $in: [color]
                            },
                            StyleNumber: {
                                $in: [style]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.FinishedGoods.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: 'Active',
                            CompanyCode: companyCode,
                            $and: {
                                StyleColor: {
                                    $in: [color]
                                },
                                StyleNumber: {
                                    $in: [style]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.FinishedGoodsAdjustment
                        }]
                    }).then(function (response) {
                        console.log('response value color filter values CCCCC  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no Inventory", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        } else {
            models.FinishedGoods.count({
                    where: {
                        StatusName: 'Active',
                        CompanyCode: companyCode,
                        $and: {
                            StyleColor: {
                                $in: [color]
                            },
                            GarmentSize: {
                                $in: [size]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.FinishedGoods.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: 'Active',
                            CompanyCode: companyCode,
                            $and: {
                                StyleColor: {
                                    $in: [color]
                                },
                                GarmentSize: {
                                    $in: [size]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.FinishedGoodsAdjustment
                        }]
                    }).then(function (response) {
                        console.log('response value color filter values CCCCC  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no Inventory", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        }
    } else if (size.length !== 0 && ((color.length === 0 && style.length !== 0) || (color.length !== 0 && style.length === 0))) {
        //need to work
        console.log('entering into size filter values SSSSize ----- ', style, color, size);
        if (style.length !== 0) {
            models.FinishedGoods.count({
                    where: {
                        StatusName: 'Active',
                        CompanyCode: companyCode,
                        $and: {
                            GarmentSize: {
                                $in: [size]
                            },
                            StyleNumber: {
                                $in: [style]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.FinishedGoods.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: 'Active',
                            CompanyCode: companyCode,
                            $and: {
                                GarmentSize: {
                                    $in: [size]
                                },
                                StyleNumber: {
                                    $in: [style]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.FinishedGoodsAdjustment
                        }]
                    }).then(function (response) {
                        console.log('response value color filter values sizeeeee  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no Inventory", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        } else {
            models.FinishedGoods.count({
                    where: {
                        StatusName: 'Active',
                        CompanyCode: companyCode,
                        $and: {
                            GarmentSize: {
                                $in: [size]
                            },
                            StyleColor: {
                                $in: [color]
                            }
                        }
                    }
                })
                .then(function (count) {
                    console.log('all filter values count are ---- ', count);
                    models.FinishedGoods.findAll({
                        offset: offsetValue,
                        limit: parseInt(pageSize),
                        where: {
                            StatusName: 'Active',
                            CompanyCode: companyCode,
                            $and: {
                                GarmentSize: {
                                    $in: [size]
                                },
                                StyleColor: {
                                    $in: [color]
                                }
                            }
                        },
                        order: [
                            [sortLabel, sortDirection]
                        ],
                        include: [{
                            model: models.FinishedGoodsAdjustment
                        }]
                    }).then(function (response) {
                        console.log('response value color filter values sizeeeee  -- ', response.length)
                        if (response.length != 0) {
                            callback({
                                "count": count,
                                "response": response
                            }, statusCode.ok);
                        } else {
                            callback("There is no Inventory", statusCode.no_content)
                        }
                    }).catch(function (error) {
                        console.log('error in count ---- ', error)
                        callback(error, statusCode.error)
                    })
                }).catch(function (error) {
                    callback(error, statusCode.error);
                })
        }
    } else if (style.length !== 0 && color.length === 0 && size.length === 0) {
        console.log('~~~~ entering into style option in inventory dao  ', style);
        models.FinishedGoods.count({
            where: {
                StatusName: 'Active',
                CompanyCode: companyCode,
                StyleNumber: {
                    $in: [style]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.FinishedGoods.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: 'Active',
                    CompanyCode: companyCode,
                    StyleNumber: {
                        $in: [style]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.FinishedGoodsAdjustment
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Inventory", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else if (color.length !== 0 && style.length === 0 && size.length === 0) {
        console.log('~~~~ entering into color option in inventory dao  ', color);
        models.FinishedGoods.count({
            where: {
                StatusName: 'Active',
                CompanyCode: companyCode,
                StyleColor: {
                    $in: [color]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.FinishedGoods.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: 'Active',
                    CompanyCode: companyCode,
                    StyleColor: {
                        $in: [color]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.FinishedGoodsAdjustment
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Inventory", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else if (size.length !== 0 && style.length === 0 && color.length === 0) {
        console.log('~~~~ entering into size option in inventory dao  ', style);
        models.FinishedGoods.count({
            where: {
                StatusName: 'Active',
                GarmentSize: {
                    $in: [size]
                }
            }
        }).then(function (count) {
            console.log('#### count values are ----- ', count);
            models.FinishedGoods.findAll({
                offset: offsetValue,
                limit: parseInt(pageSize),
                where: {
                    StatusName: 'Active',
                    GarmentSize: {
                        $in: [size]
                    }
                },
                order: [
                    [sortLabel, sortDirection]
                ],
                include: [{
                    model: models.FinishedGoodsAdjustment
                }]
            }).then(function (response) {
                console.log('response value are -- ', response.length)
                if (response.length != 0) {
                    callback({
                        "count": count,
                        "response": response
                    }, statusCode.ok);
                } else {
                    callback("There is no Inventory", statusCode.no_content)
                }
            }).catch(function (error) {
                console.log('error in count ---- ', error)
                callback(error, statusCode.error)
            })
        }).catch(function (error) {
            callback(error, statusCode.error)
        })

    } else {
        console.log('nothing if condition is called')
    }
}


module.exports.deleteinventory = function (inventoryID, callback) {
    models.FinishedGoods.destroy({
        where: {
            uuid: inventoryID
        }
    }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.updateinventory = function (InventoryDetails, callback) {
    models.FinishedGoods.update(InventoryDetails, {
        where: {
            uuid: InventoryDetails.uuid
        }
    }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getinventorybyid = function (inventoryID, callback) {
    models.FinishedGoods.findOne({

        where: {
            FinishedGoodsID: inventoryID
        },
        order: [
            ['StyleNumber', 'DESC']
        ],
        include: [{
            model: models.FinishedGoodsAdjustment
        }]

    }).then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no Inventory", statusCode.no_content)
        }
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}