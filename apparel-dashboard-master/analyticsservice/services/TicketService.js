var TicketDao = require("../daos/TicketsDao")
var Sequelize = require('sequelize');
var confi = require('../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);


module.exports.getpriorityticket = function (Days, callback) {
    var listoftickets;
    sequelize.query("SELECT * FROM Tickets WHERE DATEDIFF(day,GETDATE(),Date)<=$dayvalue AND Type = 'Urgent'", {
            bind: {
                dayvalue: Days
            },
            type: sequelize.QueryTypes.SELECT
        })
        .then(Ticketlist => {
            listoftickets = Ticketlist;
            var responseData = {
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