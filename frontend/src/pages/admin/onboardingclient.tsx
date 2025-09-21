import React, { useState } from "react";
import { Card, Typography, Button, Form, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const businessTypeOptions = [
    { label: "B2B/B2G", value: "B2B/B2G" },
    { label: "B2C", value: "B2C" },
    { label: "B2B/B2G/B2C", value: "B2B/B2G/B2C" },
];

const OnboardingClient: React.FC = () => {
    const [success, setSuccess] = useState(false);
    const [clientName, setClientName] = useState("");
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleFinish = async (values: any) => {
        try {
            // Add a dummy OTP for backend requirement
            const payload = { ...values, otp: "000000" };
            const res = await fetch("/api/zatca/onboardClient", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (res.ok) {
                setSuccess(true);
                setClientName(values.egs_client_name);
                form.resetFields();
            } else {
                // handle error
            }
        } catch (err) {
            // handle error
        }
    };

    const handleReset = () => {
        setSuccess(false);
        setClientName("");
        form.resetFields();
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
                        <Text>Client <b>{clientName}</b> has been successfully onboarded.</Text>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" onClick={() => { handleReset(); navigate("/admin/dashboard"); }}>Back to Dashboard</Button>
                        </div>
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                        style={{ width: "100%" }}
                    >
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
                        <Form.Item label="EGS Client Name" name="egs_client_name" rules={[{ required: true, message: "Please enter client name" }]}><Input size="large" placeholder="Client Name" /></Form.Item>
                        <Form.Item label="VAT Registration Number" name="vat_registration_number" rules={[{ required: true, message: "Please enter VAT number" }, { len: 15, message: "VAT number must be 15 digits" }]}><Input size="large" maxLength={15} minLength={15} placeholder="15 digit VAT number" /></Form.Item>
                        <Form.Item label="City" name="city" rules={[{ required: true, message: "Please enter city" }]}><Input size="large" placeholder="City" /></Form.Item>
                        <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter address" }]}><Input size="large" placeholder="Address" /></Form.Item>
                        <Form.Item label="Country Code" name="country_code" initialValue="SA" rules={[{ required: true }]}><Input size="large" value="SA" disabled /></Form.Item>
                        <Form.Item label="Business Type" name="business_type" rules={[{ required: true, message: "Please select business type" }]}><Select size="large" options={businessTypeOptions} placeholder="Select business type" /></Form.Item>
                        <Form.Item label="Location Address" name="location_address" rules={[{ required: true, message: "Please enter location address" }]}><Input size="large" placeholder="e.g. RRRD29291" /></Form.Item>
                        <Form.Item label="Industry Type" name="industry_type" rules={[{ required: true, message: "Please enter industry type" }]}><Input size="large" placeholder="Industry Type" /></Form.Item>
                        <Form.Item label="Contact Number" name="contact_number" rules={[{ required: true, message: "Please enter contact number" }]}><Input size="large" placeholder="Contact Number" /></Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter valid email" }]}><Input size="large" placeholder="Email" /></Form.Item>
                        <Form.Item label="Zip Code" name="zip_code" rules={[{ required: true, message: "Please enter zip code" }]}><Input size="large" placeholder="Zip Code" /></Form.Item>
                        <Form.Item label="Organization Unit" name="organization_unit" rules={[{ required: true, message: "Please enter organization unit" }]}><Input size="large" placeholder="Organization Unit" /></Form.Item>
                        <div style={{ textAlign: "center", marginTop: 16 }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ width: 200, fontWeight: 600, borderRadius: 8 }}>Save Client</Button>
                        </div>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default OnboardingClient;
