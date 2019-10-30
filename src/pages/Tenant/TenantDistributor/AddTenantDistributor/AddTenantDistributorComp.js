import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Row, Col, Form, Input, Select, Button, message } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls, UserInfo } from '../../../../base/common';
@connect(state => ({ tenantDistributor: state.tenantDistributor }))
class AddTenantDistributorComp extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { detail } = this.props;
    detail.provinceCode && this.props.dispatch({ type: 'tenantDistributor/setSelectVal', provinceCode: detail.provinceCode, cityCode: detail.cityCode, countyCode: detail.countyCode })
  }

  componentWillUnmount() {
  }
  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { provinceCode, cityCode, countyCode } = this.props.tenantDistributor;
      delete values.area
      values = Object.assign({}, this.props.detail, values, { provinceCode: provinceCode }, { cityCode: cityCode }, { countyCode: countyCode }, { type: 3 })
      this.props.onSubmit(values)
    })
  }
  addrOptionsChange = options => {
    this.props.dispatch({ type: 'tenantDistributor/setSelectVal', provinceCode: options.length > 0 && options[0].value, cityCode: options.length > 1 && options[1].value, countyCode: options.length > 2 && options[2].value })
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
                <Form.Item {...formItemLayout} label="经销商名称">
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
        </Modal>
      </div>
    )
  }
}
export default Form.create()(AddTenantDistributorComp)
