'use strict';
var shortid = require('shortid');

module.exports = function (sequelize, DataTypes) {
    var TicketsHistory = sequelize.define("TicketsHistory", {
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
        Date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        CreatedBy:DataTypes.STRING,
        AssignedTo:DataTypes.STRING,
        LogDescription: DataTypes.STRING
    },{
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
        hierarchy: true
    });
    TicketsHistory.associate = (models) => {
        TicketsHistory.belongsTo(models.Tickets)
    };

    return TicketsHistory;

}