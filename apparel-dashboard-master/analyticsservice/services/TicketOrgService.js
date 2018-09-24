var TicketDao = require("../daos/TicketsOrgDao")
var Sequelize = require('sequelize');
var confi = require('../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);



module.exports.getpriorityticket = function (Days,CompanyCode, callback) {
    var listoftickets;
    sequelize.query("SELECT * FROM Tickets WHERE DATEDIFF(day,GETDATE(),Date)<=$dayvalue AND Type = 'Urgent' AND organizationUuid = $companyCode", {bind:{dayvalue: Days, companyCode: CompanyCode}, type: sequelize.QueryTypes.SELECT })
    .then(Ticketlist => {
        listoftickets = Ticketlist;
        if(Ticketlist.length == 0) {
            listoftickets = "No data!"
        } else {
            listoftickets = Ticketlist
        }
        var responseData= {
            PriorityTickets: listoftickets,
        }
        callback(responseData);
    })
}

module.exports.getpriorityticket_date = function (callback) {
    TicketDao.getpriorityticket_date(function (response) {
       callback(response)
    })
}