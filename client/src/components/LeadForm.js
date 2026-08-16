import React, { useEffect } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';

const { Option } = Select;

/**
 * Shared lead form used by both CreateLeadPage and EditLeadPage.
 *
 * Props:
 *   initialValues  {Object}   – pre-fill values for edit mode (optional)
 *   onSubmit       {Function} – called with { name, email, phone, status }
 *   onCancel       {Function} – called when the Cancel button is clicked
 *   loading        {boolean}  – disables/shows spinner on submit button
 *   submitText     {string}   – label for the submit button
 */
function LeadForm({ initialValues, onSubmit, onCancel, loading = false, submitText = 'Submit' }) {
  const [form] = Form.useForm();

  // When initialValues arrive (edit mode), populate the form fields.
  // This runs whenever initialValues changes so async-loaded data is applied.
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleFinish = (values) => {
    // Trim string fields before passing up
    const cleaned = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      status: values.status,
    };
    onSubmit(cleaned);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      // Default status for create mode; overridden by initialValues in edit mode
      initialValues={{ status: 'new', ...initialValues }}
      requiredMark={false}
    >
      {/* Name */}
      <Form.Item
        label="Name"
        name="name"
        rules={[
          { required: true, message: 'Name is required' },
          { whitespace: true, message: 'Name cannot be empty' },
        ]}
      >
        <Input placeholder="Enter lead name" maxLength={100} />
      </Form.Item>

      {/* Email */}
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Please enter a valid email address' },
        ]}
      >
        <Input placeholder="Enter email address" maxLength={200} />
      </Form.Item>

      {/* Phone */}
      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          { required: true, message: 'Phone is required' },
          { whitespace: true, message: 'Phone cannot be empty' },
        ]}
      >
        <Input placeholder="Enter phone number" maxLength={50} />
      </Form.Item>

      {/* Status */}
      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: 'Status is required' }]}
      >
        <Select placeholder="Select status">
          <Option value="new">New</Option>
          <Option value="contacted">Contacted</Option>
          <Option value="qualified">Qualified</Option>
          <Option value="lost">Lost</Option>
        </Select>
      </Form.Item>

      {/* Actions */}
      <Form.Item style={{ marginBottom: 0 }}>
        <Space>
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {submitText}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}

export default LeadForm;
