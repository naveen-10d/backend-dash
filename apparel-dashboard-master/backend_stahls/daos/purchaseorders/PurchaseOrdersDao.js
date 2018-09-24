var models = require("../../models")
var asyncLoop = require('node-async-loop');
var status = require("../../config/status");

module.exports.createpurchaseorder = function (PurchaseOrderDetails, callback) {
    models.VendorReceive.create(PurchaseOrderDetails).then(function (response) {
        console.log("i am in dao  in", PurchaseOrderDetails)
        callback(response, status.created)
    }).catch(function (error) {
        callback(error, status.error)
    })
}

// module.exports.getallpurchaseorders = function (callback) {
//     models.VendorReceive.findAll({
//         order:[
//             ['ReceiveID','DESC']
//         ],
//         include: [
//             {
//                 model: models.VendorReceiveDetails,
//             },
//             {
//                 model: models.VendorPOs,
//             }
//         ]

//         }).then(function (response) {

//                 asyncLoop(response, (element, next) => {
//                     if(element.dataValues.VendorPO.PONumber!==null){
//                             models.SalesOrder.findOne({ where: {PONumber: element.dataValues.VendorPO.PONumber} }).then(Order => {

//                                 if(Order){
//                                         element.dataValues.SalesOrder=Order;
//                                     }else{element.dataValues.SalesOrder={};}         
//                                 })
//                         }else{element.dataValues.SalesOrder={};}
//                            next();
//                 },async function (err) {
//                     if (err) {
//                         console.log("error in async")
//                     }
//                     else {
//                         await sleep(500)
//                         callback(response)
//                     }
//                 })


//     }).catch(function (error) {
//          callback(error, status.error)
//     })
// }


module.exports.getallpurchaseorders = function (callback) {
    models.VendorPOs.findAll({
        order: [
            ['PONumber', 'DESC']
        ],
        include: [{
            model: models.VendorReceive,
            include: [{
                model: models.VendorReceiveDetails,
            }]
        }]

    }).then(function (response) {
        var count = 0
        if (response.length != 0) {
            asyncLoop(response, (element, next) => {
                if (element.dataValues.PONumber !== null) {
                    models.SalesOrder.findOne({
                        where: {
                            PONumber: element.dataValues.PONumber
                        }
                    }).then(Order => {

                        if (Order) {
                            element.dataValues.SalesOrder = Order;
                        } else {
                            element.dataValues.SalesOrder = {};
                        }
                        count++
                        if (count == response.length) {
                            callback(response, status.ok)
                        }
                    })
                    next();
                } else {
                    element.dataValues.SalesOrder = {};
                }

            }, async function (err) {
                if (err) {
                    console.log("error in async")
                } else {
                    await sleep(500)
                }
            })

        } else {
            callback(response, status.ok);
        }

    }).catch(function (error) {
        callback(error, status.error)
    })
}



module.exports.getAllPurchaseOrderByOrg = function (companyCode, callback) {
    models.VendorPOs.findAll({
        where: {
            CompanyCode: companyCode
        },
        order: [
            ['PONumber', 'DESC']
        ],
        include: [{
            model: models.VendorReceive,
            include: [{
                model: models.VendorReceiveDetails,
            }]
        }]

    }).then(function (response) {
        var count = 0
        if (response.length != 0) {

            asyncLoop(response, (element, next) => {
                if (element.dataValues.PONumber !== null) {
                    models.SalesOrder.findOne({
                        where: {
                            PONumber: element.dataValues.PONumber
                        }
                    }).then(Order => {

                        if (Order) {
                            element.dataValues.SalesOrder = Order;
                        } else {
                            element.dataValues.SalesOrder = {};
                        }
                        count++
                        if (count == response.length) {
                            callback(response, status.ok)
                        }
                    })
                    next();
                } else {
                    element.dataValues.SalesOrder = {};
                }

            }, async function (err) {
                if (err) {
                    console.log("error in async")
                } else {
                    await sleep(500)
                }
            })


        } else {
            callback(response, status.ok);
        }



    }).catch(function (error) {
        callback(error, status.error)
    })
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.getpurchaseorderbyid = function (purchaseorderID, callback) {
    models.VendorReceive.findOne({
        where: {
            ReceiveID: purchaseorderID
        },
        order: [
            ['ReceiveID', 'DESC']
        ],
        include: [{
                model: models.VendorReceiveDetails
            },
            {
                model: models.VendorPOs,
            }
        ]
    }).then(async function (response) {
        //callback(response)

        if (response.dataValues.VendorPO.PONumber !== null) {
            models.SalesOrder.findOne({
                where: {
                    PONumber: response.dataValues.VendorPO.PONumber
                }
            }).then(Order => {

                if (Order) {
                    response.dataValues.SalesOrder = Order;
                } else {
                    response.dataValues.SalesOrder = {};
                }
                callback(response, status.ok)
            })
        } else {
            response.dataValues.SalesOrder = {};
            callback(response, status.ok)
        }



    }).catch(function (error) {
        callback(error, status.error)
    })
}


module.exports.deletepurchaseorder = function (purchaseorderID, callback) {
    models.VendorReceive.destroy({
        where: {
            ReceiveID: purchaseorderID
        }
    }).then(function (response) {
        callback(response, status.ok)
    }).catch(function (error) {
        callback(error, status.error)
    })
}

module.exports.updatepurchaseorder = function (PurchaseOrderDetails, callback) {
    models.VendorReceive.update(PurchaseOrderDetails, {
        where: {
            ReceiveID: PurchaseOrderDetails.ReceiveID
        }
    }).then(function (response) {
        callback(response, status.ok)
    }).catch(function (error) {
        callback(error, status.error)
    })
}