import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import axios from "axios";
import Invoice from "../mongodb/models/invoice.js";

const ZATCA_API_BASE_URL = process.env.ZATCA_BACKEND_BASE_URL;

export const api = axios.create({
    baseURL: ZATCA_API_BASE_URL,
    headers: {"Content-Type": "application/json"},
});

export async function handleRequest(promise) {
    try {
        const response = await promise;
        return {zatcaStatus: response.status, zatcaData: response.data};
    } catch (error) {
        console.error("ZATCA API Error:", error.response?.data || error.message);
        return {
            zatcaStatus: error.response?.status || 500,
            zatcaData: error.response?.data || {message: error.message},
        };
    }
}

export function createInvoiceZatcaBackend(payload) {
    return handleRequest(api.post("/invoice/create", payload, {headers: {egsClientName: "Syncshire"}}));
}

export function updateInvoiceZatcaBackend(payload, uuid) {
    return handleRequest(api.put("/invoice/" + uuid, payload, {headers: {egsClientName: "Syncshire"}}));
}

export function onboardClient(payload) {
    return handleRequest(api.post("/onboardClient", payload));
}

// export async function checkInvoicesCompliance(payload) {
//     const invoicesWithType = await Promise.all(
//         payload.body.invoices.map(async ({invoiceId}) => {
//             const invoiceDoc = await Invoice.findOne({id: invoiceId}).lean();
//
//             return {
//                 invoiceId,
//                 invoiceType: invoiceDoc?.invoice_type || "StandardInvoice", // fallback
//             };
//         })
//     );
//
//     // Final payload to send
//     const requestBody = {
//         acceptLanguage: "EN",
//         egsClientName: "Syncshire",
//         invoices: invoicesWithType,
//     };
//
//     console.log("📥 Request body being sent:", requestBody);
//     return handleRequest(api.post("/checkInvoicesCompliance", requestBody));
// }

// export function reportInvoice(payload) {
//     return handleRequest(api.post("/reportInvoice", payload));
// }
