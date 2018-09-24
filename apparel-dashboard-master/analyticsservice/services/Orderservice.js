var OrderDao = require("../daos/OrdersDao")
var DateDiff = require('date-diff');
var asyncLoop = require('node-async-loop');
var Sequelize = require('sequelize');
var confi = require('../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);



module.exports.getOrderReceived = function (callback) {
  sequelize.query("SELECT Count(*) N'currentOrderDate' FROM SalesOrder WHERE CONVERT(date,OrderDate)=CONVERT(DATE,GETDATE())", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(orderDateData => {
      var currentOrderDate = orderDateData[0].currentOrderDate;
      sequelize.query("SELECT Count(*) N'orderDate' FROM SalesOrder WHERE DATEDIFF(day,GETDATE(),OrderDate)<=$dayvalue", {
          bind: {
            dayvalue: 7
          },
          type: sequelize.QueryTypes.SELECT
        })
        .then(orderResponse => {
          var orderDate = orderResponse[0].orderDate;
          var percent = (currentOrderDate / orderDate) * 100
          var responseData = {
            TodayOrder: currentOrderDate,
            percent: percent
          }
          callback(responseData)
        })

    })
}

module.exports.getOrderShippedToday = function (callback) {
  sequelize.query("SELECT Count(*) N'currentShipDate' FROM SalesOrder WHERE CONVERT(date,ShipDate)=CONVERT(DATE,GETDATE())", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(currentShipData => {
      var currentShipDate = currentShipData[0].currentShipDate;
      sequelize.query("SELECT Count(*) N'shipDate' FROM SalesOrder WHERE DATEDIFF(day,GETDATE(),ShipDate)<=$dayvalue", {
          bind: {
            dayvalue: 7
          },
          type: sequelize.QueryTypes.SELECT
        })
        .then(shipDate => {
          var shipDate = shipDate[0].shipDate;
          var percent = (currentShipDate / shipDate) * 100
          var responseData = {
            TodayShipped: currentShipDate,
            percent: percent
          }
          callback(responseData)
        })

    })
}

module.exports.getOrdertopSelling = function (Days, callback) {


  sequelize.query(
      "SELECT TOP 8 SalesOrderItems.StyleName,Count(*) N'StyleCount' \
           FROM \
           SalesOrderItems \
           INNER JOIN \
           SalesOrder \
           ON \
           SalesOrder.OrderID=SalesOrderItems.OrderID \
           WHERE SalesOrder.OrderDate BETWEEN CONVERT(DATE,GETDATE()-$dayvalue) AND CONVERT(DATE,GETDATE()) \
           AND SalesOrderItems.StyleOption=$styleOption GROUP BY \
           SalesOrderItems.StyleName \
           HAVING \
           COUNT(*) > 1 ORDER BY StyleCount DESC", {
        bind: {
          dayvalue: Days - 1,
          styleOption: 'Blank Only'
        },
        type: sequelize.QueryTypes.SELECT
      })
    .then(data => {
      data.sort();
      var stylelist = data.slice(0, 7);
      callback(stylelist)
    })

}


module.exports.getOrderReceivedToday = function (callback) {
  sequelize.query("SELECT Count(*) N'orderDate' FROM SalesOrder WHERE Convert(date,OrderDate) = Convert(date,GETDATE())", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(orderResponse => {
      var orderDate = orderResponse[0].orderDate;
      var responseData = {
        TodayOrderReceived: orderDate,
      }
      callback(responseData)
    })
}


module.exports.getOrderShipped = function (callback) {
  sequelize.query("SELECT Count(*) N'shipDate' FROM SalesOrder WHERE Convert(date,ShipDate) = Convert(date,GETDATE())", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(Response => {
      var shipDate = Response[0].shipDate;
      var responseData = {
        TodayShippedOrder: shipDate,
      }
      callback(responseData)
    })
}

module.exports.getOrderForcastedGraph = function (Days, callback) {
  var Forcastgraph = []
  var Ordergraph = []
  var arrayCount = [];
  if (Days === '7') {
    // daysdiff = 0;
    for (var daysdiff = 0; daysdiff < 7; daysdiff++) {
      arrayCount.push(daysdiff);
    }
  } else if (Days === '30') {
    // daysdiff = 4;
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
        sequelize.query("SELECT Count(*) N'orderCount' FROM SalesOrder WHERE StatusName <> 'Forecast' AND CONVERT(date,OrderDate)=CONVERT(DATE,GETDATE()-$dayvalue)", {
            bind: {
              dayvalue: count
            },
            type: sequelize.QueryTypes.SELECT
          })
          .then(record1 => {
            Ordergraph.push(record1[0].orderCount);
            sequelize.query("SELECT Count(*) N'forecastCount' FROM SalesOrder WHERE StatusName='Forecast' AND CONVERT(date,OrderDate)=CONVERT(DATE,GETDATE()-$dayvalue)", {
                bind: {
                  dayvalue: count
                },
                type: sequelize.QueryTypes.SELECT
              })
              .then(record2 => {
                Forcastgraph.push(record2[0].forecastCount);
                next();
              })
          })
      } else {
        sequelize.query("SELECT Count(*) N'currentOrderDate' FROM SalesOrder WHERE StatusName <> 'Forecast' AND CONVERT(date,OrderDate) BETWEEN CONVERT(DATE,GETDATE()-$endvalue) AND CONVERT(DATE,GETDATE()-$startvalue)", {
            bind: {
              endvalue: count - 1,
              startvalue: beforeCount
            },
            type: sequelize.QueryTypes.SELECT
          })
          .then(record1 => {
            Ordergraph.push(record1[0].currentOrderDate);
            sequelize.query("SELECT Count(*) N'forecastCount' FROM SalesOrder WHERE StatusName='Forecast' AND CONVERT(date,OrderDate) BETWEEN CONVERT(DATE,GETDATE()-$endvalue) AND CONVERT(DATE,GETDATE()-$startvalue)", {
                bind: {
                  endvalue: count - 1,
                  startvalue: beforeCount
                },
                type: sequelize.QueryTypes.SELECT
              })
              .then(record2 => {
                Forcastgraph.push(record2[0].forecastCount);
                beforeCount = count;
                next();
              })
          })
      }
    }, function (err) {
      if (err) {} else {
        var responseData = {
          Actual: Ordergraph,
          Forcast: Forcastgraph
        }

        callback(responseData)


      }
    })
  }

}

module.exports.getOrderReceivedGraph = function (Days, callback) {
  var Ordergraph = []
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
        sequelize.query("SELECT Count(*)N'orderCount' FROM SalesOrder WHERE CONVERT(date,OrderDate)=CONVERT(DATE,GETDATE()-$dayvalue)", {
            bind: {
              dayvalue: count
            },
            type: sequelize.QueryTypes.SELECT
          })
          .then(record1 => {
            Ordergraph.push(record1[0].orderCount);
            next();
          })
      } else {
        sequelize.query("SELECT Count(*)N'currentOrderDate' FROM SalesOrder WHERE CONVERT(date,OrderDate) BETWEEN CONVERT(DATE,GETDATE()-$endvalue) AND CONVERT(DATE,GETDATE()-$startvalue)", {
            bind: {
              endvalue: count - 1,
              startvalue: beforeCount
            },
            type: sequelize.QueryTypes.SELECT
          })
          .then(record1 => {
            Ordergraph.push(record1[0].currentOrderDate);
            beforeCount = count;
            next();
          })
      }
    }, function (err) {
      if (err) {} else {
        var responseData = {
          Actual: Ordergraph,
        }

        callback(responseData)


      }
    })
  }
}

module.exports.getOrderShippedGraph = function (Days, callback) {
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
        sequelize.query("SELECT Count(*) N'shipCount' FROM SalesOrder WHERE CONVERT(date,ShipDate)=CONVERT(DATE,GETDATE()-$dayvalue)", {
            bind: {
              dayvalue: count
            },
            type: sequelize.QueryTypes.SELECT
          })
          .then(record1 => {
            shipGraph.push(record1[0].shipCount);
            next();
          })
      } else {
        sequelize.query("SELECT Count(*) N'shipCount' FROM SalesOrder WHERE CONVERT(date,ShipDate) BETWEEN CONVERT(DATE,GETDATE()-$endvalue) AND CONVERT(DATE,GETDATE()-$startvalue)", {
            bind: {
              endvalue: count - 1,
              startvalue: beforeCount
            },
            type: sequelize.QueryTypes.SELECT
          })
          .then(record1 => {
            shipGraph.push(record1[0].shipCount);
            beforeCount = count;
            next();
          })
      }
    }, function (err) {
      if (err) {
        console.log('error in async loop --- ', err);
      } else {
        var responseData = {
          Shipped: shipGraph,
        }

        callback(responseData)


      }
    })
  }
}