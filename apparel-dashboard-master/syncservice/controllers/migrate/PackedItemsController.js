var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');
const log = require("../../config/logConfig.js");


var Invoices = require("./InvoiceController");

var DataExportDate = null;


module.exports.migratePackedItems = function () {
    log.info('in migratePackedItems');

    models.sequelize.query("SELECT * FROM SyncService Where SyncTable = 'PackedItems'",
        { type: models.sequelize.QueryTypes.SELECT })
        .then(date => {

            if (date[0].DataExportDate != null) {
                log.info('before top query P_PackedItems--------->');


                models.sequelize.query("SELECT  * FROM P_PackedItems WHERE DataExportDate > '" + date[0].DataExportDate.toISOString() + "' ORDER BY DataExportDate DESC",
                    { type: models.sequelize.QueryTypes.SELECT })
                    .then(data1 => {
                        DataExportDate = date[0].DataExportDate;
                        log.info('after top query P_PackedItems--------->');
                        if (data1.length !== 0) {
                            DataExportDate = data1[0].DataExportDate;

                            models.sequelize.query("SELECT TOP 1 * FROM PackedItems ORDER BY DataExportDate DESC",
                                { type: models.sequelize.QueryTypes.SELECT })
                                .then(response => {
                                    log.info('after top query PackedItems--------->');

                                    if (response.length !== 0) {
                                        if (DataExportDate > response[0].DataExportDate) {

                                            models.sequelize.query("SELECT * FROM P_PackedItems where DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                .then(data2 => {

                                                    if (data2.length != 0) {
                                                        models.sequelize.query("select * from P_PackedItems a \
                                            where exists (select 1 \
                                                        from PackedItems b \
                                                        where a.PackedItemID = b.PackedItemID) \
                                                        And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(updateData => {
                                                                updateRecords(updateData)
                                                            })

                                                        models.sequelize.query("select * from P_PackedItems a \
                                                where not exists (select 1 \
                                                            from PackedItems b \
                                                            where a.PackedItemID = b.PackedItemID) \
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
                                            log.info("--------> PackedItems Uptodate")
                                            nextTable("Complete-NoDataFound");
                                        }
                                    } else {
                                        log.info("--------> PackedItems FreshMigrate")
                                        models.sequelize.query("SELECT * FROM P_PackedItems ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                                            .then(data3 => {
                                                if (data3.length != 0) {
                                                    DataExportDate = data3[0].DataExportDate.toISOString()
                                                    insertRecords(data3);
                                                } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_PackedItems") }
                                            }).catch(function (error) {
                                                log.error('Error PackedItems:' + error);
                                                nextTable("PolypmTable-NotExist");
                                            })

                                    }

                                })

                        } else { nextTable("Complete-NoDataToExport"); }
                    })
            } else {
                log.info("--------> PackedItems FreshMigrate")
                models.sequelize.query("SELECT * FROM P_PackedItems ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                    .then(data3 => {
                        if (data3.length != 0) {
                            DataExportDate = data3[0].DataExportDate.toISOString()
                            insertRecords(data3);
                        } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_PackedItems") }
                    }).catch(function (error) {
                        log.error('Error PackedItems:' + error);
                        nextTable("PolypmTable-NotExist");
                    })
            }
        })

}

async function insertRecords(data) {
    log.info('in insertRecords PackedItems')

    models.PackedItems.bulkCreate(data).then(async function (response) {

        log.info("--------> Success PackedItems Migrated!")
        //  log.info("--------> Sleeping for 2secs..")
        //  await sleep(2000)   
        nextTable("Complete-DataExported");
    }).catch(function (error) {
        log.info('Error PackedItems:' + error);
        nextTable("Error-DataExport");
    })


}

async function updateRecords(data) {
    log.info('in updateRecords PackedItems');
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.PackedItems.update(data[i], {
            where: {
                PackedItemID: data[i].PackedItemID
            }
        }).then(async function (response) {

        }).catch(function (error) {
            log.error("Error PackedItems:", error);
            nextTable("Error-DataExport");

        })

        // await sleep(100)
    }


}

function nextTable(status) {
    log.info('in nextTable PackedItems');

    models.SyncService.update({ SyncOperation: true, SyncStatus: 'InProgress' },
        { where: { SyncTable: 'Invoices' } }
    ).then(function (response) {

        models.SyncService.update({ SyncOperation: false, SyncStatus: status, DataExportDate: DataExportDate },
            { where: { SyncTable: 'PackedItems' } }
        ).then(function (response) {
            log.info('out nextTable PackedItems');
            Invoices.migrateInvoices();
        })
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}        