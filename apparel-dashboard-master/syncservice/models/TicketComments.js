'use strict';
var shortid = require('shortid');

module.exports = function (sequelize, DataTypes) {
    var TicketComments = sequelize.define("TicketComments", {
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
        CommentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        CommentUserName: DataTypes.STRING,
        Comments: DataTypes.TEXT,


    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            hierarchy: true
        });
    TicketComments.associate = (models) => {
        TicketComments.belongsTo(models.Tickets)
    };

    return TicketComments;

}