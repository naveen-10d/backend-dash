var migrate = require("./migrate");
var models = require("../models")
var main =require("../main.js")
const log=require("../config/logConfig.js");
var DateDiff = require('date-diff');

module.exports.migrateAll = function () {
    log.info('in migrateAll');

models.SyncService.findAll({ where: { SyncOperation: true }}).then(function (response) {   
    if(response.length===0){
        log.info('Start Sync');
        migrate.SalesOrder.migrateSalesOrder();
    }else{
        
  models.SyncService.findAll({limit: 1, order: [ [ 'updatedAt', 'DESC' ]]}).then(function(response){                              
            var date1 = new Date();
            var date2 = new Date(response[0].updatedAt); 
            var diff = new DateDiff(date1, date2);
            //console.log("diff at --------->", diff.minutes())
            if(diff.minutes()>120){                
                models.SyncService.update({SyncOperation:false,SyncStatus:'Complete-NoDataFound'}, { where: { SyncOperation: true } }).then(function (response) {                  
                    log.info('restart sync.')
                }).catch(function (error) {
                    log.error(error)                   
                })                 
            }else{log.info("Sync Already in Progress...")}
        }).catch(function (error) {
            log.error(error)
        })
    }

  })

}


/**
 *
 * Updating Time Frequency for Migrate
 *
 */
module.exports.updateTimeFrequency = function (req, res) {
    log.info('in Update time frequency.')
    var syncData = req.body;

    models.StahlsConfig.update(syncData, { where: { name: 'migrationfrequency' } }).then(function (response) {
        main.updateShedule();
        res.json(response);
        res.status(200);
        log.info('update time success.')
    }).catch(function (error) {
        log.error(error)
        res.json(error);
        res.status(500);
    })
}

/**
 *
 * Get Time Frequency for Migrate
 *
 */

module.exports.getTimeFrequency = function (req, res) {
    log.info('in get time frequency.')
    models.StahlsConfig.findOne({ where: { name: 'migrationfrequency' }}).then(function (response) {
        log.info('get time success.')
        res.json(response);
        res.status(200);
    }).catch(function (error) {
        log.error(error)
        res.json(error);
        res.status(500);
    })
}