import React from 'react';
import { Card, Typography, Divider } from 'antd';

export interface DemographicData {
  gender?: string[];
  ageRange?: [number, number];
  income?: [number, number];
  education?: string[];
  ethnicity?: string[];
  region?: string[];
  // TODO: Add more demographic fields for detailed analysis
}

export interface FeasibilityData {
  poolSize?: number;
  costImpact?: 'low' | 'medium' | 'high';
  // TODO: Add more feasibility fields for advanced impact analysis
}

interface DemographicsImpactSidebarProps {
  demographics?: DemographicData;
  feasibilityData?: FeasibilityData;
}

const DemographicsImpactSidebar: React.FC<DemographicsImpactSidebarProps> = ({ demographics, feasibilityData }) => {
  return (
    <Card title="Demographics Impact" style={{ width: 300 }}>
      <Typography.Text>
        <b>Pool Size Impact:</b> {feasibilityData?.poolSize ?? '--'}
      </Typography.Text>
      <Divider />
      <Typography.Text>
        <b>Cost Impact:</b> {feasibilityData?.costImpact ?? '--'}
      </Typography.Text>
      <Divider />
      <Typography.Text>
        <b>Demographics:</b> {demographics ? (
          <span>
            {demographics.gender ? `Gender: ${demographics.gender.join(', ')}; ` : ''}
            {demographics.ageRange ? `Age: ${demographics.ageRange[0]}-${demographics.ageRange[1]}; ` : ''}
            {demographics.income ? `Income: $${demographics.income[0]}-$${demographics.income[1]}; ` : ''}
            {/* TODO: Add more detailed demographic summary */}
          </span>
        ) : '--'}
      </Typography.Text>
      {/* TODO: Add advanced demographic impact visualizations */}
    </Card>
  );
};

export default DemographicsImpactSidebar;
