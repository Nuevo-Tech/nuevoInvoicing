import { Row, Col, Card, Typography } from 'antd';
import { AppstoreAddOutlined, ShareAltOutlined, LockOutlined, BranchesOutlined } from '@ant-design/icons';
import LandingPage from "@/providers/auth-provider/LandinPage";

const { Title } = Typography;

const features = [
    {
        icon: <AppstoreAddOutlined />,
        title: 'Create, Print, Cancel, Manage',
        description: 'Perform all operations on e-Invoices through a single user-friendly console.',
    },
    {
        icon: <ShareAltOutlined />,
        title: 'One-click Communication',
        description: 'Send an email to all your customers with a single click.',
    },
    {
        icon: <LockOutlined />,
        title: 'Always On, 99.99% Uptime',
        description: 'With zero downtime and multiple redundancies, we are up and running 24x7.',
    },
    {
        icon: <BranchesOutlined />,
        title: 'No Scale Too Steep',
        description: 'Scale at will as you migrate to e-Invoicing for B2B and B2C customers.',
    },
];

const FeaturesSection: React.FC = () => (
    <div style={{ padding: '50px 0', backgroundColor: '#f4f4f4' }}>
        <Title level={2} style={{ textAlign: 'center' }}>
            Key Features
        </Title>
        <Row gutter={[16, 16]} justify="center">
            {features.map((feature, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                    <Card
                        hoverable
                        cover={<div style={{ fontSize: '48px', textAlign: 'center' }}>{feature.icon}</div>}
                    >
                        <Title level={4}>{feature.title}</Title>
                        <p>{feature.description}</p>
                    </Card>
                </Col>
            ))}
        </Row>
    </div>
);
export default FeaturesSection;