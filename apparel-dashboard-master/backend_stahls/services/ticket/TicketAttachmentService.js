var TicketAttachmentDao = require("../../daos/ticket/TicketAttachmentDao")

module.exports.saveFileUrl = function (file, callback) {
    TicketAttachmentDao.saveFileUrl(file, function (response, status) {
        callback(response, status);
    })
}

module.exports.getalluploadfile = function (files, ticket_id, callback) {
    TicketAttachmentDao.getalluploadfile(files, ticket_id, function (response, status) {
        callback(response, status);
    })
}

module.exports.getuploadfilebyid = function (FileDetails, callback) {
    TicketAttachmentDao.getuploadfilebyid(FileDetails, function (response, status) {
        callback(response, status);
    })
}


module.exports.deleteuploadfile = function (FileDetails, callback) {
    TicketAttachmentDao.deleteuploadfile(FileDetails, function (response, status) {
        callback(response, status);
    })
}