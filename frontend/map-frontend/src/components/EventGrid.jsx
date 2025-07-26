import React, { useState, useEffect } from 'react';
import { Row, Col, theme } from 'antd';
import EventCard from './EventCard';
import { useStateContext } from 'provider/stateContextProvider';

const EventGrid = () => {
  const [cardSpan, setCardSpan] = useState();
  const {
    token: { borderRadiusLG }
  } = theme.useToken();

  const { collapsed } = useStateContext();

  useEffect(() => {
    if (collapsed)
      setCardSpan(6);
    else
      setCardSpan(8);
  }, [collapsed]);

  return (
    <Row
      gutter={[16, 16]}
      style={{
        padding: 24,
        borderRadius: borderRadiusLG,
      }}
    >
      <Col span={cardSpan}><EventCard /></Col>
      <Col span={cardSpan}><EventCard /></Col>
      <Col span={cardSpan}><EventCard /></Col>
      <Col span={cardSpan}><EventCard /></Col>
      <Col span={cardSpan}><EventCard /></Col>
    </Row>
  )
}

export default EventGrid