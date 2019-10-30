import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Icon, Button, message, Dropdown, Menu, Modal, Upload, Row, Col, Tag } from 'antd';
import Components from '../../../base/components';
import { ReqApi, Urls, UserInfo } from '../../../base/common';
import { prefixImportexcel } from '../../../base/common/net/UrlsConfig';
import AddAddEquipmentListComp from './AddEquipmentList/AddAddEquipmentListComp'
import DistributorManufacturerModalComp from './Distributor/DistributorManufacturerModalComp'
import DistributorDealerModalComp from './Distributor/DistributorDealerModalComp'
import DistributorEndCustomerModalComp from './Distributor/DistributorEndCustomerModalComp'
import './index.scss'
const { SearchMore, FooterPagination, DeleteModal } = Components;

@connect(state => ({ equipmentListModel: state.equipmentListModel }))
class EquipmentList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,//弹框
      visibleDistributorModal: false,//厂商
      visibleDealerModal: false,//经销商
      visibleEndCustomerModal: false,//终端客户
      visibleImport: false,//设备导入
      detail: {},
      title: '',
      fileList: [],
      fileUrl: '',
      fileName: '',
      step: 1,
      uploadInfo: {},
      id: ''
    }
    this.tableColumns1 = [
      {
        title: '设备编号',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '设备型号',
        dataIndex: 'model',
        key: 'model',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '芯片序列号',
        dataIndex: 'serialNumber',
        key: 'serialNumber'
      },
      {
        title: '冰柜厂商',
        dataIndex: 'freezerManufacturer',
        key: 'freezerManufacturer',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '是否装机',
        dataIndex: 'installed',
        key: 'installed',
        render: (text, record) => {
          switch (text + '') {
            case '0':
              return '--'
            case '1':
              return <span className="fontStatusY">Y</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        fixed: 'right',
        width: 160,
        render: (value, row, index) => {
          return (
            <div className="table-click">
              {row.installed == 1 ? '--' : (
                <div>{row.installed == 0 && <a style={{ marginRight: 10 }} onClick={() => this.openModal(row, 'update')}>编辑</a>}
                  {row.installed == 0 && <DeleteModal deleteOk={() => this.deleteRow(row, index)}><a>删除</a></DeleteModal>}
                </div>
              )}
            </div>
          )
        }
      }
    ];
    this.tableColumns2 = [
      {
        title: '设备编号',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '设备型号',
        dataIndex: 'model',
        key: 'model',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '控制器编号',
        dataIndex: 'controllerCode',
        key: 'controllerCode',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '经销商',
        dataIndex: 'dealer',
        key: 'dealer',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '终端客户',
        dataIndex: 'endCustomer',
        key: 'endCustomer',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => {
          switch (text + '') {
            case '0':
              return <span><span className="status statusN"></span>已禁用</span>
            case '1':
              return <span><span className="status statusY"></span>已启用</span>
          }
        }
      },
      {
        title: '设备状态',
        dataIndex: 'monitorStatus',
        key: 'monitorStatus',
        render: (text, record) => {
          switch (text + '') {
            case '0':
              return <span className="fontStatusN">通讯中断</span>
            case '1':
              return <span className="fontStatusY">通讯正常</span>
            default:
              return <span>--</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        fixed: 'right',
        width: 160,
        render: (value, row, index) => {
          return (
            <div className="table-click">
              <a style={{ marginRight: 10 }} onClick={() => this.openModal(row, 'update')}>编辑</a>
              <DeleteModal deleteOk={() => this.deleteRow(row, index)}><a>删除</a></DeleteModal>
            </div>
          )
        }
      }
    ];
    this.tableColumns3 = [
      {
        title: '设备编号',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '设备型号',
        dataIndex: 'model',
        key: 'model',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '生产厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '终端客户',
        dataIndex: 'endCustomer',
        key: 'endCustomer',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '所在地区',
        dataIndex: 'area',
        key: 'area',
        render: text => <span title={text}>{text && text.length > 12 ? text.substring(0, 12) + '...' : text ? text : '--'}</span>
      },
      {
        title: '设备状态',
        dataIndex: 'monitorStatus',
        key: 'monitorStatus',
        render: (text, record) => {
          switch (text + '') {
            case '0':
              return <span className="fontStatusN">通讯中断</span>
            case '1':
              return <span className="fontStatusY">通讯正常</span>
            default:
              return <span>--</span>
          }
        }
      },
    ];
    this.tableColumns4 = [
      {
        title: '设备编号',
        dataIndex: 'code',
        key: 'code'
      },
      {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '设备别名',
        dataIndex: 'alias',
        key: 'alias'
      },
      {
        title: '设备型号',
        dataIndex: 'model',
        key: 'model',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '生产厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        render: (text, record) => <div>{text ? text : '--'}</div>
      },
      {
        title: '设备状态',
        dataIndex: 'monitorStatus',
        key: 'monitorStatus',
        render: (text, record) => {
          switch (text + '') {
            case '0':
              return <span className="fontStatusN">通讯中断</span>
            case '1':
              return <span className="fontStatusY">通讯正常</span>
            default:
              return <span>--</span>
          }
        }
      },
      {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        fixed: 'right',
        width: 160,
        render: (value, row, index) => {
          return (
            <div className="table-click">
              <a style={{ marginRight: 10 }} onClick={() => this.openModal(row, 'update')}>编辑</a>
            </div>
          )
        }
      }
    ];
    this.searchItems1 = [
      {
        label: '设备编号',
        type: 'Input',
        id: 'code'
      },
      {
        label: '设备名称',
        type: 'Input',
        id: 'name'
      },
      {
        label: '设备型号',
        type: 'Input',
        id: 'model'
      },
      {
        label: '芯片序列号',
        type: 'Input',
        id: 'serialNumber'
      },
      {
        label: '冰柜整机厂',
        type: 'Input',
        id: 'freezerManufacturer'
      }
    ];
    this.searchItems2 = [
      {
        label: '设备编号',
        type: 'Input',
        id: 'code'
      },
      {
        label: '设备名称',
        type: 'Input',
        id: 'name'
      },
      {
        label: '设备型号',
        type: 'Input',
        id: 'model'
      },
      {
        label: '控制器编号',
        type: 'Input',
        id: 'controllerCode'
      },
      {
        label: '经销商',
        type: 'Input',
        id: 'dealer'
      },
      {
        label: '终端客户',
        type: 'Input',
        id: 'endCustomer'
      }
    ];
    this.searchItems3 = [
      {
        label: '设备编号',
        type: 'Input',
        id: 'code'
      },
      {
        label: '设备名称',
        type: 'Input',
        id: 'name'
      },
      {
        label: '设备型号',
        type: 'Input',
        id: 'model'
      },
      {
        label: '生产厂商',
        type: 'Input',
        id: 'freezerManufacturer'
      },
      {
        label: '终端客户',
        type: 'Input',
        id: 'endCustomer'
      },
      {
        label: '所在地区',
        type: 'AddrOptions',
        id: 'freezerManufacturer',
        props: {
          isCity: false,
          selectChange: (options) => this.addrOptionsChange(options)
        }
      },
    ];
    this.searchItems4 = [
      {
        label: '设备编号',
        type: 'Input',
        id: 'code'
      },
      {
        label: '设备名称',
        type: 'Input',
        id: 'name'
      },
      {
        label: '设备型号',
        type: 'Input',
        id: 'model'
      },
      {
        label: '生产厂商',
        type: 'Input',
        id: 'freezerManufacturer'
      },
      {
        label: '设备别名',
        type: 'Input',
        id: 'alias'
      }
    ]
  }

  componentDidMount() {
    this.props.dispatch({ type: 'equipmentListModel/getTableList' })
    this.props.dispatch({ type: 'equipmentListModel/watchChange' })
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'equipmentListModel/resetData' })
  }
  addrOptionsChange = options => {
    this.props.dispatch({ type: 'equipmentListModel/setSelectVal', provinceCode: options.length > 0 && options[0].value, cityCode: options.length > 1 && options[1].value, countyCode: options.length > 2 && options[2].value })
  }
  handleSearchForm = (e) => {
    if (e == 'reset') {
      this.props.dispatch({ type: 'equipmentListModel/resetSelectVal' })
      // console.log(this.searchCon)
    }
    this.props.dispatch({ type: 'equipmentListModel/setSearch', payload: e })
  }

  pageChange = e => {
    this.props.dispatch({ type: 'equipmentListModel/setCurrent', payload: e })
  }
  onCancel = () => {
    this.setState({
      detail: {},
      visible: false
    })
  }
  deleteRow = (record) => {
    return ReqApi.get({
      url: Urls.deviceDelete,
      pm: { id: record.id }
    }).then((data) => {
      message.success('删除成功')
      this.setState({
        detail: {},
        visible: false
      })
      this.props.dispatch({ type: 'equipmentListModel/getTableList' })
    })
  }
  openModal = (record) => {
    this.setState({ visible: true, detail: record })
  }
  addRow = () => {
    this.setState({ visible: true })
  }
  onSubmit = (values) => {
    if (values.id) {//编辑
      return ReqApi.post({
        url: Urls.deviceUpdate,
        pm: values
      }).then((data) => {
        message.success('编辑成功')
        this.setState({
          detail: {},
          visible: false
        })
        this.props.dispatch({ type: 'equipmentListModel/getTableList' })
      })
    } else {//新增
      return ReqApi.post({
        url: Urls.deviceAdd,
        pm: values
      }).then((data) => {
        message.success('保存成功')
        this.setState({
          detail: {},
          visible: false
        })
        this.props.dispatch({ type: 'equipmentListModel/getTableList' })
      })
    }
  }
  onChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch({ type: 'equipmentListModel/onSelectChange', selectedRowKeys: selectedRowKeys, selectedRows: selectedRows })
  }
  handleMenuClick = (e) => {
    const { selectedRowKeys } = this.props.equipmentListModel;
    if (selectedRowKeys.length > 0) {
      if (e.key == 1) {//分配厂商
        this.setState({ visibleDistributorModal: true })
      } else if (e.key == 3) {//分配经销商
        this.setState({ visibleDealerModal: true })
      } else if (e.key == 4) {//终端客户
        this.setState({ visibleEndCustomerModal: true })
      } else if (e.key == 2) {//批量删除
        ReqApi.post({
          url: Urls.deviceBatchDelete,
          pm: { ids: selectedRowKeys }
        }).then((data) => {
          message.success('批量删除成功')
          this.props.dispatch({ type: 'equipmentListModel/getTableList' })
          this.props.dispatch({ type: 'equipmentListModel/resetSelectData' })
        })
      } else if (e.key == 5) {//批量启用
        ReqApi.post({
          url: Urls.deviceBatchEnable,
          pm: { ids: selectedRowKeys }
        }).then((data) => {
          message.success('批量启用成功')
          this.props.dispatch({ type: 'equipmentListModel/getTableList' })
          this.props.dispatch({ type: 'equipmentListModel/resetSelectData' })
        })
      } else if (e.key == 6) {//批量禁用
        ReqApi.post({
          url: Urls.deviceBatchDisable,
          pm: { ids: selectedRowKeys }
        }).then((data) => {
          message.success('批量禁用成功')
          this.props.dispatch({ type: 'equipmentListModel/getTableList' })
          this.props.dispatch({ type: 'equipmentListModel/resetSelectData' })
        })
      }
    } else {
      message.info('请选择数据')
    }

  }
  onCancelDistributor = () => {
    this.setState({ visibleDistributorModal: false })
  }
  onCancelDealer = () => {
    this.setState({ visibleDealerModal: false })
  }
  onCancelEndCustomer = () => {
    this.setState({ visibleEndCustomerModal: false })
  }
  getColumns = () => {
    const tenantType = UserInfo.getData().tenantType;
    switch (tenantType) {
      case 1:
        return this.tableColumns1
      case 2:
        return this.tableColumns2
      case 3:
        return this.tableColumns3
      case 4:
        return this.tableColumns4
    }
  }
  getSearchItems = () => {
    const tenantType = UserInfo.getData().tenantType;
    switch (tenantType) {
      case 1:
        return this.searchItems1
      case 2:
        return this.searchItems2
      case 3:
        return this.searchItems3
      case 4:
        return this.searchItems4
    }
  }
  onImport = () => {
    this.setState({ visibleImport: true })
  }
  handleImportCancel = () => {
    this.setState({
      visible: false,
      step: 1,
      fileList: [],
      importedExcel: true,
      importLoading: false,
      visibleImport: false
    })
  }

  handleImportOk = () => {
    let id = this.state.id;
    ReqApi.post({
      url: Urls.deviceImportExcel,
      pm: { id: id }
    }).then((res) => {
      // message.success(res.message[0].msg)
      this.setState({
        step: 2,
        importLoading: false,
        uploadInfo: res,
        fileList: [],
        importedExcel: true,
      })
      // 更新数据
      this.props.dispatch({ type: 'equipmentListModel/getTableList' })
    }).catch(error => {
      console.log('error----', error)
      // if (error.status == 6001) {
      //   let src = error.data.errorFileUrl
      //   Modal.error({
      //     title: '设备导入',
      //     content: (
      //       <Row>
      //         <Col style={{ marginBottom: 15 }}>
      //           {name && <span style={{ marginRight: 15 }}>{name}</span>}
      //           <span style={{ color: 'red' }}>校验失败</span>
      //         </Col>
      //         <Col>
      //           <span>查看错误日志：</span>
      //           <Tag color="blue">
      //             <a href={src} download={name}>
      //               <Row gutter={5} type="flex" align="middle">
      //                 <Col><Icon type={src ? 'paper-clip' : 'disconnect'} style={{ display: 'block' }} /></Col>
      //                 <Col>{name ? name : '无源文件'}</Col>
      //               </Row>
      //             </a>
      //           </Tag>
      //         </Col>
      //       </Row>
      //     ),
      //   });
      // } else if (error.status == 6000) {
      //   message.error(error.data.errorMessage || '校验失败')
      // }
    })
  }
  render() {
    const { tableLoading, listData, current, selectedRowKeys } = this.props.equipmentListModel;
    const { visible, detail, visibleDistributorModal, visibleDealerModal, visibleEndCustomerModal, visibleImport } = this.state
    const tenantType = UserInfo.getData().tenantType;
    let rowSelection = {};
    if (tenantType == 1 || tenantType == 2) {
      rowSelection.rowSelection = {
        selectedRowKeys: selectedRowKeys,
        hideDefaultSelections: true,
        onChange: (selectedRowKeys, selectedRows) => this.onChange(selectedRowKeys, selectedRows),
        getCheckboxProps: (record) => ({
          disabled: listData.records.some(item => record.installed === 1),
        }),
      }
    }
    const uploadProps = {
      name: 'file',
      action: '/cem/file/uploadFile',
      accept: '.xls,.xlsx',
      headers: {
        authorization: 'authorization-text',
        tokenId: UserInfo.getTokenId(),
      },
      data: {
        module: 'importexcle',
      },
      onChange: (info) => {
        let fileList = info.fileList;
        fileList = fileList.slice(-1);
        fileList = fileList.map((file) => {
          if (file.response) {
            file.url = file.response.data.address;
          }
          return file;
        });
        fileList = fileList.filter((file) => {
          if (file.response) {
            return file.response.code === 2000;
          }
          return true;
        });
        this.setState({ fileList });
        if (info.file.status === 'done') {
          this.setState({
            fileUrl: info.file.response.data.address,
            fileId: Number(info.file.response.data.id),
            fileName: info.file.response.data.name,
            id: Number(info.file.response.data.id),
          });
        }
        else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    }
    let btnStatus = false;
    if (this.state.fileList && this.state.fileList.length != 0) {
      btnStatus = true;
    }
    return (
      <div className="EquipmentList baseListStyle">
        <div className="topCon">
          <span className="currentTitle">设备列表</span>
        </div>
        <div className="headDiv">
          <SearchMore
            ref={e => this.searchCon = e}
            searchItems={this.getSearchItems()}
            onSearch={e => this.handleSearchForm(e)}
            onReset={() => this.handleSearchForm('reset')}
          />
        </div>
        {(tenantType == 3 || tenantType == 4) &&
          <div style={{ height: 24 }} />
        }
        {(tenantType == 1 || tenantType == 2) ?
          <div className="addRowBtn">
            <Button type="primary" onClick={this.addRow}><Icon type="plus" />新建</Button>
            <Button onClick={this.onImport}>导入</Button>
            <Dropdown overlay={
              <Menu onClick={this.handleMenuClick}>
                {tenantType == 1 && <Menu.Item key="1">分配厂商</Menu.Item>}
                {tenantType == 2 && <Menu.Item key="3">分配经销商</Menu.Item>}
                {tenantType == 2 && <Menu.Item key="4">分配终端客户</Menu.Item>}
                {tenantType == 2 && <Menu.Item key="5">批量启用</Menu.Item>}
                {tenantType == 2 && <Menu.Item key="6">批量禁用</Menu.Item>}
                <Menu.Item key="2">批量删除</Menu.Item>
              </Menu>
            }>
              <Button>
                批量操作 <Icon type="down" />
              </Button>
            </Dropdown>
          </div> : null
        }
        <Table
          rowKey={'id'}
          loading={tableLoading}
          columns={this.getColumns()}
          pagination={false}
          dataSource={listData.records}
          width={'100%'}
          {...rowSelection}
        />
        <FooterPagination total={listData.total ? listData.total : 0} current={current} pageChange={this.pageChange} />
        {visible && <AddAddEquipmentListComp detail={detail} onSubmit={this.onSubmit} onCancel={this.onCancel} />}
        {visibleDistributorModal && <DistributorManufacturerModalComp onCancel={this.onCancelDistributor} />}
        {visibleDealerModal && <DistributorDealerModalComp onCancel={this.onCancelDealer} />}
        {visibleEndCustomerModal && <DistributorEndCustomerModalComp onCancel={this.onCancelEndCustomer} />}
        <Modal
          visible={visibleImport}
          title="设备导入"
          width={413}
          onOk={this.handleImportOk}
          onCancel={this.handleImportCancel}
          className="devicelModal"
          footer={null}
        >
          {/* {this.renderNav()} */}
          <div className={this.state.step == 1 ? "step step-1 show" : "step step-1"}>
            <div className="uploads" style={{ marginTop: 20 }}>
              <Upload {...uploadProps} fileList={this.state.fileList} className={btnStatus ? "avatar-uploader hidden" : "avatar-uploader"}>
                <Button><Icon type="upload" /> 点击上传</Button>
              </Upload>
            </div>
            <p className="templateDownload" style={{ marginTop: 20 }}>请您使用《设备导入模板》&nbsp;上传数据&nbsp;
            {tenantType == 1 && <a className="link" href={prefixImportexcel + '控制器设备导入模板.xls'} download="控制器设备导入模板.xls">下载模板</a>}
              {tenantType == 2 && <a className="link" href={prefixImportexcel + '冰柜设备导入模板.xls'} download="冰柜设备导入模板.xls">下载模板</a>}
            </p>
          </div>
          <div className={this.state.step == 2 ? "step step-2 show" : "step step-2"}>
            <div className="result">
              {
                <div className="success">
                  <span className="text">成功导入&nbsp;<span className="count">{this.state.uploadInfo.successNum}</span>&nbsp;条数据</span>
                  {/* <a className="link" href="javascript:;" onClick={this.toAppointPage.bind(this, 'inventoryInstantInventory')}>前往查看库存 》</a> */}
                </div>
              }
              {
                (this.state.uploadInfo.failNum && this.state.uploadInfo.failNum != 0) ?
                  <div className="err">
                    <span className="text">导入失败&nbsp;<span className="count">{this.state.uploadInfo.failNum}</span>&nbsp;条数据</span>
                    <a className="link" href={`/cem/file/downloadFile?&id=${this.state.uploadInfo.errorFileId}&tokenId=${UserInfo.getTokenId()}`} >下载错误日志 》</a>
                  </div> : null
              }
            </div>
          </div>
          <div className="footer">
            {this.state.step == 1 && <div>
              <Button onClick={this.handleImportCancel}>取消</Button>
              <Button type="primary" className="upload-demo-start" disabled={this.state.fileList.length === 0} onClick={this.handleImportOk}>开始导入</Button>
            </div>}
            {this.state.step == 2 && <Button onClick={this.handleImportCancel}>关闭</Button>}
          </div>
        </Modal>
      </div>
    )
  }
}

export default EquipmentList;
