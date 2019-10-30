import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, message } from 'antd';
import Components from '../../../base/components';
import AddEquipmentSpareComp from './AddEquipmentSpare/AddEquipmentSpareComp'
import { ReqApi, Urls } from '../../../base/common';
import './index.scss'
const { SearchMore, FooterPagination, DeleteModal } = Components;
@connect(state => ({ equipmentSpareModel: state.equipmentSpareModel }))
class EquipmentSpare extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,//弹框
      detail: {},
      title: ''
    }

  }

  componentDidMount() {
    this.props.dispatch({ type: 'equipmentSpareModel/getTableList' })
    this.props.dispatch({ type: 'equipmentSpareModel/watchChange' })
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'equipmentSpareModel/resetData' })
  }

  handleSearchForm = (e) => {
    this.props.dispatch({ type: 'equipmentSpareModel/setSearch', payload: e })
  }

  pageChange = e => {
    this.props.dispatch({ type: 'equipmentSpareModel/setCurrent', payload: e })
  }
  deleteRow = (record) => {
    return ReqApi.post({
      url: Urls.deleteEquipmentSpare,
      pm: { id: record.id }
    }).then((data) => {
      message.success('删除成功')
      this.setState({
        detail: {},
        visible: false
      })
      this.props.dispatch({ type: 'equipmentSpareModel/getTableList' })
    })
  }
  openModal = (record) => {
    this.setState({ visible: true, detail: record, title: 'edit' })
  }
  addRow = () => {
    this.setState({ visible: true, detail: {}, title: 'add' })
  }
  onSubmit = (values) => {
    if (values.id) {//编辑
      return ReqApi.post({
        url: Urls.updateEquipmentSpare,
        pm: values
      }).then((data) => {
        message.success('提交成功')
        this.setState({
          detail: {},
          visible: false
        })
        this.props.dispatch({ type: 'equipmentSpareModel/getTableList' })
      })
    } else {//新增
      return ReqApi.post({
        url: Urls.addEquipmentSpare,
        pm: values
      }).then((data) => {
        message.success('提交成功')
        this.setState({
          detail: {},
          visible: false
        })
        this.props.dispatch({ type: 'equipmentSpareModel/getTableList' })
      })
    }
  }
  onCancel = () => {
    this.setState({
      detail: {},
      visible: false
    })
  }
  render() {
    const { tableLoading, listData, current } = this.props.equipmentSpareModel;
    let { detail, visible } = this.state
    const tableColumns = [
      {
        title: '备件编号',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '备件名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '规格型号',
        dataIndex: 'spec',
        key: 'spec',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '生产厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '关联设备',
        dataIndex: 'deviceName',
        key: 'deviceName',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          switch (text + '') {
            case '0':
              return <span><span className="status statusW"></span>未使用</span>
            case '1':
              return <span><span className="status statusY"></span>已使用</span>
            case '2':
              return <span><span className="status statusN"></span>已报废</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        fixed: 'right',
        width: 160,
        render: (value, record, index) => {
          return (
            <div className="table-click">
              {record.status == 2 ? '--' :
                (
                  <div>
                    {record.status != 2 && <a style={{ marginRight: 10 }} onClick={() => this.openModal(record)}>编辑</a>}
                    {record.status == 0 && <DeleteModal deleteOk={() => this.deleteRow(record, index)}><a>删除</a></DeleteModal>}
                  </div>
                )}
            </div>
          )
        }
      }
    ];
    const searchItems = [
      {
        label: '备件编号',
        type: 'Input',
        id: 'code'
      },
      {
        label: '备件名称',
        type: 'Input',
        id: 'name'
      },
      {
        label: '规格型号',
        type: 'Input',
        id: 'spec'
      },
      {
        label: '生产厂商',
        type: 'Input',
        id: 'manufacturer'
      },
      {
        label: '关联设备',
        type: 'Input',
        id: 'deviceName'
      },
      {
        label: '状态',
        type: 'Select',
        enums: [
          { catCode: '', catName: '全部' },
          { catCode: '0', catName: '未使用' },
          { catCode: '1', catName: '已使用' },
          { catCode: '2', catName: '已报废' },
        ],
        id: 'status'
      }
    ]
    return (
      <div className="EquipmentSpare baseListStyle">
        <div className="topCon">
          <span className="currentTitle">备件管理</span>
        </div>
        <div className="headDiv">
          <SearchMore
            searchItems={searchItems}
            onSearch={e => this.handleSearchForm(e)}
            onReset={() => this.handleSearchForm({})}
          />
        </div>
        <div className="addRowBtn">
          <Button type="primary" onClick={this.addRow}><Icon type="plus" />新建</Button>
        </div>
        <Table
          rowKey={'id'}
          loading={tableLoading}
          columns={tableColumns}
          pagination={false}
          dataSource={listData.records}
          width={'100%'}
        />
        <FooterPagination total={listData.total ? listData.total : 0} current={current} pageChange={this.pageChange} />
        {visible && <AddEquipmentSpareComp detail={detail} onSubmit={this.onSubmit} onCancel={this.onCancel} />}
      </div>
    )
  }
}
export default EquipmentSpare
