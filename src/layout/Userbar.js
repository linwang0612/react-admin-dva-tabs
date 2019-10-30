import React from 'react';
import { Icon } from 'antd';
import { Link, withRouter } from 'dva/router';
import { UserInfo } from '../base/common';

class Userbar extends React.Component {
  logout() {
    //登出接口
    UserInfo.clear();
    this.props.history.push('/login');
  }
  render() {
    return (
      <React.Fragment>
        <div className="headerTitle">
          控制器设备监控物联网平台
        </div>
        <div className="headerinfo">
          {
            UserInfo.getData().id
              ? <React.Fragment>
                <span className="userbar">
                  <span className="user-img"><img src={require('../assets/images/user.png')} /></span>
                  <span className="user-name">{UserInfo.getData().username}</span>
                </span>
                <span className="logout" onClick={() => this.logout()}><Icon type="poweroff" /></span>
              </React.Fragment>
              : <Link to="/login">请登录</Link>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(Userbar);
