import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    id: {type: String, required: true, unique: true},
    // postalAddress
    streetName: {type: String},
    buildingNumber: {type: String},
    citySubdivisionName: {type: String},
    cityName: {type: String},
    postalZone: {type: String},
    countryIdentificationCode: {type: String}, // country.identificationCode

    // partyTaxScheme
    partyTaxSchemeCompanyID: {type: String},
    partyTaxSchemeTaxSchemeId: {type: String}, // taxScheme.id

    // partyLegalEntity
    partyLegalEntityRegistrationName: {type: String, required: true},

    client_email: {type: String, required: false},
    phoneNumber: {type: String, required: false},
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true,
    },
    logo: {type: String, required: false},
    invoices: [{type: mongoose.Schema.Types.ObjectId, ref: "Invoice"}],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, {timestamps: true});

const ClientModel = mongoose.model("Client", ClientSchema);

export default ClientModel;
