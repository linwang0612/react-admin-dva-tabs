import React from 'react';
import { Select, Input, InputNumber, Switch, TimePicker, DatePicker, TreeSelect, Cascader, Checkbox, Radio } from 'antd'
const RangePicker = DatePicker.RangePicker;
import AddrOptions from '../AddrOptions';

const returnFormItem = (options) => {
    const {
        type = '',
        props = {},
        enums = []
    } = options

    switch (type) {
        case 'Select':
            return (
                <Select placeholder="请选择" {...props} >
                    {enums && enums.map((item, index) =>
                        <Select.Option key={index} value={item.catCode}>{item.catName}</Select.Option>
                    )}
                </Select>
            )
        case 'Switch':
            return <Switch {...props} />
        case 'Input':
            return <Input placeholder="请输入" {...props} />
        case 'TextArea':
            return <Input.TextArea placeholder="请输入" {...props} />
        case 'InputNumber':
            return <InputNumber placeholder="请输入" {...props} />
        case 'TimePicker':
            return <TimePicker placeholder="请选择" {...props} />
        case 'DatePicker':
            return <DatePicker placeholder="请选择" {...props} />
        case 'Cascader':
            return <Cascader {...props} />
        case 'TreeSelect':
            return <TreeSelect {...props} />
        case 'RangePicker':
            return <RangePicker {...props} />
        case 'Checkbox':
            return <Checkbox {...props} />
        case 'RadioButton':
            return (
                <Radio.Group {...props} >
                    {enums && enums.map((item, index) =>
                        <Radio.Button key={index} value={item.catCode}>{item.catName}</Radio.Button>
                    )}
                </Radio.Group>
            )
        case 'AddrOptions':
            return <AddrOptions {...props} />
        default:
            return null
    }
}

export default returnFormItem
