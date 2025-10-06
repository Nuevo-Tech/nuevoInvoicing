import express from 'express';
import {
    createInvoiceZatcaBackend,
    updateInvoiceZatcaBackend,
} from '../middleware/zatcaApis.js';

const router = express.Router();

router.route('/invoice/create').post(createInvoiceZatcaBackend);
router.route('/invoice/update').post(updateInvoiceZatcaBackend);

export default router;
