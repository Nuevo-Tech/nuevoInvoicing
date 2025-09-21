import express from 'express';
import {
    createInvoiceZatcaBackend,
    updateInvoiceZatcaBackend,
    onboardClient,
    reportInvoice,
} from '../middleware/zatcaApis.js';

const router = express.Router();

router.route('/invoice/create').post(createInvoiceZatcaBackend);
router.route('/invoice/update').post(updateInvoiceZatcaBackend);
// router.route('/onboardClient').post(onboardClient);
// router.route('/checkInvoicesCompliance').post(checkInvoicesCompliance);
router.route('/reportInvoice').post(reportInvoice);

export default router;
