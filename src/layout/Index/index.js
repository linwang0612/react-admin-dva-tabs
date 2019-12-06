import React from 'react';
import { Layout } from 'antd';
import NavLeft from '../NavLeft';
import Userbar from '../Userbar';
import './index.scss';

const { Header, Sider, Content } = Layout;

const isLocalHost = window.location.hostname === 'localhost';

export default function Home(props) {
  return (
    <Layout>
      {
        isLocalHost &&
        <Header className="rootHeader">
          <Userbar />
        </Header>
      }
      <Layout>
        <Sider
          trigger={null}
          width={160}
          style={{ boxShadow: '0px 5px 6px 0px rgba(130,130,130,0.5)', zIndex: 2 }}
        >
          <NavLeft />
        </Sider>
        <Layout>
          <Content style={{ margin: 0, padding: 0, minHeight: 280 }}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
