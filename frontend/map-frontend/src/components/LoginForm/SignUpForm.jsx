import React from 'react';

import { Form, Input, InputNumber, Button, message, Row, Col, Select } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';

import axios from 'api/axios';

const SIGNUP_URL = '/auth/register';

const SignUpForm = (props) => {
  const { setActiveTab } = props;

  const [form] = Form.useForm();

  const handleSignUp = async (values) => {
    try {
      await axios.post(SIGNUP_URL, {
          name: values?.last_name ? `${values.first_name} ${values.last_name}` : `${values.first_name}`,
          email: values?.email,
          password: values?.password,
          age: values?.age,
          gender: values?.gender
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }).then(() => {
          setActiveTab('login');
          form.resetFields();
          message.success("User Account created!");
        }).catch((error) => {
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
      name="signup_form"
      initialValues={{
        remember: true,
      }}
      onFinish={handleSignUp}
      layout="vertical"
      requiredMark="optional"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="first_name"
            rules={[{required: true, message: "Name is required!"}]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="last_name">
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
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
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="age">
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="Age" 
            />
          </Form.Item>
        </Col>
        <Col span={16}>
          <Form.Item name="gender">
            <Select 
              placeholder="Gender"
              allowClear
              style={{ textAlign: "left" }}
              options={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
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
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item
            name="confirm_password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ({ getFieldValue }) => ({
                validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error("Password does not match!"));
                },
            }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item style={{ marginBottom: "0px" }}>
        <Button block="true" type="primary" htmlType="submit">
          Sign Up
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SignUpForm;