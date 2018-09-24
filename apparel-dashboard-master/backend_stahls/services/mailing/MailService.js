var MailDao = require('../../daos/mailing/MailDao');

module.exports.createMail = (mailData, callback) => {
    MailDao.createMail(mailData, function (data, status) {
        // if (err) {
        //     callback(err);
        // } else {
        //     callback(data);
        // }
        callback(data, status);
    })
}




module.exports.addMail = function (MailDetails, callback) {
    MailDao.addMail(MailDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.getallMail = function (callback) {
    MailDao.getallMail(function (response, status) {
        callback(response, status)
    })
}

module.exports.updateMail = function (MailDetails, callback) {
    MailDao.updateMail(MailDetails, function (response, status) {
        callback(response, status)
    });
}

module.exports.deleteMail = function (uuid, callback) {
    MailDao.deleteMail(uuid, function () {
        callback();
    });
}