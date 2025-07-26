import React from 'react';
import { Layout } from 'antd';

import SiderHome from 'components/Layout/SiderHome';
import HeaderHome from 'components/Layout/HeaderHome';
import ContentHome from 'components/Layout/ContentHome';
import FooterHome from 'components/Layout/FooterHome';

import { StateProvider } from 'provider/stateContextProvider';

const Home = () => {
  return (
    <StateProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <SiderHome />
        <Layout>
          <HeaderHome />
          <ContentHome />
          <FooterHome />
        </Layout>
      </Layout>
    </StateProvider>
  );
};

export default Home;