var models = require("../../models")
var asyncLoop = require('node-async-loop')
var status = require("../../config/status");


module.exports.getalluploadfile = function (callback) {
    models.TicketAttachments.findAll().then(function (response) {
        if (response.length != 0) {
            callback(response, status.ok)
        } else {
            callback("There is no attachments", status.no_content)
        }
    }).catch(function (err) {
        callback(err, status.error);
    })
}

module.exports.saveFileUrl = function (file, callback) {
    asyncLoop(file.attachmenturl, (item, next) => {

        var fileDetails = {};
        fileDetails.attachmenturl = item.path;
        fileDetails.filename = item.filename;
        fileDetails.TicketUuid = file.TicketUuid;
        models.TicketAttachments.create(fileDetails);
        next();
    }, function (err) {
        if (err) {
            console.log("error in save url", status.error);
            callback(err)
        } else {
            callback("fileAttachmentUrl saved", status.ok);
        }
    })
}

module.exports.getuploadfilebyid = function (FileDetails, callback) {
    models.TicketAttachments.findAll({
        where: {
            TicketUuid: FileDetails
        }
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, status.ok);
        } else {
            callback(null, status.no_content)
        }
    }).catch(function (err) {
        callback(err, status.error);
    })
}

module.exports.deleteuploadfile = function (FileDetails, callback) {
    models.TicketAttachments.destroy({
        where: {
            uuid: FileDetails
        }
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, status.ok)
        } else {
            callback(null, status.no_content)
        }
    }).catch(function (err) {
        callback(err, status.error);
    })
}