import MyOrgProfile from "../mongodb/models/myorgprofile.js";
import User from "../mongodb/models/user.js";
import * as dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";
import {onboardZatcaClient} from "../middleware/zatcaApis.js";
import mongoose from "mongoose";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const getMyOrgProfileDetail = async (req, res) => {
    const {id} = req.params;
    let myOrgProfileExists;
    if (id != null) {
        myOrgProfileExists = await MyOrgProfile.findOne({id: id});
    } else {
        myOrgProfileExists = await MyOrgProfile.findOne();
    }
    if (myOrgProfileExists) {
        res.status(200).json(myOrgProfileExists);
    } else {
        res.status(404).json({message: "MyOrgProfile not found"});
    }
};


const createMyOrgProfile = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const {
            company_legal_name,
            company_location,
            business_type,
            organization_unit,
            industry_type,
            vat_number,
            company_crn,
            building_number,
            street_name,
            city,
            city_subdivision,
            postal_code,
            email,
            phone,
            saudi_national_address,
            schemeId = "CRN",
            plan_type,
        } = req.body;

        // Ensure user exists
        const Profile = await MyOrgProfile.findOne();
        if (Profile) {
            return res.status(200).json({message: "Org Profile already exists"});
        }

        // Create new MyOrgProfile document
        const newOrgProfile = new MyOrgProfile({
            id: "1", // static for single org (adjust if multi-org later)
            partyId: company_crn,
            schemeId,
            streetName: street_name,
            buildingNumber: building_number,
            citySubdivisionName: city_subdivision,
            cityName: city,
            postalZone: postal_code,
            countryIdentificationCode: company_location,
            partyTaxSchemeCompanyID: vat_number,
            partyTaxSchemeTaxSchemeId: "VAT",
            partyLegalEntityRegistrationName: company_legal_name,
            saudi_national_address,
            business_type,
            organization_unit,
            industry_type,
            email,
            plan_type,
            phoneNumber: phone.number,
        });

        const savedOrgProfile = await newOrgProfile.save({session});
        await session.commitTransaction();

        res.status(201).json({
            message: "MyOrgProfile created successfully",
            data: savedOrgProfile,
        });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        if (error.code === 11000) {
            return res.status(409).json({message: "Duplicate entry detected"});
        }
        res.status(500).json({message: error.message});
    } finally {
        await session.endSession(); // always close session
    }
};


const updateMyOrgProfile = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const id = "1";
        const {
            partyId,
            schemeId = "CRN",
            streetName,
            buildingNumber,
            citySubdivisionName,
            cityName,
            postalZone,
            countryIdentificationCode,
            partyTaxSchemeCompanyID,
            partyTaxSchemeTaxSchemeId,
            partyLegalEntityRegistrationName,
            email,
            phoneNumber,
            saudi_national_address,
            business_type,
            organization_unit,
            industry_type,
            logo,
            userId,
            plan_type,
            onboarding_complete,
            otp,
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User Not Found"});
        }

        const myOrgProfile = await MyOrgProfile.findOneAndUpdate(
            {id},                      // search condition
            {$setOnInsert: {id}},    // if not found, insert with this id
            {new: true, upsert: true}  // return the doc & create if not exists
        );
        if (!myOrgProfile) {
            return res.status(404).json({message: "MyOrgProfile not found"});
        }
        const _id = myOrgProfile._id;

        const updatedFields = {};

        if (logo && !logo.startsWith("http")) {
            // If `logo` is not a URL, assume it's a new base64 string
            if (myOrgProfile.logo) {
                const publicId = myOrgProfile.logo.split("/").pop().split(".")[0]; // Extract the public ID from the URL
                if (publicId) {
                    await cloudinary.uploader.destroy(`InvoiceManagement/${publicId}`); // Delete the old image
                }
            }

            // Upload the new image
            const photoUrl = await cloudinary.uploader.upload(logo, {
                folder: "InvoiceManagement",
            });
            updatedFields.logo = photoUrl.url;
        } else if (logo) {
            // If `logo` is a URL, keep it as-is
            updatedFields.logo = logo;
        }

        // Add other fields to `updatedFields` if they are provided
        if (partyId) updatedFields.partyId = partyId;
        if (schemeId) updatedFields.schemeId = schemeId;
        if (streetName) updatedFields.streetName = streetName;
        if (buildingNumber) updatedFields.buildingNumber = buildingNumber;
        if (citySubdivisionName) updatedFields.citySubdivisionName = citySubdivisionName;
        if (cityName) updatedFields.cityName = cityName;
        if (postalZone) updatedFields.postalZone = postalZone;
        if (countryIdentificationCode) updatedFields.countryIdentificationCode = countryIdentificationCode;
        if (partyTaxSchemeCompanyID) updatedFields.partyTaxSchemeCompanyID = partyTaxSchemeCompanyID;
        if (partyTaxSchemeTaxSchemeId) updatedFields.partyTaxSchemeTaxSchemeId = partyTaxSchemeTaxSchemeId;
        if (partyLegalEntityRegistrationName) updatedFields.partyLegalEntityRegistrationName = partyLegalEntityRegistrationName;
        if (email) updatedFields.email = email;
        if (phoneNumber) updatedFields.phoneNumber = phoneNumber;
        if (otp) updatedFields.otp = otp;


        if (saudi_national_address) updatedFields.saudi_national_address = saudi_national_address;
        if (business_type) updatedFields.business_type = business_type;
        if (organization_unit) updatedFields.organization_unit = organization_unit;
        if (industry_type) updatedFields.industry_type = industry_type;

        if (logo) updatedFields.logo = logo;
        if (userId) updatedFields.creator = userId;
        if (plan_type) updatedFields.plan_type = plan_type;
        if (onboarding_complete) updatedFields.onboarding_complete = onboarding_complete;

        const updatedMyOrgProfile = await MyOrgProfile.findByIdAndUpdate(
            _id,
            {$set: updatedFields},
            {new: true, runValidators: true}, {session}// Return the updated document and run validations
        );

        const {zatcaStatus, zatcaData} = await onboardClient(session);
        if (![200, 202].includes(zatcaStatus)) {
            return res.status(500).json({
                data: zatcaData,
                message: zatcaData?.message || "Failed at backend"
            });
        }

        await session.commitTransaction();

        res
            .status(200)
            .json({message: "Zatca Egs Client Onboarded successfully"});
    } catch (error) {
        if (error.code === 11000) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(409).json({message: "unique keys already exists"});
        }
        res.status(500).json({message: error.message});
    } finally {
        await session.endSession(); // always close session
    }
};

const onboardClient = async (session) => {
    try {
        // 1️⃣ Fetch organization profile
        const myOrgProfileExists = await MyOrgProfile.findOne();

        if (!myOrgProfileExists) {
            console.error("Organization profile not found.");
            return;
        }

        // 2️⃣ Destructure fields from DB
        const {
            partyId,
            schemeId,
            streetName,
            buildingNumber,
            citySubdivisionName,
            cityName,
            postalZone,
            countryIdentificationCode,
            partyTaxSchemeCompanyID,
            partyTaxSchemeTaxSchemeId,
            partyLegalEntityRegistrationName,
            saudi_national_address,
            business_type,
            organization_unit,
            industry_type,
            email,
            plan_type,
            phoneNumber,
            otp,
        } = myOrgProfileExists;

        // 3️⃣ Example OTP (you’ll probably pass this from user input)

        let currentOtp = "";
        const trialOtp = "12345";

        if (plan_type !== "trial") {
            currentOtp = otp
        } else {
            currentOtp = trialOtp;
        }

        let locationAddress = "";
        if (saudi_national_address === "" || saudi_national_address === null) {
            locationAddress = cityName
        } else {
            locationAddress = saudi_national_address;
        }


        // 4️⃣ Map fields to ZATCA payload structure
        const payload = {
            otp: currentOtp,
            egs_client_name: partyLegalEntityRegistrationName,
            vat_registration_number: partyTaxSchemeCompanyID,
            city: cityName,
            address: `${buildingNumber} ${streetName}`,
            country_code: countryIdentificationCode,
            business_type: business_type,
            location_address: locationAddress,
            industry_type: industry_type,
            contact_number: phoneNumber,
            email: email,
            zip_code: postalZone,
            organization_unit: organization_unit,
        };

        console.log("✅ Onboarding Zatca Client:", payload);

        const {zatcaStatus, zatcaData} = await onboardZatcaClient(payload);
        return {
            zatcaStatus: zatcaStatus || 500,
            zatcaData: zatcaData,
        };

    } catch
        (error) {
        throw error;
    }
};


// const deleteMyOrgProfile = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//
//     try {
//         const {id} = req.params;
//
//         const myOrgProfile = await MyOrgProfile.findOne({id}).session(session);
//
//         if (!myOrgProfile) {
//             await session.abortTransaction();
//             return res.status(404).json({message: "MyOrgProfile not found"});
//         }
//
//         if (myOrgProfile.logo) {
//             const publicId = myOrgProfile.logo.split("/").pop().split(".")[0]; // Extract public ID
//             await cloudinary.uploader.destroy(`InvoiceManagement/${publicId}`);
//         }
//         await MyOrgProfile.deleteOne({id}).session(session);
//
//         await session.commitTransaction();
//         session.endSession();
//
//         res
//             .status(200)
//             .json({message: "MyOrgProfile and related resources deleted successfully"});
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         res.status(500).json({message: error.message});
//     }
// };

export {
    getMyOrgProfileDetail,
    createMyOrgProfile,
    updateMyOrgProfile,
};
