'use strict';

module.exports = function(sequelize, DataTypes) {
    var GroupUsers = sequelize.define("GroupUsers", {
        
        
      },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName:true
    });
    return GroupUsers;
}