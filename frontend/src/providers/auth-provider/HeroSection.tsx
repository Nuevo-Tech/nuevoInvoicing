import { Button, Layout, Typography, Space, Row, Col } from "antd";
import backgroundImage from "../../../public/assets/loginBackground.jpg";
import { useAuth0 } from "@auth0/auth0-react";

export const HeroSection: React.FC = () => {
    const { loginWithRedirect } = useAuth0();

    return (
        <Layout
            style={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Row
                style={{ height: "100%", padding: "0 5%" }}
                align="middle"
                justify="space-between"
            >
                {/* Hero Content */}
                <Col xs={24} md={12}>
                    <Space direction="vertical" size="large">
                        <Typography.Title style={{ color: "#fff", fontSize: 48 }}>
                            Simplify Your E-Invoicing
                        </Typography.Title>
                        <Typography.Paragraph style={{ color: "#fff", fontSize: 18 }}>
                            Manage invoices seamlessly, stay ZATCA-compliant, and accelerate your business with smart e-invoicing.
                        </Typography.Paragraph>
                        <Button
                            type="primary"
                            size="large"
                            style={{ backgroundColor: "#f6871f", border: "none" }}
                            onClick={() => loginWithRedirect()}
                        >
                            Get Started
                        </Button>
                    </Space>
                </Col>

                {/* Login Card */}
                <Col xs={24} md={10}>
                    <Space
                        direction="vertical"
                        style={{
                            width: "100%",
                            padding: "40px",
                            borderRadius: "16px",
                            background: "rgba(255, 255, 255, 0.1)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                            color: "#fff",
                        }}
                    >
                        <Typography.Title level={3} style={{ color: "#fff" }}>
                            Sign In
                        </Typography.Title>
                        <Button
                            type="primary"
                            size="large"
                            style={{ backgroundColor: "#f6871f", border: "none" }}
                            onClick={() => loginWithRedirect()}
                        >
                            Sign in with Auth0
                        </Button>
                        <Typography.Text style={{ color: "#fff" }}>
                            Powered by
                            <img
                                style={{ padding: "0 5px", verticalAlign: "middle" }}
                                alt="Auth0"
                                src="https://refine.ams3.cdn.digitaloceanspaces.com/superplate-auth-icons%2Fauth0-2.svg"
                            />
                        </Typography.Text>
                    </Space>
                </Col>
            </Row>
        </Layout>
    );
};
export default HeroSection;