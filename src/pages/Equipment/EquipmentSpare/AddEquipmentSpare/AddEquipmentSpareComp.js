import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Form, Input, Select, Button, message, Icon } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls ,Validate} from '../../../../base/common';
import DeviceModalComp from './DeviceModalComp'
@connect(state => ({ equipmentSpareModel: state.equipmentSpareModel }))
class AddEquipmentSpareComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      deviceVisible: false,
    }
  }

  componentDidMount() {
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
      deviceCode: record.code,
    })
  }
  onCancel = () => {
    this.setState({ deviceVisible: false })
    this.props.dispatch({ type: 'equipmentListModel/getBeiTableList' })
  }
  render() {
    const { detail } = this.props;
    const { deviceVisible } = this.state
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
    return (
      <div className="EquipmentSpare baseListStyle">
        <Modal
          visible={true}
          title={this.props.detail.code ? '编辑' : '新建'}
          onCancel={this.props.onCancel}
          width={781}
          className="addEquipmentSpare"
          footer={[
            <Button key="1" onClick={this.props.onCancel}>取消</Button>,
            <Button key="2" onClick={this.onSubmit} type="primary">提交</Button>
          ]}
        >
          <Form>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="备件编号">
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入备件编号' },
                    Validate({ type: 'prefix' }),
                    { max: 20, message: '最多20个字符' }],
                    initialValue: detail.code || ''
                  })(
                    <Input key="code" placeholder="请输入" disabled={this.props.detail.code && true} />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="备件名称">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入备件编号' },
                    { max: 20, message: '最多20个字符' }],
                    initialValue: detail.name || ''
                  })(
                    <Input key="name" placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="规格型号">
                  {getFieldDecorator('spec', {
                    rules: [{ max: 50, message: '最多50个字符' }],
                    initialValue: detail.spec || ''
                  })(
                    <Input key="spec" placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="生产厂商">
                  {getFieldDecorator('manufacturer', {
                    rules: [{ max: 50, message: '最多50个字符' }],
                    initialValue: detail.manufacturer || ''
                  })(
                    <Input key="manufacturer" placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="关联设备">
                  {getFieldDecorator('deviceCode', {
                    initialValue: detail.deviceCode || ''
                  })(
                    <Input key="deviceCode" onClick={() => {
                      this.setState({ deviceVisible: true })
                    }} suffix={this.renderIcon()} placeholder="请选择" />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item {...formItemLayout} label="状态">
                  {getFieldDecorator('status', {
                    initialValue: detail.status !=undefined && detail.status + '' || '0'
                  })(
                    <Select>
                      <Select.Option key="0" value="0">未使用</Select.Option>
                      <Select.Option key="1" value="1">已使用</Select.Option>
                      <Select.Option key="2" value="2">已报废</Select.Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {deviceVisible && <DeviceModalComp setVal={this.setVal} onCancel={this.onCancel} />}
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AddEquipmentSpareComp)
