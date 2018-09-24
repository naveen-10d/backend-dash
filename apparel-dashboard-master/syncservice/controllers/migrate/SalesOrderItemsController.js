var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');

var SalesOrderDetails = require("./SalesOrderDetailsController");
const log = require("../../config/logConfig.js");

var DataExportDate = null;



module.exports.migrateSalesOrderItems = function () {
    log.info('in migrateSalesOrderItems');

    models.sequelize.query("SELECT * FROM SyncService Where SyncTable = 'SalesOrderItems'",
        { type: models.sequelize.QueryTypes.SELECT })
        .then(date => {

            if (date[0].DataExportDate != null) {
                log.info('before top query P_SalesOrder--------->');

                models.sequelize.query("SELECT  * FROM P_SalesOrderItems WHERE  DataExportDate > '" + date[0].DataExportDate.toISOString() + "' ORDER BY DataExportDate DESC",
                    { type: models.sequelize.QueryTypes.SELECT })
                    .then(data1 => {
                        DataExportDate = date[0].DataExportDate;
                        log.info('after top query P_SalesOrder--------->');
                        if (data1.length !== 0) {
                            DataExportDate = data1[0].DataExportDate;

                            models.sequelize.query("SELECT TOP 1 * FROM SalesOrderItems ORDER BY DataExportDate DESC",
                                { type: models.sequelize.QueryTypes.SELECT })
                                .then(response => {
                                    log.info('after top query SalesOrderItems--------->');
                                    if (response.length !== 0) {
                                        if (DataExportDate > response[0].DataExportDate) {

                                            models.sequelize.query("SELECT * FROM P_SalesOrderItems where DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                .then(data2 => {

                                                    if (data2.length != 0) {
                                                        models.sequelize.query("select * from P_SalesOrderItems a \
                                where exists (select 1 \
                                            from SalesOrderItems b \
                                            where a.OrderItemID = b.OrderItemID) \
                                            And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(updateData => {
                                                                updateRecords(updateData)
                                                            })

                                                        models.sequelize.query("select * from P_SalesOrderItems a \
                                    where not exists (select 1 \
                                                from SalesOrderItems b \
                                                where a.OrderItemID = b.OrderItemID) \
                                                And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(insertData => {
                                                                insertRecords(insertData)
                                                            })
                                                    } else {
                                                        log.info("--------> No Records To Migrate!")
                                                        nextTable("Complete-NoDataFound");
                                                    }

                                                })


                                        } else {
                                            log.info("--------> SalesOrderItems Uptodate")
                                            nextTable("Complete-NoDataFound");
                                        }
                                    } else {
                                        log.info("--------> SalesOrderItems FreshMigrate")
                                        models.sequelize.query("SELECT * FROM P_SalesOrderItems ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                                            .then(data3 => {
                                                if (data3.length != 0) {
                                                    DataExportDate = data3[0].DataExportDate.toISOString()
                                                    insertRecords(data3);
                                                } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_SalesOrderItems") }
                                            }).catch(function (error) {
                                                log.error('Error SalesOrderItems:' + error);
                                                nextTable("PolypmTable-NotExist");
                                            })                        
                                    }
                                })
                        } else { nextTable("Complete-NoDataToExport"); }
                    })
            } else {
                log.info("--------> SalesOrderItems FreshMigrate")
                models.sequelize.query("SELECT * FROM P_SalesOrderItems ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                    .then(data3 => {
                        if (data3.length != 0) {
                            DataExportDate = data3[0].DataExportDate.toISOString()
                            insertRecords(data3);
                        } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_SalesOrderItems") }
                    }).catch(function (error) {
                        log.error('Error SalesOrderItems:' + error);
                        nextTable("PolypmTable-NotExist");
                    })
            }
        })

}

async function insertRecords(data) {
    log.info('in insertRecords SalesOrderItems')

    models.SalesOrderItems.bulkCreate(data).then(async function (response) {

        log.info("--------> Success SalesOrderItems Migrated!")
        // log.info("--------> Sleeping for 2secs..")
        // await sleep(2000)
        nextTable("Complete-DataExported");
    }).catch(function (error) {
        log.info('Error SalesOrderItems:' + error);
        nextTable("Error-DataExport");
    })


}

async function updateRecords(data) {
    log.info('in updateRecords SalesOrderItems');
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.SalesOrderItems.update(data[i],{
            where:{
                OrderItemID: data[i].OrderItemID
            }
        }).then(async function (response) {

        }).catch(function (error) {
            log.error("Error SalesOrderItems:" + error);
            nextTable("Error-DataExport");

        })

        // await sleep(100)
    }


}

function nextTable(status) {
    log.info('in nextTable SalesOrderItems');
    models.SyncService.update({ SyncOperation: true, SyncStatus: 'InProgress' },
        { where: { SyncTable: 'SalesOrderDetails' } }
    ).then(function (response) {

        models.SyncService.update({ SyncOperation: false, SyncStatus: status, DataExportDate: DataExportDate },
            { where: { SyncTable: 'SalesOrderItems' } }
        ).then(function (response) {
            log.info('out nextTable SalesOrderItems');
            SalesOrderDetails.migrateSalesOrderDetails();
        })
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}








