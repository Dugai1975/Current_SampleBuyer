'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Table, Button, Progress, Tag, Typography, notification, Modal, Form, Select, Input, Tabs, Card, Collapse
} from 'antd';
import {
  CopyOutlined, ArrowLeftOutlined, PauseCircleOutlined,
  BarChartOutlined, EyeOutlined, PlusOutlined, DownloadOutlined
} from '@ant-design/icons';
import { Doughnut } from 'react-chartjs-2';
import { theme } from 'antd';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const { Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Mock data definitions
const mockProject = {
  uuid: 'mock-project',
  name: 'Mock Project Name',
  description: 'Project description goes here.',
  total_available: 150,
  count_complete: 30,
  count_accept: 5,
  count_reject: 2,
  count_terminate: 10,
  count_over_quota: 1,
  cpi_buyer: 200,
  state: 'active',
  buyer: {
    name: 'Mock Buyer',
    complete_link: 'https://live.com/complete',
    terminate_link: 'https://live.com/terminate',
    quota_link: 'https://live.com/quota',
    duplicate_link: 'https://live.com/duplicate',
    quality_link: 'https://live.com/quality',
    screenout_link: 'https://live.com/screenout',
    timeout_link: 'https://live.com/timeout',
    redirect_url: 'https://router.com/test?pid=mock-project'
  }
};
const mockSuppliers = [
  { uuid: 'sup-1', name: 'Supplier A' },
  { uuid: 'sup-2', name: 'Supplier B' }
];
const mockQuotasData = [
  { name: 'Group 1', description: 'US, natural fallout, 18-65', cpi: 1.50, complete: 14, target: 200, failure: 82, message: 'collecting data' },
  { name: 'Group 2', description: 'US, natural fallout, 18-65', cpi: 1.50, complete: 0, target: 200, failure: 2, message: 'collecting data' },
  { name: 'Group 3', description: 'US, natural fallout, 18-65', cpi: 1.50, complete: 0, target: 200, failure: 1, message: 'collecting data' }
];
const mockSessions = [
  { uuid: 's1', target_code: 'G1', respondent_id: 'R01', status_detail: 'complete - return', created_at: '2025-06-10T10:00:00' },
  { uuid: 's2', target_code: 'G1', respondent_id: 'R02', status_detail: 'terminate - screenout', created_at: '2025-06-11T11:30:00' }
];

export default function ViewProjectMock() {
  const { token: { colorBgContainer } } = theme.useToken();
  const [project] = useState(mockProject);
    const router = useRouter();
  const [suppliers] = useState(mockSuppliers);
  const [quotasData] = useState(mockQuotasData);
  const [sessions] = useState(mockSessions);
  const [activeTab, setActiveTab] = useState('1');
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [detailQuota, setDetailQuota] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOverviewRep = () => setActiveTab('1');
  const handleSupplierClick = (id) => setSelectedSupplierId(id);
  const calcPercent = (value, total) => total ? Math.round((value / total) * 100) : 0;
  const showDetailModal = (quota) => { setDetailQuota(quota); setModalVisible(true); };
  const closeModal = () => setModalVisible(false);

  const chartData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [project.count_complete + project.count_accept, Math.max(project.total_available - (project.count_complete + project.count_accept), 0)],
      backgroundColor: ['#4ADE80', '#E2E8F0'], borderWidth: 0
    }]
  };
  const chartOptions = { cutout: '70%', plugins: { legend: { display: false }, tooltip: { enabled: false } } };

  const sampleUrls = [{ code: 'G1', redirect_url: project.buyer.redirect_url + '&q=q1' }];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      {quotasData.map((quota, index) => {
        const completeRate = Math.round((quota.complete / quota.target) * 100);
        const terminateRate = Math.round((quota.failure / quota.target) * 100);
        const isLowPerformance = quota.complete === 0;

        return (
          <Card
            key={index}
            title={<span className="font-semibold">{quota.name}</span>}
            extra={<Tag color="green">{quota.message}</Tag>}
            className={`shadow-md ${isLowPerformance ? 'border border-red-300' : ''}`}
          >
            <p className="text-sm text-gray-500 mb-2">{quota.description}</p>
            <div className="space-y-1">
              <div className="text-sm">CPI: <strong>${quota.cpi.toFixed(2)}</strong></div>
              <div className="text-sm">Completes: <strong>{quota.complete}/{quota.target}</strong></div>
              <Progress percent={completeRate} strokeColor={isLowPerformance ? "#ff4d4f" : "#52c41a"} size="small" />
              <div className="text-sm pt-2">Terminates: <strong>{quota.failure}</strong></div>
              <Progress percent={terminateRate} strokeColor="#f5222d" size="small" showInfo={false} />
            </div>
            {isLowPerformance && <div className="mt-2"><Tag color="red">⚠ No completes yet – action recommended</Tag></div>}
            <div className="flex gap-2 mt-4">
              <Button icon={<PauseCircleOutlined />} size="small">Pause</Button>
              <Button icon={<BarChartOutlined />} size="small" onClick={() => showDetailModal(quotasData[0])}>Details</Button>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 bg-gray-50">
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={()=>router.push('/')} className="mb-4">Back to Projects</Button>
      <Card style={{ background: colorBgContainer }} className="mb-4">
        <div className='px-4'>
          <div className='text-right'>
            <Button onClick={handleOverviewRep}>Overview</Button>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-2'>
            <div>
              <Title level={4} className='capitalize'>{project.name} <Button icon={<CopyOutlined />} size="small" /></Title>
              <p className="py-2"><span className="text-gray-500">Project ID: </span>{project.uuid}</p>
              <p>Description: {project.description}</p>
              <div className="px-6 py-4 grid grid-cols-1 w-64 gap-2">
                {suppliers.map(s => <Button key={s.uuid} className={`w-full ${selectedSupplierId===s.uuid?'bg-blue-500 text-white':''}`} onClick={()=>handleSupplierClick(s.uuid)}>{s.name}</Button>)}
              </div>
            </div>
            <div>
              <div className="flex flex-col p-4 items-center">
                <div className="relative w-40 h-40">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-bold text-green-400">{((project.count_complete+project.count_accept)/project.total_available*100).toFixed(2)} %</p>
                    <p className="text-gray-500 text-sm">Completed</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg shadow-md text-center"><p className="text-gray-500 text-sm">Sample available</p><p className="text-2xl font-bold">{project.total_available}</p></div>
                <div className="p-4 rounded-lg shadow-md text-center"><p className="text-gray-500 text-sm">CPI</p><p className="text-2xl font-bold">${(project.cpi_buyer/100).toFixed(2)}</p></div>
                <div className="p-4 rounded-lg shadow-md text-center"><p className="text-gray-500 text-sm">Completed</p><p className="text-2xl font-bold">{project.count_complete+project.count_accept}</p></div>
                <div className="p-4 rounded-lg shadow-md text-center"><p className="text-gray-500 text-sm">Over Quotas</p><p className="text-2xl font-bold">{project.count_over_quota}</p></div>
                <div className="p-4 rounded-lg shadow-md text-center"><p className="text-gray-500 text-sm">Terminated</p><p className="text-2xl font-bold">{project.count_terminate+project.count_reject}</p></div>
                <div className="p-4 rounded-lg shadow-md text-center"><p className="text-gray-500 text-sm">Status</p><Tag color={project.state==='active'?'green':'orange'} className="text-lg font-semibold">{project.state.charAt(0).toUpperCase()+project.state.slice(1)}</Tag></div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="px-8">
        <TabPane tab="Project Info" key="1">{renderOverview()}</TabPane>
        <TabPane tab="Buyer" key="4"><Card className="shadow-md mb-4">{sampleUrls.map((u,i)=>(<div key={i} className="mb-2"><label className="block text-sm">Code: {u.code}</label><Input readOnly value={u.redirect_url} addonAfter={<Button icon={<CopyOutlined />} onClick={()=>navigator.clipboard.writeText(u.redirect_url)}>Copy</Button>} /></div>))}</Card></TabPane>
        <TabPane tab="Suppliers" key="7"><div className="text-right mb-2"><Button icon={<PlusOutlined />} size="small">Add sample provider</Button></div><Table dataSource={quotasData} rowKey="name" pagination={false} columns={[{title:'Name',dataIndex:'name',key:'name'},{title:'Description',dataIndex:'description',key:'description'},{title:'CPI',dataIndex:'cpi',key:'cpi',render:c=>`$${c.toFixed(2)}`},{title:'Complete',key:'complete',render:(_,r)=><Progress percent={Math.round((r.complete/r.target)*100)} size="small"/>},{title:'Actions',key:'actions',render:(_,r)=><Button icon={<EyeOutlined />} size="small" onClick={()=>showDetailModal(r)}>View</Button>}]} scroll={{x:'max-content'}}/></TabPane>
        <TabPane tab="Respondents" key="2"><div className="text-right mb-2"><Button icon={<DownloadOutlined />} size="small">Download CSV</Button></div><Table dataSource={sessions} rowKey="uuid" pagination={false} columns={[{title:'Quota Code',dataIndex:'target_code',key:'target_code'},{title:'UUID',dataIndex:'uuid',key:'uuid'},{title:'Supplier RID',dataIndex:'respondent_id',key:'respondent_id'},{title:'Status Detail',dataIndex:'status_detail',key:'status_detail'},{title:'Date (UTC)',dataIndex:'created_at',key:'created_at'}]} scroll={{x:'max-content'}}/></TabPane>
        <TabPane tab="Invoicing" key="6"><Table dataSource={[{item:'Completes sent',quantity:project.count_complete+project.count_accept+project.count_reject,cpi:`$${(project.cpi_buyer/100).toFixed(2)}`,cost:`$${((project.count_complete+project.count_accept+project.count_reject)*(project.cpi_buyer/100)).toFixed(2)}` }]} rowKey="item" pagination={false} columns={[{title:'Item',dataIndex:'item',key:'item'},{title:'Quantity',dataIndex:'quantity',key:'quantity'},{title:'CPI (Avg)',dataIndex:'cpi',key:'cpi'},{title:'Revenue',dataIndex:'cost',key:'cost'},{title:'Actions',key:'actions',render:()=> <Button icon={<DownloadOutlined />} size="small">Download CSV</Button> }]} scroll={{x:'max-content'}}/></TabPane>
      </Tabs>
      <Modal title={`Details – ${detailQuota?.name}`} visible={modalVisible} onCancel={closeModal} footer={null} width={700}><Collapse><Collapse.Panel header="Qualifications" key="1">{detailQuota?.qualifications?.map((q,i)=><p key={i}>{q.id}: {q.response_ids.join(', ')}</p>)}</Collapse.Panel></Collapse></Modal>
    </div>
  );
}