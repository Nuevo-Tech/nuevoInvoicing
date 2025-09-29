import { Row, Col, Typography, Card } from 'antd';
import { SafetyOutlined, CheckCircleOutlined, CloudServerOutlined } from '@ant-design/icons';

const { Title } = Typography;

const complianceItems = [
    {
        icon: <SafetyOutlined />,
        title: '100% Compliance',
        description: 'Fully aligned with global e-invoicing standards and government regulations.',
    },
    {
        icon: <CheckCircleOutlined />,
        title: 'Quick Go-live',
        description: 'Get your e-invoicing up and running in just 24 hours.',
    },
    {
        icon: <CloudServerOutlined />,
        title: 'AI-powered Tech Stack',
        description: 'Leverage advanced AI capabilities for fraud detection and proactive support.',
    },
];

const ComplianceSection: React.FC = () => (
    <div style={{ padding: '50px 0', backgroundColor: '#f4f4f4' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
            Security & Compliance
        </Title>
        <Row gutter={[16, 16]} justify="center">
            {complianceItems.map((item, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                    <Card
                        hoverable
                        cover={<div style={{ fontSize: '48px', textAlign: 'center' }}>{item.icon}</div>}
                    >
                        <Title level={4}>{item.title}</Title>
                        <p>{item.description}</p>
                    </Card>
                </Col>
            ))}
        </Row>
    </div>
);

export default ComplianceSection;