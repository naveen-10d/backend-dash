'use strict';

module.exports = function (sequelize, DataTypes) {
    var Reports = sequelize.define("Reports", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        reportname: DataTypes.STRING,
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true
        });
        Reports.associate = (models) => {
          Reports.belongsTo(models.Organizations, { as: 'Organization'});
        };

    return Reports;
}

