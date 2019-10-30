import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Input, Pagination } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls } from '../../../../base/common';
const { FooterPagination } = Components;
const Search = Input.Search;
@connect(state => ({ tenantCustomerModel: state.tenantCustomerModel }))
class DistributorModalComp extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
    this.columns = [{
      title: '编号',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '经销商名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      render: (text, record) => <a onClick={() => {
        let _func = this.onCustomer
        typeof _func === 'function' ? _func(record) : null
      }}>选取</a>
    }]
  }
  componentDidMount() {
    this.props.dispatch({ type: 'tenantCustomerModel/getDistributorList' })
  }
  componentWillUnmount() {
    this.props.dispatch({ type: 'tenantCustomerModel/resetFreeSearch' })
  }
  pageChange = e => {
    this.props.dispatch({ type: 'tenantCustomerModel/pageChange', payload: e })
  }
  onCustomer = (record) => {
    this.props.setVal(record)
    this.props.onCancel()
    this.props.dispatch({ type: 'tenantCustomerModel/resetSelectData' })
  }
  handleSearch = (keywords) => {
    this.props.dispatch({ type: 'tenantCustomerModel/handleSearch', payload: keywords, types: 'bei' })
  }
  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
      },
    };
    const { distributorList } = this.props.tenantCustomerModel
    return (
      <Modal
        className="distributorModal"
        width={600}
        title={'上级经销商'}
        wrapClassName="vertical-center-modal"
        visible={true}
        footer={null}
        onCancel={this.props.onCancel}
      >
        <Search
          placeholder="请输入编号/名称进行查询"
          style={{ width: 294 }}
          className="SearchComp"
          onSearch={keywords => this.handleSearch({ keywords })}
        />
        <Table
          rowKey={'code'}
          columns={this.columns}
          pagination={false}
          dataSource={distributorList.records || []}
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
          total={distributorList.total}
        />

      </Modal>
    )
  }
}

export default DistributorModalComp