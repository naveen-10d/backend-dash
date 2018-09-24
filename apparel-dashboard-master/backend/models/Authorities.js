'use strict';

module.exports = function (sequelize, DataTypes) {
    var Authorities = sequelize.define("Authorities", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        role: DataTypes.STRING,
    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true
        });
    return Authorities;
}