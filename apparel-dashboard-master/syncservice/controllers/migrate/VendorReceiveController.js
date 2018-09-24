var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');
const log = require("../../config/logConfig.js");


var VendorReceiveDetails = require("./VendorReceiveDetailsController");

var DataExportDate = null;






module.exports.migrateVendorReceive = function () {
    log.info('in migrateVendorReceive')

    models.sequelize.query("SELECT * FROM SyncService Where SyncTable = 'VendorReceive'",
        { type: models.sequelize.QueryTypes.SELECT })
        .then(date => {

            if (date[0].DataExportDate != null) {
                log.info('before top query P_VendorReceive--------->');
                models.sequelize.query("SELECT * FROM P_VendorReceive Where DataExportDate > '" + date[0].DataExportDate.toISOString() + "' ORDER BY DataExportDate DESC",
                    { type: models.sequelize.QueryTypes.SELECT })
                    .then(data1 => {
                        DataExportDate = date[0].DataExportDate;
                        log.info('after top query P_VendorReceive--------->');
                        if (data1.length !== 0) {
                            DataExportDate = data1[0].DataExportDate;

                            // models.VendorReceive.findAll({ limit: 1, order: [ [ 'DataExportDate', 'DESC' ]]}).then(function(response){
                            log.info('before top query VendorReceive--------->');
                            models.sequelize.query("SELECT TOP 1 * FROM VendorReceive ORDER BY DataExportDate DESC",
                                { type: models.sequelize.QueryTypes.SELECT })
                                .then(response => {
                                    log.info('after top query VendorReceive--------->');

                                    if (response.length !== 0) {
                                        if (DataExportDate > response[0].DataExportDate) {

                                            models.sequelize.query("SELECT * FROM P_VendorReceive where DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                .then(data2 => {

                                                    if (data2.length != 0) {


                                                        models.sequelize.query("select * from P_VendorReceive a \
                                                  where exists (select 1 \
                                                              from VendorReceive b \
                                                              where a.ReceiveID = b.ReceiveID) \
                                                              And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(updateData => {
                                                                updateRecords(updateData)
                                                            })

                                                        models.sequelize.query("select * from P_VendorReceive a \
                                                      where not exists (select 1 \
                                                                  from VendorReceive b \
                                                                  where a.ReceiveID = b.ReceiveID) \
                                                                  And a.DataExportDate > " + "'" + response[0].DataExportDate.toISOString() + "'", { type: models.sequelize.QueryTypes.SELECT })
                                                            .then(insertData => {
                                                                insertRecords(insertData)
                                                            })


                                                    } else {
                                                        log.info("--------> VendorReceive Uptodate")
                                                        nextTable("Complete-NoDataFound");
                                                    }

                                                })


                                        } else {
                                            log.info("--------> VendorReceive Uptodate")
                                            nextTable("Complete-NoDataFound");
                                        }
                                    } else {
                                        log.info("--------> VendorReceive FreshMigrate")
                                        models.sequelize.query("SELECT * FROM P_VendorReceive ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                                            .then(data3 => {
                                                if (data3.length != 0) {
                                                    DataExportDate = data3[0].DataExportDate.toISOString()
                                                    insertRecords(data3);
                                                } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_VendorReceive") }
                                            }).catch(function (error) {
                                                log.error('Error VendorReceive:' + error);
                                                nextTable("PolypmTable-NotExist");
                                            })
                                    }
                                })

                        } else { nextTable("Complete-NoDataFound"); log.info("--------> VendorReceive Uptodate") }
                    })

            }

            else {
                log.info("--------> VendorReceive FreshMigrate")
                models.sequelize.query("SELECT * FROM P_VendorReceive ORDER BY DataExportDate DESC", { type: models.sequelize.QueryTypes.SELECT })
                    .then(data3 => {
                        if (data3.length != 0) {
                            DataExportDate = data3[0].DataExportDate.toISOString()
                            insertRecords(data3);
                        } else { nextTable("Complete-NoDataToExport"); log.info("-------->No data in P_VendorReceive") }
                    }).catch(function (error) {
                        log.error('Error VendorReceive:' + error);
                        nextTable("PolypmTable-NotExist");
                    })

            }

        })

}


async function insertRecords(data) {
    log.info('in insertRecords VendorReceive')

    models.VendorReceive.bulkCreate(data).then(async function (response) {

        log.info("--------> Success VendorReceive Migrated!")
        //  log.info("--------> Sleeping for 2secs..")
        //  await sleep(2000)   
        nextTable("Complete-DataExported");
    }).catch(function (error) {
        log.info('Error VendorReceive:' + error);
        nextTable("Error-DataExport");
    })


}


async function updateRecords(data) {
    log.info('in updateRecords VendorReceive')
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.VendorReceive.update(data[i],{
            where:{
                ReceiveID:data[i].ReceiveID
            }
        }).then(async function (response) {

        }).catch(function (error) {
            log.info('Error VendorReceive:' + error);
            nextTable("Error-DataExport");
        })
        // await sleep(100)
    }


}






function nextTable(status) {
    log.info('in nextTable VendorReceive')

    models.SyncService.update({ SyncOperation: true, SyncStatus: 'InProgress' },
        { where: { SyncTable: 'VendorReceiveDetails' } }
    ).then(function (response) {

        models.SyncService.update({ SyncOperation: false, SyncStatus: status, DataExportDate: DataExportDate },
            { where: { SyncTable: 'VendorReceive' } }
        ).then(function (response) {
            log.info('out nextTable VendorReceive')
            VendorReceiveDetails.migrateVendorReceiveDetails();
        })
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}  