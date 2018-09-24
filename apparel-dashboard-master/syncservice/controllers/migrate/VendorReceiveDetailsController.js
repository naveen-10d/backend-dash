var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');
const log = require("../../config/logConfig.js");


var DataExportDate = null;




module.exports.migrateVendorReceiveDetails = function () {
    log.info('in migrateVendorReceiveDetails')

    models.sequelize.query("SELECT * FROM SyncService Where SyncTable = 'VendorReceiveDetails'",
        { type: models.sequelize.QueryTypes.SELECT })
        .then(date => {

            if (date[0].DataExportDate != null) {
                log.info('before top query P_VendorReceive--------->');
                models.sequelize.query("SELECT * FROM P_VendorReceiveDetails Where DataExportDate > '" + date[0].DataExportDate.toISOString() + "' ORDER BY DataExportDate DESC",
                    { type: models.sequelize.QueryTypes.SELECT })
                    .then(data1 => {
                        DataExportDate = date[0].DataExportDate;
                        log.info('after top query P_VendorReceive--------->');
                        if (data1.length !== 0) {
                            DataExportDate = data1[0].DataExportDate;

                            // models.VendorReceiveDetails.findAll({ limit: 1, order: [ [ 'DataExportDate', 'DESC' ]]}).then(function(response){
                            log.info('before top query VendorReceiveDetails--------->');
                            models.sequelize.query("SELECT TOP 1 * FROM VendorReceiveDetails ORDER BY DataExportDate DESC",
                                { type: models.sequelize.QueryTypes.SELECT })
                                .then(response => {
                                    log.info('after top query VendorReceiveDetails--------->');

                                    if (response.length !== 0) {
                                        if (DataExportDate > response[0].DataExportDate) {

                                            models.sequelize.query("SELECT * FROM P_VendorReceiveDetails where DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                .then(data2 => {

                                                    if (data2.length != 0) {


                                                        models.sequelize.query("select * from P_VendorReceiveDetails a \
                                                where exists (select 1 \
                                                            from VendorReceiveDetails b \
                                                            where a.ReceiveItemID = b.ReceiveItemID) \
                                                            And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(updateData => {
                                                                updateRecords(updateData)
                                                            })

                                                        models.sequelize.query("select * from P_VendorReceiveDetails a \
                                                    where not exists (select 1 \
                                                                from VendorReceiveDetails b \
                                                                where a.ReceiveItemID = b.ReceiveItemID) \
                                                                And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(insertData => {
                                                                insertRecords(insertData)
                                                            })


                                                    } else {
                                                        log.info("--------> VendorReceiveDetails Uptodate")
                                                        nextTable("Complete-NoDataFound");
                                                    }

                                                })


                                        } else {
                                            log.info("--------> VendorReceiveDetails Uptodate")
                                            nextTable("Complete-NoDataFound");
                                        }
                                    } else {
                                        log.info("--------> VendorReceiveDetails FreshMigrate")
                                        models.sequelize.query("SELECT * FROM P_VendorReceiveDetails ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                                            .then(data3 => {
                                                if (data3.length != 0) {
                                                    DataExportDate = data3[0].DataExportDate.toISOString()
                                                    insertRecords(data3);
                                                } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_VendorReceiveDetails") }
                                            }).catch(function (error) {
                                                log.error('Error VendorReceiveDetails:' + error);
                                                nextTable("PolypmTable-NotExist");
                                            })
                                    }
                                })

                        } else { nextTable("Complete-NoDataFound"); log.info("--------> VendorReceiveDetails Uptodate") }
                    })

            } else {
                log.info("--------> VendorReceiveDetails FreshMigrate")
                models.sequelize.query("SELECT * FROM P_VendorReceiveDetails ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                    .then(data3 => {
                        if (data3.length != 0) {
                            DataExportDate = data3[0].DataExportDate.toISOString()
                            insertRecords(data3);
                        } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_VendorReceiveDetails") }
                    }).catch(function (error) {
                        log.error('Error VendorReceiveDetails:' + error);
                        nextTable("PolypmTable-NotExist");
                    })
            }

        })

}


async function insertRecords(data) {
    log.info('in insertRecords VendorReceiveDetails')

    models.VendorReceiveDetails.bulkCreate(data).then(async function (response) {

        log.info("--------> Success VendorReceiveDetails Migrated!")
        // log.info("--------> Sleeping for 2secs..")
        // await sleep(2000)   
        nextTable("Complete-DataExported");
    }).catch(function (error) {
        log.info('Error VendorReceiveDetails:' + error);
        nextTable("Error-DataExport");
    })


}


async function updateRecords(data) {
    log.info('in updateRecords VendorReceiveDetails')
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.VendorReceiveDetails.update(data[i],{
            where:{
                ReceiveItemID:data[i].ReceiveItemID
            }
        }).then(async function (response) {

        }).catch(function (error) {
            log.info('Error VendorReceiveDetails:' + error);
            nextTable("Error-DataExport");
        })
        // await sleep(100)
    }


}




function nextTable(status) {
    log.info('in nextTable VendorReceiveDetails')
    // models.SyncService.update( { SyncOperation: true, SyncStatus: 'InProgress' },
    //     { where: { SyncTable: 'ShipmentsItems' } }
    // ).then(function (response) {

    models.SyncService.update({ SyncOperation: false, SyncStatus: status, DataExportDate: DataExportDate },
        { where: { SyncTable: 'VendorReceiveDetails' } }
    ).then(function (response) {
        log.info("--------> All Tables Syncronized!")
    })
    //})

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  