import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Icon, Button, message } from 'antd';
import { ReqApi, Urls, Utils } from '../../../../base/common';
import Components from '../../../../base/components';
import DeviceModal from './DeviceModal';

const { FooterPagination, DeleteModal } = Components;

@connect(state => ({ alertsRuleModel: state.alertsRuleModel }))
class DeviceAlertsRule extends PureComponent {
    constructor(props) {
        super(props);
        this.tableColumns = [
            {
                title: '设备编号',
                dataIndex: 'deviceCode',
                key: 'deviceCode'
            },
            {
                title: '设备名称',
                dataIndex: 'deviceName',
                key: 'deviceName',
            },
            {
                title: '设备型号',
                dataIndex: 'deviceModel',
                key: 'deviceModel',
            },
            {
                title: '操作',
                dataIndex: 'cz',
                key: 'cz',
                fixed: 'right',
                width: 200,
                render: (value, row, index) => {
                    return (
                        <div className="table-click">
                            <DeleteModal deleteOk={() => this.deleteRow(row.id)}><a>删除</a></DeleteModal>
                        </div>
                    )
                }
            }
        ];
        const { id } = Utils.parseSearch(this.props.location.search);
        this.state = {
            id,
            visible: false
        }
    }

    componentDidMount() {
        this.getDeviceList();
    }

    getDeviceList = () => {
        this.props.dispatch({ type: 'alertsRuleModel/getDeviceList', ruleId: this.state.id });
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'alertsRuleModel/resetDeviceData' })
    }

    pageChange = e => {
        this.props.dispatch({ type: 'alertsRuleModel/devicePageChange', e })
        this.getDeviceList();
    }

    deleteRow = idList => {
        if (Object.prototype.toString.call(idList) !== '[object Array]') {
            idList = [ idList ]
        }
        ReqApi.post({
            url: Urls.alertsDeviceAdd,
            pm: { idList, ruleId: this.state.id }
        }).then((data) => {
            message.success('删除成功')
            this.getDeviceList();
            this.props.dispatch({ type: 'alertsRuleModel/setSelectedRowKeys', selectedRowKeys: [] })
        })
    }

    selectChange = (selectedRowKeys, selectedRows) => {
        this.props.dispatch({ type: 'alertsRuleModel/setSelectedRowKeys', selectedRowKeys })
    }

    goBack = () => {
        this.props.dispatch(routerRedux.push('/alerts/rule'))
    }

    addRow = () => {
        this.setState({ visible: true })
    }

    modalCancel = () => {
        this.setState({ visible: false })
    }

    render() {
        const { tableLoading, deviceList, deviceCurrent, deviceSelectedRowKeys } = this.props.alertsRuleModel;
        return (
            <div className="baseListStyle">
                <div className="topCon">
                    <span className="previousTitle" onClick={this.goBack}>预警规则</span>
                    <span className="lines">/</span><span className="currentTitle">设备列表</span>
                </div>
                <div className="addRowBtn">
                    <Button type="primary" onClick={() => this.addRow()}>添加</Button>
                    <DeleteModal deleteOk={() => this.deleteRow(deviceSelectedRowKeys)}>
                        <Button type="danger" className="ant-btn-danger" disabled={deviceSelectedRowKeys.length < 1}>删除</Button>
                    </DeleteModal>
                </div>
                <Table
                    rowSelection={{
                        selectedRowKeys: deviceSelectedRowKeys,
                        hideDefaultSelections: true,
                        onChange: (selectedRowKeys, selectedRows) => this.selectChange(selectedRowKeys, selectedRows),
                    }}
                    rowKey={'id'}
                    loading={tableLoading}
                    columns={this.tableColumns}
                    pagination={false}
                    dataSource={deviceList.records}
                    width={'100%'}
                />
                <FooterPagination total={deviceList.total ? deviceList.total : 0} current={deviceCurrent} pageChange={this.pageChange} />
                { this.state.visible && <DeviceModal onCancel={this.modalCancel} ruleId={this.state.id} getDeviceList={this.getDeviceList} /> }
            </div>
        )
    }
}

export default DeviceAlertsRule;
