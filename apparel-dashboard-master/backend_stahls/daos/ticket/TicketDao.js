var models = require("../../models");
var asyncLoop = require('node-async-loop');
var Sequelize = require('sequelize');
var status = require('../../config/status');
var configJSON = require("../../config/config");
var env = process.env.NODE_ENV || 'development';
var config = configJSON[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);

// var Sequelize = require('sequelize');
// var confi = require('../../config/config.json');
// var env = process.env.NODE_ENV || 'development';
// var config = confi[env];
// var sequelize = new Sequelize(config.name, config.username, config.password, config);



module.exports.create_Ticket = function (TicketDetails, callback) {
    console.log(TicketDetails.salesorder.length)
    if (TicketDetails.salesorder.length != 0) {
        models.Tickets.create(TicketDetails).then(function (response) {
            if (response) {
                asyncLoop(TicketDetails.salesorder, (salesorder, next) => {
                    console.log("order in create ticket dao ---- ", salesorder)
                    // salesorder.TicketUuid = response.dataValues.uuid;
                    salesorder.Tickets = salesorder.Tickets + 1;
                    console.log("tickets in this order ---- ", salesorder.Tickets);
                    models.SalesOrder.update(salesorder, {
                            where: {
                                OrderID: salesorder.OrderID
                            }
                        })
                        .then(function (OrderResponse) {
                            var SalesOrderOrder = {
                                SalesOrderOrderID: salesorder.OrderID,
                                TicketUuid: response.dataValues.uuid
                            }
                            models.SalesOrderTickets.create(SalesOrderOrder)
                                .then(function (SalesOrderOrderResponse) {
                                    console.log("mydata test-----------", SalesOrderOrderResponse)
                                }).catch(function (err) {})
                        }).catch(function (err) {})
                    next();
                }, function (err) {
                    if (err) {
                        console.log("error in async")
                    } else {
                        console.log("success in async")

                        callback(response, status.created)
                    }
                })
            }

        }).catch(function (error) {
            callback(error, status.error)
            console.log('create ticket error in if condition ----- ', error);
        })
    } else {
        models.Tickets.create(TicketDetails).then(function (response) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~No salesOrder since Ticket Created ")
            callback(response, status.created)
        }).catch(function (error) {
            console.log('create ticket error in else condition ------ ', error);
            callback(error, status.error)
        })
    }

}

module.exports.update_ticket = function (TicketDetails, callback) {
    console.log(' entering into update ticket in dao ')
    if (TicketDetails.salesorder.length != 0) {
        console.log('entering into if condition of update ticket in dao')
        models.Tickets.update(TicketDetails, {
            where: {
                uuid: TicketDetails.uuid
            }
        }).then(function (response) {
            if (response) {
                asyncLoop(TicketDetails.salesorder, (salesorder, next) => {
                    console.log("update tickets order in dao ---- ", salesorder)
                    // salesorder.TicketUuid = response.dataValues.uuid;
                    // salesorder.Tickets = salesorder.Tickets + 1;
                    console.log("update tickets in this order ---- ", salesorder.OrderID);
                    models.SalesOrder.update(salesorder, {
                            where: {
                                OrderID: salesorder.OrderID
                            }
                        })
                        .then(function (OrderResponse) {
                            var SalesOrderOrder = {
                                SalesOrderOrderID: salesorder.OrderID,
                                TicketUuid: TicketDetails.uuid
                            }
                            models.SalesOrderTickets.create(SalesOrderOrder)
                                .then(function (SalesOrderOrderResponse) {
                                    console.log("mydata test-----------", SalesOrderOrderResponse)
                                }).catch(function (err) {})
                        }).catch(function (err) {})
                    next();
                }, function (err) {
                    if (err) {
                        console.log("error in async")
                    } else {
                        console.log("success in async")

                        callback(response, status.ok)
                    }
                })
            }
        }).catch(function (error) {
            callback(error, status.error)
        })
    } else {
        // } else if (TicketDetails.assigned_to.length === 0) {
        //     models.AssignedUserTickets.destroy({ where: { TicketUuid: TicketDetails.uuid } }).then(function (response) {
        //         console.log('--------Destoryreponse--->>>>>', response);
        //         models.Tickets.update(TicketDetails, { where: { uuid: TicketDetails.uuid } }).then(function (updateticket) {
        //             console.log('--------Updateresponse--->>>>>', updateticket);
        //             callback(updateticket)
        //         }).catch(function(error){
        //             console.log('--------Errorresponse--->>>>>', error);
        //             callback(error, status.error)
        //         })
        //     }).catch(function (error) {
        //         console.log('--------Errorresponse--->>>>>', error);
        //         callback(error, status.error)
        //     })
        // } else {
        console.log('entering into else condition of update ticket in dao')
        models.Tickets.update(TicketDetails, {
            where: {
                uuid: TicketDetails.uuid
            }
        }).then(function (response) {
            callback(response, status.ok)
        }).catch(function (error) {
            callback(error, status.error)
        })
    }
}

module.exports.getall_ticket = function (callback) {
    models.Tickets.findAll({
        order: [
            ['Date', 'DESC']
        ],
        include: [{
                model: models.Users,
                as: 'assigned_to',
                attributes: ['firstname']
            }, {
                model: models.Users,
                as: 'created_by',
                attributes: ['firstname']
            }, {
                model: models.SalesOrder,
                as: 'salesorder',
                attributes: ['PONumber', 'OrderNumber']
            },
            {
                model: models.Organizations,
                as: 'organization',
                attributes: ['organizationname']
            }
        ]
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, status.ok)
        } else {
            callback("There is no Tickets", status.no_content)
        }
        // console.log("after get all ticket in dao --- ",response);
    }).catch(function (error) {
        // console.log("after get all ticket in dao error ---- ",error);
        callback(error, status.error)
    })
}

module.exports.getticketById = function (Ticket_id, callback) {
    console.log('entering into get ticket by id are ------- ');
    models.Tickets.find({
        where: {
            uuid: Ticket_id
        },
        include: [{
                model: models.TicketAttachments,
                as: 'attachments',
            }, {
                model: models.Users,
                as: 'assigned_to'
            }, {
                model: models.Users,
                as: 'created_by'
            }, {
                model: models.SalesOrder,
                order: [
                    ['OrderDate', 'DESC']
                ],
                as: 'salesorder'
            }, {
                model: models.CloseReason,
                as: 'CloseReason'
            },
            {
                model: models.Organizations,
                as: 'organization',
            }
        ]
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, status.ok)
        } else {
            callback("There is no Tickets", status.no_content)
        }
    }).catch(function (error) {
        callback(error, status.error)
    })
}

module.exports.getticketByOrgId = function (orgId, callback) {
    models.Tickets.findAll({
        order: [
            ['Date', 'DESC']
        ],
        where: {
            organizationUuid: orgId
        },
        include: [{
                model: models.TicketAttachments,
                as: 'attachments',
            }, {
                model: models.Users,
                as: 'assigned_to'
            }, {
                model: models.Users,
                as: 'created_by'
            }, {
                model: models.SalesOrder,
                order: [
                    ['OrderDate', 'DESC']
                ],
                include: [{
                    model: models.SalesOrderStatus
                }],
                as: 'salesorder'
            }, {
                model: models.CloseReason,
                as: 'CloseReason'
            },
            {
                model: models.Organizations,
                as: 'organization',
            }
        ]
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, status.ok)
        } else {
            callback("There is no Tickets", status.no_content)
        }
    }).catch(function (error) {
        callback(error, status.error)
    })
}





module.exports.Removeassigneduser = function (TicketDetails, callback) {
    models.AssignedUserTickets.destroy({
        where: {
            TicketUuid: TicketDetails.uuid
        }
    }).then(function (response) {
        models.Tickets.update(TicketDetails, {
            where: {
                uuid: TicketDetails.uuid
            }
        }).then(function (updateticket) {
            callback(updateticket, status.ok)
        }).catch(function (error) {
            callback(error, status.error)
        })
    }).catch(function (error) {
        callback(error, status.error)
    })
}

module.exports.delete_ticket = function (Ticket_id, callback) {
    models.Tickets.destroy({
        where: {
            uuid: Ticket_id
        }
    }).then(function (response) {
        callback(response, status.ok)
    }).catch(function (error) {
        callback(error, status.error)
    })
}

module.exports.getFilterValue = function (callback) {
    // TicketService.getFilterValue(function (response) {
    //     callback(response);
    // })
    //created by filter values
    sequelize.query("SELECT firstname FROM Users WHERE uuid IN (SELECT \
        createdByUuid FROM Tickets)", {
        type: Sequelize.QueryTypes.SELECT
    }).then(function (data1) {
        console.log('$$ get filter value response data 1 values are ==------ ', data1);
        // assigned to filter values
        sequelize.query("SELECT firstname FROM Users WHERE uuid IN (SELECT \
                AssignedUserTickets.UserUuid FROM AssignedUserTickets \
                INNER JOIN Tickets ON Tickets.uuid = AssignedUserTickets.TicketUuid)", {
            type: Sequelize.QueryTypes.SELECT
        }).then(function (data2) {
            console.log('$$ get filter value response data 2 ## values are ==------ ', data2);
            // status filter values 
            sequelize.query("SELECT DISTINCT Status from Tickets", {
                type: Sequelize.QueryTypes.SELECT
            }).then(function (data3) {
                sequelize.query("SELECT DISTINCT organizationname FROM Organizations", {
                    type: Sequelize.QueryTypes.SELECT
                }).then(function (data4) {
                    console.log('$$ get filter value response data 3 %%% values are ==------ ', data3);
                    var response = {
                        "createdBy": data1,
                        "assignedTo": data2,
                        "Status": data3,
                        "organization": data4
                    }
                    console.log('callback of get filter values are --- -  ', response)
                    callback(response, status.ok);
                })
            })
        })
    })
}
//get filter value by organization uuid
module.exports.getFilterByOrgId = function (orgID, callback) {
    //created by filter values
    sequelize.query("SELECT firstname FROM Users WHERE uuid IN (SELECT \
         createdByUuid FROM Tickets WHERE organizationUuid IN (:organizationID,'H1b9MM9zQ') )", {
        replacements: {
            organizationID: orgID
        },
        type: Sequelize.QueryTypes.SELECT
    }).then(function (data1) {
        console.log('response data 1 values are ==------ ', data1);
        // assigned to filter values
        sequelize.query("SELECT firstname FROM Users WHERE uuid IN (SELECT \
                 AssignedUserTickets.UserUuid FROM AssignedUserTickets \
                 INNER JOIN Tickets ON Tickets.uuid = AssignedUserTickets.TicketUuid \
                  WHERE Tickets.organizationUuid IN (:organizationID,'H1b9MM9zQ'))", {
            replacements: {
                organizationID: orgID
            },
            type: Sequelize.QueryTypes.SELECT
        }).then(function (data2) {
            console.log('response data 2 ## values are ==------ ', data2);
            // status filter values 
            sequelize.query("SELECT DISTINCT Status from Tickets WHERE organizationUuid IN (:organizationID)", {
                replacements: {
                    organizationID: orgID
                },
                type: Sequelize.QueryTypes.SELECT
            }).then(function (data3) {
                console.log('response data 3 %%% values are ==------ ', data3);
                var response = {
                    "createdBy": data1,
                    "assignedTo": data2,
                    "Status": data3
                }
                console.log('callback of get filter values are --- -  ', response)
                callback(response, status.ok);
            })
        })
    })
}

module.exports.getAllTickets = function (object, callback) {
    console.log('get all ticket in ticket dao ----- ', object);
    var selectQuery = "SELECT uuid FROM Tickets";
    var countQuery = "SELECT COUNT(*)N'count' FROM Tickets";
    var offsetValue = parseInt(object.pageSize) * (parseInt(object.pageNumber));
    // var OrgIdQuery = "  organizationUuid IN (:orgId) "
    selectOffsetQuery = "ORDER BY :sortLabel  " + object.sortDirection.toUpperCase() + "  OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    var whereQuery = '',
        completeQuery = '';
    var querys = [];
    var queryDetails = '';
    if (object.search != '') {
        whereQuery = "WHERE  createdByUuid IN (SELECT uuid FROM Users WHERE firstname LIKE :name) \
OR uuid IN (SELECT TicketUuid FROM \
AssignedUserTickets INNER JOIN Users ON Users.uuid = AssignedUserTickets.UserUuid WHERE firstname LIKE :name) \
OR  Status LIKE :name \
OR  Status LIKE :name \
OR Type  LIKE :name \
OR  id LIKE :name \
OR uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
             INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
              WHERE  PONumber LIKE :name OR OrderNumber LIKE :name) \
OR  CONVERT(DATE,Date) LIKE :name"
        var countCompleteQuery = countQuery + " " + whereQuery;
        var completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets " + " " + whereQuery + " " + selectOffsetQuery;

        sequelize.query(countCompleteQuery, {
            replacements: {
                name: "%" + object.search + "%"
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    sortLabel: object.sortLabel,
                    name: "%" + object.search + "%",
                    offset: offsetValue,
                    fetch: parseInt(object.pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (ticketUuid) {
                console.log('response length are ---- ', ticketUuid);

                var uuid = [];
                if (ticketUuid.length > 0) {
                    ticketUuid.forEach(element => {
                        uuid.push(element.uuid);
                    })
                } else {
                    uuid.push('');
                }
                console.log('ticket uuid values are -uuid---- ', ticketUuid, uuid);
                models.Tickets.findAll({
                    where: {
                        uuid: {
                            $in: [uuid]
                        }
                    },
                    order: [
                        [object.sortLabel, object.sortDirection]
                    ],
                    include: [{
                            model: models.Users,
                            as: 'assigned_to',
                            attributes: ['firstname']
                        }, {
                            model: models.Users,
                            as: 'created_by',
                            attributes: ['firstname']
                        }, {
                            model: models.SalesOrder,
                            as: 'salesorder',
                            attributes: ['PONumber', 'OrderNumber']
                        },
                        {
                            model: models.Organizations,
                            as: 'organization',
                            attributes: ['organizationname']
                        }
                    ]
                }).then(function (response) {
                    if (response.length != 0) {
                        // callback(response)
                        callback({
                            "count": countResponse[0].count,
                            "response": response
                        },status.ok);
                    } else {
                        callback({
                            "count": 0,
                            "response": []
                        },status.no_content);
                    }
                    console.log("after get all ticket in dao --- ", response.length);
                }).catch(function (error) {
                    console.log("after get all ticket in dao error ---- ", error);
                    callback(error, status.error)
                })

            })
        })


    } else if (object.createdBy.length === 0 && object.assignedTo.length === 0 && object.status.length === 0 && object.organization.length === 0) {
        var countCompleteQuery = countQuery;
        var completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets  " + selectOffsetQuery;
        console.log(' #### full of query are --admin flow-- ', countCompleteQuery, completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                orgId: object.orgId
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    orgId: object.orgId,
                    sortLabel: object.sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(object.pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (ticketUuid) {
                console.log('response length are ---- ', ticketUuid);

                var uuid = [];
                if (ticketUuid.length > 0) {
                    ticketUuid.forEach(element => {
                        uuid.push(element.uuid);
                    })
                } else {
                    uuid.push('');
                }
                console.log('##### ticket uuid values are -uuid---- ', ticketUuid, uuid);
                models.Tickets.findAll({
                    where: {
                        uuid: {
                            $in: [uuid]
                        }
                    },
                    order: [
                        [object.sortLabel, object.sortDirection]
                    ],
                    include: [{
                            model: models.Users,
                            as: 'assigned_to',
                            attributes: ['firstname']
                        }, {
                            model: models.Users,
                            as: 'created_by',
                            attributes: ['firstname']
                        }, {
                            model: models.SalesOrder,
                            as: 'salesorder',
                            attributes: ['PONumber', 'OrderNumber']
                        },
                        {
                            model: models.Organizations,
                            as: 'organization',
                            attributes: ['organizationname']
                        }
                    ]
                }).then(function (response) {
                    if (response.length != 0) {
                        // callback(response)
                        callback({
                            "count": countResponse[0].count,
                            "response": response
                        },status.ok);
                    } else {
                        callback({
                            "count": 0,
                            "response": []
                        },status.no_content);
                    }
                    console.log("#####after get all ticket in dao --- ", response.length);
                }).catch(function (error) {
                    console.log("after get all ticket in dao error ---- ", error);
                    callback(error, status.error)
                })

            })
        })
    } else {
        whereQuery = '';
        if (object.createdBy.length != 0) {
            queryDetails = "createdByUuid IN (SELECT uuid FROM Users WHERE firstname IN (:createdName))";
            querys.push(queryDetails);
        }
        if (object.assignedTo.length != 0) {
            queryDetails = "uuid IN (SELECT TicketUuid FROM AssignedUserTickets INNER JOIN Users ON Users.uuid = AssignedUserTickets.UserUuid WHERE firstname IN (:assignedName))"
            querys.push(queryDetails);
        }
        if (object.status.length != 0) {
            queryDetails = "Status IN (:status)"
            querys.push(queryDetails);
        }
        if (object.organization.length != 0) {
            queryDetails = " organizationUuid IN (SELECT uuid FROM Organizations WHERE \
                organizationname IN (:organizationName))"
            querys.push(queryDetails)
        }
        var count = 0;
        asyncLoop(querys, (item, next) => {
            count++;
            if (count == querys.length) {
                next();
            } else {
                whereQuery = whereQuery + item + " " + 'AND' + " "
                next();
            }
        }, function (err) {

            if (err) {

            } else {
                completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets " + "  WHERE  " + whereQuery + " " + querys[querys.length - 1] + " " + selectOffsetQuery;
                countCompleteQuery = countQuery + "  WHERE  " + whereQuery + " " + querys[querys.length - 1];
                console.log('$$$ complete query values are ----------- ', completeQuery, countCompleteQuery);
                sequelize.query(countCompleteQuery, {
                    replacements: {
                        createdName: object.createdBy,
                        assignedName: object.assignedTo,
                        status: object.status,
                        organizationName: object.organization
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (countResponse) {
                    sequelize.query(completeQuery, {
                        replacements: {
                            createdName: object.createdBy,
                            assignedName: object.assignedTo,
                            status: object.status,
                            organizationName: object.organization,
                            sortLabel: object.sortLabel,
                            offset: offsetValue,
                            fetch: parseInt(object.pageSize)
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (ticketUuid) {
                        console.log('filter ticket uuid are ------- ', ticketUuid)
                        var uuid = [];
                        if (ticketUuid.length > 0) {
                            ticketUuid.forEach(element => {
                                uuid.push(element.uuid);
                            })
                        } else {
                            uuid.push('');
                        }
                        models.Tickets.findAll({
                            where: {
                                uuid: {
                                    $in: [uuid]
                                }
                            },
                            order: [
                                [object.sortLabel, object.sortDirection]
                            ],
                            include: [{
                                    model: models.Users,
                                    as: 'assigned_to',
                                    attributes: ['firstname']
                                }, {
                                    model: models.Users,
                                    as: 'created_by',
                                    attributes: ['firstname']
                                }, {
                                    model: models.SalesOrder,
                                    as: 'salesorder',
                                    attributes: ['PONumber', 'OrderNumber']
                                },
                                {
                                    model: models.Organizations,
                                    as: 'organization',
                                    attributes: ['organizationname']
                                }
                            ]
                        }).then(function (response) {
                            if (response.length != 0) {
                                callback({
                                    "count": countResponse[0].count,
                                    "response": response
                                },status.ok);
                            } else {
                                callback({
                                    "count": 0,
                                    "response": []
                                },status.no_content);
                            }
                        }).catch(function (error) {
                            console.log("after get all ticket in dao error ---- ", error);
                            callback(error, status.error)
                        })
                    }).catch(function (error) {
                        console.log('entering in finding uuid are ---- ', error);
                        callback(error, status.error);
                    })
                }).catch(function (error) {
                    callback(error, status.error);
                })

            }
        })
    }
}

module.exports.getAllTicketByOrgId = function (object, callback) {
    console.log('get all ticket by org id in ticket dao ----- ', object);
    var selectQuery = "SELECT uuid FROM Tickets";
    var countQuery = "SELECT COUNT(*)N'count' FROM Tickets";
    var offsetValue = parseInt(object.pageSize) * (parseInt(object.pageNumber));
    var OrgIdQuery = "  organizationUuid IN (:orgId) "
    selectOffsetQuery = "ORDER BY :sortLabel  " + object.sortDirection.toUpperCase() + "  OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    var whereQuery = '',
        completeQuery = '';
    var querys = [];
    var queryDetails = '';
    // if (object.PONumber != '' && object.orderNumber != '') {
    //     queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
    //          INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
    //           WHERE  PONumber IN (:PONumber) AND OrderNumber IN (:orderNumber))"
    //     querys.push(queryDetails);
    // } else if (object.PONumber != '') {
    //     queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
    //         INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
    //          WHERE  PONumber IN (:PONumber))"
    //     querys.push(queryDetails);

    // } else if (object.orderNumber != '') {
    //     queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
    //         INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
    //          WHERE OrderNumber IN (:orderNumber))"
    //     querys.push(queryDetails);

    // }

    // if (object.comments != '') {
    //     queryDetails = "uuid IN (SELECT TicketUuid FROM TicketComments WHERE CONTAINS(Comments, :comments))"
    //     querys.push(queryDetails);
    // }
    var single = false;
    if (object.search != '') {
        whereQuery = "WHERE  createdByUuid IN (SELECT uuid FROM Users WHERE firstname LIKE :name) \
OR uuid IN (SELECT TicketUuid FROM \
AssignedUserTickets INNER JOIN Users ON Users.uuid = AssignedUserTickets.UserUuid WHERE firstname LIKE :name) \
OR  Status LIKE :name \
OR  Status LIKE :name \
OR Type  LIKE :name \
OR  id LIKE :name \
OR organizationUuid IN (SELECT uuid FROM Organizations WHERE organizationname LIKE :name) \
OR uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
             INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
              WHERE  PONumber LIKE :name OR OrderNumber LIKE :name) \
OR  CONVERT(DATE,Date) LIKE :name"
        var countCompleteQuery = countQuery + " " + whereQuery;
        var completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets " + " " + whereQuery + " " + selectOffsetQuery;

        sequelize.query(countCompleteQuery, {
            replacements: {
                name: "%" + object.search + "%"
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    sortLabel: object.sortLabel,
                    name: "%" + object.search + "%",
                    offset: offsetValue,
                    fetch: parseInt(object.pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (ticketUuid) {
                console.log('response length are ---- ', ticketUuid);

                var uuid = [];
                if (ticketUuid.length > 0) {
                    ticketUuid.forEach(element => {
                        uuid.push(element.uuid);
                    })
                } else {
                    uuid.push('');
                }
                console.log('ticket uuid values are -uuid---- ', ticketUuid, uuid);
                models.Tickets.findAll({
                    where: {
                        uuid: {
                            $in: [uuid]
                        }
                    },
                    order: [
                        [object.sortLabel, object.sortDirection]
                    ],
                    include: [{
                            model: models.Users,
                            as: 'assigned_to',
                            attributes: ['firstname']
                        }, {
                            model: models.Users,
                            as: 'created_by',
                            attributes: ['firstname']
                        }, {
                            model: models.SalesOrder,
                            as: 'salesorder',
                            attributes: ['PONumber', 'OrderNumber']
                        },
                        {
                            model: models.Organizations,
                            as: 'organization',
                            attributes: ['organizationname']
                        }
                    ]
                }).then(function (response) {
                    if (response.length != 0) {
                        // callback(response)
                        callback({
                            "count": countResponse[0].count,
                            "response": response
                        },status.ok);
                    } else {
                        callback({
                            "count": 0,
                            "response": []
                        },status.no_content);
                    }
                    console.log("after get all ticket in dao --- ", response.length);
                }).catch(function (error) {
                    console.log("after get all ticket in dao error ---- ", error);
                    callback(error, status.error)
                })

            })
        })


    } else if (object.createdBy.length === 0 && object.assignedTo.length === 0 && object.status.length === 0) {
        console.log("@@@@@@@@@@@@@@@@@@@ entering into all array null in get all tickets org id @@@@@@@@@@@@")
        var countCompleteQuery = countQuery + " WHERE " + OrgIdQuery + " OR uuid IN \
        (SELECT TicketUuid FROM AssignedUserTickets \
        INNER JOIN Users ON AssignedUserTickets.UserUuid = Users.uuid WHERE Users.organizationUuid IN (:orgId)) ";
        var completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets WHERE  " + OrgIdQuery + " OR uuid IN \
        (SELECT TicketUuid FROM AssignedUserTickets \
        INNER JOIN Users ON AssignedUserTickets.UserUuid = Users.uuid WHERE Users.organizationUuid IN (:orgId)) " + selectOffsetQuery;
        console.log('get all ticket by org id ------------------------------>', completeQuery);
        sequelize.query(countCompleteQuery, {
            replacements: {
                orgId: object.orgId
            },
            type: sequelize.QueryTypes.SELECT
        }).then(function (countResponse) {
            console.log("all filter count values are ------- ", countResponse);
            sequelize.query(completeQuery, {
                replacements: {
                    orgId: object.orgId,
                    sortLabel: object.sortLabel,
                    offset: offsetValue,
                    fetch: parseInt(object.pageSize)
                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (ticketUuid) {
                console.log('response length are ---- ', ticketUuid);

                var uuid = [];
                if (ticketUuid.length > 0) {
                    ticketUuid.forEach(element => {
                        uuid.push(element.uuid);
                    })
                } else {
                    uuid.push('');
                }
                console.log('ticket uuid values are -uuid---- ', ticketUuid, uuid);
                models.Tickets.findAll({
                    where: {
                        uuid: {
                            $in: [uuid]
                        }
                    },
                    order: [
                        [object.sortLabel, object.sortDirection]
                    ],
                    include: [{
                            model: models.Users,
                            as: 'assigned_to',
                            attributes: ['firstname']
                        }, {
                            model: models.Users,
                            as: 'created_by',
                            attributes: ['firstname']
                        }, {
                            model: models.SalesOrder,
                            as: 'salesorder',
                            attributes: ['PONumber', 'OrderNumber']
                        },
                        {
                            model: models.Organizations,
                            as: 'organization',
                            attributes: ['organizationname']
                        }
                    ]
                }).then(function (response) {
                    if (response.length != 0) {
                        // callback(response)
                        callback({
                            "count": countResponse[0].count,
                            "response": response
                        },status.ok);
                    } else {
                        callback({
                            "count": 0,
                            "response": []
                        },status.no_content);
                    }
                    console.log("after get all ticket in dao --- ", response.length);
                }).catch(function (error) {
                    console.log("after get all ticket in dao error ---- ", error);
                    callback(error, status.error)
                })

            })
        })
    } else {
        console.log("$$$$$$$$$$$$$ entering into final else part $$$$$$$$$$$$$$$$$$$")
        if (object.createdBy.length != 0) {
            queryDetails = "createdByUuid IN (SELECT uuid FROM Users WHERE firstname IN (:createdName))";
            querys.push(queryDetails);
        }
        if (object.assignedTo.length != 0) {
            queryDetails = "uuid IN (SELECT TicketUuid FROM AssignedUserTickets INNER JOIN Users ON Users.uuid = AssignedUserTickets.UserUuid WHERE firstname IN (:assignedName))"
            querys.push(queryDetails);
        }
        if (object.status.length != 0) {
            queryDetails = "Status IN (:status)"
            querys.push(queryDetails);
        }
        var count = 0;
        querys.push(OrgIdQuery);
        asyncLoop(querys, (item, next) => {
            count++;
            if (count == querys.length) {
                next();
            } else {
                whereQuery = whereQuery + item + " " + 'AND' + " "
                next();
            }
        }, function (err) {

            if (err) {

            } else {
                completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets " + "  WHERE  " + whereQuery + " " + querys[querys.length - 1] + "OR uuid IN \
                (SELECT TicketUuid FROM AssignedUserTickets \
                INNER JOIN Users ON AssignedUserTickets.UserUuid = Users.uuid WHERE Users.organizationUuid IN (:orgId))  " + selectOffsetQuery;
                countCompleteQuery = countQuery + "  WHERE  " + whereQuery + " " + querys[querys.length - 1] + "OR uuid IN \
                (SELECT TicketUuid FROM AssignedUserTickets \
                INNER JOIN Users ON AssignedUserTickets.UserUuid = Users.uuid WHERE Users.organizationUuid IN (:orgId))  ";
                console.log('$$$ complete query values are ----------- ', completeQuery, countCompleteQuery);


                sequelize.query(countCompleteQuery, {
                    replacements: {
                        orgId: object.orgId,
                        createdName: object.createdBy,
                        assignedName: object.assignedTo,
                        status: object.status
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (countResponse) {
                    sequelize.query(completeQuery, {
                        replacements: {
                            orgId: object.orgId,
                            createdName: object.createdBy,
                            assignedName: object.assignedTo,
                            status: object.status,
                            sortLabel: object.sortLabel,
                            offset: offsetValue,
                            fetch: parseInt(object.pageSize)
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (ticketUuid) {
                        console.log('filter ticket uuid are ------- ', ticketUuid)
                        var uuid = [];
                        if (ticketUuid.length > 0) {
                            ticketUuid.forEach(element => {
                                uuid.push(element.uuid);
                            })
                        } else {
                            uuid.push('');
                        }
                        models.Tickets.findAll({
                            where: {
                                uuid: {
                                    $in: [uuid]
                                }
                            },
                            order: [
                                [object.sortLabel, object.sortDirection]
                            ],
                            include: [{
                                    model: models.Users,
                                    as: 'assigned_to',
                                    attributes: ['firstname']
                                }, {
                                    model: models.Users,
                                    as: 'created_by',
                                    attributes: ['firstname']
                                }, {
                                    model: models.SalesOrder,
                                    as: 'salesorder',
                                    attributes: ['PONumber', 'OrderNumber']
                                },
                                {
                                    model: models.Organizations,
                                    as: 'organization',
                                    attributes: ['organizationname']
                                }
                            ]
                        }).then(function (response) {
                            if (response.length != 0) {
                                var response2 = [];

                                response.forEach(element => {
                                    //console.log("element0--------------->",element) 
                                    if (object.createdBy.length != 0) {
                                        if (object.createdBy[0] === element.created_by.firstname) {
                                            response2.push(element);
                                        }
                                    }

                                    if (object.assignedTo.length != 0) {
                                        console.log("element0--------------->", element.assigned_to[0].dataValues.firstname)
                                        if (object.assignedTo[0] === element.assigned_to[0].dataValues.firstname) {
                                            response2.push(element);
                                        }
                                    }

                                    if (object.status.length != 0) {
                                        if (object.status[0] === element.dataValues.Status) {
                                            response2.push(element);
                                        }
                                    }

                                })

                                callback({
                                    "count": countResponse[0].count - (countResponse[0].count - response2.length),
                                    "response": response2
                                },status.ok);

                            } else {
                                callback({
                                    "count": 0,
                                    "response": []
                                },status.no_content);
                            }
                        }).catch(function (error) {
                            console.log("after get all ticket in dao error ---- ", error);
                            callback(error, status.error)
                        })
                    }).catch(function (error) {
                        console.log('entering in finding uuid are ---- ', error);
                        callback(error, status.error);
                    })
                }).catch(function (error) {
                    callback(error, status.error);
                })

            }
        })
    }
}
module.exports.searchDetails = function (object, callback) {
    console.log('search details in dao mthod ---- ', object)
    var selectQuery = "SELECT uuid FROM Tickets WHERE";
    var countQuery = "SELECT COUNT(*)N'count' FROM Tickets";
    var whereQuery = '',
        completeQuery = '';
    var querys = [];
    var queryDetails = '';
    var offsetValue = parseInt(object.pageSize) * (parseInt(object.pageIndex));
    selectOffsetQuery = "ORDER BY :sortLabel  " + object.sortDirection.toUpperCase() + "  OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    if (object.PONumber != '' && object.orderNumber != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
             INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
              WHERE  PONumber IN (:PONumber) AND OrderNumber IN (:orderNumber))"
        querys.push(queryDetails);
    } else if (object.PONumber != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
            INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
             WHERE  PONumber IN (:PONumber))"
        querys.push(queryDetails);

    } else if (object.orderNumber != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
            INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
             WHERE OrderNumber IN (:orderNumber))"
        querys.push(queryDetails);

    }
    if (object.createdName != '') {
        queryDetails = "createdByUuid IN (SELECT uuid FROM Users WHERE firstname IN (:createdName))";
        querys.push(queryDetails);
    }
    if (object.createDate != '') {
        console.log('created date entering into if condition')
        queryDetails = "CONVERT(DATE,Date) IN (:createdDate)";
        querys.push(queryDetails);
    }
    if (object.assignedName != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM AssignedUserTickets INNER JOIN Users ON Users.uuid = AssignedUserTickets.UserUuid WHERE firstname IN (:assignedName))"
        querys.push(queryDetails);
    }
    if (object.comments != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM TicketComments WHERE CONTAINS(Comments, :comments))"
        querys.push(queryDetails);
    }
    var count = 0;
    asyncLoop(querys, (item, next) => {
        count++;

        if (count == querys.length) {
            next();
        } else {
            whereQuery = whereQuery + item + " " + 'AND' + " "
            next();
        }
    }, function (err) {

        if (err) {

        } else {

            completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets " + "  WHERE  " + whereQuery + " " + querys[querys.length - 1] + " " + selectOffsetQuery;
            countCompleteQuery = countQuery + "  WHERE  " + whereQuery + " " + querys[querys.length - 1];
            console.log('$$$ complete query values are --search details--------- ', completeQuery, countCompleteQuery);
            sequelize.query(countCompleteQuery, {
                replacements: {
                    PONumber: object.PONumber,
                    orderNumber: object.orderNumber,
                    createdName: object.createdName,
                    assignedName: object.assignedName,
                    createdDate: object.createDate,
                    comments: '"' + object.comments + '"',
                    orgId: object.orgId

                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (countResponse) {
                sequelize.query(completeQuery, {
                    replacements: {
                        PONumber: object.PONumber,
                        orderNumber: object.orderNumber,
                        createdName: object.createdName,
                        assignedName: object.assignedName,
                        createdDate: object.createDate,
                        comments: '"' + object.comments + '"',
                        orgId: object.orgId,
                        sortLabel: object.sortLabel,
                        offset: offsetValue,
                        fetch: parseInt(object.pageSize)
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (ticketUuid) {
                    console.log('filter ticket uuid are ------- ', ticketUuid)
                    var uuid = [];
                    if (ticketUuid.length > 0) {
                        ticketUuid.forEach(element => {
                            uuid.push(element.uuid);
                        })
                    } else {
                        uuid.push('');
                    }
                    models.Tickets.findAll({
                        where: {
                            uuid: {
                                $in: [uuid]
                            }
                        },
                        order: [
                            [object.sortLabel, object.sortDirection]
                        ],
                        include: [{
                                model: models.Users,
                                as: 'assigned_to',
                                attributes: ['firstname']
                            }, {
                                model: models.Users,
                                as: 'created_by',
                                attributes: ['firstname']
                            }, {
                                model: models.SalesOrder,
                                as: 'salesorder',
                                attributes: ['PONumber', 'OrderNumber']
                            },
                            {
                                model: models.Organizations,
                                as: 'organization',
                                attributes: ['organizationname']
                            }
                        ]
                    }).then(function (response) {
                        if (response.length != 0) {
                            callback({
                                "count": countResponse[0].count,
                                "response": response
                            }, status.ok);
                        } else {
                            callback({
                                "count": 0,
                                "response": []
                            }, status.no_content);
                        }
                    }).catch(function (error) {
                        console.log("after get all ticket in dao error ---- ", error);
                        callback(error, status.error)
                    })
                }).catch(function (error) {
                    console.log('entering in finding uuid are ---- ', error);
                    callback(error, status.error);
                })
            }).catch(function (error) {
                callback(error, status.error);
            })


            // completeQuery = selectQuery + " " + whereQuery + " " + querys[querys.length - 1];
            // sequelize.query(completeQuery, {
            //     replacements: {
            //         PONumber: object.PONumber,
            //         orderNumber: object.orderNumber,
            //         createdName: object.createdName,
            //         assignedName: object.assignedName,
            //         createdDate: object.createDate,
            //         comments: '"' + object.comments + '"'
            //     },
            //     type: sequelize.QueryTypes.SELECT
            // }).then(function (ticketUuid) {
            //     var uuid = [];
            //     if (ticketUuid.length > 0) {
            //         ticketUuid.forEach(element => {
            //             uuid.push(element.uuid);
            //         })
            //     } else {
            //         uuid.push('');
            //     }
            //     models.Tickets.findAll({
            //         where: {
            //             uuid: {
            //                 $in: [uuid]
            //             }
            //         },
            //         order: [
            //             ['Date', 'DESC']
            //         ],
            //         include: [{
            //                 model: models.Users,
            //                 as: 'assigned_to',
            //                 attributes: ['firstname']
            //             }, {
            //                 model: models.Users,
            //                 as: 'created_by',
            //                 attributes: ['firstname']
            //             }, {
            //                 model: models.SalesOrder,
            //                 as: 'salesorder',
            //                 attributes: ['PONumber', 'OrderNumber']
            //             },
            //             {
            //                 model: models.Organizations,
            //                 as: 'organization',
            //                 attributes: ['organizationname']
            //             }
            //         ]
            //     }).then(function (response) {
            //         if (response.length != 0) {
            //             callback(response)
            //         } else {
            //             callback([])
            //         }
            //     }).catch(function (error) {
            //         console.log("after get all ticket in dao error ---- ", error);
            //         callback(error, status.error)
            //     })
            // }).catch(function (error) {
            //     console.log('entering in finding uuid are ---- ', error);
            //     callback(error, status.error);
            // })

        }
    })
}


module.exports.searchDetailsByOrgId = function (object, callback) {
    console.log('search details org id in dao mthod --@@@@-- ', object)
    var selectQuery = "SELECT uuid FROM Tickets WHERE";
    var countQuery = "SELECT COUNT(*)N'count' FROM Tickets";
    var whereQuery = '',
        completeQuery = '';
    var querys = [];
    var queryDetails = '';
    var offsetValue = parseInt(object.pageSize) * (parseInt(object.pageIndex));
    console.log('offset values are in org id are ---- ', offsetValue);
    selectOffsetQuery = "ORDER BY :sortLabel  " + object.sortDirection.toUpperCase() + "  OFFSET (:offset) ROWS FETCH NEXT (:fetch) ROWS ONLY";
    if (object.orgId != '') {
        queryDetails = "organizationUuid IN (:orgId)"
        querys.push(queryDetails);
    }
    if (object.PONumber != '' && object.orderNumber != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
             INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
              WHERE  PONumber IN (:PONumber) AND OrderNumber IN (:orderNumber))"
        querys.push(queryDetails);
    } else if (object.PONumber != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
            INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
             WHERE  PONumber IN (:PONumber))"
        querys.push(queryDetails);

    } else if (object.orderNumber != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM SalesOrderTickets \
            INNER JOIN SalesOrder ON SalesOrder.OrderID = SalesOrderTickets.SalesOrderOrderID \
             WHERE OrderNumber IN (:orderNumber))"
        querys.push(queryDetails);

    }
    if (object.createdName != '') {
        queryDetails = "createdByUuid IN (SELECT uuid FROM Users WHERE firstname IN (:createdName))";
        querys.push(queryDetails);
    }
    if (object.createDate != '') {
        console.log('created date entering into if condition')
        queryDetails = "CONVERT(DATE,Date) IN (:createdDate)";
        querys.push(queryDetails);
    }
    if (object.assignedName != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM AssignedUserTickets INNER JOIN Users ON Users.uuid = AssignedUserTickets.UserUuid WHERE firstname IN (:assignedName))"
        querys.push(queryDetails);
    }
    if (object.comments != '') {
        queryDetails = "uuid IN (SELECT TicketUuid FROM TicketComments WHERE CONTAINS(Comments, :comments))"
        querys.push(queryDetails);
    }
    var count = 0;
    asyncLoop(querys, (item, next) => {
        count++;
        console.log('items are ----- ', item);

        if (count == querys.length) {
            next();
        } else {
            whereQuery = whereQuery + item + " " + 'AND' + " "
            next();
        }
    }, function (err) {

        if (err) {

        } else {


            completeQuery = "SELECT uuid," + object.sortLabel + "  FROM Tickets " + "  WHERE  " + whereQuery + " " + querys[querys.length - 1] + " " + selectOffsetQuery;
            countCompleteQuery = countQuery + "  WHERE  " + whereQuery + " " + querys[querys.length - 1];
            console.log('$$$ complete query values are --org id---------> ', completeQuery);
            sequelize.query(countCompleteQuery, {
                replacements: {
                    PONumber: object.PONumber,
                    orderNumber: object.orderNumber,
                    createdName: object.createdName,
                    assignedName: object.assignedName,
                    createdDate: object.createDate,
                    comments: '"' + object.comments + '"',
                    orgId: object.orgId

                },
                type: sequelize.QueryTypes.SELECT
            }).then(function (countResponse) {
                sequelize.query(completeQuery, {
                    replacements: {
                        PONumber: object.PONumber,
                        orderNumber: object.orderNumber,
                        createdName: object.createdName,
                        assignedName: object.assignedName,
                        createdDate: object.createDate,
                        comments: '"' + object.comments + '"',
                        orgId: object.orgId,
                        sortLabel: object.sortLabel,
                        offset: offsetValue,
                        fetch: parseInt(object.pageSize)
                    },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (ticketUuid) {
                    console.log('filter ticket uuid are ------- ', ticketUuid)
                    var uuid = [];




                    var whereQuery2 = "uuid IN (SELECT TicketUuid FROM AssignedUserTickets INNER JOIN Users ON AssignedUserTickets.UserUuid = Users.uuid WHERE Users.organizationUuid IN (:orgId)) AND "

                    var completeQuery2 = "SELECT uuid," + object.sortLabel + "  FROM Tickets " + "  WHERE  " + whereQuery2 + " " + querys[querys.length - 1] + " " + selectOffsetQuery;


                    sequelize.query(completeQuery2, {
                        replacements: {
                            PONumber: object.PONumber,
                            orderNumber: object.orderNumber,
                            createdName: object.createdName,
                            assignedName: object.assignedName,
                            createdDate: object.createDate,
                            comments: '"' + object.comments + '"',
                            orgId: object.orgId,
                            sortLabel: object.sortLabel,
                            offset: offsetValue,
                            fetch: parseInt(object.pageSize)
                        },
                        type: sequelize.QueryTypes.SELECT
                    }).then(function (ticketUuid2) {
                        console.log('filter ticket uuid are ------- ', ticketUuid)


                        if (ticketUuid2.length > 0) {
                            ticketUuid2.forEach(element1 => {
                                uuid.push(element1.uuid);
                            })
                        }

                        if (ticketUuid.length > 0) {
                            ticketUuid.forEach(element => {
                                uuid.push(element.uuid);
                            })
                        } else {
                            uuid.push('');
                        }
                        models.Tickets.findAll({
                            where: {
                                uuid: {
                                    $in: [uuid]
                                }
                            },
                            order: [
                                [object.sortLabel, object.sortDirection]
                            ],
                            include: [{
                                    model: models.Users,
                                    as: 'assigned_to',
                                    attributes: ['firstname']
                                }, {
                                    model: models.Users,
                                    as: 'created_by',
                                    attributes: ['firstname']
                                }, {
                                    model: models.SalesOrder,
                                    as: 'salesorder',
                                    attributes: ['PONumber', 'OrderNumber']
                                },
                                {
                                    model: models.Organizations,
                                    as: 'organization',
                                    attributes: ['organizationname']
                                }
                            ]
                        }).then(function (response) {
                            if (response.length != 0) {
                                callback({
                                    "count": countResponse[0].count + ticketUuid2.length,
                                    "response": response
                                },status.ok);
                            } else {
                                callback({
                                    "count": 0,
                                    "response": []
                                },status.no_content);
                            }
                        }).catch(function (error) {
                            console.log("after get all ticket in dao error ---- ", error);
                            callback(error, status.error)
                        })
                    })
                }).catch(function (error) {
                    console.log('entering in finding uuid are ---- ', error);
                    callback(error, status.error);
                })
            }).catch(function (error) {
                console.log('error in count are ---- ', error);
                callback(error, status.error);
            })



            // completeQuery = selectQuery + " " + whereQuery + " " + querys[querys.length - 1];
            // console.log('async loop data are ----- ', completeQuery);
            // sequelize.query(completeQuery, {
            //     replacements: {
            //         PONumber: object.PONumber,
            //         orderNumber: object.orderNumber,
            //         createdName: object.createdName,
            //         assignedName: object.assignedName,
            //         createdDate: object.createDate,
            //         comments: '"' + object.comments + '"',
            //         orgId: object.orgId
            //     },
            //     type: sequelize.QueryTypes.SELECT
            // }).then(function (ticketUuid) {
            //     var uuid = [];
            //     if (ticketUuid.length > 0) {
            //         ticketUuid.forEach(element => {
            //             uuid.push(element.uuid);
            //         })
            //     } else {
            //         uuid.push('');
            //     }
            //     models.Tickets.findAll({
            //         where: {
            //             uuid: {
            //                 $in: [uuid]
            //             }
            //         },
            //         order: [
            //             ['Date', 'DESC']
            //         ],
            //         include: [{
            //                 model: models.Users,
            //                 as: 'assigned_to',
            //                 attributes: ['firstname']
            //             }, {
            //                 model: models.Users,
            //                 as: 'created_by',
            //                 attributes: ['firstname']
            //             }, {
            //                 model: models.SalesOrder,
            //                 as: 'salesorder',
            //                 attributes: ['PONumber', 'OrderNumber']
            //             },
            //             {
            //                 model: models.Organizations,
            //                 as: 'organization',
            //                 attributes: ['organizationname']
            //             }
            //         ]
            //     }).then(function (response) {
            //         if (response.length != 0) {
            //             callback(response)
            //         } else {
            //             callback([])
            //         }
            //     }).catch(function (error) {
            //         console.log("after get all ticket in dao error ---- ", error);
            //         callback(error, status.error)
            //     })
            // }).catch(function (error) {
            //     console.log('entering in finding uuid are ---- ', error);
            //     callback(error, status.error);
            // })

        }
    })
}