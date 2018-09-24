var express = require("express");
var router = express.Router();
var controller = require("../../controllers/invoices/InvoicesController");


router.post("/create", controller.createInvoices);
//router.get("/getall",controller.getallInvoices);
//router.get("/org/getall/:companyCode",controller.getallInvoicesByOrg);
router.get("/get/:uuid",controller.getInvoicesById);
router.delete("/delete/:uuid",controller.delete_Invoices);
router.put("/update",controller.update_Invoices);

router.post("/getall",controller.getallInvoices);
router.post("/org/getall",controller.getallInvoicesByOrg);
router.get("/getInvoicesFilterValue",controller.getInvoicesFilterValue);
router.post("/getInvoicesFilterValueData",controller.getInvoicesFilterValueData);
router.post("/getInvoicesFilterValueDataByCode/:code",controller.getInvoicesFilterValueDataByCode);
router.get("/getInvoicesFilterValueByCode/:code",controller.getInvoicesFilterValueByCode);

module.exports = router;