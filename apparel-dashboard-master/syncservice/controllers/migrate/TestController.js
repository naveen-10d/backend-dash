var models = require("../../models")
var Sequelize = require('sequelize');
var asyncLoop = require('node-async-loop')
var config = require('../../config/config.json');
const log=require("../../config/logConfig.js");

var SalesOrderItems = require("./SalesOrderItemsController");

var DataExportDate = null;

const sequelize = new Sequelize(config.dumpDb.name, config.dumpDb.username, config.dumpDb.password, {
    dialect: config.dumpDb.dialect,
    host: config.dumpDb.host,
    port: config.dumpDb.port,
    dialectOptions: {
        "encrypt": true
    }
})

var SalesOrderData=[]

module.exports.migrateSalesOrder = function () {
    log.info('in migrateSalesOrder');


  if(SalesOrderData.length==0){  
    sequelize.query("SELECT TOP 1 * FROM P_SalesOrder ORDER BY DataExportDate DESC",
        { type: sequelize.QueryTypes.SELECT })
        .then(data1 => {

         if(data1.length!==0){    
            DataExportDate = data1[0].DataExportDate;

        models.SalesOrder.findAll({ limit: 1, order: [ [ 'DataExportDate', 'DESC' ]]}).then(function(response){

            if(response.length!==0){  
                if (DataExportDate > response[0].DataExportDate) {

                    sequelize.query("SELECT * FROM P_SalesOrder where DataExportDate > "+"'"+response[0].DataExportDate.toISOString()+"'", { type: sequelize.QueryTypes.SELECT })
                        .then(data2 => {

                            if (data2.length != 0) {
                               
                               SalesOrderData =data2
                               var filterData1 = SalesOrderData.splice(0, 100);
                               startMigrate(filterData1)

                            } else {
                                log.info("--------> No Records To Migrate!")
                                nextTable("Complete-NoDataFound");
                            }

                        })


                } else {
                    log.info("--------> SalesOrder Uptodate")
                    nextTable("Complete-NoDataFound");
                }

            }else{
                log.info("--------> SalesOrder FreshMigrate")
                sequelize.query("SELECT * FROM P_SalesOrder", { type: sequelize.QueryTypes.SELECT })
                        .then(data3 => {
                    
                                SalesOrderData =data3
                                var filterData2 = SalesOrderData.splice(0, 100);
                                startMigrate(filterData2)
                             
                        })
             }

            })

        }else{  nextTable("Complete-NoDataToExport"); log.info("-------->Nodata in P_SalesOrder") } 
        })
        .catch(function (error) {
            log.error('Error SalesOrder:'+error);
            nextTable("PolypmTable-NotExist");
        })

    }else{
        var filterData3 = SalesOrderData.splice(0, 100);
        startMigrate(filterData3)
      }  

}

 
async function startMigrate(data) {
    log.info('in startMigrate SalesOrder')
    var count = 0;
    for (i = 0; i < data.length; i++) {
        count++;

        models.SalesOrder.upsert(data[i]).then(async function (response) {

        }).catch(function (error) {
            log.info('Error SalesOrder:'+error);
            nextTable("Error-DataExport");
        })

        if (count === data.length) {
            log.info("--------> Success SalesOrder Migrated!")
            log.info("--------> Sleeping for 2secs..")
            await sleep(2000)
            nextTable("Complete-DataExported");
        }
        await sleep(100)
    }


}

function nextTable(status) {
    log.info('in nextTable SalesOrder')
    models.SyncService.update( { SyncOperation: true, SyncStatus: 'InProgress' },
        { where: { SyncTable: 'SalesOrderItems' } }
    ).then(function (response) {

        models.SyncService.update({ SyncOperation: false, SyncStatus: status,  DataExportDate: DataExportDate },
         { where: { SyncTable: 'SalesOrder' } }
        ).then(function (response) {
            log.info('out nextTable SalesOrder')
            SalesOrderItems.migrateSalesOrderItems();
        })
    })

}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}








