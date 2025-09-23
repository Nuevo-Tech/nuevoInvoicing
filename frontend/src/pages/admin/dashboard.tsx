import React from "react";
import { Card, Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
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
                <Title level={2} style={{ marginBottom: 32 }}>Admin Dashboard</Title>
                <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
                    <Card
                        style={{
                            minWidth: 340,
                            minHeight: 180,
                            border: "1px solid #d3adf7",
                            borderRadius: 18,
                            boxShadow: "0 4px 24px 0 rgba(140, 90, 255, 0.15)",
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
                            onClick={e => { e.stopPropagation(); navigate("/admin/onboardingclient"); }}
                        >
                            Onboard EGS Client
                        </Button>
                    </Card>
                    <Card
                        style={{
                            minWidth: 340,
                            minHeight: 180,
                            border: "1px solid #d3adf7",
                            borderRadius: 18,
                            boxShadow: "0 4px 24px 0 rgba(140, 90, 255, 0.15)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            padding: 32,
                            cursor: "pointer",
                            transition: "box-shadow 0.2s",
                        }}
                        bodyStyle={{ padding: 0 }}
                        onClick={() => navigate("/admin/listClients")}
                    >
                        <Title level={4} style={{ marginBottom: 16 }}>
                            Show Clients Details
                        </Title>
                        <Text style={{ fontWeight: 500, marginBottom: 24, display: "block" }}>
                            View and manage all onboarded EGS clients.
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            style={{ fontWeight: 600, width: 200 }}
                            onClick={e => { e.stopPropagation(); navigate("/admin/listClients"); }}
                        >
                            Show Clients
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
