var TicketCommentsDao = require("../../daos/ticket/TicketCommentsDao");

module.exports.create_Ticketcomments = function (Ticketcomments, callback) {
    TicketCommentsDao.create_Ticketcomments(Ticketcomments, function (response, status) {
        callback(response, status);
    })
}

module.exports.getall_ticketcomments = function (ticketId, callback) {
    TicketCommentsDao.getall_ticketcomments(ticketId, function (response, status) {
        callback(response, status);
    })
}
module.exports.getTicketsByComment = function (comment, callback) {
    TicketCommentsDao.getTicketsByComment(comment, function (response, status) {
        callback(response, status);
    })
}

module.exports.getTicketsByCommentCode = function (comment, code, callback) {
    TicketCommentsDao.getTicketsByCommentCode(comment, code, function (response, status) {
        callback(response, status);
    })
}