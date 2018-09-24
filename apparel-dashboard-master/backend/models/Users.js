'use strict';
module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define("Users", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: DataTypes.STRING,

    }, {
            timestamps: false,
            createdAt: false,
            updatedAt: false,
            freezeTableName: true
        });

    Users.associate = (models) => {
        Users.belongsToMany(models.Authorities, {
            as: "Authorities", through: "UserAuthorities", onDelete: 'cascade'
        })
        Users.belongsTo(models.Organizations, { as: 'organization' });
        Users.hasMany(models.Tickets)
        Users.belongsToMany(models.Reports,{through:"UserReports"})
    }
    return Users;
}