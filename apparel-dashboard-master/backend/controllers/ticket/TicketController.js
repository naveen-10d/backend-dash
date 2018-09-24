var TicketService = require("../../services/ticket/TicketService")
/**
 * Create Ticket for User
 * @param {Ticket} req
 * @param {Created Object with the UUID} res
 */
module.exports.create_Ticket = function (req, res) {
    var TicketDetails = req.body;
    TicketService.create_Ticket(TicketDetails, function (response) {
        res.json(response);
        res.status(201);
    })
}

/**
 * Get All Tickets
 * @param { No values} req
 * @param {List of Tickets} res
 */
module.exports.getall_ticket = function (req, res) {
    TicketService.getall_ticket(function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 * Get Ticket By Ticket Id
 * @param {Ticket UUID} req
 * @param {Get Ticket based on ticket uuid} res
 */
module.exports.getticketById = function (req, res) {
    var Ticket_id = req.params.uuid;
    TicketService.getticketById(Ticket_id, function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 * Get Ticket By User Id
 * @param {User UUID} req
 * @param {List of tickets based on User UUID} res
 */
module.exports.getticketByUserId = function (req, res) {
    var UserId = req.params.uuid;
    TicketService.getticketByUserId(UserId, function (response) {
        res.json(response);
        res.status(200);
    })
}
/**
 * Get all assigned tickets for user
 * @param {Ticket} req
 * @param {list of assigned tickets} res
 */
module.exports.getticketByAssignTo = function (req, res) {
    var assignTo = req.params.uuid;
    TicketService.getticketByAssignTo(assignTo, function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 * To Update the existing ticket by ID
 * @param {Ticket} req
 * @param {Updated Ticket } res
 */
module.exports.update_ticket = function (req, res) {
    var TicketDetails = req.body;
    TicketService.update_ticket(TicketDetails, function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 * Delete ticket based on the tiket UUID
 * @param {Ticket Id as request param} req
 * @param {deleted ticket count } res
 */
module.exports.delete_ticket = function (req, res) {
    var Ticket_id = req.params.uuid;
    TicketService.delete_ticket(Ticket_id, function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * @param { Ticket status and user id } req
 * @param {list of ticket based on status and user id } res
 */
module.exports.getticketByStatus_UserId = function (req, res) {
    var Ticket_Status = req.body.status;
    var User_id = req.body.UserUuid;
    TicketService.getticketByStatus_UserId(Ticket_Status, User_id, function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * @param {Ticket Status} req
 * @param { Lsit of Ticket Based on status} res
 *
 */
module.exports.getticketByStatus = function (req, res) {
    var Ticket_Status = req.params.status;
    TicketService.getticketByStatus(Ticket_Status, function (response) {
        res.json(response);
        res.status(200);
    })
}
/**
 * Search Tickets based on status
 * @param { Ticket status} req
 * @param { list of ticket as per tickets} res
 */
module.exports.searchticket = function (req, res) {
    var status = req.params.status;
    var assignTo = req.params.assignTo;
    var SearchDetails = {
        Status: status,
        AssignTo: assignTo
    }
    TicketService.searchticket(SearchDetails, function (response) {
        res.json(response);
        res.status(200);
    })
}
