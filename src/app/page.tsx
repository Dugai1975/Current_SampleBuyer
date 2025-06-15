'use client';

import React, { useState, useMemo } from 'react';
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
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
   const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['code','name','state','created_at','actions']);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRecord, setModalRecord] = useState<Project | null>(null);

  // Filtered & paginated data
  const filtered = useMemo(() => {
    return projects
      .filter(p => p.code.includes(searchText) || p.name.includes(searchText))
      .filter(p => statusFilter.length ? statusFilter.includes(p.state) : true)
      .filter(p => dateRange ? dayjs(p.created_at).isBetween(dateRange[0], dateRange[1], null, '[]') : true);
  }, [projects, searchText, statusFilter, dateRange]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const columns = useMemo(() => {
    const base = [
      { key:'code', title:'Code', dataIndex:'code' },
      { key:'name', title:'Name', dataIndex:'name' },
      {
        key:'state', title:'Status', dataIndex:'state', render: s => <Tag color={s==='active'?'green':'red'}>{s}</Tag>
      },
      {
        key:'created_at', title:'End date', dataIndex:'created_at', render: d => dayjs(d).format('MM/DD/YYYY')
      },
      {
        key:'actions', title:'Actions', render: (_: any, record: Project) => (
          <Space>
            <Button onClick={()=>router.push('/projectDetail')} icon={<EyeOutlined />} size="small" />
            <Button icon={<EditOutlined />} size="small" />
            <Button icon={<CopyOutlined />} size="small" onClick={() => notification.info({ message: `Duplicated ${record.code}` })} />
          </Space>
        )
      }
    ];
    return base.filter(col => visibleColumns.includes(col.key));
  }, [visibleColumns]);

  // Bulk actions
  const archiveSelected = () => { notification.info({ message: `Archived ${selectedRowKeys.length}` }); setSelectedRowKeys([]); };
  const deleteSelected = () => { notification.info({ message: `Deleted ${selectedRowKeys.length}` }); setSelectedRowKeys([]); };
  const exportSelected = () => { notification.info({ message: `Exported ${selectedRowKeys.length}` }); };

  return (
    <div className="p-4 space-y-6 bg-white">
      {/* KPI Cards + Controls */}
      <Skeleton active loading={false} paragraph={false}>
        <div className="flex flex-wrap gap-4 items-center">
          {['active','closed'].map(status => (
            <Card key={status} style={{ width: 160, textAlign: 'center' }} className="shadow">
              <div className="text-sm text-gray-500">{status.charAt(0).toUpperCase()+status.slice(1)}</div>
              <div className="text-2xl font-bold">{projects.filter(p=>p.state===status).length}</div>
            </Card>
          ))}
          <div className="ml-auto flex items-center space-x-2">
            <Button icon={<ReloadOutlined />} />
            <Button type="primary" onClick={()=>router.push('/projects')} icon={<PlusOutlined />}>New Project</Button>
            <Dropdown menu={<Menu>{['code','name','state','created_at','actions'].map(key=> (
              <Menu.Item key={key}>
                <Checkbox checked={visibleColumns.includes(key)} onChange={e=>{
                  const next = e.target.checked ? [...visibleColumns,key] : visibleColumns.filter(k=>k!==key);
                  setVisibleColumns(next);
                }}>{key}</Checkbox>
              </Menu.Item>
            ))}</Menu>}>
              <Button icon={<SettingOutlined />} />
            </Dropdown>
          </div>
        </div>
      </Skeleton>

      {/* Filters */}
      <Card className="shadow">
        <Space wrap>
          <Input.Search placeholder="Search" onSearch={val=>setSearchText(val)} style={{minWidth:200}} />
          <Select mode="multiple" placeholder="Status" options={[{label:'Active',value:'active'},{label:'Closed',value:'closed'}]} onChange={setStatusFilter} style={{minWidth:180}}/>
          <RangePicker onChange={dates=>setDateRange(dates as any)} />
        </Space>
      </Card>

      {/* Table + Bulk Actions */}
      <Card className="shadow">
        {selectedRowKeys.length>0 && (
          <Space className="mb-2">
            <Button onClick={archiveSelected}>Archive</Button>
            <Button danger onClick={deleteSelected}>Delete</Button>
            <Button onClick={exportSelected}>Export</Button>
          </Space>
        )}
        <Table<Project>
          rowKey="uuid"
          dataSource={paged}
          columns={columns}
          pagination={false}
          rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
        />
      </Card>

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination current={page} pageSize={pageSize} total={filtered.length} showSizeChanger onChange={(p,ps)=>{setPage(p);setPageSize(ps);}}/>
      </div>

      {/* Details Modal */}
      <Modal open={modalVisible} onCancel={()=>setModalVisible(false)} footer={null} title={modalRecord?.name}>
        <p><strong>Code:</strong> {modalRecord?.code}</p>
        <p><strong>Status:</strong> {modalRecord?.state}</p>
        <p><strong>Created At:</strong> {dayjs(modalRecord?.created_at).format('MM/DD/YYYY')}</p>
      </Modal>
    </div>
  );
}