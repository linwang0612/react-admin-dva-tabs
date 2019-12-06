import React, { Suspense } from 'react';
import PropTypes from 'prop-types';
import { routerRedux, Route, Switch } from 'dva/router';
import { Spin, ConfigProvider } from 'antd';
import AppContent from './AppContent';
import zhCN from 'antd/es/locale/zh_CN';

export default function Router({ history }) {
  const { ConnectedRouter } = routerRedux;
  return (
    <ConfigProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%' }} />}>
          <Switch>
            <Route path="/" component={AppContent} />
          </Switch>
        </Suspense>
      </ConnectedRouter>
    </ConfigProvider>
  );
}

Router.propTypes = {
  history: PropTypes.object
};
