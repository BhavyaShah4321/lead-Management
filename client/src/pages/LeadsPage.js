import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getLeads, deleteLead } from '../services/leadService';

const { Title } = Typography;
const { Option } = Select;

// ── Status helpers ─────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  lost: 'Lost',
};

const STATUS_COLORS = {
  new: 'blue',
  contacted: 'orange',
  qualified: 'green',
  lost: 'red',
};

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Qualified', value: 'qualified' },
  { label: 'Lost', value: 'lost' },
];

const DEBOUNCE_MS = 400;

// ── Component ──────────────────────────────────────────────────────────────────

function LeadsPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Ref to hold the debounce timer
  const debounceTimer = useRef(null);

  // ── Fetch leads ──────────────────────────────────────────────────────────────

  const fetchLeads = useCallback(async (searchValue, statusValue) => {
    setLoading(true);
    setError(null);

    const params = {};
    if (searchValue) params.search = searchValue;
    if (statusValue) params.status = statusValue;

    try {
      const response = await getLeads(params);
      // Backend: { success: true, data: { leads: [...] } }
      setLeads(response.data.data.leads);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to load leads. Please try again.';
      setError(msg);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchLeads('', '');
  }, [fetchLeads]);

  // ── Search with debounce ─────────────────────────────────────────────────────

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchLeads(value, status);
    }, DEBOUNCE_MS);
  };

  // Clear button on Input.Search fires with empty string
  const handleSearchClear = () => {
    setSearch('');
    clearTimeout(debounceTimer.current);
    fetchLeads('', status);
  };

  // ── Status filter ────────────────────────────────────────────────────────────

  const handleStatusChange = (value) => {
    setStatus(value);
    fetchLeads(search, value);
  };

  // ── Delete ───────────────────────────────────────────────────────────────────

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteLead(id);
      messageApi.success('Lead deleted successfully');
      fetchLeads(search, status);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to delete lead. Please try again.';
      messageApi.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Table columns ────────────────────────────────────────────────────────────

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (s) => (
        <Tag color={STATUS_COLORS[s] || 'default'}>
          {STATUS_LABELS[s] || s}
        </Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) =>
        date ? dayjs(date).format('DD MMM YYYY, hh:mm A') : '—',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 160,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate(`/leads/${record._id}`)}
            title="View"
          />
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/leads/${record._id}/edit`)}
            title="Edit"
          />
          <Popconfirm
            title="Delete lead"
            description="Are you sure you want to delete this lead?"
            okText="Delete"
            okButtonProps={{ danger: true }}
            cancelText="Cancel"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={deletingId === record._id}
              title="Delete"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div>
      {contextHolder}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          Leads
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/leads/new')}
        >
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={handleSearchChange}
          onClear={handleSearchClear}
          allowClear
          style={{ maxWidth: 300 }}
        />
        <Select
          value={status}
          onChange={handleStatusChange}
          style={{ width: 180 }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <Option key={opt.value} value={opt.value}>
              {opt.label}
            </Option>
          ))}
        </Select>
      </div>

      {/* Error banner */}
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Table */}
      <Table
        columns={columns}
        dataSource={leads}
        rowKey="_id"
        loading={loading}
        locale={{ emptyText: 'No leads found' }}
        pagination={{ pageSize: 10, showSizeChanger: false, hideOnSinglePage: true }}
        scroll={{ x: 800 }}
      />
    </div>
  );
}

export default LeadsPage;
