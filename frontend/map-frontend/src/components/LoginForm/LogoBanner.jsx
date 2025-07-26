import React from 'react';
import { Typography, Flex } from 'antd';
import { ReactComponent as Logo } from 'assets/logo.svg';

const { Title } = Typography;

const LogoBanner = () => {
  return (
    <Flex justify='center' align='center'>
      <Logo style={{ width: "40", height: "40", padding: "10px" }} />
      <Title style={{ fontSize: 28, margin: 0 }} >PrasangConnect</Title>
    </Flex>
  )
}

export default LogoBanner;