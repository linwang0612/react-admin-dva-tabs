import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Components from '../../../../base/components';
import { Utils, ReqApi, Urls, Validate, UserInfo } from '../../../../base/common';
import { Card, Row, Col, Form, Input, Select, Button, Checkbox, Switch, message } from 'antd';
import './AddAlertsRule.scss'
const { IconFont } = Components

@connect(state => ({ alertsRuleModel: state.alertsRuleModel }))
class AddAlertsRule extends PureComponent {
  constructor(props) {
    super(props);
    const { id } = Utils.parseSearch(this.props.location.search);
    this.state = {
      type: id ? 'update' : 'add',
      id,
      data: {}
    }
    this.tenantType = UserInfo.getData().tenantType || 1
  }

  componentDidMount() {
    if (this.state.id) {
      ReqApi.get({
        url: Urls.alertsRuleDetails,
        pm: { id: this.state.id }
      }).then((data) => {
        this.setState({ data })
      })
    }
  }

  onSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      let url = Urls.alertsRuleAdd;
      let pm = { ...values };
      if (pm.temperatureLowWarn + pm.temperatureHighWarn + pm.humidityLowWarn + pm.humidityHighWarn < 1) {
        message.error('请设置预警监控规则');
        return false;
      }
      if (pm.noticeSms && pm.phone === '') {
        message.error('请输入手机号');
        return false;
      }
      if (pm.noticeEmail && pm.email === '') {
        message.error('请输入邮箱');
        return false;
      }
      for (let key in pm) {
        if (typeof pm[key] === 'boolean') {
          pm[key] = Number(pm[key]);
        }
      }
      if (this.state.type === 'update') {
        url = Urls.alertsRuleUpdate;
        pm.id = this.state.id
      }
      ReqApi.post({ url, pm }).then((data) => {
        message.success('提交成功')
        this.goBack()
      })
    })
  }
  goBack = () => {
    this.props.dispatch(routerRedux.push('/alerts/rule'))
  }
  render() {
    const { getFieldsError, getFieldDecorator } = this.props.form;
    const stateData = this.state.data;
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
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 20 },
        sm: { span: 3 },
      },
      wrapperCol: {
        xs: { span: 20 },
        sm: { span: 21 },
      },
    };
    const readonly = this.tenantType > 2;
    return (
      <div className="addAlertsRule baseListStyle">
        <div className="topCon">
          <span className="previousTitle" onClick={this.goBack}>预警规则</span>
          <span className="lines">/</span><span className="currentTitle">{this.state.type === 'add' ? '新建' : '编辑'}</span>
        </div>
        <Form onSubmit={this.onSubmit} >
          <Row className="formHeader">
            <Col span={6}>
              <Form.Item {...formItemLayout} label="规则名称">
                {getFieldDecorator('name', {
                  rules: [
                    { required: true, message: '请输入名称', },
                    { pattern: /^.{0,20}$/, message: '长度超过限制' }
                  ],
                  initialValue: stateData.name || ''
                })(
                  <Input placeholder="请输入名称" disabled={readonly} />
                )}
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item {...formItemLayout2} label="规则描述">
                {getFieldDecorator('description', {
                  rules: [
                    { pattern: /^.{0,50}$/, message: '长度超过限制' }
                  ],
                  initialValue: stateData.description || ''
                })(
                  <Input placeholder="请输入规则描述" disabled={readonly} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Card className="formCard" title="预警监控">
            <div className="container">
              <div className="title">
                <IconFont type="iconwendu1" /> 温度预警
                            </div>
              <Row className="content">
                <Col span={8}>
                  <Row>
                    <Col className="formItem" span={8}>温度过低预警</Col>
                    <Col className="formItem" span={16}>
                      <Form.Item>
                        {getFieldDecorator('temperatureLowWarn', {
                          valuePropName: 'checked',
                          initialValue: !!stateData.temperatureLowWarn
                        })(
                          <Switch disabled={readonly} />
                        )}
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="阀值">
                        {getFieldDecorator('temperatureLowThreshold', {
                          rules: [
                            Validate({
                              type: 'thanZero',
                              decimal: 2,
                              noRequired: true
                            })
                          ],
                          initialValue: stateData.temperatureLowThreshold === undefined ? '' : stateData.temperatureLowThreshold + ''
                        })(
                          <Input disabled={readonly || !this.props.form.getFieldValue('temperatureLowWarn')} />
                        )}
                      </Form.Item>
                      <div>℃</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col className="formItem" span={8}>温度过高预警</Col>
                    <Col className="formItem" span={16}>
                      <Form.Item>
                        {getFieldDecorator('temperatureHighWarn', {
                          valuePropName: 'checked',
                          initialValue: !!stateData.temperatureHighWarn
                        })(
                          <Switch disabled={readonly} />
                        )}
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="阀值">
                        {getFieldDecorator('temperatureHighThreshold', {
                          rules: [
                            Validate({
                              type: 'thanZero',
                              decimal: 2,
                              noRequired: true
                            })
                          ],
                          initialValue: stateData.temperatureHighThreshold === undefined ? '' : stateData.temperatureHighThreshold + ''
                        })(
                          <Input disabled={readonly || !this.props.form.getFieldValue('temperatureHighWarn')} />
                        )}
                      </Form.Item>
                      <div>℃</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col className="formItem" span={8}>预警执行频率</Col>
                    <Col className="formItem" span={16}>
                      <Form.Item className="formSelect">
                        {getFieldDecorator('temperatureWarnFrequency', {
                          rules: [],
                          initialValue: stateData.temperatureWarnFrequency || 30,
                        })(
                          <Select disabled={readonly}>
                            <Select.Option value={5}>5分钟</Select.Option>
                            <Select.Option value={10}>10分钟</Select.Option>
                            <Select.Option value={15}>15分钟</Select.Option>
                            <Select.Option value={30}>30分钟</Select.Option>
                            <Select.Option value={60}>1小时</Select.Option>
                            <Select.Option value={120}>2小时</Select.Option>
                            <Select.Option value={240}>4小时</Select.Option>
                          </Select>
                        )}
                      </Form.Item>
                      <div>执行一次</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="container">
              <div className="title">
                <IconFont type="iconwendu1" /> 湿度预警
                            </div>
              <Row className="content">
                <Col span={8}>
                  <Row>
                    <Col className="formItem" span={8}>湿度过低预警</Col>
                    <Col className="formItem" span={16}>
                      <Form.Item>
                        {getFieldDecorator('humidityLowWarn', {
                          valuePropName: 'checked',
                          initialValue: !!stateData.humidityLowWarn
                        })(
                          <Switch disabled={readonly} />
                        )}
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="阀值">
                        {getFieldDecorator('humidityLowThreshold', {
                          rules: [
                            Validate({
                              type: 'thanZero',
                              decimal: 2,
                              noRequired: true
                            })
                          ],
                          initialValue: stateData.humidityLowThreshold === undefined ? '' : stateData.humidityLowThreshold + ''
                        })(
                          <Input disabled={readonly || !this.props.form.getFieldValue('humidityLowWarn')} />
                        )}
                      </Form.Item>
                      <div>%</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col className="formItem" span={8}>湿度过高预警</Col>
                    <Col className="formItem" span={16}>
                      <Form.Item>
                        {getFieldDecorator('humidityHighWarn', {
                          valuePropName: 'checked',
                          initialValue: !!stateData.humidityHighWarn
                        })(
                          <Switch disabled={readonly} />
                        )}
                      </Form.Item>
                      <Form.Item {...formItemLayout} label="阀值">
                        {getFieldDecorator('humidityHighThreshold', {
                          rules: [
                            Validate({
                              type: 'thanZero',
                              decimal: 2,
                              noRequired: true
                            })
                          ],
                          initialValue: stateData.humidityHighThreshold === undefined ? '' : stateData.humidityHighThreshold + ''
                        })(
                          <Input disabled={readonly || !this.props.form.getFieldValue('humidityHighWarn')} />
                        )}
                      </Form.Item>
                      <div>%</div>
                    </Col>
                  </Row>
                </Col>
                <Col span={8}>
                  <Row>
                    <Col className="formItem" span={8}>预警执行频率</Col>
                    <Col className="formItem" span={16}>
                      <Form.Item className="formSelect">
                        {getFieldDecorator('humidityWarnFrequency', {
                          initialValue: stateData.humidityWarnFrequency || 30,
                          rules: [],
                        })(
                          <Select disabled={readonly}>
                            <Select.Option value={5}>5分钟</Select.Option>
                            <Select.Option value={10}>10分钟</Select.Option>
                            <Select.Option value={15}>15分钟</Select.Option>
                            <Select.Option value={30}>30分钟</Select.Option>
                            <Select.Option value={60}>1小时</Select.Option>
                            <Select.Option value={120}>2小时</Select.Option>
                            <Select.Option value={240}>4小时</Select.Option>
                          </Select>
                        )}
                      </Form.Item>
                      <div>执行一次</div>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Card>
          <Card className="formCard" title="预警通知方式">
            <div className="container">
              <Row className="formNotice">
                <Col span={10}>
                  <Row>
                    <Col span={1}>
                      <Form.Item>
                        {getFieldDecorator('noticeSms', {
                          valuePropName: 'checked',
                          initialValue: !!stateData.noticeSms
                        })(<Checkbox />)}
                      </Form.Item>
                    </Col>
                    <Col span={18}>
                      <Form.Item {...formItemLayout2} label="短信通知">
                        {getFieldDecorator('phone', {
                          rules: [
                            Validate({ type: 'phone' })
                          ],
                          initialValue: stateData.phone || ''
                        })(
                          <Input placeholder="请输入手机号" />
                        )}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={10}>
                  <Col span={1}>
                    <Form.Item>
                      {getFieldDecorator('noticeEmail', {
                        valuePropName: 'checked',
                        initialValue: !!stateData.noticeEmail
                      })(<Checkbox />)}
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item {...formItemLayout2} label="邮件通知">
                      {getFieldDecorator('email', {
                        rules: [
                          Validate({ type: 'email' })
                        ],
                        initialValue: stateData.email || ''
                      })(
                        <Input placeholder="请输入邮箱" />
                      )}
                    </Form.Item>
                  </Col>
                </Col>
                <Col span={4}>
                  <Form.Item {...formItemLayout} label="站内通知">
                    {getFieldDecorator('noticeStation', {
                      valuePropName: 'checked',
                      initialValue: true
                    })(
                      <Checkbox disabled />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Card>
          <div className="formFooter">
            <Button onClick={this.goBack}>取消</Button>
            <Button type="primary" htmlType="submit" >保存</Button>
          </div>
        </Form>
      </div>
    )
  }
}
export default Form.create()(AddAlertsRule)
