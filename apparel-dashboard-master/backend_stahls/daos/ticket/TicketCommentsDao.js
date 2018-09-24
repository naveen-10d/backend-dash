var models = require("../../models");
var Sequelize = require('sequelize');
var confi = require('../../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);
var status = require("../../config/status");



module.exports.create_Ticketcomments = function (Ticketcomments, callback) {
    models.TicketComments.create(Ticketcomments).then(function (response) {
        callback(response, status.created)
    }).catch(function (error) {
        callback(error, status.error)
    })
}

module.exports.getall_ticketcomments = function (ticketId, callback) {
    models.TicketComments.findAll({
        where: {
            TicketUuid: ticketId
        },
        order: [
            ['CommentDate', 'DESC']
        ]
    }, ).then(function (response) {
        if (response.length != 0) {
            callback(response, status.ok)
        } else {
            callback("There is no Comments", status.no_content)
        }

    }).catch(function (error) {
        callback(error, status.error);
    })
}

// "SELECT [Tickets].[uuid], [Tickets].[id], [Tickets].[Date], [Tickets].[Type], [Tickets].[description], [Tickets].[Status], [Tickets].[CloseReasonUuid], [Tickets].[createdByUuid], [Tickets].[organizationUuid], [Tickets].[UserUuid], [assigned_to]. [uuid] AS[assigned_to.uuid], [assigned_to]. [firstname] AS[assigned_to.firstname], [assigned_to - > AssignedUserTickets]. [id] AS[assigned_to.AssignedUserTickets.id], [assigned_to - > AssignedUserTickets]. [TicketUuid] AS[assigned_to.AssignedUserTickets.TicketUuid], \
//     [assigned_to - > AssignedUserTickets]. [UserUuid] AS[assigned_to.AssignedUserTickets.UserUuid], \
//     [created_by]. [uuid] AS[created_by.uuid], [created_by]. [firstname] AS[created_by.firstname], \
//     [salesorder]. [OrderID] AS[salesorder.OrderID], [salesorder]. [PONumber] AS[salesorder.PONumber], [salesorder]. [OrderNumber] AS[salesorder.OrderNumber], [salesorder - > SalesOrderTickets]. [SalesOrderOrderID] AS[salesorder.SalesOrderTickets.SalesOrderOrderID], [salesorder - > SalesOrderTickets]. [TicketUuid] AS[salesorder.SalesOrderTickets.TicketUuid], \
//     [organization]. [uuid] AS[organization.uuid], [organization]. [organizationname] AS[organization.organizationname] \
// FROM[Tickets] AS[Tickets] \
// LEFT OUTER JOIN([AssignedUserTickets] AS[assigned_to - > AssignedUserTickets] INNER JOIN[Users] AS[assigned_to] ON[assigned_to]. [uuid] = [assigned_to - > AssignedUserTickets]. [UserUuid]) ON[Tickets]. [uuid] = [assigned_to - > AssignedUserTickets]. [TicketUuid] \
// LEFT OUTER JOIN[Users] AS[created_by] ON[Tickets]. [createdByUuid] = [created_by]. [uuid] \
// LEFT OUTER JOIN([SalesOrderTickets] AS[salesorder - > SalesOrderTickets] INNER JOIN[SalesOrder] AS[salesorder] ON[salesorder]. [OrderID] = [salesorder - > SalesOrderTickets]. [SalesOrderOrderID]) ON[Tickets]. [uuid] = [salesorder - > SalesOrderTickets]. [TicketUuid] \
// LEFT OUTER JOIN[Organizations] AS[organization] ON [Tickets]. [organizationUuid] = [organization]. [uuid] WHERE [Tickets].[uuid] IN (SELECT TicketUuid \
//     FROM StahlsDevelopment.dbo.TicketComments WHERE FREETEXT((Comments),:comments)) ORDER BY[Tickets]. [Date] DESC;"

module.exports.getTicketsByComment = function (comment, callback) {
    console.log('entering into comments dao -- ', comment);
    // sequelize.query("SELECT Tickets.uuid,Tickets.id,Users.firstname FROM Tickets INNER JOIN Users on Users.uuid = Tickets.createdByUuid WHERE Tickets.uuid IN (SELECT TicketUuid \
    // FROM StahlsDevelopment.dbo.TicketComments WHERE FREETEXT((Comments),:comments))", {
    //     replacements: {
    //         comments: comment
    //     },
    //     type: sequelize.QueryTypes.SELECT
    // }).

    //     sequelize.query("SELECT DISTINCT [Tickets].[uuid], [Tickets].[id], [Tickets].[Date], [Tickets].[Type], [Tickets].[description], [Tickets].[Status], [Tickets].[CloseReasonUuid], [Tickets].[createdByUuid], [Tickets].[organizationUuid], [Tickets].[UserUuid], [assigned_to]. [uuid] AS[assigned_to.uuid], [assigned_to]. [firstname] AS[assigned_to.firstname], [assigned_to - > AssignedUserTickets]. [id] AS[assigned_to.AssignedUserTickets.id], [assigned_to - > AssignedUserTickets]. [TicketUuid] AS[assigned_to.AssignedUserTickets.TicketUuid], \
    //     [assigned_to - > AssignedUserTickets]. [UserUuid] AS[assigned_to.AssignedUserTickets.UserUuid], \
    //     [created_by]. [uuid] AS[created_by.uuid], [created_by]. [firstname] AS[created_by.firstname], \
    //     [salesorder]. [OrderID] AS[salesorder.OrderID], [salesorder]. [PONumber] AS[salesorder.PONumber], [salesorder]. [OrderNumber] AS[salesorder.OrderNumber], [salesorder - > SalesOrderTickets]. [SalesOrderOrderID] AS[salesorder.SalesOrderTickets.SalesOrderOrderID], [salesorder - > SalesOrderTickets]. [TicketUuid] AS[salesorder.SalesOrderTickets.TicketUuid], \
    //     [organization]. [uuid] AS[organization.uuid], [organization]. [organizationname] AS[organization.organizationname] \
    // FROM[Tickets] AS[Tickets] \
    // LEFT OUTER JOIN([AssignedUserTickets] AS[assigned_to - > AssignedUserTickets] INNER JOIN[Users] AS[assigned_to] ON[assigned_to]. [uuid] = [assigned_to - > AssignedUserTickets]. [UserUuid]) ON[Tickets]. [uuid] = [assigned_to - > AssignedUserTickets]. [TicketUuid] \
    // LEFT OUTER JOIN[Users] AS[created_by] ON[Tickets]. [createdByUuid] = [created_by]. [uuid] \
    // LEFT OUTER JOIN([SalesOrderTickets] AS[salesorder - > SalesOrderTickets] INNER JOIN[SalesOrder] AS[salesorder] ON[salesorder]. [OrderID] = [salesorder - > SalesOrderTickets]. [SalesOrderOrderID]) ON[Tickets]. [uuid] = [salesorder - > SalesOrderTickets]. [TicketUuid] \
    // LEFT OUTER JOIN[Organizations] AS[organization] ON [Tickets]. [organizationUuid] = [organization]. [uuid] WHERE [Tickets].[uuid] IN (SELECT TicketUuid \
    //     FROM StahlsDevelopment.dbo.TicketComments WHERE FREETEXT((Comments),:comments)) ORDER BY[Tickets]. [Date] DESC;", {
    //         replacements: {
    //             comments: comment
    //         },
    //         type: sequelize.QueryTypes.SELECT
    //     }).then(function (response) {
    //         callback(response);
    //     }).catch(function (error) {
    //         callback(error);
    //     })

    sequelize.query("SELECT uuid FROM Tickets WHERE uuid IN (SELECT TicketUuid \
        FROM TicketComments WHERE FREETEXT((Comments), :comments))", {
        replacements: {
            comments: comment
        },
        type: sequelize.QueryTypes.SELECT
    }).then(function (ticketUuid) {
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
                callback(response)
            } else {
                callback("There is no Tickets")
            }
            console.log("after get all ticket in dao --- ", response);
        }).catch(function (error) {
            console.log("after get all ticket in dao error ---- ", error);
            callback(error)
        })
    }).catch(function (error) {
        callback(error);
    })


}


//get comments by code

module.exports.getTicketsByCommentCode = function (comment, code, callback) {
    console.log('entering into comments code dao -- ', comment, code);
    sequelize.query("SELECT uuid FROM Tickets WHERE organizationUuid = :organizationUuid AND  uuid IN (SELECT TicketUuid \
        FROM StahlsDevelopment.dbo.TicketComments WHERE FREETEXT((Comments), :comments))", {
        replacements: {
            comments: comment,
            organizationUuid: code
        },
        type: sequelize.QueryTypes.SELECT
    }).then(function (ticketUuid) {
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
                callback(response)
            } else {
                callback("There is no Tickets")
            }
            console.log("after get all ticket in dao --- ", response);
        }).catch(function (error) {
            console.log("after get all ticket in dao error ---- ", error);
            callback(error)
        })
    }).catch(function (error) {
        callback(error);
    })


}