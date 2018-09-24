'use strict';

module.exports = function(sequelize, DataTypes) {
    var UserReports = sequelize.define("UserReports", {
        
        
      },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName:true
    });
    return UserReports;
}