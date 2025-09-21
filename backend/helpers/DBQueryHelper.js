import InvoiceCounter from "../mongodb/models/invoicecounter.js";
import Helper from "./Helper.js";


export async function generateInvoiceId(Client, session){

    const partyLegalEntityRegistrationName = Client.partyLegalEntityRegistrationName;
    const prefix = Helper.getPrefixFromName(partyLegalEntityRegistrationName);

    // Atomic findOneAndUpdate → prevents concurrency issues
    const counter = await InvoiceCounter.findOneAndUpdate(
        { prefix },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // upsert ensures prefix is created if missing
    ).session(session);

    const seqNumber = counter.seq.toString().padStart(3, "0"); // e.g. 001, 002, ...
    return `${prefix}${seqNumber}`;
}

