import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Input, Pagination } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls } from '../../../../base/common';
const { FooterPagination } = Components;
const Search = Input.Search;
@connect(state => ({ equipmentListModel: state.equipmentListModel }))
class ControllerModalComp extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
    this.columns = [{
      title: '控制器编号',
      dataIndex: 'controllerCode',
      key: 'controllerCode',
    }, {
      title: '操作',
      render: (text, record) => <a onClick={() => {
        let _func = this.onController
        typeof _func === 'function' ? _func(record) : null
      }}>选取</a>
    }]
  }
  componentDidMount() {
    this.props.dispatch({ type: 'equipmentListModel/getControllerList' })
  }
  componentWillUnmount() {
    this.props.dispatch({ type: 'equipmentListModel/resetFreeSearch' })
  }
  pageChange = e => {
    this.props.dispatch({ type: 'equipmentListModel/pageChange', payload: e, types: 'controller' })
  }
  onController = (record) => {
    this.props.setVal(record)
    this.props.onCancel()
    // this.props.dispatch({ type: 'equipmentListModel/resetSelectData' })
  }
  handleSearch = (code) => {
    this.props.dispatch({ type: 'equipmentListModel/handleSearch', payload: code, types: 'controller'  })
  }
  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
      },
    };
    const { controllerList } = this.props.equipmentListModel
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
          onSearch={code => this.handleSearch({ code })}
        />
        <Table
          rowKey={'controllerCode'}
          columns={this.columns}
          pagination={false}
          dataSource={controllerList.records || []}
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
          total={controllerList.total}
        />

      </Modal>
    )
  }
}

export default ControllerModalComp