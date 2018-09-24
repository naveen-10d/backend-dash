'use strict';

module.exports = function (sequelize, DataTypes) {
    var TicketAttachments = sequelize.define("TicketAttachments", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        attachmenturl: DataTypes.STRING,
        filename: DataTypes.STRING,
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            hierarchy: true
        });

        TicketAttachments.associate = (models) => {
            TicketAttachments.belongsTo(models.Tickets)
        };

    return TicketAttachments;
}

