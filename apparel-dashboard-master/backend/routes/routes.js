var express = require("express");
var routers = require("./routers");


var api = express.Router();

api.use("/User", routers.UserRouter);
api.use("/Authorities", routers.AuthoritiesRouter);
api.use("/Organization", routers.OrganizationRouter)
api.use("/Group", routers.GroupRouter);
api.use("/GroupUsers", routers.GroupUsersRouter);
api.use("/Ticket", routers.TicketRouter);
api.use("/file", routers.TicketAttachmentRouter);
api.use("/Report", routers.ReportRouter);
api.use("/loggerDetails", routers.LoggerRouter);
api.use("/Chat", routers.ChatRouter);


module.exports = api;
