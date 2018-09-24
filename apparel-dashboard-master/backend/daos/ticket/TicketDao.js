
var models = require("../../models")

module.exports.create_Ticket = function (TicketDetails, callback) {
    models.Tickets.create(TicketDetails).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getall_ticket = function (callback) {
    models.Tickets.findAll({
        include: [{
            model: models.Users,
            as: 'user',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.Users,
            as: 'assignto',
            attributes: {
                exclude: ['password']
            },
        }, {
            model: models.TicketAttachments,
            as: 'attachments',
            hierarchy: true,
            attributes: ['uuid', 'attachmenturl', 'filename', 'TicketUuid']
        }]
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getticketById = function (Ticket_id, callback) {
    models.Tickets.find({
        where: { uuid: Ticket_id },
        include: [{
            model: models.Users,
            as: 'user',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.Users,
            as: 'assignto',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.TicketAttachments,
            as: 'attachments',
            hierarchy: true,
            attributes: ['uuid', 'attachmenturl', 'filename', 'TicketUuid']
        }]
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getticketByUserId = function (UserId, callback) {
    models.Tickets.findAll({
        where: { UserUuid: UserId },
        include: [{
            model: models.Users,
            as: 'user',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.Users,
            as: 'assignto',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.TicketAttachments,
            as: 'attachments',
            hierarchy: true,
            attributes: ['uuid', 'attachmenturl', 'filename', 'TicketUuid']
        }]
    }).then(function (response) {
        if (response != 0) {
            callback(response)
        }
        else {
            callback(null)
        }
    }).catch(function (error) {
        callback(error)
    })
}


module.exports.getticketByAssignTo = function (assignTo, callback) {
    models.Tickets.findAll({
        where: { assignTo: assignTo },
        include: [{
            model: models.Users,
            as: 'user',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.Users,
            as: 'assignto',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.TicketAttachments,
            as: 'attachments',
            hierarchy: true,
            attributes: ['uuid', 'attachmenturl', 'filename', 'TicketUuid']
        }]
    }).then(function (response) {
        if (response != 0) {
            callback(response)
        }
        else {
            callback(null)
        }
    }).catch(function (error) {
        callback(error)
    })
}


module.exports.update_ticket = function (TicketDetails, callback) {
    models.Tickets.update(TicketDetails, { where: { uuid: TicketDetails.uuid } }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.delete_ticket = function (Ticket_id, callback) {
    models.Tickets.destroy({ where: { uuid: Ticket_id } }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getticketByStatus_UserId = function (Ticket_Status, User_id, callback) {

    models.Tickets.findAll({
        where: { status: Ticket_Status, UserUuid: User_id },
        include: [{
            model: models.Users,
            as: 'user',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.Users,
            as: 'assignto',
            attributes: {
                exclude: ['password']
            }
        }, {
            model: models.TicketAttachments,
            as: 'attachments',
            hierarchy: true,
            attributes: ['uuid', 'attachmenturl', 'filename', 'TicketUuid']
        }]
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getticketByStatus = function (Ticket_Status, callback) {
    models.Tickets.findAll({
        where: { status: Ticket_Status },
        include: [{
            model: models.Users,
            as: 'user',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.Users,
            as: 'assignto',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.TicketAttachments,
            as: 'attachments',
            hierarchy: true,
            attributes: ['uuid', 'attachmenturl', 'filename', 'TicketUuid']
        }
        ]
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.searchticket = function (SearchDetails, callback) {
    var elements = [];
    if (SearchDetails.Priority == null || SearchDetails.Status == null) {
        elements = [
            {
                assignTo: { $eq: SearchDetails.AssignTo }
            },
            {
                status: { $eq: SearchDetails.Status }
            }
        ]
    }
    else {
        elements = [{
            assignTo: { $eq: SearchDetails.AssignTo },
            status: { $eq: SearchDetails.Status }
        }]
    }

    models.Tickets.findAll({
        where: { $or: elements },
        include: [{
            model: models.Users,
            as: 'user',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.Users,
            as: 'assignto',
            attributes: {
                exclude: ['password']
            }
        },
        {
            model: models.TicketAttachments,
            as: 'attachments',
            hierarchy: true,
            attributes: ['uuid', 'attachmenturl', 'filename', 'TicketUuid']
        }
        ]

    }).then(usersdata => {
        callback(usersdata)
    }).catch(function (error) {
        callback(error)
    })
}