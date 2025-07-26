import React from 'react';
import { useNavigate } from 'react-router';

import { Form, Input, Checkbox, Button, Typography, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import axios from 'api/axios';
import { useAuth } from 'provider/authProvider';
import { RowDiv } from 'components/Styles';

const { Text, Link } = Typography;
const LOGIN_URL = '/auth/login';

const LoginForm = (props) => {
  const { setActiveTab } = props;
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const onSignUpClick = (e) => {
    e.preventDefault();
    setActiveTab('signup');
  };

  const handleLogin = async (values) => {
    const { email, password } = values;
    
    try {
      await axios.post(LOGIN_URL, {
          email: email,
          password: password,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }).then((response) => {
          setToken(response?.data?.accessToken);
          navigate("/home", { replace: true });
          message.success("Login successful!");
        }).catch((error) => {
          form.setFieldValue("password", "");
          throw error;
        });
    } catch (error) {
      message.error(error?.response?.data?.message || error?.message || error.toString());
      console.error(error);
    }
  };

  return (
    <Form
      form={form}
      name="login_form"
      initialValues={{
        remember: true,
      }}
      onFinish={handleLogin}
      layout="vertical"
      requiredMark="optional"
    >
      <Form.Item
        name="email"
        rules={[
          {
            type: "email",
            required: true,
            message: "Please input your Email!",
          },
        ]}
        hasFeedback
      >
        <Input
          prefix={<MailOutlined />}
          placeholder="Email"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox style={{ float: 'left' }}>Remember me</Checkbox>
        </Form.Item>
        <a style={{ float: 'right' }} href="/">
          Forgot password?
        </a>
      </Form.Item>

      <Form.Item style={{ marginBottom: "0px" }}>
        <Button block="true" type="primary" htmlType="submit">
          Log in
        </Button>
        <RowDiv>
          <div style={{ marginTop: "10px", textAlign: "center", width: "100%" }}>
            <Text link="" type='secondary'>Don't have an account?</Text>{" "}
            <Link onClick={onSignUpClick}>Sign up now</Link>
          </div>
        </RowDiv>
      </Form.Item>
    </Form>
  )
}

export default LoginForm;