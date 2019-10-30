import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Input, Pagination } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls } from '../../../../base/common';
const { FooterPagination } = Components;
const Search = Input.Search;
@connect(state => ({ equipmentSpareModel: state.equipmentSpareModel, equipmentListModel: state.equipmentListModel }))
class DeviceModalComp extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
    this.columns = [{
      title: '设备编号',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      render: (text, record) => <a onClick={() => {
        let _func = this.onDevice
        typeof _func === 'function' ? _func(record) : null
      }}>选取</a>
    }]
  }
  componentDidMount() {
    this.props.dispatch({ type: 'equipmentListModel/getBeiTableList' })
  }
  componentWillUnmount() {
    this.props.dispatch({ type: 'equipmentListModel/resetFreeSearch' })
  }
  pageChange = e => {
    this.props.dispatch({ type: 'equipmentListModel/pageChange', payload: e, types: 'bei' })
  }
  onDevice = (record) => {
    this.props.setVal(record)
    this.props.onCancel()
    this.props.dispatch({ type: 'equipmentListModel/resetSelectData' })
  }
  handleSearch = (keywords) => {
    this.props.dispatch({ type: 'equipmentListModel/handleSearch', payload: keywords, types: 'bei' })
  }
  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
      },
    };
    const { beiList } = this.props.equipmentListModel
    return (
      <Modal
        className="distributorModal"
        width={600}
        title={'设备'}
        wrapClassName="vertical-center-modal"
        visible={true}
        footer={null}
        onCancel={this.props.onCancel}
      >
        <Search
          placeholder="请输入设备编号进行查询"
          style={{ width: 294 }}
          className="SearchComp"
          onSearch={keywords => this.handleSearch({ keywords })}
        />
        <Table
          rowKey={'code'}
          columns={this.columns}
          pagination={false}
          dataSource={beiList.records || []}
        />
        <Pagination
          className="_pagination"
          defaultPageSize={5}
          showQuickJumper
          size="small"
          showSizeChanger={false}
          onChange={(page, pageSize) => this.pageChange({ current: page, size: pageSize })}
          defaultCurrent={1}
          showTotal={(total, range) => `为您找到 ${total} 条记录`}
          total={beiList.total}
        />

      </Modal>
    )
  }
}

export default DeviceModalComp