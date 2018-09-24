var TicketService = require("../services/TicketOrgService")

/**
 *
 * Getting Priority Tickets
 *
 */
module.exports.getpriorityticket = function (req, res) {
    var Days=req.params.days;
    var CompanyCode=req.params.code;
    console.log("controller------------>",CompanyCode);
    TicketService.getpriorityticket(Days,CompanyCode,function (response) {
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
