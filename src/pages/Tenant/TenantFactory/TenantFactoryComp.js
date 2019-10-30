import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, message } from 'antd';
import Components from '../../../base/components';
import { ReqApi, Urls, UserInfo } from '../../../base/common';
import AddTenantFactoryComp from './AddTenantFactory/AddTenantFactoryComp'
import AccountComp from './Account/AccountComp'
// import './index.scss'
const { SearchMore, FooterPagination, DeleteModal } = Components;
@connect(state => ({ tenantFactory: state.tenantFactory }))
class TenantFactoryComp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addVisible: false,
      accountVisible: false,
      detail: {},
      detailAccount: {},
      tenantCode: ''
    }
    this.tableColumns = [
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '公司名称',
        dataIndex: 'name',
        key: 'name',
        render: text => <span title={text}>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</span>
      },
      {
        title: '所在地区',
        dataIndex: 'area',
        key: 'area',
        render: text => <span title={text}>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</span>
      },
      {
        title: '详细地址',
        dataIndex: 'address',
        key: 'address',
        render: text => <span title={text}>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</span>
      },
      {
        title: '状态',
        dataIndex: 'enableFlag',
        key: 'enableFlag',
        render: (text, record) => {
          switch (text) {
            case 0:
              return <span><span className="status statusW"></span>未启用</span>
            case 1:
              return <span><span className="status statusY"></span>已启用</span>
            case 2:
              return <span><span className="status statusN"></span>已禁用</span>
          }
        }
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
              <a style={{ marginRight: 10 }} onClick={() => this.openModal(row, 'update')}>编辑</a>
              {(row.enableFlag == 2 || row.enableFlag == 0) && <a style={{ marginRight: 10 }} onClick={() => this.enable(row)}>启用</a>}
              {row.enableFlag == 1 && <a style={{ marginRight: 10 }} onClick={() => this.disable(row)}>禁用</a>}
              {row.enableFlag != 0 && <a style={{ marginRight: 10 }} onClick={() => this.onAccount(row)}>账号管理</a>}
              {row.enableFlag == 0 && <DeleteModal deleteOk={() => this.deleteRow(row, index)}><a>删除</a></DeleteModal>}
            </div>
          )
        }
      }
    ];
  }

  componentDidMount() {
    this.props.dispatch({ type: 'tenantFactory/getTableList' })
    this.props.dispatch({ type: 'tenantFactory/watchChange' })
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'tenantFactory/resetData' })
  }

  handleSearchForm = (e) => {
    this.props.dispatch({ type: 'tenantFactory/setSearch', payload: e })
  }

  pageChange = e => {
    this.props.dispatch({ type: 'tenantFactory/setCurrent', payload: e })
  }
  openModal = (detail) => {
    this.setState({ addVisible: true, detail: detail })
  }
  //启用
  enable = (row) => {
    ReqApi.post({
      url: Urls.tenantEnable,
      pm: { id: row.id }
    }).then((data) => {
      message.success('启用成功')
      this.props.dispatch({ type: 'tenantFactory/getTableList' })
    })
  }
  //禁用
  disable = (row) => {
    ReqApi.post({
      url: Urls.tenantDisable,
      pm: { id: row.id }
    }).then((data) => {
      message.success('禁用成功')
      this.props.dispatch({ type: 'tenantFactory/getTableList' })
    })
  }
  deleteRow = (record) => {
    return ReqApi.post({
      url: Urls.tenantDelete,
      pm: { id: record.id }
    }).then((data) => {
      message.success('删除成功')
      this.props.dispatch({ type: 'tenantFactory/getTableList' })
    })
  }
  addRow = () => {
    this.setState({ addVisible: true, detail: {} })
  }
  addOnCancel = () => {
    this.setState({ addVisible: false, detail: {} })
  }
  onSubmit = (values) => {
    if (values.id) {//编辑
      return ReqApi.post({
        url: Urls.tenantupdate,
        pm: values
      }).then((data) => {
        message.success('编辑成功')
        this.setState({
          detail: {},
          addVisible: false
        })
        this.props.dispatch({ type: 'tenantFactory/getTableList' })
        this.props.dispatch({ type: 'tenantFactory/resetSelectVal' })
      })
    } else {//新增
      return ReqApi.post({
        url: Urls.tenantadd,
        pm: values
      }).then((data) => {
        message.success('保存成功')
        this.setState({
          detail: {},
          addVisible: false
        })
        this.props.dispatch({ type: 'tenantFactory/getTableList' })
        this.props.dispatch({ type: 'tenantFactory/resetSelectVal' })
      })
    }
  }
  //账号管理-提交
  onSubmitAccount = (values) => {
    if (values.id) {//编辑
      return ReqApi.post({
        url: Urls.tenantAccountUpdate,
        pm: values
      }).then((data) => {
        message.success('编辑成功')
        this.setState({
          detailAccount: {},
          accountVisible: false,
          tenantCode: ''
        })
        this.props.dispatch({ type: 'tenantFactory/getTableList' })
      })
    } else {//新增
      let { tenantCode } = this.state
      return ReqApi.post({
        url: Urls.tenantAccountAdd,
        pm: { ...values, tenantCode: tenantCode }
      }).then((data) => {
        message.success('保存成功')
        this.setState({
          detailAccount: {},
          accountVisible: false,
          tenantCode: ''
        })
        this.props.dispatch({ type: 'tenantFactory/getTableList' })
      })
    }
  }
  onAccount = (row) => {
    return ReqApi.get({
      url: Urls.tenantGetByTenantCode,
      pm: { tenantCode: row.code }
    }).then((data) => {
      this.setState({
        detailAccount: data,
        accountVisible: true,
        tenantCode: row.code
      })
    })
  }
  accountOnCancel = () => {
    this.setState({
      detailAccount: {},
      accountVisible: false,
      tenantCode: ''
    })
  }
  render() {
    const { tableLoading, listData, current } = this.props.tenantFactory;
    const tenantType = UserInfo.getData().tenantType;
    const { addVisible, detail, accountVisible, detailAccount } = this.state
    const searchItems = [
      {
        label: '公司名称',
        type: 'Input',
        id: 'vendorName'
      }
    ]
    return (
      <div className="EquipmentSpare baseListStyle">
        <div className="topCon">
          <span className="currentTitle">冰柜整机厂</span>
        </div>
        <div className="headDiv">
          <SearchMore
            searchItems={searchItems}
            onSearch={e => this.handleSearchForm(e)}
            onReset={() => this.handleSearchForm({})}
          />
        </div>
        {tenantType == 1 ?
          <div className="addRowBtn">
            <Button type="primary" onClick={this.addRow}><Icon type="plus" />新建</Button>
          </div> : null
        }
        <Table
          rowKey={'id'}
          loading={tableLoading}
          columns={this.tableColumns}
          pagination={false}
          dataSource={listData.records}
          width={'100%'}
        />
        <FooterPagination total={listData.total ? listData.total : 0} current={current} pageChange={this.pageChange} />
        {addVisible && <AddTenantFactoryComp detail={detail} onCancel={this.addOnCancel} onSubmit={this.onSubmit} />}
        {accountVisible && <AccountComp detail={detailAccount} onCancel={this.accountOnCancel} onSubmit={this.onSubmitAccount} />}
      </div>
    )
  }
}
export default TenantFactoryComp
