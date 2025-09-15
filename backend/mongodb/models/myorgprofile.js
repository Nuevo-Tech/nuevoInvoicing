import mongoose from "mongoose";

const MyOrgProfileSchema = new mongoose.Schema({
        id:{type: String},
            // partyIdentification
        partyId: {type: String},                        // id
        partySchemeID: {type: String, default: "CRN"},  // schemeID

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
        partyLegalEntityRegistrationName: {type: String},

        // other fields
        logo: {type: String, required: false},
        email: {type: String, required: false},
        phoneNumber: {type: String, required: false},
    },
    {timestamps: true}
);

const myOrgProfileModel = mongoose.model("MyOrgProfile", MyOrgProfileSchema);

export default myOrgProfileModel;
