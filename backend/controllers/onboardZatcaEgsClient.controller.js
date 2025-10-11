import OnboardZatcaEgsClient from "../mongodb/models/OnboardZatcaEgsClient.js";
import MyOrgProfile from "../mongodb/models/myorgprofile.js";
import mongoose from "mongoose";
import {onboardZatcaClient} from "../middleware/zatcaApis.js";

// const getAllZatcaEgsClients = async (req, res) => {
//     try {
//         const clients = await OnboardZatcaEgsClient.find({}).limit(req.query._end);
//         res.status(200).json(clients);
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };
//
// const getZatcaEgsClient = async (req, res) => {
//     try {
//         const {email} = req.params;
//         const client = await OnboardZatcaEgsClient.findOne({email});
//         if (client) {
//             return res.status(200).json({message: "ZatcaEgsClient exists", client});
//         } else {
//             return res.status(404).json({message: "ZatcaEgsClient does not exist"});
//         }
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

const createZatcaEgsClient = async (req, res) => {
    try {
        const {
            otp,
        } = req.body;

        const MyOrgProfileExists = await MyOrgProfile.findOne();

        const {zatcaStatus, zatcaData} = await onboardClient(otp);
        if (![200, 202].includes(zatcaStatus)) {
            MyOrgProfileExists.onboarding_complete = false;
            MyOrgProfileExists.save();
            return res.status(500).json({
                data: zatcaData,
                message: zatcaData?.message || "Failed at backend"
            });
        }

        if ([200, 202].includes(zatcaStatus)) {
            MyOrgProfileExists.onboarding_complete = true;
            MyOrgProfileExists.save();
        }

        res.status(200).json(zatcaData);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// const getZatcaEgsClientInfoByID = async (req, res) => {
//     try {
//         const {id} = req.params;
//         const client = await OnboardZatcaEgsClient.findOne({_id: id});
//         if (client) {
//             res.status(200).json(client);
//         } else {
//             res.status(404).json({message: "ZatcaEgsClient not found"});
//         }
//     } catch (error) {
//         res.status(500).json({message: error.message});
//     }
// };

const deleteZatcaEgsClient = async (req, res) => {
    try {
        const {id} = req.params;
        const deleted = await OnboardZatcaEgsClient.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({message: "ZatcaEgsClient not found"});
        }
        res.status(200).json({message: "ZatcaEgsClient deleted successfully"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


const onboardClient = async (otp) => {
    try {
        const myOrgProfileExists = await MyOrgProfile.findOne();

        if (!myOrgProfileExists) {
            console.error("Organization profile not found.");
            return;
        }

        // 2️⃣ Destructure fields from DB
        const {
            streetName,
            buildingNumber,
            cityName,
            postalZone,
            countryIdentificationCode,
            partyTaxSchemeCompanyID,
            partyLegalEntityRegistrationName,
            saudi_national_address,
            business_type,
            organization_unit,
            industry_type,
            email,
            plan_type,
            phoneNumber,
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

export {
    createZatcaEgsClient,
    deleteZatcaEgsClient
};
