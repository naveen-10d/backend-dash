var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');

var PackedBoxes = require("./PackedBoxController");
const log = require("../../config/logConfig.js");

var DataExportDate = null;



module.exports.migrateShipmentItems = function () {
    log.info('in migrateShipmentItems');

    models.sequelize.query("SELECT * FROM SyncService Where SyncTable = 'ShipmentsItems'",
        { type: models.sequelize.QueryTypes.SELECT })
        .then(date => {

            if (date[0].DataExportDate != null) {
                log.info('before top query P_ShipmentItems--------->');

                models.sequelize.query("SELECT * FROM P_ShipmentItems WHERE DataExportDate > '" + date[0].DataExportDate.toISOString() + "' ORDER BY DataExportDate DESC",
                    { type: models.sequelize.QueryTypes.SELECT })
                    .then(data1 => {
                        DataExportDate = date[0].DataExportDate;
                        log.info('after top query P_ShipmentItems--------->');
                        if (data1.length !== 0) {
                            DataExportDate = data1[0].DataExportDate;

                            models.sequelize.query("SELECT TOP 1 * FROM ShipmentsItems ORDER BY DataExportDate DESC",
                                { type: models.sequelize.QueryTypes.SELECT })
                                .then(response => {
                                    log.info('after top query ShipmentsItems--------->');
                                    if (response.length !== 0) {
                                        if (DataExportDate > response[0].DataExportDate) {

                                            models.sequelize.query("SELECT * FROM P_ShipmentItems where DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                .then(data2 => {

                                                    if (data2.length != 0) {
                                                        models.sequelize.query("select * from P_ShipmentItems a \
                                where exists (select 1 \
                                            from ShipmentsItems b \
                                            where a.GoodsTransactionID = b.GoodsTransactionID) \
                                            And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(updateData => {
                                                                updateRecords(updateData)
                                                            })

                                                        models.sequelize.query("select * from P_ShipmentItems a \
                                    where not exists (select 1 \
                                                from ShipmentsItems b \
                                                where a.GoodsTransactionID = b.GoodsTransactionID) \
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
                                            log.info("--------> ShipmentsItems Uptodate")
                                            nextTable("Complete-NoDataFound");
                                        }
                                    } else {
                                        log.info("--------> ShipmentsItems FreshMigrate")
                                        models.sequelize.query("SELECT * FROM P_ShipmentItems ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                                            .then(data3 => {
                                                if (data3.length != 0) {
                                                    DataExportDate = data3[0].DataExportDate.toISOString()
                                                    insertRecords(data3);
                                                } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_ShipmentItems") }
                                            }).catch(function (error) {
                                                log.error('Error ShipmentsItems:' + error);
                                                nextTable("PolypmTable-NotExist");
                                            })
                                    }
                                })

                        } else { nextTable("Complete-NoDataToExport"); }
                    })
            } else {
                log.info("--------> ShipmentsItems FreshMigrate")
                models.sequelize.query("SELECT * FROM P_ShipmentItems ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                    .then(data3 => {
                        if (data3.length != 0) {
                            DataExportDate = data3[0].DataExportDate.toISOString()
                            insertRecords(data3);
                        } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_ShipmentItems") }
                    }).catch(function (error) {
                        log.error('Error ShipmentsItems:' + error);
                        nextTable("PolypmTable-NotExist");
                    })
            }
        })

}

async function insertRecords(data) {
    log.info('in insertRecords ShipmentsItems')

    models.ShipmentsItems.bulkCreate(data).then(async function (response) {

        log.info("--------> Success ShipmentsItems Migrated!")
        // log.info("--------> Sleeping for 2secs..")
        // await sleep(2000)
        nextTable("Complete-DataExported");
    }).catch(function (error) {
        log.info('Error ShipmentsItems:' + error);
        nextTable("Error-DataExport");
    })


}

async function updateRecords(data) {
    log.info('in updateRecords ShipmentsItems');
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.ShipmentsItems.update(data[i],{
            where:{
                GoodsTransactionID: data[i].GoodsTransactionID
            }
        }).then(async function (response) {

        }).catch(function (error) {
            log.error("Error ShipmentsItems:" + error);
            nextTable("Error-DataExport");

        })

        // await sleep(100)
    }


}

function nextTable(status) {
    log.info('in nextTable ShipmentsItems');

    models.SyncService.update({ SyncOperation: true, SyncStatus: 'InProgress' },
        { where: { SyncTable: 'PackedBoxes' } }
    ).then(function (response) {

        models.SyncService.update({ SyncOperation: false, SyncStatus: status, DataExportDate: DataExportDate },
            { where: { SyncTable: 'ShipmentsItems' } }
        ).then(function (response) {
            log.info('out nextTable ShipmentsItems');
            PackedBoxes.migratePackedBoxes();
        })
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}    