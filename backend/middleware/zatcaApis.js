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

export function onboardZatcaClient(payload) {
    return handleRequest(api.post("/onboardClient", payload));
}