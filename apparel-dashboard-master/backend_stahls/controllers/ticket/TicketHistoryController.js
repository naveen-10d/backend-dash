var TicketHistoryService = require('../../services/ticket/TicketHistoryService');

module.exports.update_Tickethistory = function (req, res) {
    var Tickethistory = req.body;
    TicketHistoryService.update_Tickethistory(Tickethistory, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getall_Tickethistory = function (req, res) {
    // console.log('------------------req-----------',req);
    var TicketDetials = req.params.uuid;
    // console.log('---------------->>>>>>>>>>>>>>>>',TicketDetials);
    TicketHistoryService.getall_Tickethistory(TicketDetials, function (response, status) {
        res.json(response);
        res.status(status);
    })
}