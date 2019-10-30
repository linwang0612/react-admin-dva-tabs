import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Form, Input, Select, Button, message, Icon } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls, UserInfo } from '../../../../base/common';
import DistributorModalComp from './DistributorModalComp'
@connect(state => ({ tenantCustomerModel: state.tenantCustomerModel }))
class AddTenantCustomerComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      distributorVisible: false,
      parentCode: ''
    }
  }

  componentDidMount() {
    const { detail } = this.props;
    detail.provinceCode && this.props.dispatch({ type: 'tenantCustomerModel/setSelectVal', provinceCode: detail.provinceCode, cityCode: detail.cityCode, countyCode: detail.countyCode })
  }

  componentWillUnmount() {
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { provinceCode, cityCode, countyCode } = this.props.tenantCustomerModel;
      const { parentCode } = this.state
      delete values.area
      values = Object.assign({}, this.props.detail, values, { parentCode: parentCode && parentCode || this.props.detail.parentCode  }, { provinceCode: provinceCode }, { cityCode: cityCode }, { countyCode: countyCode }, { type: 4 })
      this.props.onSubmit(values)
    })
  }
  addrOptionsChange = options => {
    this.props.dispatch({ type: 'tenantCustomerModel/setSelectVal', provinceCode: options.length > 0 && options[0].value, cityCode: options.length > 1 && options[1].value, countyCode: options.length > 2 && options[2].value })
  }
  renderIcon() {
    return <Icon type="select" style={{ color: 'rgba(0, 0, 0, 0.43)', fontSize: '14px' }} />
  }
  setVal = (record) => {
    this.props.form.setFieldsValue({
      dealerName: record.name,
    })
    this.setState({
      parentCode: record.code
    })
  }
  onCancel = () => {
    this.setState({ distributorVisible: false })
  }
  render() {
    const { detail } = this.props;
    const { distributorVisible } = this.state
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
    let defaultValue = [detail.provinceCode, detail.cityCode, detail.countyCode]
    return (
      <div className="baseListStyle">
        <Modal
          visible={true}
          title={this.props.detail.name ? '编辑' : '新建'}
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
                <Form.Item {...formItemLayout} label="终端客户">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入销商名称' },
                    { max: 20, message: '最多20个字符' }],
                    initialValue: detail.name || ''
                  })(
                    <Input key="name" placeholder="请输入" disabled={this.props.detail.name && true} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="上级经销商">
                  {getFieldDecorator('dealerName', {
                    rules: [{ required: true, message: '请选择经销商' },
                    { max: 20, message: '最多20个字符' }],
                    initialValue: detail.dealerName || ''
                  })(
                    <Input key="dealerName" onClick={() => {
                      this.setState({ distributorVisible: true })
                    }} suffix={this.renderIcon()} placeholder="请选择" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="所在地区">
                  {getFieldDecorator('area', {
                    initialValue: defaultValue || []
                  })(
                    <Components.AddrOptions selectChange={this.addrOptionsChange} isCity={false} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item {...formItemLayout} label="详细地址">
                  {getFieldDecorator('address', {
                    rules: [{ max: 50, message: '最多50个字符' }],
                    initialValue: detail.address || ''
                  })(
                    <Input key="address" placeholder="请输入" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {distributorVisible && <DistributorModalComp setVal={this.setVal} onCancel={this.onCancel} />}
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AddTenantCustomerComp)
