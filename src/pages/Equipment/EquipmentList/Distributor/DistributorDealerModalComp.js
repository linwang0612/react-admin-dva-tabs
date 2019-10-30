import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Modal, Input, Pagination } from 'antd';
import Components from '../../../../base/components';
import { ReqApi, Urls } from '../../../../base/common';
const { FooterPagination } = Components;
const Search = Input.Search;
@connect(state => ({ equipmentListModel: state.equipmentListModel }))
class DistributorDealerModalComp extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
    this.columns = [{
      title: '公司名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '所在地区',
      dataIndex: 'area',
      key: 'area',
    }, {
      title: '操作',
      render: (text, record) => <a onClick={() => {
        let _func = this.onDistribution
        typeof _func === 'function' ? _func(record) : null
      }}>分配</a>
    }]
  }
  componentDidMount() {
    this.props.dispatch({ type: 'equipmentListModel/getDealerPagelist' })
  }
  componentWillUnmount() {
    this.props.dispatch({ type: 'equipmentListModel/resetFreeSearch' })
  }
  pageChange = e => {
    this.props.dispatch({ type: 'equipmentListModel/pageChange', payload: e, types: 'dealer' })
  }
  onDistribution = (record) => {
    const { selectedRowKeys } = this.props.equipmentListModel
    let values = Object.assign({}, { ids: selectedRowKeys, dealerCode: record.code })
    ReqApi.post({
      url: Urls.deviceBatchDistributeDealer,
      pm: values
    }).then((data) => {
      this.props.onCancel()
      this.props.dispatch({ type: 'equipmentListModel/getTableList' })
      this.props.dispatch({ type: 'equipmentListModel/resetSelectData' })
    })
  }
  handleSearch = (name) => {
    this.props.dispatch({ type: 'equipmentListModel/handleSearch', payload: name, types: 'dealer' })
  }
  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows })
      },
    };
    const { dealerPageList } = this.props.equipmentListModel
    return (
      <Modal
        className="distributorModal"
        width={600}
        title={'分配经销商'}
        wrapClassName="vertical-center-modal"
        visible={true}
        footer={null}
        onCancel={this.props.onCancel}
      >
        <Search
          placeholder="请输入公司名称进行查询"
          style={{ width: 294 }}
          className="SearchComp"
          onSearch={name => this.handleSearch({ name })}
        />
        <Table
          rowKey={'code'}
          columns={this.columns}
          pagination={false}
          dataSource={dealerPageList.records || []}
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
          total={dealerPageList.total}
        />

      </Modal>
    )
  }
}

export default DistributorDealerModalComp