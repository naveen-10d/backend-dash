var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');
const log = require("../../config/logConfig.js");

var InvoiceDetails = require("./InvoiceDetailsController");

var DataExportDate = null;



module.exports.migrateInvoices = function () {
    log.info('in migrateInvoices')
    models.sequelize.query("SELECT * FROM SyncService Where SyncTable = 'Invoices'",
        { type: models.sequelize.QueryTypes.SELECT })
        .then(date => {

            if (date[0].DataExportDate != null) {
                log.info('before top query P_Invoices--------->');

                models.sequelize.query("SELECT  * FROM P_Invoices WHERE DataExportDate >'" + date[0].DataExportDate.toISOString() + "' ORDER BY DataExportDate DESC",
                    { type: models.sequelize.QueryTypes.SELECT })
                    .then(data1 => {
                        DataExportDate = date[0].DataExportDate;
                        log.info('after top query P_SalesOrder--------->');

                        if (data1.length !== 0) {
                            DataExportDate = data1[0].DataExportDate;

                            log.info('before top query SalesOrder--------->');

                            models.sequelize.query("SELECT TOP 1 * FROM Invoices ORDER BY DataExportDate DESC",
                                { type: models.sequelize.QueryTypes.SELECT })
                                .then(response => {
                                    log.info('after top query Invoices--------->');
                                    if (response.length !== 0) {
                                        if (DataExportDate > response[0].DataExportDate) {

                                            models.sequelize.query("SELECT * FROM P_Invoices where DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                .then(data2 => {

                                                    if (data2.length != 0) {
                                                        models.sequelize.query("select * from P_Invoices a \
                                            where exists (select 1 \
                                                        from Invoices b \
                                                        where a.ShipmentID = b.ShipmentID)\
                                                        And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "' ", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(updateData => {
                                                                updateRecords(updateData)
                                                            })

                                                        models.sequelize.query("select * from P_Invoices a \
                                                where not exists (select 1 \
                                                            from Invoices b \
                                                            where a.ShipmentID = b.ShipmentID)\
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
                                            log.info("--------> Invoices Uptodate")
                                            nextTable("Complete-NoDataFound");
                                        }
                                    } else {
                                        log.info("--------> Invoices FreshMigrate")
                                        models.sequelize.query("SELECT * FROM P_Invoices ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                                            .then(data3 => {
                                                if (data3.length != 0) {
                                                    DataExportDate = data3[0].DataExportDate.toISOString()
                                                    insertRecords(data3);
                                                } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_Invoices") }
                                            }).catch(function (error) {
                                                log.error('Error Invoices:' + error);
                                                nextTable("PolypmTable-NotExist");
                                            })
                                    }

                                })

                        } else { nextTable("Complete-NoDataToExport"); }
                    })
            } else {
                log.info("--------> Invoices FreshMigrate")
                models.sequelize.query("SELECT * FROM P_Invoices ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                    .then(data3 => {
                        if (data3.length != 0) {
                            DataExportDate = data3[0].DataExportDate.toISOString()
                            insertRecords(data3);
                        } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_Invoices") }
                    }).catch(function (error) {
                        log.error('Error Invoices:' + error);
                        nextTable("PolypmTable-NotExist");
                    })
            }
        })

}

async function insertRecords(data) {
    log.info('in insertRecords Invoices')

    models.Invoices.bulkCreate(data).then(async function (response) {
        log.info("--------> Success Invoices Migrated!")
        // log.info("--------> Sleeping for 2secs..")
        // await sleep(2000)
        nextTable("Complete-DataExported");
    }).catch(function (error) {
        log.info('Error Invoices:' + error);
        nextTable("Error-DataExport");
    })


}

async function updateRecords(data) {
    log.info('in updateRecords Invoices');
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.Invoices.update(data[i], {
            where: {
                ShipmentID: data[i].ShipmentID
            }
        }).then(async function (response) {

        }).catch(function (error) {
            log.error("Error Invoices:" + error);
            nextTable("Error-DataExport");

        })

        // await sleep(100)
    }


}

function nextTable(status) {
    log.info('in nextTable InvoiceDetails');
    models.SyncService.update({ SyncOperation: true, SyncStatus: 'InProgress' },
        { where: { SyncTable: 'InvoiceDetails' } }
    ).then(function (response) {

        models.SyncService.update({ SyncOperation: false, SyncStatus: status, DataExportDate: DataExportDate },
            { where: { SyncTable: 'Invoices' } }
        ).then(function (response) {
            log.info('out nextTable InvoiceDetails');
            InvoiceDetails.migrateInvoiceDetails();
        })
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}         