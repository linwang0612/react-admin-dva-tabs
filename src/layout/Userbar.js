import React from 'react';
import { Icon } from 'antd';

class Userbar extends React.Component {
  logout() {
    console.log('logout')
  }
  render() {
    return (
      <React.Fragment>
        <div className="headerTitle">
          admin
        </div>
        <div className="headerinfo">
          <span className="userbar">
            <span className="user-name">user</span>
          </span>
          <span className="logout" onClick={() => this.logout()}><Icon type="poweroff" /></span>
        </div>
      </React.Fragment>
    )
  }
}

export default Userbar;
