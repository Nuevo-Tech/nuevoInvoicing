const { randomUUID } = require("crypto");

class Helper {
    /**
     * Generate a UUID (v4 by default)
     */
    static generateUUID() {
        return randomUUID();
    }

    /**
     * Extract prefix from English part of a string
     */
    static getPrefixFromName(name) {
        // Keep only English letters/words
        const englishPart = name.replace(/[^\x00-\x7F]/g, "").trim();

        // Take first letters of each word
        const prefix = englishPart
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase())
            .join("");

        // Limit to 3–5 letters for readability
        return prefix.substring(0, 5);
    }

    static formatDateToZatca(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    static getTimeNowZatca() {
        const d = new Date.now();
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
    }

    static getZatcaInvoiceType(invoiceType) {
        switch (invoiceType) {
            case "StandardInvoice":
                return { value: "388", name: "0100000" };
            case "StandardInvoiceCreditNote":
                return { value: "381", name: "0100000" };
            case "StandardInvoiceDebitNote":
                return { value: "383", name: "0100000" };

            case "SimplifiedInvoice":
                return { value: "388", name: "0200000" };
            case "SimplifiedInvoiceCreditNote":
                return { value: "381", name: "0200000" };
            case "SimplifiedInvoiceDebitNote":
                return { value: "383", name: "0200000" };

            default:
                throw new Error(`Unknown invoice type: ${invoiceType}`);
        }
    }


    /**
     * Concatenate multiple strings with a separator
     */
    static joinStrings(parts, separator = "") {
        return parts.join(separator);
    }

    /**
     * Convert a string to Title Case
     */
    static toTitleCase(str) {
        return str.replace(/\w\S*/g, txt => {
            return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
        });
    }

    /**
     * Pad a string to a specific length
     */
    static padString(str, length, padChar = " ") {
        if (str.length >= length) return str;
        return str + padChar.repeat(length - str.length);
    }

    /**
     * Repeat a string N times
     */
    static repeatString(str, times) {
        return str.repeat(times);
    }
}

module.exports = Helper;
