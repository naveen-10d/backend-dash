var OrderService = require("../services/Orderservice")
var OrderService2 = require("../services/OrderGraphservice")

/**
 *
 * Getting Order Shipped
 *
 */
module.exports.getOrderShipped = function (req, res) {
    OrderService.getOrderShipped(function (response) {
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
    OrderService.getOrderReceived(function (response) {
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
    var Days = req.params.days;
    OrderService.getOrderReceivedGraph(Days, function (response) {
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
    var Days = req.params.days;
    OrderService.getOrderShippedGraph(Days, function (response) {
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
    var Days = req.params.days;
    OrderService.getOrderForcastedGraph(Days, function (response) {
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
    var Days = req.params.days;
    OrderService.getOrdertopSelling(Days, function (response) {
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
    OrderService.getOrderReceivedToday(function (response) {
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
    OrderService.getOrderShippedToday(function (response) {
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
    OrderService2.getOrderonTime(function (response) {
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
    OrderService2.getOrderonTimeToday(function (response) {
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
    var Days = req.params.days;
    OrderService2.getOrderonTimeShipped(Days, function (response) {
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
    var Days = req.params.days;
    OrderService2.getOrderonTimeForecast(Days, function (response) {
        res.json(response);
        res.status(200);
    })
}
