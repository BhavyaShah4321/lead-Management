import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you are looking for does not exist."
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          Back to Leads
        </Button>
      }
    />
  );
}

export default NotFoundPage;
