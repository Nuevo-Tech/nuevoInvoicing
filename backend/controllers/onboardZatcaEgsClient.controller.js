import OnboardZatcaEgsClient from "../mongodb/models/OnboardZatcaEgsClient.js";

const getAllZatcaEgsClients = async (req, res) => {
  try {
    const clients = await OnboardZatcaEgsClient.find({}).limit(req.query._end);
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getZatcaEgsClient = async (req, res) => {
  try {
    const { email } = req.params;
    const client = await OnboardZatcaEgsClient.findOne({ email });
    if (client) {
      return res.status(200).json({ message: "ZatcaEgsClient exists", client });
    } else {
      return res.status(404).json({ message: "ZatcaEgsClient does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createZatcaEgsClient = async (req, res) => {
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

    const clientExists = await OnboardZatcaEgsClient.findOne({ email });
    if (clientExists) return res.status(200).json(clientExists);

    const currentDate = new Date();

    const newZatcaEgsClient = await OnboardZatcaEgsClient.create({
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

    res.status(200).json(newZatcaEgsClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateZatcaEgsClient = async (req, res) => {
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

    await OnboardZatcaEgsClient.findByIdAndUpdate(
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
    res.status(200).json({ message: "ZatcaEgsClient updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getZatcaEgsClientInfoByID = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await OnboardZatcaEgsClient.findOne({ _id: id });
    if (client) {
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: "ZatcaEgsClient not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteZatcaEgsClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OnboardZatcaEgsClient.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "ZatcaEgsClient not found" });
    }
    res.status(200).json({ message: "ZatcaEgsClient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getAllZatcaEgsClients, getZatcaEgsClient, createZatcaEgsClient, getZatcaEgsClientInfoByID, updateZatcaEgsClient, deleteZatcaEgsClient };
