import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Form, Input, Select, Button, message, Icon } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls, UserInfo, Validate } from '../../../../base/common';
import ControllerModalComp from './ControllerModalComp'
@connect(state => ({ equipmentListModel: state.equipmentListModel }))
class AddAddEquipmentListComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      controllerVisible: false
    }
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
      this.props.onSubmit(values)
    })
  }
  renderIcon() {
    return <Icon type="select" style={{ color: 'rgba(0, 0, 0, 0.43)', fontSize: '14px' }} />
  }
  setVal = (record) => {
    this.props.form.setFieldsValue({
      controllerCode: record.controllerCode,
    })
  }
  onCancel = () => {
    this.setState({ controllerVisible: false })
  }
  render() {
    const { detail } = this.props;
    const { controllerVisible } = this.state
    // console.log('detail--',detail)
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
          title={this.props.detail.code ? '编辑' : '新建'}
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
                <Form.Item {...formItemLayout} label="设备编号">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入设备编号' },
                    Validate({ type: 'prefix' }),
                    { max: 20, message: '最多20个字符' }],
                    initialValue: detail.code || ''
                  })(
                    <Input key="code" placeholder="请输入" disabled={this.props.detail.code && true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="设备名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入设备名称' },
                    { max: 50, message: '最多50个字符' }],
                    initialValue: detail.name || ''
                  })(
                    <Input key="name" placeholder="请输入" disabled={this.props.detail.code && tenantType == 4 && true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {
              tenantType == 4 && <Row>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label="设备别称">
                    {getFieldDecorator('alias', {
                      rules: [{ required: true, message: '请输入设备别称' },
                      { max: 50, message: '最多50个字符' }],
                      initialValue: detail.alias || ''
                    })(
                      <Input key="alias" placeholder="请输入" />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            }
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="设备型号">
                  {getFieldDecorator('model', {
                    rules: [{ max: 50, message: '最多50个字符' }],
                    initialValue: detail.model || ''
                  })(
                    <Input key="model" placeholder="请输入" disabled={this.props.detail.code && tenantType == 4 && true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            {
              tenantType == 4 && <Row>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label="生产厂商">
                    {getFieldDecorator('manufacturer', {
                      rules: [{ max: 20, message: '最多20个字符' }],
                      initialValue: detail.manufacturer || ''
                    })(
                      <Input key="manufacturer" disabled={this.props.detail.code && tenantType == 4 && true} />
                    )}
                  </Form.Item>
                </Col>
              </Row>}
            {
              tenantType == 1 && <Row>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label="芯片序列号">
                    {getFieldDecorator('serialNumber', {
                      rules: [Validate({ type: 'numOrLetter' }),{ required: true, message: '请输入芯片序列号' },{ max: 20, message: '最多20个字符' }],
                      initialValue: detail.serialNumber || ''
                    })(
                      <Input key="serialNumber" />
                    )}
                  </Form.Item>
                </Col>
              </Row>}
            {
              tenantType == 2 && <Row>
                <Col span={24}>
                  <Form.Item {...formItemLayout} label="控制器编号">
                    {getFieldDecorator('controllerCode', {
                      rules: [{ max: 20, message: '最多20个字符' }],
                      initialValue: detail.controllerCode || ''
                    })(
                      <Input key="controllerCode" onClick={() => {
                        this.setState({ controllerVisible: true })
                      }} suffix={this.renderIcon()} placeholder="请选择" />
                    )}
                  </Form.Item>
                </Col>
              </Row>}
          </Form>
          {controllerVisible && <ControllerModalComp setVal={this.setVal} onCancel={this.onCancel} />}
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AddAddEquipmentListComp)
