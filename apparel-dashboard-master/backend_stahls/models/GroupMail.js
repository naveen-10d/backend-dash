'use strict';
var shortid = require('shortid');

module.exports = function (sequelize, DataTypes) {
    var GroupMail = sequelize.define("GroupMail", {
        uuid: {
            type: DataTypes.STRING,
            defaultValue: shortid.generate,
            primaryKey: true
        },
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
        },
        
        label: DataTypes.STRING,
        mail: DataTypes.STRING,
        status: DataTypes.BOOLEAN,
        Date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        }
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            hierarchy: true
        });

    return GroupMail;
}

