import User from "../mongodb/models/user.js";
import Currency from "../mongodb/models/currency.js";
import Client from "../mongodb/models/client.js";
import mongoose from "mongoose";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).limit(req.query._end);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { email } = req.params; // Assuming email is passed as a route parameter
    const user = await User.findOne({ email }); // Search for the user by email

    if (user) {
      return res.status(200).json({
        message: "User exists",
        user, // Return the user details
      });
    } else {
      return res.status(404).json({
        message: "User does not exist",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar, plan_type } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(200).json(userExists);

    const currentDate = new Date();

    // const currency = await Currency.create({
    //   baseCurrency: "USD", // or any default currency
    //   latestUpdatedTime: new Date(),
    //   targetCurrency: "USD", // or any default currency
    // });

    const maxIdAccount = await User.findOne().sort({ id: -1 }).select("id");
    const nextId = maxIdAccount ? maxIdAccount.id + 1 : 1;

    const newUser = await User.create({
      id: nextId,
      name,
      email,
      avatar,
      plan_type,
      updatedDate: currentDate,
      // currency: currency._id,
    });

    res.status(200).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//for now just updating few parameters and not the email and password
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { address, phone_number, user_role, baseCurrency, targetCurrency, onboarding_complete } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    // const curCurrency = await User.findById(id)
    //   .populate("currency")
    //   .session(session);
    // const curCurrencyId = curCurrency.currency._id;
    //
    // if (baseCurrency | appSelectedCurrency) {
    //   await Currency.findByIdAndUpdate(
    //     { _id: curCurrencyId },
    //     {
    //       baseCurrency,
    //       targetCurrency,
    //     }
    //   );
    // }

    const currentDate = new Date();

    const updatedFields = {};

    if (address) updatedFields.address = address;
    if (phone_number) updatedFields.phoneNumber = phone_number;
    if (user_role) updatedFields.user_role = user_role;
    if (baseCurrency) updatedFields.baseCurrency = baseCurrency;
    if (targetCurrency) updatedFields.targetCurrency = targetCurrency;
    if (onboarding_complete) updatedFields.onboarding_complete = onboarding_complete;
    updatedFields.updatedDate = currentDate;

    const updatedUser = await User.findByIdAndUpdate(
        { _id: id },
        {$set: updatedFields},
        {new: true, runValidators: true} // Return the updated document and run validations
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserInfoByID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllUsers, getUser, createUser, getUserInfoByID, updateUser };
