var models = require("../../models")
var uuid = require('uuid')
var config = require('../../config/config')

module.exports.uploadfile = function (files, ticket_id,res, callback) {
    var size = Object.keys(files);
    for (var i = 0; i < size.length; i++) {
        var file = size[i];
        var filename = uuid()
        var orginalfilename = files[file].name.split(".")
        var ext = orginalfilename[1];
        var location = config.uploadlocation + filename + "." + ext
        files[file].mv(location, function (err) {
            if (err)
                return res.status(500).send(err);
            models.TicketAttachments.create({
                filename: filename + "." + ext,
                TicketUuid: ticket_id,
                attachmenturl: location
            })
        })
    }
    callback("File Upload Successfully")
}

module.exports.getalluploadfile = function (callback) {
    models.TicketAttachments.findAll().then(function (response) {
        if (response.length != 0) {
            callback(response)
        }
        else {
            callback("There is no attachments")
        }
    }).catch(function (err) {
        callback(err);
    })
}

module.exports.getuploadfilebyid = function (FileDetails, callback) {
    models.TicketAttachments.findAll({
        where: { uuid: FileDetails }
    }).then(function (response) {
        if (response.length != 0) {
            callback(response)
        }
        else {
            callback(null)
        }
    }).catch(function (err) {
        callback(err);
    })
}

module.exports.deleteuploadfile = function (FileDetails, callback) {
    models.TicketAttachments.destroy({
        where: { uuid: FileDetails }
    }).then(function (response) {
        if (response.length != 0) {
            callback(response)
        }
        else {
            callback(null)
        }
    }).catch(function (err) {
        callback(err);
    })
}