import React from 'react';
import { Input, List, Button } from 'antd';
import { connect } from 'dva';
import Components from '../../../base/components';
import DeviceCard from './DeviceCard';
import { UserInfo } from '../../../base/common';
import './monitorData.scss';

@connect(state => ({ monitorDataModel: state.monitorDataModel }))
class MonitorData extends React.Component {
    constructor(props) {
        super(props);
        const { tenantType } = UserInfo.getData()
        this.tenantType = tenantType;
    }

    componentDidMount() {
        if (this.tenantType < 4) {
            //加载页面后判断，如果是从地图位置页面跳转过来，会携带addrLinkValue, linkActiveCode
            let { addrLinkValue, linkActiveCode } = this.props.monitorDataModel;
            let pm = {}
            if (addrLinkValue) {
                pm = {
                    provinceCode: addrLinkValue[0],
                    cityCode: addrLinkValue[1],
                    countyCode: addrLinkValue[2]
                }
            }
            this.getMenuList(pm);

            //非终端客户才有地图跳转
            if (linkActiveCode) {
                setTimeout(() => {
                    const { menuList } = this.props.monitorDataModel;
                    for (let i = 0; i < menuList.length; i++) {
                        if (menuList[i].code === linkActiveCode) {
                            this.selected(menuList[i])
                            break;
                        }
                    }
                }, 1000)
                return false
            }
        }
        this.props.dispatch({ type: 'monitorDataModel/getDeviceListInit' })
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'monitorDataModel/resetData' })
    }

    getMenuList = ({ provinceCode = '', cityCode = '', countyCode = '' }) => {
        this.props.dispatch({ type: 'monitorDataModel/getMenuList', provinceCode, cityCode, countyCode })
    }

    addrOptionsChange = options => {
        if (options.length !== 1) {
            let pm = {};
            if (options.length === 2) {
                pm = {
                    provinceCode: options[0].value,
                    cityCode: options[1].value,
                };
            }
            if (options.length > 2) {
                pm.countyCode = options[2].value
            }
            this.getMenuList(pm)
            this.props.dispatch({ type: 'monitorDataModel/setMenuActive', item: null })
            this.props.dispatch({ type: 'monitorDataModel/setCardList', resdata: { records: [] } })
        }
    }

    onSearch = value => {
        this.props.dispatch({ type: 'monitorDataModel/setSearch', search: value })
    }

    selected = item => {
        this.props.dispatch({ type: 'monitorDataModel/setMenuActive', item })
        this.props.dispatch({ type: 'monitorDataModel/getDeviceListInit', endCode: item.code })
    }

    onLoadMore = () => {
        this.props.dispatch({ type: 'monitorDataModel/getDeviceListMore' })
    }

    menuCont = () => {
        let { menuList = [], search, menuActive } = this.props.monitorDataModel;
        if (search) {
            menuList = menuList.filter(item => item.name.indexOf(search) > -1)
        }
        return (
            <List
                size="small"
                className="menuCont"
                header={false}
                footer={false}
                dataSource={menuList}
                renderItem={item => {
                    return (
                        <List.Item>
                            <div title={item.name} className={`menuItem ${menuActive && menuActive.code === item.code ? 'active' : ''}`}
                                onClick={() => this.selected(item)}>
                                <label>{item.name}</label>
                                <span>({item.deviceAmount})</span>
                            </div>
                        </List.Item>
                    )
                }}
            />
        )
    }

    deviceCont = () => {
        const { menuActive, cardList = [], loadingMore, initLoading } = this.props.monitorDataModel;
        let loadMore = loadingMore ?
            (<div
                style={{
                    textAlign: 'center',
                    marginTop: 5,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={this.onLoadMore}>加载更多</Button>
            </div>)
            : null
        let title = menuActive ?
            <div className="deviceHeader">
                <div className="title">{menuActive.name}<span>{menuActive.address}</span></div>
                <div className="extra">设备有<span>{menuActive.deviceAmount}</span>台</div>
            </div>
            : <div />
        return (
            <List
                className={`device ${this.tenantType === 4 ? 'deviceBox' : ''}`}
                grid={{
                    gutter: 40,
                    xs: 2,
                    sm: 2,
                    md: 2,
                    lg: 2,
                    xl: 2,
                    xxl: 3,
                }}
                dataSource={cardList}
                header={this.tenantType < 4 ? title : false}
                loadMore={loadMore}
                loading={initLoading}
                renderItem={item => (
                    <List.Item>
                        <DeviceCard {...item} />
                    </List.Item>
                )}
            />
        )
    }
    render() {
        let { addrLinkValue } = this.props.monitorDataModel;
        return (
            <div className="monitorData baseListStyle">
                <div className="topCon">
                    <span className="currentTitle">数据监控</span>
                </div>
                {
                    this.tenantType < 4 ?
                        <div className="addrOption" >
                            地区选择 <Components.AddrOptions
                                selectChange={this.addrOptionsChange}
                                value={addrLinkValue ? addrLinkValue : null}
                            />
                        </div>
                        : <div style={{ height: 24 }} />
                }
                <div className="dataCont">
                    {
                        this.tenantType < 4 &&
                        <div className="menu">
                            <div className="search">
                                <Input.Search
                                    placeholder="请输入终端客户名称"
                                    onSearch={value => this.onSearch(value)}
                                />
                            </div>
                            {this.menuCont()}
                        </div>
                    }

                    {this.deviceCont()}
                </div>
            </div>
        )
    }
}

export default MonitorData
