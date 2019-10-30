import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Icon, Button, message } from 'antd';
import { ReqApi, Urls, UserInfo } from '../../../base/common';
import Components from '../../../base/components';

const { FooterPagination, DeleteModal, SearchMore } = Components;

@connect(state => ({ alertsRuleModel: state.alertsRuleModel }))
class AlertsRule extends PureComponent {
    constructor(props) {
        super(props);
        this.tableColumns = [
            {
                title: '规则名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '规则描述',
                dataIndex: 'description',
                key: 'description',
                render: (text, record) => <div>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</div>
            },
            {
                title: '温度过低预警',
                dataIndex: 'temperatureLowThreshold',
                key: 'temperatureLowThreshold',
                render: (text, record) => <div>{record.temperatureLowWarn ? `阀值 < ${text} ℃` : '--'}</div>
            },
            {
                title: '温度过高预警',
                dataIndex: 'temperatureHighThreshold',
                key: 'temperatureHighThreshold',
                render: (text, record) => <div>{record.temperatureHighWarn ? `阀值 > ${text} ℃` : '--'}</div>
            },
            {
                title: '湿度过低预警',
                dataIndex: 'humidityLowThreshold',
                key: 'humidityLowThreshold',
                render: (text, record) => <div>{record.humidityLowWarn ? `阀值 < ${text} %` : '--'}</div>
            },
            {
                title: '湿度过高预警',
                dataIndex: 'humidityHighThreshold',
                key: 'humidityHighThreshold',
                render: (text, record) => <div>{record.humidityHighWarn ? `阀值 > ${text} %` : '--'}</div>
            }
        ];
        this.tenantType = UserInfo.getData().tenantType || 1
    }

    componentDidMount() {
        this.props.dispatch({ type: 'alertsRuleModel/getTableList' })
        this.props.dispatch({ type: 'alertsRuleModel/watchChange' })
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'alertsRuleModel/resetData' })
    }

    handleSearchForm = (e) => {
        this.props.dispatch({ type: 'alertsRuleModel/setSearch', payload: e })
    }

    pageChange = e => {
        this.props.dispatch({ type: 'alertsRuleModel/setCurrent', payload: e })
    }

    addRow = id => {
        let path = '/alerts/rule/add';
        if (id) {
            path += '?id=' + id
        }
        this.props.dispatch(routerRedux.push(path))
    }

    deleteRow = (row, index) => {
        ReqApi.post({
            url: Urls.alertsRuleDelete,
            pm: { id: row.id }
        }).then((data) => {
            message.success('删除成功')
            this.props.dispatch({ type: 'alertsRuleModel/getTableList' })
        })
    }

    devideList = id => {
        let path = '/alerts/rule/device';
        path += '?id=' + id
        this.props.dispatch(routerRedux.push(path))
    }
    render() {
        const { tableLoading, listData, current } = this.props.alertsRuleModel;
        let column = [...this.tableColumns];
        const searchItems = [
            {
                label: '冰柜厂商',
                type: 'Input',
                id: 'vendorName'
            },
        ]
        if (this.tenantType === 1) {
            column.unshift({
                title: '冰柜厂商',
                dataIndex: 'vendorName',
                key: 'vendorName',
            })
        }
        if (this.tenantType === 2) {
            column.push({
                title: '操作',
                dataIndex: 'cz',
                key: 'cz',
                fixed: 'right',
                width: 200,
                render: (value, row, index) => {
                    return (
                        <div className="table-click">
                            <a style={{ marginRight: 10 }} onClick={() => this.addRow(row.id)}>编辑</a>
                            <DeleteModal deleteOk={() => this.deleteRow(row, index)}><a style={{ marginRight: 10 }}>删除</a></DeleteModal>
                            <a onClick={() => this.devideList(row.id)}>设备列表</a>
                        </div>
                    )
                }
            })
        }
        if (this.tenantType > 2) {
            column.push({
                title: '操作',
                dataIndex: 'cz',
                key: 'cz',
                fixed: 'right',
                width: 200,
                render: (value, row, index) => {
                    return (
                        <div className="table-click">
                            <a style={{ marginRight: 10 }} onClick={() => this.addRow(row.id)}>预警通知设置</a>
                        </div>
                    )
                }
            })
        }
        return (
            <div className="baseListStyle">
                <div className="topCon">
                    <span className="currentTitle">预警规则</span>
                </div>
                {
                    this.tenantType === 1 &&
                    <div className="headDiv">
                        <SearchMore
                            searchItems={searchItems}
                            onSearch={e => this.handleSearchForm(e)}
                            onReset={() => this.handleSearchForm({})}
                        />
                    </div>
                }
                {
                    this.tenantType === 2
                        ? <div className="addRowBtn">
                            <Button type="primary" onClick={() => this.addRow()}><Icon type="plus" />新建</Button>
                        </div>
                        : <div style={{ height: 24 }} />
                }
                <Table
                    rowKey={'id'}
                    loading={tableLoading}
                    columns={column}
                    pagination={false}
                    dataSource={listData.records}
                    width={'100%'}
                />
                <FooterPagination total={listData.total ? listData.total : 0} current={current} pageChange={this.pageChange} />
            </div>
        )
    }
}

export default AlertsRule;
