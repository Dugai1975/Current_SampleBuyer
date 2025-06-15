import React, { useState } from 'react';
import { Steps, Button, Form, Input, Typography, Card, Row, Col } from 'antd';
import LiveImpactSidebar, { FeasibilityData as LiveFeasibilityData } from './LiveImpactSidebar';
import DemographicsImpactSidebar, { DemographicData, FeasibilityData as DemographicsFeasibilityData } from './DemographicsImpactSidebar';
import FeasibilitySummaryCard from './FeasibilitySummaryCard';
import DecisionOptionsCard from './DecisionOptionsCard';

const { Title, Paragraph } = Typography;

// Step titles and descriptions
const steps = [
  {
    title: 'Quick Setup',
    description: 'Basic project details (survey URL optional)'
  },
  {
    title: 'Audience & Feasibility',
    description: 'Build audience with live pricing'
  },
  {
    title: 'Launch Decision',
    description: 'Review and decide launch approach'
  }
];

const ProjectCreationWizard: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  // State for future launch setup flow
  const [showLaunchSetup, setShowLaunchSetup] = useState(false);
  const [showFeasibilityOnly, setShowFeasibilityOnly] = useState(false);

  // Placeholder for future state and logic

  // Survey URL field is now optional
  const quickSetupStep = (
    <Form form={form} layout="vertical">
      <Form.Item label="Project Name" name="projectName" rules={[{ required: true, message: 'Please enter the project name' }]}> 
        <Input placeholder="Enter project name" />
      </Form.Item>
      <Form.Item label="Survey URL" name="surveyUrl" extra="Optional. Add a survey URL if available.">
        <Input placeholder="Paste survey URL (optional)" />
      </Form.Item>
      {/* TODO: Add more fields as needed */}
    </Form>
  );

  // Placeholder data for now
  const feasibilityData: LiveFeasibilityData = {
    cpiEstimate: 2.5,
    availability: 80,
    timelineEstimate: '3 days',
    qualityConfidence: 70,
  };
  const demographics: DemographicData = {
    gender: ['Male', 'Female'],
    ageRange: [18, 54],
    income: [30000, 100000],
  };
  const demographicsFeasibility: DemographicsFeasibilityData = {
    poolSize: 1200,
    costImpact: 'medium',
  };

  // Step 2: Audience & Feasibility (DemographicsBuilder + Live Feasibility)
  const renderAudienceFeasibilityStep = () => (
    <Row gutter={32} align="top">
      <Col xs={24} md={12}>
        <Card>
          <DemographicsImpactSidebar demographics={demographics} feasibilityData={demographicsFeasibility} />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
          <LiveImpactSidebar feasibilityData={feasibilityData} />
        </Card>
      </Col>
    </Row>
  );

  // --- Launch Decision Step ---
  // Placeholder data for summary
  const reviewFeasibilityData = {
    totalCost: 3000,
    timelineDays: 7,
    qualityScore: 85,
    availabilityStatus: 'Available',
  };
  const reviewProjectData = {
    name: 'Sample Project',
  };

  // Handlers for decision actions
  const handleSaveDraft = () => {
    // TODO: Implement actual save draft logic
    console.log('Save Draft button clicked');
    window.alert('Draft saved!');
  };
  const handleCheckFeasibilityOnly = () => {
    console.log('Check Feasibility Only button clicked');
    setShowFeasibilityOnly(true);
    window.alert('Feasibility checked. (Stub)');
  };
  const handleProceedToLaunch = () => {
    console.log('Proceed to Launch Setup button clicked');
    setShowLaunchSetup(true);
    window.alert('Proceeding to launch setup. (Stub)');
  };

  // Render review step with summary and decision options
  const renderReviewStep = () => (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <FeasibilitySummaryCard feasibilityData={reviewFeasibilityData} projectData={reviewProjectData} />
      <DecisionOptionsCard
        onSaveDraft={handleSaveDraft}
        onCheckOnly={handleCheckFeasibilityOnly}
        onProceedToLaunch={handleProceedToLaunch}
      />
      {/* TODO: Phase 2 - Launch setup and feasibility only flows */}
    </div>
  );

  const stepContent = [
    quickSetupStep,
    renderAudienceFeasibilityStep(),
    renderReviewStep(),
  ];

  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);

  return (
    <>
      <Card style={{ maxWidth: 600, margin: '0 auto', marginTop: 32 }}>
        <Steps current={current} items={steps} style={{ marginBottom: 32 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {current > 0 && <Button onClick={prev}>Previous</Button>}
          {current < steps.length - 1 && <Button type="primary" onClick={next}>Next</Button>}
          {current === steps.length - 1 && <Button type="primary">Finish</Button>}
        </div>
      </Card>
      <div style={{ maxWidth: 1200, margin: '32px auto 0 auto' }}>
        {stepContent[current]}
      </div>
    </>
  );
};

export default ProjectCreationWizard;
