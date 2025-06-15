import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

export interface FeasibilityData {
  totalCost?: number;
  timelineDays?: number;
  qualityScore?: number; // percent
  availabilityStatus?: string;
}

export interface ProjectData {
  // Extend as needed for future features
  name?: string;
}

interface FeasibilitySummaryCardProps {
  feasibilityData: FeasibilityData;
  projectData?: ProjectData;
}

const FeasibilitySummaryCard: React.FC<FeasibilitySummaryCardProps> = ({ feasibilityData, projectData }) => {
  return (
    <Card title={projectData?.name ? `Feasibility Summary: ${projectData.name}` : 'Feasibility Summary'} style={{ marginBottom: 24 }}>
      <Row gutter={24}>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Total Cost" value={feasibilityData.totalCost ?? '--'} prefix="$" precision={2} />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Timeline" value={feasibilityData.timelineDays ?? '--'} suffix="days" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Quality Score" value={feasibilityData.qualityScore ?? '--'} suffix="%" />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Statistic title="Availability" value={feasibilityData.availabilityStatus ?? '--'} />
        </Col>
      </Row>
      {/* TODO: Add more detailed feasibility breakdowns here */}
    </Card>
  );
};

export default FeasibilitySummaryCard;
