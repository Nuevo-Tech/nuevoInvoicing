import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import IntegrationsSection from './IntegrationsSection';
import ComplianceSection from './ComplianceSection';
import CallToAction from './CallToAction';

const LandingPage: React.FC = () => (
    <>
        <HeroSection />
        <FeaturesSection />
        <IntegrationsSection />
        <ComplianceSection />
        <CallToAction />
    </>
);

export default LandingPage;
