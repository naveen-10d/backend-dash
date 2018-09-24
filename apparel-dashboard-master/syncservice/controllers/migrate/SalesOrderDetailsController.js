var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');
const log = require("../../config/logConfig.js");

var Shipments = require('./ShipmentsController');

var DataExportDate = null;



module.exports.migrateSalesOrderDetails = function () {
    log.info('in migrateSalesOrderDetails');

    models.sequelize.query("SELECT * FROM SyncService Where SyncTable = 'SalesOrderDetails'",
        { type: models.sequelize.QueryTypes.SELECT })
        .then(date => {

            if (date[0].DataExportDate != null) {
                log.info('before top query P_SalesOrderDetails--------->');


                models.sequelize.query("SELECT  * FROM P_SalesOrderDetails WHERE DataExportDate > '" + date[0].DataExportDate.toISOString() + "' ORDER BY DataExportDate DESC",
                    { type: models.sequelize.QueryTypes.SELECT })
                    .then(data1 => {
                        DataExportDate = date[0].DataExportDate;
                        log.info('after top query P_SalesOrderDetails--------->');
                        if (data1.length !== 0) {
                            DataExportDate = data1[0].DataExportDate;

                            models.sequelize.query("SELECT TOP 1 * FROM SalesOrderDetails ORDER BY DataExportDate DESC",
                                { type: models.sequelize.QueryTypes.SELECT })
                                .then(response => {
                                    log.info('after top query SalesOrderDetails--------->');
                                    if (response.length !== 0) {
                                        if (DataExportDate > response[0].DataExportDate) {

                                            models.sequelize.query("SELECT * FROM P_SalesOrderDetails where DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                .then(data2 => {

                                                    if (data2.length != 0) {
                                                        models.sequelize.query("select * from P_SalesOrderDetails a \
                                            where exists (select 1 \
                                                        from SalesOrderDetails b \
                                                        where a.OrderDetailsID = b.OrderDetailsID)\
                                                        And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "' ", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(updateData => {
                                                                updateRecords(updateData)
                                                            })

                                                        models.sequelize.query("select * from P_SalesOrderDetails a \
                                                where not exists (select 1 \
                                                            from SalesOrderDetails b \
                                                            where a.OrderDetailsID = b.OrderDetailsID)\
                                                            And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "' ", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(insertData => {
                                                                insertRecords(insertData)
                                                            })

                                                    } else {
                                                        log.info("--------> No Records To Migrate!")
                                                        nextTable("Complete-NoDataFound");
                                                    }

                                                })


                                        } else {
                                            log.info("--------> SalesOrderDetails Uptodate")
                                            nextTable("Complete-NoDataFound");
                                        }
                                    } else {
                                        log.info("--------> SalesOrderDetails FreshMigrate")
                                        models.sequelize.query("SELECT * FROM P_SalesOrderDetails ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                                            .then(data3 => {
                                                if (data3.length != 0) {
                                                    DataExportDate = data3[0].DataExportDate.toISOString()
                                                    insertRecords(data3);
                                                } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_SalesOrderDetails") }
                                            }).catch(function (error) {
                                                log.error('Error SalesOrderDetails:' + error);
                                                nextTable("PolypmTable-NotExist");
                                            })
                                    }
                                })
                        } else { nextTable("Complete-NoDataToExport"); }
                    })
            } else {
                log.info("--------> SalesOrderDetails FreshMigrate")
                models.sequelize.query("SELECT * FROM P_SalesOrderDetails ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                    .then(data3 => {
                        if (data3.length != 0) {
                            DataExportDate = data3[0].DataExportDate.toISOString()
                            insertRecords(data3);
                        } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_SalesOrderDetails") }
                    }).catch(function (error) {
                        log.error('Error SalesOrderDetails:' + error);
                        nextTable("PolypmTable-NotExist");
                    })
            }
        })
}

async function insertRecords(data) {
    log.info('in insertRecords SalesOrderDetails')

    models.SalesOrderDetails.bulkCreate(data).then(async function (response) {

        log.info("--------> Success SalesOrderDetails Migrated!")
        //  log.info("--------> Sleeping for 2secs..")
        //  await sleep(2000)   
        nextTable("Complete-DataExported");
    }).catch(function (error) {
        log.info('Error SalesOrderDetails:' + error);
        nextTable("Error-DataExport");
    })


}

async function updateRecords(data) {
    log.info('in startMigrate SalesOrderDetails');
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.SalesOrderDetails.update(data[i],{
            where:{
                OrderDetailsID: data[i].OrderDetailsID
            }
        }).then(async function (response) {

        }).catch(function (error) {
            log.error("Error SalesOrderDetails:" + error);
            nextTable("Error-DataExport");

        })

        // await sleep(100)
    }


}

function nextTable(status) {
    log.info('in nextTable SalesOrderDetails');

    models.SyncService.update({ SyncOperation: true, SyncStatus: 'InProgress' },
        { where: { SyncTable: 'Shipments' } }
    ).then(function (response) {

        models.SyncService.update({ SyncOperation: false, SyncStatus: status, DataExportDate: DataExportDate },
            { where: { SyncTable: 'SalesOrderDetails' } }
        ).then(function (response) {
            log.info('out nextTable SalesOrderDetails');
            Shipments.migrateShipments();
        })
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}








