import { Row, Col, Typography, Image } from 'antd';
import LandingPage from "@/providers/auth-provider/LandinPage";

const { Title } = Typography;

const integrations = [
    { name: 'SAP', logo: 'path_to_sap_logo' },
    { name: 'Tally', logo: 'path_to_tally_logo' },
    { name: 'Custom ERP', logo: 'path_to_custom_erp_logo' },
];

const IntegrationsSection: React.FC = () => (
    <div style={{ padding: '50px 0' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
            Effortless ERP Integrations
        </Title>
        <Row gutter={[16, 16]} justify="center">
            {integrations.map((integration, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                    <div style={{ textAlign: 'center' }}>
                        <Image
                            width={100}
                            src={integration.logo}
                            alt={integration.name}
                            preview={false}
                        />
                        <p>{integration.name}</p>
                    </div>
                </Col>
            ))}
        </Row>
    </div>
);

export default IntegrationsSection;