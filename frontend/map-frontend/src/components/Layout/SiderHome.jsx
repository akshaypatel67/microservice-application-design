import React from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  HomeFilled,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import { ReactComponent as Logo } from 'assets/logo.svg';
import { HorizontalCenterDiv } from 'components/Styles';
import { useStateContext } from 'provider/stateContextProvider';

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const items = [
  getItem('Home', '1', <HomeFilled />),
  getItem('Option 2', '2', <DesktopOutlined />),
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('Tom', '3'),
    getItem('Bill', '4'),
    getItem('Alex', '5'),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  getItem('Files', '9', <FileOutlined />),
];

const SiderHome = () => {
  const { collapsed, setCollapsed } = useStateContext();
  return (
    <Sider width={260} style={{borderRadius: '15px 0px 15px 15px', padding: '10px', margin: '10px', marginRight: 0}} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} trigger={null} theme='light'>
      <HorizontalCenterDiv style={{ marginBottom: 30 }}>
        <Logo style={{ width: "50", height: "50" }} />
        <Typography.Title level={5} style={{ fontWeight: 800, paddingLeft: 10, margin: 0 }} hidden={!!collapsed}>
          PrasangConnect
        </Typography.Title>
      </HorizontalCenterDiv>
      <Menu theme="light" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>
  )
}

export default SiderHome;