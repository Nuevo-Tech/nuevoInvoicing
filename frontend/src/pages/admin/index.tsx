import React, { useState } from "react";
import { Form, Input, Button, Alert, Card, Typography } from "antd";
import { UserOutlined, LockOutlined, CrownFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const AdminPage: React.FC = () => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Check sessionStorage for admin login
    React.useEffect(() => {
        if (sessionStorage.getItem("adminLoggedIn") === "true") {
            navigate("/admin/dashboard");
        }
    }, [navigate]);

    const onFinishLogin = (values: { email: string; password: string }) => {
        if (values.email === "admin" && values.password === "admin123") {
            sessionStorage.setItem("adminLoggedIn", "true");
            setError("");
            setTimeout(() => navigate("/admin/dashboard"), 300); // short delay for UX
        } else {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Card
                style={{
                    width: 420,
                    boxShadow: "0 8px 40px 0 rgba(0,0,0,0.25)",
                    borderRadius: 16,
                    padding: 32,
                }}
                bordered={false}
            >
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <CrownFilled style={{ fontSize: 48, color: "#faad14" }} />
                    <Title level={2} style={{ margin: "16px 0 0 0", fontWeight: 700 }}>
                        Admin Login
                    </Title>
                    <Text type="secondary">Sign in to access admin features</Text>
                </div>
                {error && (
                    <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
                )}
                <Form layout="vertical" onFinish={onFinishLogin}>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input your email!" }]}> 
                        <Input
                            size="large"
                            prefix={<UserOutlined style={{ color: "#faad14" }} />}
                            placeholder="Enter admin email"
                            autoComplete="username"
                        />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please input your password!" }]}> 
                        <Input.Password
                            size="large"
                            prefix={<LockOutlined style={{ color: "#faad14" }} />}
                            placeholder="Enter password"
                            autoComplete="current-password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            style={{ fontWeight: 600, letterSpacing: 1 }}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AdminPage;
