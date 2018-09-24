var nodemailer = require('nodemailer');
var config = require('./mailConfig');
//var __dirname = "/home/decoders/Documents";
// var __dirname = "../static"
var fs = require("fs");
var handlebars = require('handlebars');
var htmlToSend = null;
var models = require("../models")
var statusCode = require("./status");


exports.sendMail = (mailId, userId, mailContent, callback) => {
    console.log("entering into Mailer Method-1----->", mailId, userId, mailContent, mailContent.comments);
    var mailTo = []
    models.GroupMail.findAll({
        where: {
            status: true
        }
    }).then(function (response) {
        if (response.length != 0) {
            response.forEach(element => {
                mailTo.push(element.mail)
            });
        } else {
            console.log("There is no Mail")
        }
    })

    mailId.forEach(element => {
        mailTo.push(element)
    });


    var readHTMLFile = function (path, callback) {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            } else {
                callback(null, html);
            }
        });
    };

    readHTMLFile(config.mailConfig.MailTemplateLocation, function (err, html) {
        var template = handlebars.compile(html);

        if (mailContent.type === "assign") {
            console.log('entering $$ into assign if part in mailer function')
            var replacements = {
                // username: mailContent.firstname,
                ticketno: mailContent.ticketno,
                orderId: mailContent.orderId,
                content: "has been Assigned by  " + mailContent.currentUser + "  to   " + mailContent.firstname.join(","),
                discription: mailContent.description,
                urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
            };
        }

        if (mailContent.type === "close") {
            var replacements = {
                // username: mailContent.firstname,
                ticketno: mailContent.ticketno,
                orderId: mailContent.orderId,
                content: "has been Closed by  " + mailContent.currentUser,
                reason: "Closed Reason: " + mailContent.reason,
                discription: mailContent.description,
                urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
            };
        }

        if (mailContent.type === "Reopen") {
            console.log('entering into reopen status')
            var replacements = {
                username: mailContent.firstname,
                ticketno: mailContent.ticketno,
                orderId: mailContent.orderId,
                content: "has been Reopened by  " + mailContent.currentUser,
                discription: mailContent.description,
                urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
            };
        }

        if (mailContent.type === "create") {
            var replacements = {
                username: mailContent.firstname,
                ticketno: mailContent.ticketno,
                orderId: mailContent.orderId,
                content: "has been created by  " + mailContent.firstname,
                discription: mailContent.description,
                urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
            };
        }
        if (mailContent.logDescription) {
            console.log('entering into logdescription --- ', mailContent.logDescription);
            if (mailContent.logDescription == "Priority has been Changed") {
                var replacements = {
                    // username: mailContent.firstname,
                    ticketno: mailContent.ticketno,
                    orderId: mailContent.orderId,
                    content: "Priority has been changed by  " + mailContent.currentUser + "  as  " + mailContent.type,
                    discription: mailContent.description,
                    urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                    urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
                };
            } else if (mailContent.logDescription == "File has been Uploaded" ||
                mailContent.logDescription == "File has been Deleted") {
                var replacements = {
                    // username: mailContent.firstname,
                    ticketno: mailContent.ticketno,
                    orderId: mailContent.orderId,
                    content: mailContent.logDescription + " by " + mailContent.currentUser,
                    discription: mailContent.description,
                    urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                    urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
                };
            }
            // else if(mailContent.logDescription == "File has been Deleted") {

            // }

        }
        if (mailContent.comments) {
            console.log('entering into comments in mailer finction');
            var replacements = {
                // username: mailContent.firstname,
                ticketno: mailContent.ticketno,
                orderId: mailContent.orderId,
                content: mailContent.currentUser + "  has added the comment is  '  " + mailContent.comments + "  '",
                // comment: mailContent.comments,
                // commentAdded: mailContent.currentUser,
                // content: '',
                discription: mailContent.description,
                urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
            };
        }
        if (mailContent.orderList) {
            var replacements = {
                ticketno: mailContent.ticketno,
                orderId: mailContent.orderId,
                content: mailContent.currentUser + "  has added the new Order  " + mailContent.orderList.join(",") + "  to this ticket",
                discription: mailContent.description,
                urlTicket: config.mailConfig.baseUrl + "/ticketdetails?uuid=" + mailContent.ticketuid,
                urlOrder: config.mailConfig.baseUrl + "/order-detail?orderId=" + mailContent.orderId
            }
        }

        htmlToSend = template(replacements);
        //console.log("test readfile------->",htmlToSend)

        const transporter = nodemailer.createTransport({
            service: config.mailConfig.EMAIL_SERVICE_MIDDLEWARE,
            auth: {
                user: config.mailConfig.SERVICE_EMAIL,
                pass: config.mailConfig.SERVICE_EMAIL_PASSWORD
            }
        });




        const mailOptions = {

            to: mailTo,
            from: config.mailConfig.SERVICE_EMAIL,
            subject: 'Notification for Ticket- #' + mailContent.ticketno,
            replyTo: config.mailConfig.REPLAY_TO_EMAIL,
            //text: mailContent,
            html: htmlToSend
            // attachments: [
            //     {
            //         'filename': "contract.pdf",
            //         'path': __dirname + "/" + userId + ".pdf"

            //     }
            // ]
        };

        transporter.sendMail(mailOptions)
            .then((result) => {
                console.log('after mail sended result are ---- ', result);
                if (result != null) {
                    //fs.unlink(__dirname + "/" + userId + ".docx", function () { });
                    console.log("Mail Sent Successfully--------------->");
                    callback({
                        message: 'Success'
                    }, statusCode.ok)
                }

                // callback({message: 'Mail Sent'});
            }).catch(function (error) {
                callback(error, statusCode.error)
                console.log('facing error while sending mail ---- ', error);
            })


    });







}


exports.ForgotPasswordMail = (mailId, token, callback) => {
    console.log("entering into Mailer Method------>", mailId, token);

    var readHTMLFile = function (path, callback) {
        fs.readFile(path, {
            encoding: 'utf-8'
        }, function (err, html) {
            if (err) {
                throw err;
                callback(err);
            } else {
                callback(null, html);
            }
        });
    };

    readHTMLFile(config.mailConfig.ForgotPasswordTemplateLocation, function (err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            content: "You have Opted for change Password",
            url: config.mailConfig.baseUrl + '/Forgotpassword/?token=' + token,
            srcUrl: config.mailConfig.baseUrl + '/assets/img/logo.png'
        };

        htmlToSend = template(replacements);
        console.log("test readfile------->", replacements)

        const transporter = nodemailer.createTransport({
            service: config.mailConfig.EMAIL_SERVICE_MIDDLEWARE,
            auth: {
                user: config.mailConfig.SERVICE_EMAIL,
                pass: config.mailConfig.SERVICE_EMAIL_PASSWORD
            }
        });

        const mailOptions = {

            to: mailId,
            from: config.mailConfig.SERVICE_EMAIL,
            subject: 'Change Password',
            replyTo: config.mailConfig.REPLAY_TO_EMAIL,
            html: htmlToSend
        };

        transporter.sendMail(mailOptions)
            .then((result) => {
                console.log('after mail sended result are ---- ', result);
                if (result != null) {
                    console.log("Mail Sent Successfully--------------->");
                    callback({
                        message: 'Success'
                    }, statusCode.ok)
                }

            }).catch(function (error) {
                console.log('facing error while sending mail ---- ', error);
                callback(error, statusCode.error)
            })

    });
}