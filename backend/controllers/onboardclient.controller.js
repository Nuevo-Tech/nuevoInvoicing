import OnboardClient from "../mongodb/models/onboardclient.js";

const getAllClients = async (req, res) => {
  try {
    const clients = await OnboardClient.find({}).limit(req.query._end);
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClient = async (req, res) => {
  try {
    const { email } = req.params;
    const client = await OnboardClient.findOne({ email });
    if (client) {
      return res.status(200).json({ message: "Client exists", client });
    } else {
      return res.status(404).json({ message: "Client does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const {
      otp,
      egs_client_name,
      vat_registration_number,
      city,
      address,
      country_code,
      business_type,
      location_address,
      industry_type,
      contact_number,
      email,
      zip_code,
      organization_unit,
    } = req.body;

    const clientExists = await OnboardClient.findOne({ email });
    if (clientExists) return res.status(200).json(clientExists);

    const currentDate = new Date();

    const newClient = await OnboardClient.create({
      otp,
      egs_client_name,
      vat_registration_number,
      city,
      address,
      country_code,
      business_type,
      location_address,
      industry_type,
      contact_number,
      email,
      zip_code,
      organization_unit,
      updatedDate: currentDate,
    });

    res.status(200).json(newClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      city,
      address,
      business_type,
      location_address,
      industry_type,
      contact_number,
      zip_code,
      organization_unit,
    } = req.body;

    const currentDate = new Date();

    await OnboardClient.findByIdAndUpdate(
      { _id: id },
      {
        city,
        address,
        business_type,
        location_address,
        industry_type,
        contact_number,
        zip_code,
        organization_unit,
        updatedDate: currentDate,
      }
    );
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientInfoByID = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await OnboardClient.findOne({ _id: id });
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "Client not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OnboardClient.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllClients, getClient, createClient, getClientInfoByID, updateClient, deleteClient };
