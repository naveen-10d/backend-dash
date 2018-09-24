var models = require("../../models")

module.exports.createOrganization = function (OrganizationDetails, callback) {
    models.Organizations.create(OrganizationDetails).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getallOrganization = function (callback) {
    models.Organizations.findAll().then(function (response) {
        if (response.length != 0) {
            callback(response)
        } else {
            callback("There is no Organisation")
        }

    }).catch(function (error) {
        callback(error)
    })
}

module.exports.getOrganizationById = function (Organisation_id, callback) {
    models.Organizations.findById(Organisation_id).then(response => {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.delete_Organisation = function (Organisation_id, callback) {
    models.Organizations.destroy({ where: { uuid: Organisation_id } }).then(response => {
        callback();
    }).catch(function (error) {
        callback(error)
    })
}

module.exports.update_Organisation = function (OrganizationDetails, callback) {
    models.Organizations.update(OrganizationDetails, { where: { uuid: OrganizationDetails.uuid } }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        callback(error)
    })
}