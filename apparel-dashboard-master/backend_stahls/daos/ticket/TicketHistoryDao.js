var models = require("../../models");
var status = require("../../config/status");

module.exports.update_Tickethistory = function (Tickethistory, callback) {
    models.TicketsHistory.create(Tickethistory).then(function (response) {
        callback(response, status.ok)
    }).catch(function (error) {
        callback(error, status.error)
    })
}

module.exports.getall_Tickethistory = function (TicketDetials, callback) {
    models.TicketsHistory.findAll({
        where: { TicketUuid: TicketDetials },
        order: [
            ['Date', 'DESC']
        ]
    }).then(function (response) {
        callback(response, status.ok)
    }).catch(function (error) {
        callback(error, status.error);
    })
}