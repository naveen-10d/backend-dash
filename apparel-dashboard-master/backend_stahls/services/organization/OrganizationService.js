var OrganizationDao = require("../../daos/organization/OrganizationDao")

module.exports.createOrganization = function (OrganizationDetails, callback) {
    OrganizationDao.createOrganization(OrganizationDetails, function (response, status) {
        callback(response, status);
    })
}

module.exports.getallOrganization = function (callback) {
    OrganizationDao.getallOrganization(function (response, status) {
        callback(response, status)
    })
}

module.exports.getOrganizationById = function (Organisation_id, callback) {
    OrganizationDao.getOrganizationById(Organisation_id, function (response, status) {
        callback(response, status)
    })
}

module.exports.delete_Organisation = function (Organisation_id, callback) {
    OrganizationDao.delete_Organisation(Organisation_id, function (response,status) {
        callback(response , status);
    });
}

module.exports.update_Organisation = function (OrganizationDetails, callback) {
    OrganizationDao.update_Organisation(OrganizationDetails, function (response, status) {
        callback(response, status)
    });
}