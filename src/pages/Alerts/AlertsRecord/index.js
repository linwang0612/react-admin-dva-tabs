import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table } from 'antd';
import Components from '../../../base/components';
import { UserInfo } from '../../../base/common';

const { FooterPagination, SearchMore } = Components;

@connect(state => ({ alertsRecordModel: state.alertsRecordModel }))
class AlertsRecord extends PureComponent {
    constructor(props) {
        super(props);
        this.tenantType = UserInfo.getData().tenantType;
    }

    componentDidMount() {
        this.props.dispatch({ type: 'alertsRecordModel/getTableList' })
        this.props.dispatch({ type: 'alertsRecordModel/watchChange' })
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'alertsRecordModel/resetData' })
    }

    pageChange = e => {
        this.props.dispatch({ type: 'alertsRecordModel/setCurrent', payload: e })
    }

    handleSearchForm = (e) => {
        this.props.dispatch({ type: 'alertsRecordModel/setSearch', payload: e })
    }

    tableColumns = tenantType => {
        const createDate = {
            title: '预警时间',
            dataIndex: 'createDate',
            key: 'createDate'
        },
        deviceCode = {
            title: '设备编号',
            dataIndex: 'deviceCode',
            key: 'deviceCode',
        },
        deviceName = {
            title: '设备名称',
            dataIndex: 'deviceName',
            key: 'deviceName',
            render: text => <span title={text}>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</span>
        },
        deviceModel = {
            title: '设备型号',
            dataIndex: 'deviceModel',
            key: 'deviceModel',
            render: text => <span title={text}>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</span>
        },
        freezerName = {
            title: '冰柜厂商',
            dataIndex: 'freezerName',
            key: 'freezerName',
        },
        freezerName2 = {
            title: '生产厂商',
            dataIndex: 'freezerName',
            key: 'freezerName',
        },
        endName = {
            title: '终端客户',
            dataIndex: 'endName',
            key: 'endName',
        },
        item = {
            title: '监控项',
            dataIndex: 'item',
            key: 'item',
            render: (text, record) => <div>{text ? '湿度' : '温度'}</div>
        },
        value = {
            title: '监控值',
            dataIndex: 'value',
            key: 'value',
            render: (text, record) => <div>{text} {record.item ? '%' : '℃'}</div>
        },
        info = {
            title: '警告',
            dataIndex: 'info',
            key: 'info',
            render: (text, record) => <div style={{ color: text ? '#E52C00' : '#F49505' }}>{`${record.item ? '湿度' : '温度'}${text ? '过高' : '过低'}`}</div>
        },
        controllerCode = {
            title: '控制器编号',
            dataIndex: 'controllerCode',
            key: 'controllerCode',
        },
        deviceAlias = {
            title: '设备别名',
            dataIndex: 'deviceAlias',
            key: 'deviceAlias',
            render: text => <span title={text}>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</span>
        };
        const list = [
            [ createDate, deviceCode, deviceName, deviceModel, freezerName, endName, item, value, info ],
            [ createDate, deviceCode, deviceName, deviceModel, controllerCode, endName, item, value, info ],
            [ createDate, deviceCode, deviceName, deviceModel, freezerName2, endName, item, value, info ],
            [ createDate, deviceCode, deviceName, deviceAlias, deviceModel, freezerName2, item, value, info ],
        ]
        return list[ tenantType - 1]
    }

    searchItems = tenantType => {
        const deviceCode = {
            label: '设备编号',
            type: 'Input',
            id: 'deviceCode'
        },
        deviceName = {
            label: '设备名称',
            type: 'Input',
            id: 'deviceName'
        },
        deviceModel = {
            label: '设备型号',
            type: 'Input',
            id: 'deviceModel'
        },
        freezerName = {
            label: '冰柜厂商',
            type: 'Input',
            id: 'freezerName'
        },
        endName = {
            label: '终端客户',
            type: 'Input',
            id: 'endName'
        },
        controllerCode = {
            label: '控制器编号',
            id: 'controllerCode',
            type: 'Input',
        },
        deviceAlias = {
            label: '设备别名',
            id: 'deviceAlias',
            type: 'Input',
        },
        countDate = {
            label: '时间范围',
            type: 'RangePicker',
            id: 'countDate',
            dateKeyNames: ['createDateStart', 'createDateEnd'],
            props: {
                showTime: { format: 'HH:mm:ss' }
            }
        };
        const list = [
            [ deviceCode, deviceName, deviceModel, freezerName, endName, countDate ],
            [ deviceCode, deviceName, deviceModel, controllerCode, endName, countDate ],
            [ deviceCode, deviceName, deviceModel, { ...freezerName, label: '生产厂商' }, endName, countDate ],
            [ deviceCode, deviceName, deviceModel, { ...freezerName, label: '生产厂商' }, deviceAlias, countDate ],
        ]
        return list[ tenantType - 1]
    }

    render() {
        const { tableLoading, listData, current } = this.props.alertsRecordModel;
        return (
            <div className="baseListStyle">
                <div className="topCon">
                    <span className="currentTitle">预警记录</span>
                </div>
                <div className="headDiv">
                    <SearchMore
                        searchItems={this.searchItems(this.tenantType)}
                        onSearch={e => this.handleSearchForm(e)}
                        onReset={() => this.handleSearchForm({})}
                    />
                </div>
                <div style={{ height: 24 }} />
                <Table
                    rowKey={'id'}
                    loading={tableLoading}
                    columns={this.tableColumns(this.tenantType)}
                    pagination={false}
                    dataSource={listData.records}
                    width={'100%'}
                />
                <FooterPagination total={listData.total ? listData.total : 0} current={current} pageChange={this.pageChange} />
            </div>
        )
    }
}

export default AlertsRecord;
