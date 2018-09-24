var TicketService = require("../services/TicketService")

/**
 *
 * Getting Priority Tickets
 *
 */
module.exports.getpriorityticket = function (req, res) {
    var Days=req.params.days;
    TicketService.getpriorityticket(Days,function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * Getting Priority Tickets Date
 *
 */
module.exports.getpriorityticket_date = function (req, res) {
    TicketService.getpriorityticket_date(function (response) {
        res.json(response);
        res.status(200);
    })
}
