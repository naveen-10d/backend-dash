var TicketDao = require("../../daos/ticket/TicketDao")
var async = require("async")
var DateDiff = require('date-diff');


module.exports.create_Ticket = function (TicketDetails, callback) {
    TicketDao.create_Ticket(TicketDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.getall_ticket = function (callback) {
    TicketDao.getall_ticket(function (response, status) {
        callback(response, status);
    })
}

module.exports.getticketById = function (Ticket_id, callback) {
    TicketDao.getticketById(Ticket_id, function (response, status) {
        callback(response, status);
    })
}

module.exports.getticketByOrgId = function (uuid, callback) {
    TicketDao.getticketByOrgId(uuid, function (response, status) {
        callback(response, status);
    })
}

module.exports.getticketByUserId = function (UserId, callback) {
    TicketDao.getticketByUserId(UserId, function (response, status) {
        callback(response, status);
    })
}

module.exports.update_ticket = function (TicketDetails, callback) {
    TicketDao.update_ticket(TicketDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.Removeassigneduser = function (TicketDetails, callback) {
    TicketDao.Removeassigneduser(TicketDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.delete_ticket = function (Ticket_id, callback) {
    TicketDao.delete_ticket(Ticket_id, function (response, status) {
        callback(response, status);
    })
}

module.exports.getticketByStatus_UserId = function (Ticket_Status, User_id, callback) {
    TicketDao.getticketByStatus_UserId(Ticket_Status, User_id, function (response, status) {
        callback(response, status);
    })
}

module.exports.getticketByStatus = function (Ticket_Status, callback) {
    TicketDao.getticketByStatus(Ticket_Status, function (response, status) {
        callback(response, status);
    })
}

// module.exports.searchDetails = function (poNumber, orderNumber, createdDate,
//     createdName, assignedName, comments, callback) {
//     TicketDao.searchDetails(poNumber, orderNumber, createdDate,
//         createdName, assignedName, comments,
//         function (response, status) {
//             callback(response, status);
//         })
// }

module.exports.getFilterValue = function (callback) {
    TicketDao.getFilterValue(function (response, status) {
        callback(response, status);
    })
}

module.exports.getFilterByOrgId = function (orgID, callback) {
    TicketDao.getFilterByOrgId(orgID, function (response, status) {
        callback(response, status);
    })
}

module.exports.getAllTickets = function(object,callback) {
    TicketDao.getAllTickets(object,function(response, status){
        callback(response, status);
    })
}

module.exports.getAllTicketByOrgId = function (arrayValue, callback) {
    TicketDao.getAllTicketByOrgId(arrayValue, function (response, status) {
        callback(response, status);
    })
}

module.exports.searchDetails = function (object, callback) {
    TicketDao.searchDetails(object,
        function (response, status) {
            callback(response, status);
        })
}

module.exports.searchDetailsByOrgId = function (object, callback) {
    TicketDao.searchDetailsByOrgId(object,
        function (response, status) {
            callback(response, status);
        })
}