var models = require("../models");


module.exports.getpriorityticket = function (callback) {
    models.Tickets.findAll({
        include: [
            {
                model: models.TicketAttachments,
                as: 'attachments',
            }]
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getpriorityticket_date = function (callback) {
    models.StahlsConfig.findOne({
        where: { name: 'ticketprioritydate' }
    }).then(function (response) {
        callback(response)
    }).catch(function (response) {
        callback(response)
    })
}