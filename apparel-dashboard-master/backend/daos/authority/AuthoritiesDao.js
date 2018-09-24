var models = require("../../models")

 module.exports.create_authority = function(authority, callback){

    models.Authorities.create(authority).then(function(response, error){
        callback(response);
    }).catch(function(error){
        callback(null, error);
    })
 }

 module.exports.getallauthority = function (callback) {
    models.Authorities.findAll().then(function (response) {
        callback(response)
    }).catch(function (error) {
        var errdata ={status:500, stacktrace:error}
        callback(errdata)
    })
}

module.exports.getauthorityById = function (authority, callback) {
    models.Authorities.findAll({ where:{ uuid:authority } }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        var errdata ={status:500, stacktrace:error}
        callback(errdata)
    })
}

module.exports.delete_authority = function (authority, callback) {
    models.Authorities.destroy({ where: { uuid: authority } }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        var errdata ={status:500, stacktrace:error}
        callback(errdata)
    })
}

module.exports.update_authority = function (authority, callback) {
    models.Authorities.update(authority, { where: { uuid: authority.uuid } }).then(function (response) {
        callback(response)
    }).catch(function (error) {
        var errdata ={status:500, stacktrace:error}
        callback(errdata)
    })
}