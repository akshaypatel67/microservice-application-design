import React from 'react';
import { Layout } from 'antd';
import EventGrid from 'components/EventGrid';
const { Content } = Layout;

const ContentHome = () => {
  return (
    <Content style={{ margin: '0 16px' }}>
      <EventGrid />
    </Content>
  )
}

export default ContentHome