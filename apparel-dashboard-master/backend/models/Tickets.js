'use strict';

module.exports = function (sequelize, DataTypes) {
    var Tickets = sequelize.define("Tickets", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        severity: DataTypes.STRING,
        priority: DataTypes.STRING,
        status: DataTypes.STRING,
        subject: DataTypes.STRING,
        description: DataTypes.STRING,
        escalate: DataTypes.STRING,
        time: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
          },
        changetime: DataTypes.DATE,
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true,
            hierarchy: true
        });

    Tickets.associate = (models) => {
        Tickets.belongsTo(models.Users,{as:'user', foreignKey:'UserUuid'});
        Tickets.hasMany(models.TicketAttachments,{as:'attachments'})
        Tickets.belongsTo(models.Users,{as:'assignto', foreignKey:"assignTo"})
        Tickets.hasMany(models.Chat,{as:'chat'});
    };

    return Tickets;
}

