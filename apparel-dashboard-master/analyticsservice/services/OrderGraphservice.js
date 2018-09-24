var OrderDao = require("../daos/OrdersDao")
var DateDiff = require('date-diff');
var asyncLoop = require('node-async-loop');
var Sequelize = require('sequelize');
var confi = require('../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);


module.exports.getOrderonTime = function (callback) {
  sequelize.query("SELECT Count(*)N'Exportcount' FROM SalesOrder WHERE \
  DATEDIFF(day,GETDATE(),OrderDate)<=$dayvalue AND DATEDIFF(day,CustomerDueDate,ShipDate)<1 \
  ", { bind: { dayvalue: 7 }, type: sequelize.QueryTypes.SELECT })
    .then(record1 => {
      var exportDate = record1[0].Exportcount;
      sequelize.query("SELECT Count(*)N'orderCount' FROM SalesOrder WHERE DATEDIFF(day,GETDATE(),OrderDate)<=$dayvalue", { bind: { dayvalue: 7 }, type: sequelize.QueryTypes.SELECT })
        .then(record2 => {
          var orderDate = record2[0].orderCount;
          var percent = (exportDate / orderDate) * 100;
          var responsValue = {
            onTime: exportDate,
            percent: percent
          }
          callback(responsValue)
        })

    })
}
module.exports.getOrderonTimeToday = function (callback) {
  sequelize.query("SELECT Count(*)N'customerDueDate' FROM SalesOrder WHERE CONVERT(date,CustomerDueDate)=CONVERT(DATE,GETDATE())", { bind: { dayvalue: 7 }, type: sequelize.QueryTypes.SELECT })
    .then(record2 => {
      var forcastDate = record2[0].customerDueDate;
      var responsValue = {
        forcastDate: forcastDate
      }
      callback(responsValue)
    })
}

module.exports.getOrderonTimeGraph = function (callback) {
  sequelize.query("SELECT Count(*)N'orderCount' FROM SalesOrder WHERE DATEDIFF(day,GETDATE(),OrderDate)<=$dayvalue", { bind: { dayvalue: 7 }, type: sequelize.QueryTypes.SELECT })
    .then(record2 => {
      var orderDate = record2[0].orderCount;
      var responsValue = {
        orderDate: orderDate
      }
      callback(responsValue)
    })
}




module.exports.getOrderonTimeShipped = function (Days, callback) {
  var dayscount = Days;
  var Forcastgraph = []
  var shipGraph = []
  var arrayCount = [];
  if (Days === '7') {
    for (var daysdiff = 0; daysdiff < 7; daysdiff++) {
      arrayCount.push(daysdiff);
    }
  } else if (Days === '30') {
    for (var daysdiff = 4; daysdiff <= 30; daysdiff = daysdiff + 4) {
      arrayCount.push(daysdiff);

    }
  } else if (Days == '90') {

    for (var daysdiff = 15; daysdiff <= 90; daysdiff = daysdiff + 15) {
      arrayCount.push(daysdiff);

    }
  }

  if (daysdiff.length != 0) {
    var beforeCount = 0
    asyncLoop(arrayCount, (count, next) => {
      if (Days == '7') {
        sequelize.query("SELECT Count(*) N'shipCount' FROM SalesOrder WHERE CONVERT(date,ShipDate)=CONVERT(DATE,GETDATE()-$dayvalue)", { bind: { dayvalue: count }, type: sequelize.QueryTypes.SELECT })
          .then(record1 => {
            shipGraph.push(record1[0].shipCount);
            sequelize.query("SELECT Count(*) N'forcastCount' FROM SalesOrder WHERE CONVERT(date,CustomerDueDate)=CONVERT(DATE,GETDATE()-$dayvalue)", { bind: { dayvalue: count }, type: sequelize.QueryTypes.SELECT })
              .then(record2 => {
                Forcastgraph.push(record2[0].forcastCount);
                next();
              })
          })
      } else {
        sequelize.query("SELECT Count(*) N'shipCount' FROM SalesOrder WHERE CONVERT(date,ShipDate) BETWEEN CONVERT(DATE,GETDATE()-$endvalue) AND CONVERT(DATE,GETDATE()-$startvalue)", { bind: { endvalue: count-1, startvalue: beforeCount }, type: sequelize.QueryTypes.SELECT })
          .then(record1 => {
            shipGraph.push(record1[0].shipCount);
            sequelize.query("SELECT Count(*) N'forcastCount' FROM SalesOrder WHERE CONVERT(date,CustomerDueDate) BETWEEN CONVERT(DATE,GETDATE()-$endvalue) AND CONVERT(DATE,GETDATE()-$startvalue)", { bind: { endvalue: count, startvalue: beforeCount }, type: sequelize.QueryTypes.SELECT })
              .then(record2 => {
                Forcastgraph.push(record2[0].forcastCount);
                beforeCount = count;
                next();
              })
          })
      }
    }, function (err) {
      if (err) {
        console.log('error in async loop --- ', err);
      } else {
        var responseData = {
          ShippedGraphCount: shipGraph,
          ForcastGraphCount: Forcastgraph
        }

        callback(responseData)


      }
    })
  }
}
