'use strict';

module.exports = function(sequelize, DataTypes) {
    var UserAuthorities = sequelize.define("UserAuthorities", {},
      {
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName:true
    });
    return UserAuthorities;
}