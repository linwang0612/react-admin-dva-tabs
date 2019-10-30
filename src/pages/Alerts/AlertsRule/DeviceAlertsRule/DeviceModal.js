import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Input, Pagination, Button } from 'antd';
import { ReqApi, Urls } from '../../../../base/common';
import '../../../Equipment/EquipmentList/index.scss'
const Search = Input.Search;

@connect(state => ({ alertsRuleModel: state.alertsRuleModel }))
class DeviceModal extends PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedRowKeys: [],
            list: [],
            total: 0,
            current: 1,
            keywords: '',
            loading: false,
        }
        this.columns = [{
            title: '设备编码',
            dataIndex: 'code',
            key: 'code',
        }, {
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '设备型号',
            dataIndex: 'model',
            key: 'model',
        }]
    }
    getList = () => {
        ReqApi.get({
            url: Urls.alertsDeviceModal,
            pm: {
                current: this.state.current,
                size: 5,
                keywords: this.state.keywords
            }
        }).then((data) => {
            this.setState({
                list: data.records,
                total: data.total
            })
        })
    }
    componentDidMount() {
        this.getList()
    }
    handleSearch = e => {
        this.setState({ keywords: e.name }, ()=>{
            this.getList()
        })
    }
    pageChange = ({ current }) => {
        this.setState({ current }, ()=> {
            this.getList()
        })
    }
    selectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys })
    }
    onOk = () => {
        this.setState({ loading: true });
        ReqApi.post({
            url: Urls.alertsDeviceAdd,
            pm: {
                deviceCodeList: this.state.selectedRowKeys,
                ruleId: this.props.ruleId
            }
        }).then((data) => {
            this.setState({
                loading: false
            })
            this.props.getDeviceList()
            this.props.onCancel()
        })
    }
    render() {
        return (
            <Modal
                className="distributorModal"
                width={600}
                title={'添加设备'}
                wrapClassName="vertical-center-modal"
                visible={true}
                footer={[
                    <Button key={0} onClick={this.props.onCancel}>取消</Button>,
                    <Button key={1}
                        disabled={this.state.selectedRowKeys.length === 0}
                        onClick={this.onOk}
                        loading={this.state.loading}
                        type="primary"
                    >
                        确定
                    </Button>
                ]}
                onCancel={this.props.onCancel}
            >
                <Search
                    placeholder="请输入设备编号/名称/型号进行查询"
                    style={{ width: 294 }}
                    className="SearchComp"
                    onSearch={name => this.handleSearch({ name })}
                />
                <Table
                    rowSelection={{
                        selectedRowKeys: this.state.selectedRowKeys,
                        hideDefaultSelections: true,
                        onChange: (selectedRowKeys, selectedRows) => this.selectChange(selectedRowKeys, selectedRows),
                    }}
                    rowKey={'code'}
                    columns={this.columns}
                    pagination={false}
                    dataSource={this.state.list || []}
                />
                <Pagination
                    className="_pagination"
                    defaultPageSize={5}
                    showQuickJumper
                    size="small"
                    showSizeChanger={false}
                    onChange={(page, pageSize) => this.pageChange({ current: page, size: pageSize })}
                    defaultCurrent={1}
                    showTotal={(total, range) => <span style={{ position: 'absolute', left: 28 }}>为您找到{total}台设备</span>}
                    total={this.state.total}
                />

            </Modal>
        )
    }
}

export default DeviceModal
