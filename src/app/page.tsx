'use client';

import React, { useState, useMemo } from 'react';
import ProjectCreationWizard from '../components/project/ProjectCreationWizard';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table, Button, Tag, Typography, Modal, Dropdown, Menu, Checkbox, Space, notification, Select, DatePicker, Card, Skeleton, Pagination, Input
} from 'antd';
import {
  EyeOutlined, EditOutlined, PlusOutlined, ReloadOutlined, DeleteOutlined, CopyOutlined,SettingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

// Mock data types
interface Project {
  uuid: string;
  code: string;
  name: string;
  state: 'active' | 'closed';
  created_at: string;
}

// Static mock data
const MOCK_PROJECTS: Project[] = Array.from({ length: 23 }).map((_, i) => ({
  uuid: `proj-${i + 1}`,
  code: `P-${1000 + i}`,
  name: `Project ${i + 1}`,
  state: i % 2 === 0 ? 'active' : 'closed',
  created_at: dayjs().subtract(i, 'day').toISOString(),
}));

export default function DashboardPageMock() {
  // TEMP: Render ProjectCreationWizard for validation
  return (
    <div>
      <ProjectCreationWizard />
    </div>
  );
}