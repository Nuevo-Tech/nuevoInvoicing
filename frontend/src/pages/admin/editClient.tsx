import React, { useEffect, useState } from "react";
import { Card, Typography, Button, Form, Input, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { Title } = Typography;

const businessTypeOptions = [
    { label: "B2B/B2G", value: "B2B/B2G" },
    { label: "B2C", value: "B2C" },
    { label: "B2B/B2G/B2C", value: "B2B/B2G/B2C" },
];

const EditClient: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [success, setSuccess] = useState(false);
    const [fields, setFields] = useState<any>({});

    useEffect(() => {
        fetch(`/api/zatca/onboardClient/${id}`)
            .then(res => res.json())
            .then(data => {
                setFields(data);
                form.setFieldsValue(data);
            });
    }, [id, form]);

    const handleFinish = async (values: any) => {
        await fetch(`/api/zatca/onboardClient/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });
        setSuccess(true);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
            <Card style={{ maxWidth: 600, width: "100%", boxShadow: "0 8px 40px 0 rgba(114,46,209,0.15)", borderRadius: 20, border: "1px solid #d3adf7", padding: 36 }}>
                <Title level={3} style={{ textAlign: "center", color: "#722ed1", marginBottom: 24 }}>Edit EGS Client</Title>
                {success ? (
                    <div style={{ textAlign: "center", marginTop: 32 }}>
                        <Title level={4} style={{ color: "#52c41a" }}>Client Updated!</Title>
                        <Button type="primary" onClick={() => navigate("/admin/listClients")}>Back to List</Button>
                    </div>
                ) : (
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={fields}
                        onFinish={handleFinish}
                    >
                        <Form.Item label="EGS Client Name" name="egs_client_name" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="VAT Registration Number" name="vat_registration_number" rules={[{ required: true, len: 15, message: "VAT number must be 15 digits" }]}><Input maxLength={15} minLength={15} /></Form.Item>
                        <Form.Item label="City" name="city" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Address" name="address" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Country Code" name="country_code" initialValue="SA" rules={[{ required: true }]}><Input value="SA" disabled /></Form.Item>
                        <Form.Item label="Business Type" name="business_type" rules={[{ required: true }]}><Select options={businessTypeOptions} /></Form.Item>
                        <Form.Item label="Location Address" name="location_address" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Industry Type" name="industry_type" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Contact Number" name="contact_number" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Email" name="email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
                        <Form.Item label="Zip Code" name="zip_code" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item label="Organization Unit" name="organization_unit" rules={[{ required: true }]}><Input /></Form.Item>
                        <Form.Item style={{ textAlign: "center" }}>
                            <Button type="primary" htmlType="submit" size="large" style={{ width: 180, fontWeight: 600 }}>Save Changes</Button>
                            <Button style={{ marginLeft: 16 }} onClick={() => navigate("/admin/listClients")}>Cancel</Button>
                        </Form.Item>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default EditClient;
