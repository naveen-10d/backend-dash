'use strict';

module.exports = function(sequelize, DataTypes) {
    var GroupReports = sequelize.define("GroupReports", {
        
        
      },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName:true
    });
    return GroupReports;
}