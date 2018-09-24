'use strict';

module.exports = function (sequelize, DataTypes) {
    var Organizations = sequelize.define("Organizations", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        organizationname: DataTypes.STRING,
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true
        });
    Organizations.associate = (models) => {
        Organizations.hasMany(models.Groups)
        Organizations.hasMany(models.Reports)
    };
    return Organizations;
}
