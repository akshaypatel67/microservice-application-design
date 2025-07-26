import React from 'react';
import { Typography, Tabs } from 'antd';

import { CenterDiv, RowDiv } from 'components/Styles';
import LoginForm from 'components/LoginForm/LoginForm';
import SignUpForm from 'components/LoginForm/SignUpForm';
import LogoBanner from 'components/LoginForm/LogoBanner';

const { Text } = Typography;

const Login = () => {
  const [activeTab, setActiveTab] = React.useState('login');

  const tabItems = [
    { key: 'login', label: 'Login', children: <LoginForm setActiveTab={setActiveTab} /> },
    { key: 'signup', label: 'Sign Up', children: <SignUpForm setActiveTab={setActiveTab} /> },
  ];

  return (
    <CenterDiv>
      <div style={{ width: '320px', margin: '0 auto', textAlign: 'center' }}>
        <RowDiv>
          <LogoBanner />
          <Text type='secondary'>
            Welcome back to PrasangConnect! Please enter your details below to
            sign in.
          </Text>
        </RowDiv>
        
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          defaultActiveKey="1"
          items={tabItems}
          centered
          // indicator={{ size: (origin) => origin - 20 }}
        />
      </div>
    </CenterDiv>
  );
};

Login.propTypes = {};

export default Login;