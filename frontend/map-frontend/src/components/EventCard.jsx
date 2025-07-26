import React from 'react';
import { Card, Flex, Typography, theme } from 'antd';
import { FaLocationDot, FaTicket } from "react-icons/fa6";

const { Meta } = Card;
const { Text, Title } = Typography;

const EventCard = () => {
  const {
    token: { borderRadiusLG, colorFillSecondary, colorSecondaryBg, colorPrimary }
  } = theme.useToken();
  
  return (
    <Card
      hoverable
      type='inner'
      styles={{
        body: {
          padding: '10px 0px 15px 0px',
        },
      }}
      loading={false}
      style={{ width: '100%', padding: 10, paddingBottom: 0 }}
      cover={
        <div style={{ position: 'relative', height: '160px', width: '100%' }}>
        <img
          style={{ borderRadius: borderRadiusLG, width: '100%', height: '100%', objectFit: 'cover' }}
          alt="example"
          src="https://cdn.magicdecor.in/com/2024/10/16194223/Nimbus-Soft-Blue-White-Abstract-Waves-Wallpaper-Mural.jpg"
        />
        <Flex 
          gap={0} 
          justify='center' 
          align='center' 
          vertical 
          style={{ 
            background: colorSecondaryBg, 
            top: '8px', 
            right: '8px', 
            position: 'absolute', 
            padding: 2, 
            minWidth: 40, 
            borderRadius: borderRadiusLG 
          }}
        >
          <Text strong type='secondary' style={{ fontSize: '10px' }}>Dec</Text>
          <Title level={4} style={{ fontWeight: 800, margin: 0, marginTop: -5 }}>2</Title>
        </Flex>
        </div>
      }
    >
      <Meta
        description={
          <>
            <Flex justify='space-between' align='flex-end' width='100%' style={{  }}>
              <span>
                <Text type='secondary' strong={true} style={{ fontSize: '12px' }}>Sunday • 05:00 pm</Text>
                <Title level={4} style={{ fontWeight: 600, margin: 0, paddingTop: 0 }}>GrooveGate Music Event</Title>
                <Flex gap={5} align='center' justify='flex-start'>
                  <FaLocationDot />
                  <Text type='secondary' strong={true} style={{ fontSize: '12px' }}>Ahmedabad, Gujarat</Text>
                </Flex>
                <Flex gap={5} align='center' justify='flex-start' style={{ background: colorFillSecondary, width: 'fit-content', padding: '0px 10px', borderRadius: borderRadiusLG, marginTop: 10 }}>
                  <FaTicket />
                  <Text strong style={{ fontSize: '20px' }}>27</Text><Text type='secondary' strong={true} style={{ fontSize: '12px' }}>/ 100 Seats</Text>
                </Flex>
              </span>
              <span
                style={{
                  background: colorFillSecondary,
                  padding: '5px 10px',
                  borderRadius: borderRadiusLG,
                  fontSize: '14px',
                  fontWeight: 800,
                  color: colorPrimary
                }}
              >
                $ 5.25
              </span>
            </Flex>
          </>
        }
      />
    </Card>
  )
}

export default EventCard