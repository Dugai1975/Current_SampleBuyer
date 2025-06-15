import React from 'react';
import { Card, Statistic, Progress, Space } from 'antd';

export interface FeasibilityData {
  cpiEstimate?: number;
  availability?: number; // percentage
  timelineEstimate?: string;
  qualityConfidence?: number; // score out of 100
  // TODO: Add more fields for advanced feasibility analytics
}

interface LiveImpactSidebarProps {
  feasibilityData: FeasibilityData;
}

const LiveImpactSidebar: React.FC<LiveImpactSidebarProps> = ({ feasibilityData }) => {
  return (
    <Card title="Live Feasibility Impact" style={{ width: 300 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Statistic title="Current CPI Estimate" value={feasibilityData.cpiEstimate ?? '--'} prefix="$" precision={2} />
        <Statistic title="Availability" value={feasibilityData.availability ?? '--'} suffix="%" />
        <Statistic title="Timeline Estimate" value={feasibilityData.timelineEstimate ?? '--'} />
        <div>
          <div style={{ marginBottom: 8 }}>Quality Confidence</div>
          <Progress percent={feasibilityData.qualityConfidence ?? 0} />
        </div>
        {/* TODO: Add advanced CPI breakdown, real-time updates, etc. */}
      </Space>
    </Card>
  );
};

export default LiveImpactSidebar;
