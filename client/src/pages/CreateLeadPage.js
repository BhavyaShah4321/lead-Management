import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, message } from 'antd';
import LeadForm from '../components/LeadForm';
import { createLead } from '../services/leadService';

const { Title } = Typography;

function CreateLeadPage() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await createLead(values);
      messageApi.success('Lead created successfully');
      // Small delay so the user sees the success toast before navigating
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to create lead. Please try again.';
      messageApi.error(msg);
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      {contextHolder}

      <Title level={3} style={{ marginBottom: 24 }}>
        Create Lead
      </Title>

      <Card>
        <LeadForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/')}
          loading={submitting}
          submitText="Create Lead"
        />
      </Card>
    </div>
  );
}

export default CreateLeadPage;
