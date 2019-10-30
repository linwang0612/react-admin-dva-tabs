import React, { Component } from 'react';
import { Form, Input, Button, message, Icon } from 'antd';
import { ReqApi, UserInfo, Urls } from '../../base/common';
import Components from '../../base/components';
import './index.scss';
const { IconFont } = Components;

@Form.create()
class Login extends Component {
  constructor(props) {
    super(props);
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        ReqApi.post({
          url: Urls.login,
          pm: values
        }).then((data) => {
          UserInfo.setTokenId(data.tokenId)
          UserInfo.setData(data.userInfo)
          message.success('登录成功！');
            (data.userInfo.tenantType === 1 || data.userInfo.tenantType === 2) && this.props.history.push('/monitor/distribution');
              (data.userInfo.tenantType === 3 || data.userInfo.tenantType === 4) && this.props.history.push('/monitor/data');
          this.props.form.resetFields()
        })
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="Login">
        <div className="content">
          {/* <div className="loginLeft">
                        <div className="loginCon">
                            <img src={require('../../assets/images/login-logo.png')} />
                            <p className="loginTitle">运营管理系统平台</p>
                        </div>
                    </div> */}
          <div className="loginRight">
            <div className="loginBox">
              <div className="title">
                <span>控制器设备监控物联网平台</span>
              </div>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名' }],
                  })(
                    <Input className="login-form-input"
                      prefix={<IconFont type="iconzhanghao" />}
                      autoComplete="off"
                      style={{ height: 48, width: 320 }} placeholder="请输入用户名" />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码' }],
                  })(
                    <Input className="login-form-input"
                      prefix={<IconFont type="iconmima" />}
                      autoComplete="off"
                      style={{ height: 48, width: 320 }} type="password" placeholder="请输入密码" />
                  )}
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" className="login-form-button">
                    登录
                                    </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
