var OrderService = require("../services/OrderOrgservice")
var OrderService2 = require("../services/OrderOrgGraphService")

/**
 *
 * Getting Order Shipped
 *
 */
module.exports.getOrderShipped = function (req, res) {
    var CompanyCode=req.params.code
    OrderService.getOrderShipped(CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * Getting Order Received
 *
 */
module.exports.getOrderReceived = function (req, res) {
    var CompanyCode=req.params.code
    OrderService.getOrderReceived(CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * Getting Order Received Graph
 *
 */
module.exports.getOrderReceivedGraph = function (req, res) {
    var Days=req.params.days;
    var CompanyCode=req.params.code
    OrderService.getOrderReceivedGraph(Days,CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * Getting Order Shipped Graph
 *
 */
module.exports.getOrderShippedGraph = function (req, res) {
    var Days=req.params.days;
    var CompanyCode=req.params.code
    OrderService.getOrderShippedGraph(Days,CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}


/**
 *
 * Getting Order Forcasted Graph
 *
 */
module.exports.getOrderForcastedGraph = function (req, res) {
    var Days=req.params.days;
    var CompanyCode=req.params.code;
    OrderService.getOrderForcastedGraph(Days,CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
} 


/**
 *
 * Getting Order Forcasted Graph
 *
 */
module.exports.getOrdertopSelling = function (req, res) {
    var Days=req.params.days;
    var CompanyCode=req.params.code
    OrderService.getOrdertopSelling(Days,CompanyCode, function (response) {
        res.json(response);
        res.status(200);
    })
}


/**
 *
 * Getting Order Received Today
 *
 */
module.exports.getOrderReceivedToday = function (req, res) {
    var CompanyCode=req.params.code
    OrderService.getOrderReceivedToday(CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}


/**
 *
 * Getting Order Shipped Today
 *
 */
module.exports.getOrderShippedToday = function (req, res) {
    var CompanyCode=req.params.code
    OrderService.getOrderShippedToday(CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * Getting Order OnTime Percentage
 *
 */
module.exports.getOrderonTime = function (req, res) {
    var CompanyCode=req.params.code
    OrderService2.getOrderonTime(CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}

/**
 *
 * Getting Order OnTime Today
 *
 */
module.exports.getOrderonTimeToday = function (req, res) {
    var CompanyCode=req.params.code
    OrderService2.getOrderonTimeToday(CompanyCode,function (response) {
        res.json(response);
        res.status(200);
    })
}


/**
 *
 * Getting Order OnTime Percentage Graph
 *
 */
module.exports.getOrderonTimeShipped = function (req, res) {
    var CompanyCode=req.params.code
    var Days=req.params.days;
    OrderService2.getOrderonTimeShipped(Days,CompanyCode, function (response) {
        res.json(response);
        res.status(200);
    })
}


/**
 *
 * Getting Order OnTime Percentage Graph
 *
 */
module.exports.getOrderonTimeForecast = function (req, res) {
    var CompanyCode=req.params.code
    var Days=req.params.days;
    OrderService2.getOrderonTimeForecast(Days,CompanyCode, function (response) {
        res.json(response);
        res.status(200);
    })
}
