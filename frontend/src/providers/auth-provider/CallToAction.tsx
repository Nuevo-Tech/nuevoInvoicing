import { Button, Layout, Typography, Space } from 'antd';

const { Title } = Typography;

const CallToAction: React.FC = () => (
    <Layout
        style={{
            minHeight: '100vh',
            backgroundColor: '#f4f4f4',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Space direction="vertical" size="large" align="center">
            <Title level={2}>Ready to Transform Your Invoicing?</Title>
            <Button
                type="primary"
                size="large"
                style={{ backgroundColor: '#f6871f', border: 'none' }}
                onClick={() => window.location.href = '/demo'}
            >
                Book a Demo
            </Button>
        </Space>
    </Layout>
);

export default CallToAction;