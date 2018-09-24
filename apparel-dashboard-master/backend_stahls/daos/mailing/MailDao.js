let mailer = require('../../config/mailer');
//let FileModel = require('../model/File');
let Users = require('../../models/Users');
let fs = require('fs')
let path = require('path')
var models = require("../../models")
var statusCode = require('../../config/status');

exports.createMail = (mailData, callback) => {
    console.log('entering into creatmail dao ---- ', mailData);
    console.log("entering into maildao method -------> ", mailData.LogDescription, mailData.currentUser)
    if (mailData.LogDescription) {
        console.log(' entering into log description in maildao ')
        // console.log("inside close-------->", mailData)
        var email = [];
        // email.push(mailData.created_by.email);
        var logDescription = mailData.LogDescription;
        var userId = mailData.created_by.uuid;
        var firstname = mailData.created_by.firstname;
        if (mailData.assigned_to.length !== 0) {
            mailData.assigned_to.forEach(element => {
                email.push(element.email);
            })
        }
        var ticketno = mailData.id;
        var ticketDescription = mailData.description;

        if (mailData.salesorder.length > 0) {
            var orderid = mailData.salesorder[0].OrderID;
        } else {
            var orderid = " - ";
        }

        //var mailContent = "Hi " + firstname + " , \n\n Ticket No : " + ticketno + "\t has been closed by :" + assigned_to + "\n Reason:" + reason + "\n Order ID : " + orderid + " "

        var mailContent = {
            "firstname": firstname,
            "ticketno": ticketno,
            "logDescription": logDescription,
            "orderId": orderid,
            "type": mailData.Type,
            "ticketuid": mailData.uuid,
            "description": ticketDescription,
            "currentUser": mailData.currentUser
        }
        mailer.sendMail(email, userId, mailContent, function (MailResponse, status) {
            callback(MailResponse, status)
        })

    }
    if (mailData.comments) {
        console.log("entering into comments in maildao --- ", mailData);
        var email = [];
        // email.push(mailData.email);
        var comments = mailData.comments;
        var userId = mailData.userId;
        var firstname = mailData.firstname;
        if (mailData.assigned_to.length !== 0) {
            mailData.assigned_to.forEach(element => {
                email.push(element.email);
            })
        }
        var ticketno = mailData.id;
        var ticketDescription = mailData.description;
        var orderid = mailData.salesorder;
        // if (mailData.salesorder.length > 0) {
        //     var orderid = mailData.salesorder[0].OrderID;
        // } else {
        //     var orderid = " - ";
        // }

        //var mailContent = "Hi " + firstname + " , \n\n Ticket No : " + ticketno + "\t has been closed by :" + assigned_to + "\n Reason:" + reason + "\n Order ID : " + orderid + " "

        var mailContent = {
            "firstname": firstname,
            "ticketno": ticketno,
            "comments": comments,
            "orderId": orderid,
            "type": mailData.Type,
            "ticketuid": mailData.uuid,
            "description": ticketDescription,
            "currentUser": mailData.currentUser
        }
        mailer.sendMail(email, userId, mailContent, function (MailResponse, status) {
            callback(MailResponse, status)
        })
    }
    // if (mailData.orderNumberList) {
    //     console.log("entering into orderNumber list in maildao")
    //     var email = [];
    //     // email.push(mailData.created_by.email);
    //     var comments = mailData.comments;
    //     var userId = mailData.created_by.uuid;
    //     var firstname = mailData.created_by.firstname;
    //     if (mailData.assigned_to.length !== 0) {
    //         mailData.assigned_to.forEach(element => {
    //             email.push(element.email);
    //         })
    //     }
    //     var ticketno = mailData.id;
    //     var ticketDescription = mailData.description;

    //     if (mailData.salesorder.length > 0) {
    //         var orderid = mailData.salesorder[0].OrderID;
    //     } else {
    //         var orderid = " - ";
    //     }
    //     var orderList = mailData.orderNumberList;
    //     //var mailContent = "Hi " + firstname + " , \n\n Ticket No : " + ticketno + "\t has been closed by :" + assigned_to + "\n Reason:" + reason + "\n Order ID : " + orderid + " "

    //     var mailContent = {
    //         "firstname": firstname,
    //         "ticketno": ticketno,
    //         "comments": comments,
    //         "orderList": orderList,
    //         "orderId": orderid,
    //         "type": mailData.Type,
    //         "ticketuid": mailData.uuid,
    //         "description": ticketDescription,
    //         "currentUser": mailData.currentUser
    //     }
    //     mailer.sendMail(email, userId, mailContent, function (MailResponse, status) {
    //         callback(MailResponse, status)
    //     })
    // }
    if (mailData.Status === "Closed") {

        // console.log("inside close-------->", mailData)
        var email = [];
        // email.push(mailData.created_by.email);
        var userId = mailData.created_by.uuid;
        var firstname = mailData.created_by.firstname;
        if (mailData.assigned_to.length !== 0) {
            var assigned_to = mailData.assigned_to[0].firstname;
            // email.push(mailData.assigned_to[0].email);
            mailData.assigned_to.forEach(element => {
                // firstname.push(element.firstname);
                email.push(element.email);
            })
        } else {
            var assigned_to = "-";
        }
        var reason = mailData.closingRemarks.Reason;
        // var email = mailData.created_by.email;
        var ticketno = mailData.id;
        var ticketDescription = mailData.description;

        if (mailData.salesorder.length > 0) {
            var orderid = mailData.salesorder[0].OrderID;
        } else {
            var orderid = " - ";
        }

        //var mailContent = "Hi " + firstname + " , \n\n Ticket No : " + ticketno + "\t has been closed by :" + assigned_to + "\n Reason:" + reason + "\n Order ID : " + orderid + " "

        var mailContent = {
            "firstname": firstname,
            "ticketno": ticketno,
            "closedby": assigned_to,
            "reason": reason,
            "orderId": orderid,
            "type": "close",
            "ticketuid": mailData.uuid,
            "description": ticketDescription,
            "currentUser": mailData.currentUser
        }
        mailer.sendMail(email, userId, mailContent, function (MailResponse, status) {
            callback(MailResponse, status)
        })

    }

    if (mailData.Status === "Reopen") {
        var userId = mailData.created_by.uuid;
        var email = [];
        // email.push(mailData.created_by.email);
        var firstname = mailData.created_by.firstname;
        if (mailData.assigned_to.length !== 0) {
            email.push(mailData.assigned_to[0].email);
            var assigned_to = mailData.assigned_to[0].firstname;
        } else {
            var assigned_to = "-";
        }
        // var email = mailData.created_by.email;
        var ticketno = mailData.id;
        var ticketDescription = mailData.description;

        if (mailData.salesorder.length > 0) {
            var orderid = mailData.salesorder[0].OrderID;
        } else {
            var orderid = " - ";
        }

        //var mailContent = "Hi " + firstname + " , \n\n Ticket No : " + ticketno + "\t has been closed by :" + assigned_to + "\n Reason:" + reason + "\n Order ID : " + orderid + " "

        var mailContent = {
            "firstname": firstname,
            "ticketno": ticketno,
            "closedby": assigned_to,
            "orderId": orderid,
            "type": "Reopen",
            "ticketuid": mailData.uuid,
            "description": ticketDescription,
            "currentUser": mailData.currentUser
        }
        mailer.sendMail(email, userId, mailContent, function (MailResponse, status) {
            callback(MailResponse, status)
        })

    }
    if (mailData.Status === 'Assigned') {
        console.log('entering into assigned if part in dao')
        var email = [];
        var firstname = [];
        console.log('assigned to length of data are ---- ', mailData.assigned_to.length);
        if (mailData.assigned_to.length != 0) {
            var userId = mailData.assigned_to.uuid;
            if (mailData.assigned_to.length !== 0) {
                mailData.assigned_to.forEach(element => {
                    firstname.push(element.firstname);
                    email.push(element.email);
                })
            }
            var ticketno = mailData.id;
            var ticketDescription = mailData.description;
            if (mailData.salesorder.length > 0) {
                var orderid = mailData.salesorder[0].OrderID;
            } else {
                var orderid = " - ";
            }
            // if (mailData.created_by != null) {
            //     email.push(mailData.created_by.email);
            // }

            var mailContent = {
                "firstname": firstname,
                "ticketno": ticketno,
                "orderId": orderid,
                "type": "assign",
                "ticketuid": mailData.uuid,
                "description": ticketDescription,
                "currentUser": mailData.currentUser
            }
            mailer.sendMail(email, userId, mailContent, function (MailResponse, status) {
                callback(MailResponse, status)
            })

        } else {
            callback("mail not sent", statusCode.no_content)
        }
    }

    if (mailData.Status === 'Open') {
        var email = [];

        console.log("inside Open-------->", mailData)
        var userId = mailData.createdByUuid;
        var firstname = mailData.createdByUser.firstname;
        // email.push(mailData.createdByUser.email);
        var ticketno = mailData.ticket.id;
        var ticketDescription = mailData.ticket.description;
        if (mailData.salesorder.length > 0) {
            var orderid = mailData.salesorder[0].OrderID;
        } else {
            var orderid = " - ";
        }

        var mailContent = {
            "firstname": firstname,
            "ticketno": ticketno,
            "ticketuid": mailData.ticket.uuid,
            "orderId": orderid,
            "type": "create",
            "description": ticketDescription
        }
        mailer.sendMail(email, userId, mailContent, function (MailResponse, status) {
            callback(MailResponse, status)
        })
    }

}




// Group Mail
module.exports.addMail = function (MailDetails, callback) {
    models.GroupMail.create(MailDetails).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}

module.exports.getallMail = function (callback) {
    models.GroupMail.findAll().then(function (response) {
        if (response.length != 0) {
            callback(response, statusCode.ok)
        } else {
            callback("There is no Mail", statusCode.no_content)
        }

    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}



module.exports.updateMail = function (MailDetails, callback) {
    models.GroupMail.update(MailDetails, {
        where: {
            uuid: MailDetails.uuid
        }
    }).then(function (response) {
        callback(response, statusCode.ok)
    }).catch(function (error) {
        callback(error, statusCode.error)
    })
}


module.exports.deleteMail = function (uuid, callback) {
    models.GroupMail.destroy({
        where: {
            uuid: uuid
        }
    }).then(response => {
        callback(response);
    }).catch(function (error) {
        callback(error)
    })
}