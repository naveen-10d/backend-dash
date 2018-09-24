var TicketHistoryDao = require("../../daos/ticket/TicketHistoryDao");

module.exports.update_Tickethistory = function (Tickethistory, callback) {
    TicketHistoryDao.update_Tickethistory(Tickethistory, function (response, status) {
        callback(response, status);
    })
}

module.exports.getall_Tickethistory = function (TicketDetials,callback) {
    TicketHistoryDao.getall_Tickethistory(TicketDetials,function (response, status) {
        callback(response, status);
    })
}
