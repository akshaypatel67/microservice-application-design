import React from 'react';
import {
  UserOutlined,
  SearchOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Button, theme, Input, Dropdown, Avatar, Flex, Layout } from 'antd';
import { useStateContext } from 'provider/stateContextProvider';

const { Header } = Layout;

function getItem(label, key, icon, children) {
  return { key, icon, children, label };
}

const menuItems = [
  getItem('Logout', '1', <LogoutOutlined />),
  getItem('Item 2', '2', <UserOutlined />),
];

const menuProps = {
  items: menuItems,
  onClick: (e) => e.preventDefault(),
};

const HeaderHome = () => {
  const { collapsed, setCollapsed } = useStateContext();
  const {
    token: { colorBgContainer, colorPrimary, colorBorderSecondary },
  } = theme.useToken();

  return (
    <Header style={{ margin: 10, marginLeft: 0, paddingLeft: 10, paddingRight: 20, borderRadius: '0px 15px 15px 0px', background: colorBgContainer }} >
      <Flex align='center' justify='space-between' width='100%' style={{ height: '100%' }}>
        <Flex justify='flex-start'>
          <Button
            type="text"
            icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              height: 30,
              width: 30
            }}
          />
          <Input style={{ width: '250px', marginLeft: 30, borderColor: colorBorderSecondary, background: colorBorderSecondary }} placeholder="Search" prefix={<SearchOutlined />} />
        </Flex>
        <Flex justify='flex-end' width='100%'>
          <Dropdown
            menu={menuProps}
            placement="bottomRight"
          >
            <Avatar size="medium" style={{ background: colorPrimary }} icon={<UserOutlined />} />
          </Dropdown>
        </Flex>
      </Flex>
    </Header>
  )
}

export default HeaderHome;