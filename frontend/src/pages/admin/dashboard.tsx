import React, { useState } from "react";
import { Card, Typography, Button, Form, Input, Select, Alert } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const businessTypeOptions = [
    { label: "B2B/B2G", value: "B2B/B2G" },
    { label: "B2C", value: "B2C" },
    { label: "B2B/B2G/B2C", value: "B2B/B2G/B2C" },
];

const AdminDashboard: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [form] = Form.useForm();
    const [success, setSuccess] = useState(false);
    const [clientName, setClientName] = useState("");
    const navigate = useNavigate();

    const onFinishOnboard = (values: any) => {
        setSuccess(true);
        setClientName(values.egs_client_name);
        form.resetFields();
        setShowForm(false);
        // Here you can send values to backend
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                padding: 48,
            }}
        >
            <div style={{ width: "100%", maxWidth: 900 }}>
                <Title level={2} style={{ color: "#722ed1", marginBottom: 32 }}>Admin Dashboard</Title>
                {showForm ? (
                    <Card style={{ maxWidth: 600, marginBottom: 32 }}>
                        <Title level={4} style={{ textAlign: "center" }}>Onboard EGS Client</Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinishOnboard}
                            style={{ marginTop: 24 }}
                        >
                            <Form.Item label="EGS Client Name" name="egs_client_name" rules={[{ required: true, message: "Please enter client name" }]}> <Input placeholder="Client Name" /></Form.Item>
                            <Form.Item label="VAT Registration Number" name="vat_registration_number" rules={[{ required: true, message: "Please enter VAT number" }, { len: 15, message: "VAT number must be 15 digits" }]}> <Input maxLength={15} minLength={15} placeholder="15 digit VAT number" /></Form.Item>
                            <Form.Item label="City" name="city" rules={[{ required: true, message: "Please enter city" }]}> <Input placeholder="City" /></Form.Item>
                            <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter address" }]}> <Input placeholder="Address" /></Form.Item>
                            <Form.Item label="Country Code" name="country_code" initialValue="SA" rules={[{ required: true }]}> <Input value="SA" disabled /> </Form.Item>
                            <Form.Item label="Business Type" name="business_type" rules={[{ required: true, message: "Please select business type" }]}> <Select options={businessTypeOptions} placeholder="Select business type" /></Form.Item>
                            <Form.Item label="Location Address" name="location_address" rules={[{ required: true, message: "Please enter location address" }]}> <Input placeholder="e.g. RRRD29291" /></Form.Item>
                            <Form.Item label="Industry Type" name="industry_type" rules={[{ required: true, message: "Please enter industry type" }]}> <Input placeholder="Industry Type" /></Form.Item>
                            <Form.Item label="Contact Number" name="contact_number" rules={[{ required: true, message: "Please enter contact number" }]}> <Input placeholder="Contact Number" /></Form.Item>
                            <Form.Item label="Email" name="email" rules={[{ required: true, type: "email", message: "Please enter valid email" }]}> <Input placeholder="Email" /></Form.Item>
                            <Form.Item label="Zip Code" name="zip_code" rules={[{ required: true, message: "Please enter zip code" }]}> <Input placeholder="Zip Code" /></Form.Item>
                            <Form.Item label="Organization Unit" name="organization_unit" rules={[{ required: true, message: "Please enter organization unit" }]}> <Input placeholder="Organization Unit" /></Form.Item>
                            <Form.Item style={{ textAlign: "center" }}>
                                <Button type="primary" htmlType="submit" size="large" style={{ width: 180, fontWeight: 600 }}>Save Client</Button>
                                <Button style={{ marginLeft: 16 }} onClick={() => setShowForm(false)}>Cancel</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                ) : success ? (
                    <Card style={{ maxWidth: 600, marginBottom: 32, textAlign: "center" }}>
                        <Title level={3} style={{ color: "#52c41a" }}>Client Onboarded!</Title>
                        <Text>Client <b>{clientName}</b> has been successfully onboarded.</Text>
                        <div style={{ marginTop: 24 }}>
                            <Button type="primary" onClick={() => setSuccess(false)}>
                                Onboard Another Client
                            </Button>
                        </div>
                    </Card>
                ) : null}
                <Card
                    style={{
                        minWidth: 340,
                        minHeight: 180,
                        border: "1px solid #d3adf7",
                        borderRadius: 18,
                        boxShadow: "0 4px 24px 0 rgba(140, 90, 255, 0.15)",
                        marginBottom: 32,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        padding: 32,
                        cursor: "pointer",
                        transition: "box-shadow 0.2s",
                    }}
                    bodyStyle={{ padding: 0 }}
                    onClick={() => navigate("/admin/onboardingclient")}
                >
                    <Title level={4} style={{ marginBottom: 16 }}>
                        EGS Client Onboarding
                    </Title>
                    <Text style={{ fontWeight: 500, marginBottom: 24, display: "block" }}>
                        Onboard new EGS clients quickly and easily.
                    </Text>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        size="large"
                        style={{ fontWeight: 600, width: 200 }}
                        onClick={() => setShowForm(true)}
                    >
                        Onboard EGS Client
                    </Button>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
