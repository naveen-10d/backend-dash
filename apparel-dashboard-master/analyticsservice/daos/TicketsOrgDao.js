var models = require("../models");


module.exports.getpriorityticket = function (CompanyCode,callback) {
    console.log("dao------------>",CompanyCode);
    models.Tickets.findAll({
        where: { organizationUuid: CompanyCode }
    }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getpriorityticket_date = function (callback) {
    models.StahlsConfig.findOne({
        where: { name: 'ticketprioritydate' }
    }).then(function (response) {
        callback(response)
    }).catch(function (response) {
        callback(response)
    })
}