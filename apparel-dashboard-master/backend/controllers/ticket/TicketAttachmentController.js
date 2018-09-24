

var TicketAttachmentService = require("../../services/ticket/TicketAttachmentService");
/**
 * @description uploading file as ticket attachment
 * @param { multipart file and ticket uuid} req 
 * @param {uploaded status for the details} res 
 */
module.exports.uploadfile = function (req, res) {
    var files = req.files;
    var ticket_id = req.params.uuid
    if (!files)
        return res.status(400).send('No files were uploaded.');

    TicketAttachmentService.uploadfile(files,ticket_id,res, function (response) {
        res.json(response);
        res.status(201);
    })
}

/**
 * @description getting all uploaded file as ticket attachment
 * @param { No params} req 
 * @param {List of files uploaded} res 
 */
module.exports.getalluploadfile = function (req,res) {
    TicketAttachmentService.getalluploadfile(function(response) {
        res.json(response);
        res.status(200);
    })
}

/**
 * @description get uploaded file 
 * @param { get uploaded file using the UUID} req 
 * @param {List of files uploaded} res 
 */
module.exports.getuploadfilebyid = function (req,res) {
    var FileDetails = req.params.uuid;
    TicketAttachmentService.getuploadfilebyid(FileDetails,function(response) {
        res.json(response);
        res.status(200);
    })
}

/**
 * @description get uploaded file 
 * @param { get uploaded file using the UUID} req 
 * @param {List of files uploaded} res 
 */
module.exports.deleteuploadfile = function (req,res) {
    var FileDetails = req.params.uuid;
    TicketAttachmentService.deleteuploadfile(FileDetails,function(response) {
        res.json(response);
        res.status(200);
    })
}