import React, { Suspense, lazy, Component } from 'react';
import PropTypes from 'prop-types';
import { routerRedux, Route, Switch, Redirect } from 'dva/router';
import { Spin, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Login from '../pages/Login';
import menuDate from './menuDate';

const Home = lazy(() => import(/* webpackChunkName: "home-vendor" */'../layout/Index'));

class AppContent extends Component {

  menuList = () => {
    let list = [];
    const rl = data => {
      data.forEach(item => {
        if (item.path) {
          list.push(item);
        }
        if (item.children && item.children.length > 0) {
          rl(item.children)
        }
        if (item.insidePages && item.insidePages.length > 0) {
          rl(item.insidePages)
        }
      })
    }
    rl(menuDate)
    return list
  }

  render() {
    return (
      <Home>
        <Switch>
          {
            this.menuList().map((item, index) =>
              <Route key={`route${index}`} path={item.path} exact component={item.component} />
            )
          }
          {/* <Redirect from="/" to="/login" /> */}
        </Switch>
      </Home>
    )
  }
}


export default function Router({ history }) {
  const { ConnectedRouter } = routerRedux;
  return (
    <ConfigProvider locale={zhCN}>
      <ConnectedRouter history={history}>
        <Suspense fallback={<Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%' }} />}>
          <Switch>
            {/* <Route path="/" exact
              render={(props) => (
                UserInfo.getTokenId()
                  ? <Component {...props} /> : <Redirect to={{ pathname: '/login' }} />
              )}
            /> */}
            <Route path="/" exact component={Login} />
            <Route path="/login" exact component={Login} />
            <Route component={AppContent} />
          </Switch>
        </Suspense>
      </ConnectedRouter>
    </ConfigProvider>
  );
}

Router.propTypes = {
  history: PropTypes.object
};
