import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Card, Skeleton, Typography, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LeadForm from '../components/LeadForm';
import { getLeadById, updateLead } from '../services/leadService';

const { Title } = Typography;

function EditLeadPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [lead, setLead] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Load existing lead ─────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    const fetchLead = async () => {
      setFetchLoading(true);
      setFetchError(null);

      try {
        const response = await getLeadById(id);
        // Backend: { success: true, data: { lead: {...} } }
        if (!cancelled) {
          setLead(response.data.data.lead);
        }
      } catch (err) {
        if (!cancelled) {
          const status = err.response?.status;
          const msg =
            status === 404
              ? 'Lead not found.'
              : err.response?.data?.message || 'Failed to load lead. Please try again.';
          setFetchError(msg);
        }
      } finally {
        if (!cancelled) setFetchLoading(false);
      }
    };

    fetchLead();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ── Submit update ──────────────────────────────────────────────────────────

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await updateLead(id, values);
      messageApi.success('Lead updated successfully');
      setTimeout(() => navigate(`/leads/${id}`), 800);
    } catch (err) {
      const status = err.response?.status;
      const msg =
        status === 404
          ? 'Lead not found.'
          : err.response?.data?.message ||
            err.response?.data?.errors?.[0]?.msg ||
            'Failed to update lead. Please try again.';
      messageApi.error(msg);
      setSubmitting(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 600 }}>
      {contextHolder}

      <Button
        icon={<ArrowLeftOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => navigate(`/leads/${id}`)}
      >
        Back to Lead
      </Button>

      <Title level={3} style={{ marginBottom: 24 }}>
        Edit Lead
      </Title>

      <Card>
        {/* Loading skeleton — shown while fetching */}
        {fetchLoading && (
          <Skeleton active paragraph={{ rows: 6 }} />
        )}

        {/* Error state — lead not found or network failure */}
        {!fetchLoading && fetchError && (
          <Alert
            type="error"
            message={fetchError}
            showIcon
            action={
              <Button size="small" onClick={() => navigate('/')}>
                Back to Leads
              </Button>
            }
          />
        )}

        {/* Form — only rendered once lead data is loaded */}
        {!fetchLoading && !fetchError && lead && (
          <LeadForm
            initialValues={{
              name: lead.name,
              email: lead.email,
              phone: lead.phone,
              status: lead.status,
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/leads/${id}`)}
            loading={submitting}
            submitText="Update Lead"
          />
        )}
      </Card>
    </div>
  );
}

export default EditLeadPage;
