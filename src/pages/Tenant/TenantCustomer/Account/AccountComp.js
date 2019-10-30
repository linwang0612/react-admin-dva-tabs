import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Form, Input, Select, Button, message } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls, UserInfo } from '../../../../base/common';
import validate from '../../../../base/common/ValidateList';
@connect(state => ({ tenantFactory: state.tenantFactory }))
class AccountComp extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      values = Object.assign({}, this.props.detail, values)
      if (values.password == '******') {
        values.password == ''
      }
      this.props.onSubmit(values)
    })
  }
  render() {
    const { detail } = this.props;

    const { getFieldsError, getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 18 },
      },
    };
    const tenantType = UserInfo.getData().tenantType;
    return (
      <div className="baseListStyle">
        <Modal
          visible={true}
          title={'账号'}
          onCancel={this.props.onCancel}
          width={475}
          className="addEquipmentList"
          footer={[
            <Button key="1" onClick={this.props.onCancel}>取消</Button>,
            <Button key="2" onClick={this.onSubmit} type="primary">保存</Button>
          ]}
        >
          <Form>
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="登录账号">
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入登录账号' },
                    validate({ type: 'username' })],
                    initialValue: detail && detail.username || ''
                  })(
                    <Input key="username" placeholder="请输入" disabled={this.props.detail && this.props.detail.username && true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {detail == null && <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="登录密码">
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入登录密码' }, validate({ type: 'password' })],
                    initialValue: detail && detail.password || ''
                  })(
                    <Input key="password" placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
            </Row>}
            {detail != null && <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="登录密码">
                  {getFieldDecorator('password', {
                    rules: [validate({ type: 'password' })],
                    initialValue: detail && detail.password || ''
                  })(
                    <Input key="password" placeholder="******" />
                  )}
                </Form.Item>
              </Col>
            </Row>}
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AccountComp)
