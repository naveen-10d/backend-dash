var models = require("../../models")
var statusCode = require('../../config/status');

module.exports.getallSyncservice = function (callback) {
    models.SyncService.findAll({
        order:[
            ['updatedAt','DESC']
        ],
    }).then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no SyncService", statusCode.no_content)
        }
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

