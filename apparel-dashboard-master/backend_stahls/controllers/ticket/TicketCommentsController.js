var TicketCommentService = require('../../services/ticket/TicketCommentsService');

module.exports.create_Ticketcomments = function (req, res) {
    var Ticketcomments = req.body;
    // var TicketDetails = "testpupse"
    TicketCommentService.create_Ticketcomments(Ticketcomments, function (response, status) {
        res.json(response);
        res.status(201);
    })
}

module.exports.getall_ticketcomments = function (req, res) {
    var ticketID = req.params.ticketId;
    TicketCommentService.getall_ticketcomments(ticketID, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

module.exports.getTicketsByComment = function (req, res) {
    var comment = req.params.text;
    TicketCommentService.getTicketsByComment(comment, function (response, status) {
        res.status(status);
        res.json(response);
    })
}

module.exports.getTicketsByCommentCode = function (req, res) {
    var comment = req.params.text;
    var code = req.params.code;
    console.log('entering into comments code dao -- ', comment, code);
    TicketCommentService.getTicketsByCommentCode(comment, code, function (response, status) {
        res.status(status);
        res.json(response);
    })
}