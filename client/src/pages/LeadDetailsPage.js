import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  Popconfirm,
  Skeleton,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { getLeadById, deleteLead, getNotesByLead, createNote } from '../services/leadService';

const { Title, Text } = Typography;
const { TextArea } = Input;

// ── Status helpers (consistent with LeadsPage) ─────────────────────────────────

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

// ── Component ──────────────────────────────────────────────────────────────────

function LeadDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  // Lead state
  const [lead, setLead] = useState(null);
  const [leadLoading, setLeadLoading] = useState(true);
  const [leadError, setLeadError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Notes state
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);

  // Add note form
  const [noteForm] = Form.useForm();
  const [addingNote, setAddingNote] = useState(false);

  // ── Fetch lead ─────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const fetchLead = async () => {
      setLeadLoading(true);
      setLeadError(null);
      try {
        const res = await getLeadById(id);
        if (!cancelled) setLead(res.data.data.lead);
      } catch (err) {
        if (!cancelled) {
          const status = err.response?.status;
          setLeadError(
            status === 404
              ? 'Lead not found.'
              : err.response?.data?.message || 'Failed to load lead.'
          );
        }
      } finally {
        if (!cancelled) setLeadLoading(false);
      }
    };

    fetchLead();
    return () => { cancelled = true; };
  }, [id]);

  // ── Fetch notes ────────────────────────────────────────────────────────────

  const fetchNotes = useCallback(async () => {
    setNotesLoading(true);
    setNotesError(null);
    try {
      const res = await getNotesByLead(id);
      setNotes(res.data.data.notes);
    } catch (err) {
      setNotesError(
        err.response?.data?.message || 'Failed to load notes.'
      );
    } finally {
      setNotesLoading(false);
    }
  }, [id]);

  // Load notes once the lead is confirmed to exist
  useEffect(() => {
    if (lead) fetchNotes();
  }, [lead, fetchNotes]);

  // ── Delete lead ────────────────────────────────────────────────────────────

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLead(id);
      messageApi.success('Lead deleted successfully');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Failed to delete lead. Please try again.';
      messageApi.error(msg);
      setDeleting(false);
    }
  };

  // ── Add note ───────────────────────────────────────────────────────────────

  const handleAddNote = async (values) => {
    setAddingNote(true);
    try {
      await createNote(id, { content: values.content.trim() });
      messageApi.success('Note added successfully');
      noteForm.resetFields();
      fetchNotes();
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to add note. Please try again.';
      messageApi.error(msg);
    } finally {
      setAddingNote(false);
    }
  };

  // ── Render: lead fetch error ───────────────────────────────────────────────

  if (!leadLoading && leadError) {
    return (
      <div>
        {contextHolder}
        <Button
          icon={<ArrowLeftOutlined />}
          style={{ marginBottom: 16 }}
          onClick={() => navigate('/')}
        >
          Back to Leads
        </Button>
        <Alert type="error" message={leadError} showIcon />
      </div>
    );
  }

  // ── Render: main page ──────────────────────────────────────────────────────

  return (
    <div>
      {contextHolder}

      {/* Top navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/')}>
          Back to Leads
        </Button>

        {!leadLoading && lead && (
          <Space wrap>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/leads/${id}/edit`)}
            >
              Edit Lead
            </Button>
            <Popconfirm
              title="Delete lead"
              description="Are you sure you want to delete this lead?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={handleDelete}
            >
              <Button danger icon={<DeleteOutlined />} loading={deleting}>
                Delete Lead
              </Button>
            </Popconfirm>
          </Space>
        )}
      </div>

      {/* Lead information */}
      <Card style={{ marginBottom: 24 }}>
        {leadLoading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : lead ? (
          <>
            <Title level={4} style={{ marginTop: 0, marginBottom: 20 }}>
              {lead.name}
            </Title>
            <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small">
              <Descriptions.Item label="Email">{lead.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{lead.phone}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={STATUS_COLORS[lead.status] || 'default'}>
                  {STATUS_LABELS[lead.status] || lead.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {lead.createdAt
                  ? dayjs(lead.createdAt).format('DD MMM YYYY, hh:mm A')
                  : '—'}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : null}
      </Card>

      {/* Notes section — only rendered once lead is loaded */}
      {!leadLoading && lead && (
        <>
          <Divider orientation="left">
            <Title level={5} style={{ margin: 0 }}>
              Notes
            </Title>
          </Divider>

          {/* Notes list */}
          <Card style={{ marginBottom: 24 }}>
            {notesLoading ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <Spin />
              </div>
            ) : notesError ? (
              <Alert
                type="error"
                message={notesError}
                showIcon
                action={
                  <Button size="small" onClick={fetchNotes}>
                    Retry
                  </Button>
                }
              />
            ) : notes.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No notes yet"
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {notes.map((note) => (
                  <Card
                    key={note._id}
                    size="small"
                    style={{ background: '#fafafa' }}
                  >
                    <Text style={{ display: 'block', marginBottom: 6 }}>
                      {note.content}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {note.createdAt
                        ? dayjs(note.createdAt).format('DD MMM YYYY, hh:mm A')
                        : '—'}
                    </Text>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Add note form */}
          <Card title="Add Note">
            <Form
              form={noteForm}
              layout="vertical"
              onFinish={handleAddNote}
            >
              <Form.Item
                name="content"
                label="Note"
                rules={[
                  { required: true, message: 'Note content is required' },
                  { whitespace: true, message: 'Note cannot be empty' },
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="Write a note about this lead..."
                  maxLength={2000}
                  showCount
                />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={addingNote}
                >
                  Add Note
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </>
      )}
    </div>
  );
}

export default LeadDetailsPage;
