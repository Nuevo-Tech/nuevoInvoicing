import React, { useState } from "react";
import { Card, Typography, Button, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const businessTypeOptions = [
    { label: "B2B/B2G", value: "B2B/B2G" },
    { label: "B2C", value: "B2C" },
    { label: "B2B/B2G/B2C", value: "B2B/B2G/B2C" },
];

const OnboardingClient: React.FC = () => {
    const [fields, setFields] = useState({
        egs_client_name: "",
        vat_registration_number: "",
        city: "",
        address: "",
        country_code: "SA",
        business_type: "",
        location_address: "",
        industry_type: "",
        contact_number: "",
        email: "",
        zip_code: "",
        organization_unit: "",
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (field: string, value: string) => {
        setFields({ ...fields, [field]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        for (const key in fields) {
            if (!fields[key as keyof typeof fields] || fields[key as keyof typeof fields].toString().trim() === "") {
                setError("All fields are required.");
                return;
            }
        }
        setError("");
        setSuccess(true);
    };

    const handleReset = () => {
        setFields({
            egs_client_name: "",
            vat_registration_number: "",
            city: "",
            address: "",
            country_code: "SA",
            business_type: "",
            location_address: "",
            industry_type: "",
            contact_number: "",
            email: "",
            zip_code: "",
            organization_unit: "",
        });
        setSuccess(false);
        setError("");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 48,
            }}
        >
            <Card style={{
                maxWidth: 600,
                width: "100%",
                boxShadow: "0 8px 40px 0 rgba(114,46,209,0.15)",
                borderRadius: 20,
                border: "1px solid #d3adf7",
                padding: 36,
                position: "relative"
            }}>
                {success ? (
                    <div style={{ textAlign: "center", marginTop: 32 }}>
                        <Title level={4} style={{ color: "#52c41a" }}>Application Submitted!</Title>
                        <Text>Client <b>{fields.egs_client_name}</b> has been successfully onboarded.</Text>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" onClick={() => { handleReset(); navigate("/admin/dashboard"); }}>Back to Dashboard</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginBottom: 16
                        }}>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #a084ee 0%, #7f53ac 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: 12
                            }}>
                                <span style={{ fontSize: 32, color: "#fff", fontWeight: 700 }}>EGS</span>
                            </div>
                            <Title level={3} style={{ textAlign: "center", color: "#722ed1", margin: 0 }}>Onboard EGS Client</Title>
                            <Text type="secondary" style={{ fontSize: 16 }}>Fill in the details to onboard a new client</Text>
                        </div>
                        {error && (
                            <div style={{ color: "#ff4d4f", marginBottom: 16, textAlign: "center" }}>{error}</div>
                        )}
                        <Input size="large" placeholder="Client Name" style={{ marginBottom: 16 }} value={fields.egs_client_name} onChange={e => handleChange("egs_client_name", e.target.value)} />
                        <Input size="large" placeholder="15 digit VAT number" style={{ marginBottom: 16 }} value={fields.vat_registration_number} onChange={e => handleChange("vat_registration_number", e.target.value)} />
                        <Input size="large" placeholder="City" style={{ marginBottom: 16 }} value={fields.city} onChange={e => handleChange("city", e.target.value)} />
                        <Input size="large" placeholder="Address" style={{ marginBottom: 16 }} value={fields.address} onChange={e => handleChange("address", e.target.value)} />
                        <Input size="large" readOnly style={{ marginBottom: 16 }} value={fields.country_code} />
                        <Select size="large" placeholder="Select business type" style={{ marginBottom: 16, width: "100%" }} value={fields.business_type || undefined} onChange={val => handleChange("business_type", val)} options={businessTypeOptions} />
                        <Input size="large" placeholder="e.g. RRRD29291" style={{ marginBottom: 16 }} value={fields.location_address} onChange={e => handleChange("location_address", e.target.value)} />
                        <Input size="large" placeholder="Industry Type" style={{ marginBottom: 16 }} value={fields.industry_type} onChange={e => handleChange("industry_type", e.target.value)} />
                        <Input size="large" placeholder="Contact Number" style={{ marginBottom: 16 }} value={fields.contact_number} onChange={e => handleChange("contact_number", e.target.value)} />
                        <Input size="large" placeholder="Email" style={{ marginBottom: 16 }} value={fields.email} onChange={e => handleChange("email", e.target.value)} />
                        <Input size="large" placeholder="Zip Code" style={{ marginBottom: 16 }} value={fields.zip_code} onChange={e => handleChange("zip_code", e.target.value)} />
                        <Input size="large" placeholder="Organization Unit" style={{ marginBottom: 16 }} value={fields.organization_unit} onChange={e => handleChange("organization_unit", e.target.value)} />
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ width: 200, fontWeight: 600, borderRadius: 8 }}>Save Client</Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default OnboardingClient;
