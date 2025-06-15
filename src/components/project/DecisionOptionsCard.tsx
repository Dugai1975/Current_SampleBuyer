import React from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';

const { Paragraph } = Typography;

interface DecisionOptionsCardProps {
  onSaveDraft: () => void;
  onCheckOnly: () => void;
  onProceedToLaunch: () => void;
}

const DecisionOptionsCard: React.FC<DecisionOptionsCardProps> = ({ onSaveDraft, onCheckOnly, onProceedToLaunch }) => {
  return (
    <Row gutter={24} style={{ marginTop: 24 }}>
      <Col xs={24} md={8}>
        <Card>
          <Button block type="default" onClick={onSaveDraft} style={{ marginBottom: 12 }}>
            Save Draft
          </Button>
          <Paragraph type="secondary">Save your progress and return later. No feasibility check performed.</Paragraph>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Button block type="primary" onClick={onCheckOnly} style={{ marginBottom: 12 }}>
            Check Feasibility Only
          </Button>
          <Paragraph type="secondary">Get a summary of feasibility results. No launch setup will be started.</Paragraph>
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Button block type="primary" onClick={onProceedToLaunch} style={{ marginBottom: 12 }}>
            Proceed to Launch Setup
          </Button>
          <Paragraph type="secondary">Continue to launch setup and survey integration.</Paragraph>
        </Card>
      </Col>
    </Row>
  );
};

export default DecisionOptionsCard;
