var SyncServiceDao = require("../../daos/SyncService/SyncServiceDao");

module.exports.getallsyncservice = function (callback) {
    SyncServiceDao.getallSyncservice(function (response, status) {
        callback(response, status);
    })
}