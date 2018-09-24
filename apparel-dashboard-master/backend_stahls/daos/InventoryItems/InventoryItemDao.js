var models = require('../../models');
var Sequelize = require('sequelize');
var confi = require('../../config/config.json');
var env = process.env.NODE_ENV || 'development';
var config = confi[env];
var sequelize = new Sequelize(config.name, config.username, config.password, config);
var statusCode = require('../../config/status');

module.exports.itemdao = function (InventoryItems, callback) {
    models.FinishedGoodsAdjustment.create(InventoryItems).then(function (response) {
        callback(response, statusCode.ok);
    }).catch(function (error) {
        callback(error, statusCode.error);
    })

};
module.exports.getallinventoryitems = function (callback) {

    models.FinishedGoodsAdjustment.findAll().then(function (response) {
        console.log('--check---------', response);
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no InventoryItems")
        }
    }).catch(function (error) {
        callback(error, statusCode.error);
    })
}

module.exports.getInventoryItemsByDateRange = function ( style,startDate, endDate, callback) {
    console.log('start date and end date in code ---- ', startDate,endDate,style); 
    sequelize.query("SELECT * from FinishedGoodsAdjustment WHERE StyleNumber = $StyleNumber AND  CONVERT(DATE,DataExportDate) \
    BETWEEN $startDate AND $endDate",
        { bind: {StyleNumber:style, startDate: startDate, endDate: endDate }, type: sequelize.QueryTypes.SELECT })
        .then(function (response) {
            callback(response, statusCode.ok)
        }).catch(function (error) {
            console.log('-------Error--------->>>>>>>>', error);
            callback(error, statusCode.error)
        })
}

module.exports.getInventoryItemsByDateRangeCode = function (code,style, startDate, endDate, callback) {
    console.log('start date and end date in code ---- ', startDate,endDate,code,style);
    sequelize.query("SELECT * from FinishedGoodsAdjustment WHERE CompanyCode = $companyCode AND StyleNumber = $StyleNumber AND \
    CONVERT(DATE,DataExportDate) \
    BETWEEN $startDate AND $endDate",
        { bind: { startDate: startDate, endDate: endDate, companyCode: code,StyleNumber:style }, type: sequelize.QueryTypes.SELECT })
        .then(function (response) {
            callback(response, statusCode.ok)
        })
}

module.exports.getinventoryitembyid = function (inventoryitemid, callback) {
    sequelize.query("SELECT TOP 25 * FROM FinishedGoodsAdjustment WHERE FinishedGoodsID = $inventoryitemid ORDER BY DataExportDate DESC",{bind:{ inventoryitemid:inventoryitemid},type: sequelize.QueryTypes.SELECT })
    .then(function (response){
        callback(response, statusCode.ok)
    }).catch(function(error){
        console.log('-------Error--------->>>>>>>>', error);
        callback(error, statusCode.error);
    })
    // models.FinishedGoodsAdjustment.findById(inventoryitemid, {

    // }).then(function (response) {
    //     if (response.length != 0) {
    //         callback(response)
    //     } else {
    //         callback("There is no InventoryItems")
    //     }
    // }).catch(function (error) {
    //     callback(error);
    // })
}