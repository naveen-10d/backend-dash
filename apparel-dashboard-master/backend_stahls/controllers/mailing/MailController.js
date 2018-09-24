var MailService = require('../../services/mailing/MailService');
const nodemailer = require('nodemailer');


module.exports.createMail = (req, res) => {
    var mailData = req.body
    console.log('entering into create mmail controller')
    MailService.createMail(mailData, function (masterllistdata, status) {
        // if (err) {
        //     res.status(500).send(err);
        // } else {
        //     res.status(status).send(masterllistdata);
        // }
        res.status(status);
        res.json(masterllistdata);
    })
}


/**
 * Create Mail 
 * @param {Mail} req 
 * @param {Create The mail  } res 
 */
module.exports.addMail = function (req, res) {
    var MailDetails = req.body;
    MailService.addMail(MailDetails, function (response, status) {
        res.json(response);
        res.status(status);
    })
}

/**
 * Getting List Of Mail 
 * @param {GetAll} req 
 * @param {Getting The List Of Mail Details From Mail} res 
 */
module.exports.getallMail = function (req, res) {
    MailService.getallMail(function (response, status) {
        res.json(response);
        res.status(status);
    })
}


/**
 * Update Particular Mail
 * @param {MailId} req 
 * @param {Update Particular Mail Details Based On It's MailId} res 
 */
module.exports.updateMail = function (req, res) {
    var MailDetails = req.body;
    MailService.updateMail(MailDetails, function (response, status) {
        res.json(response);
        res.status(status);
    });
}


/**
 * Delete The Particular Mail Based on MailId
 * @param {MailId} req 
 * @param {Delete Paticular Mail Details Form Mail Based on MailId} res 
 */
module.exports.deleteMail = function (req, res) {
    var uuid = req.params.uuid;
    MailService.deleteMail(uuid, function () {
        res.status(204);
        res.end();
    });
}