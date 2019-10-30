import React, { Component } from 'react'
import { Form, Button, Row, Col, Icon } from 'antd'
import moment from 'moment'
import returnFormItem from './returnFormItem'
import './SearchMore.scss'


class SearchMore extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      expand: false,
    }
  }

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  }

  reset = () => {
    let { form, onReset } = this.props
    form.resetFields()
    typeof onReset === 'function' && onReset()
  }

  search = () => {
    let { form, searchItems, onSearch } = this.props
    let items = form.getFieldsValue()
    Object.keys(items).map(key => {
      // 剔除值为undefined的控件
      items[key] === undefined && delete items[key]
      // 转化日期格式
      if (items[key] && items[key].length == 2 && items[key][0]._isAMomentObject == true) {
        // 获取配置项中的日期对象
        let arr = searchItems.filter(opt => opt.id == key),
          obj = arr.length > 0 ? arr[0] : null
        if (obj && obj.dateKeyNames && obj.dateKeyNames.length == 2) {
          let formatText = 'YYYY-MM-DD';
          if (obj.props && obj.props.showTime) {
            formatText += ' ' + obj.props.showTime.format
          }
          // 将date对象拆分成两个值返回给页面
          items[obj.dateKeyNames[0]] = moment(items[key][0]).format(formatText)
          items[obj.dateKeyNames[1]] = moment(items[key][1]).format(formatText)
          delete items[key]
        }
      }
    })
    typeof onSearch === 'function' ? onSearch(items) :
      console.error('nobound onSearch function or onSearch is not a function.')
  }

  getFields = () => {
    let { form, searchItems } = this.props
    const count = this.state.expand ? searchItems.length : 6
    const children = []

    for (let i = 0; i < searchItems.length; i++) {
      let item = searchItems[i]
      const FormItemProps = {
        key: i,
        label: item.label,
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
      }
      item.hidden == true ? null : children.push(
        <Col span={8} key={`${item.type}_${i}`} className="_col" style={{ display: i < count ? 'flex' : 'none' }}>
          <Form.Item {...FormItemProps}>
            {form.getFieldDecorator(item.id, { ...item.filedOption })(returnFormItem(item))}
          </Form.Item>
        </Col>
      )
    }
    return children
  }

  render() {
    let { form, searchItems } = this.props
    return (
      <Form layout="inline" >
        <div className="SearchMore">
          <div className="compDiv">
            <Row>{this.getFields()}</Row>
          </div>
          <div className="btnDiv" style={{ width: searchItems.length > 6 ? 250 : 190 }}>
            {
              this.props.onReset ? <Button onClick={this.reset}>重置</Button> : null
            }
            <Button type="primary" onClick={this.search}>查询</Button>
            {
              searchItems.length > 6 ?
                <a onClick={this.toggle}>更多
                {this.state.expand === false ? <Icon type="down" /> : <Icon type="up" />}
                </a> : null
            }
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create()(SearchMore)
