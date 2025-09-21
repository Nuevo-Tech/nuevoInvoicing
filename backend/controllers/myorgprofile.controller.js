import MyOrgProfile from "../mongodb/models/myorgprofile.js";
import User from "../mongodb/models/user.js";
import * as dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const getMyOrgProfileDetail = async (req, res) => {
    const {id} = req.params;
    let myOrgProfileExists;
    if(id!=null){
        myOrgProfileExists = await MyOrgProfile.findOne({id:id});
    } else {
        myOrgProfileExists = await MyOrgProfile.findOne();
    }
    if (myOrgProfileExists) {
        res.status(200).json(myOrgProfileExists);
    } else {
        res.status(404).json({message: "MyOrgProfile not found"});
    }
};

const updateMyOrgProfile = async (req, res) => {
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
            logo,
            userId,
        } = req.body;

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
        if (logo) updatedFields.logo = logo;

        const updatedMyOrgProfile = await MyOrgProfile.findByIdAndUpdate(
            _id,
            {$set: updatedFields},
            {new: true, runValidators: true} // Return the updated document and run validations
        );

        res
            .status(200)
            .json({message: "MyOrgProfile updated successfully", data: updatedMyOrgProfile});
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({message: "Owner email already exists"});
        }
        res.status(500).json({message: error.message});
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
    updateMyOrgProfile,
};
