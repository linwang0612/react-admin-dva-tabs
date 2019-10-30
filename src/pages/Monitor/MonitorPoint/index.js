import React from 'react';
import BMap from 'BMap';
import BMap_Symbol_SHAPE_CIRCLE from 'BMap_Symbol_SHAPE_CIRCLE';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { message, List, Input, Spin } from 'antd';
import Components from '../../../base/components';
import { UserInfo } from '../../../base/common';
import './monitorPoint.scss';

@connect(state => ({ monitorPointModel: state.monitorPointModel, monitorDataModel: state.monitorDataModel }))
class MonitorPoint extends React.Component {
    constructor(props) {
        super(props);
        const { provinceCode = '', cityCode = '', countyCode = '' } = UserInfo.getData()
        this.addrDefaultValue = [provinceCode, cityCode, countyCode];
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.initMap();
        setTimeout(() => {
            this.setState({
                loading: false
            })
        }, 800)
    }

    componentWillUnmount() {
        this.map.removeEventListener('zoomend', e => this.zoomChange(e))
    }

    initMap = () => {
        //公共
        this.map = new BMap.Map(this.mapCont, { minZoom: 9, maxZoom: 16 });
        this.myGeo = new BMap.Geocoder();
        this.iconMouseover = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
            scale: 50,
            fillColor: '#277bf9',
            fillOpacity: 0.9,
            strokeColor: '#555',
            strokeWeight: 1//线宽
        })
        this.iconMouseout = new BMap.Symbol(BMap_Symbol_SHAPE_CIRCLE, {
            scale: 50,
            fillColor: '#faa727',
            fillOpacity: 0.9,
            strokeColor: '#555',
            strokeWeight: 1//线宽
        })

        this.map.enableScrollWheelZoom(true);
        this.map.addEventListener('zoomend', e => this.zoomChange(e))
        //初始位置的数据加载
        this.getCityCount(this.addrDefaultValue[0], this.addrDefaultValue[1])

        if (!this.addrDefaultValue[0] || !this.addrDefaultValue[1]) {
            const nowCity = new BMap.LocalCity();
            nowCity.get(result => {
                let name = result.name || '北京';
                this.callCityName(name)
            });
        }
    }

    callCityName = name => {
        this.myGeo.getPoint(name, point => {
            if (point) {
                this.map.centerAndZoom(point, 11);
            } else {
                message.error('您选择地址没有解析到结果!');
            }
        });
    }

    zoomChange = e => {
        const zoom = this.map.getZoom();
        const { countList, countActive } = this.props.monitorPointModel;
        if (countActive && zoom < 13 && countList.length > 0) {
            this.addOverlay(countList, 1)
            this.props.dispatch({ type: 'monitorPointModel/setActive', item: null });
        }
    }

    addrOptionsChange = options => {
        if (options.length < 2) {
            return false
        }
        //1.缩放移动到当前市区
        // eslint-disable-next-line consistent-this
        const selectCity = options[options.length - 1].label;
        this.callCityName(selectCity)
        //2.获取区域统计
        this.getCityCount(options[0].value, options[1].value)
    }

    getCityCount = (provinceCode, cityCode) => {
        this.props.dispatch({
            type: 'monitorPointModel/getCount', provinceCode, cityCode, callback: res => {
                this.addOverlay(res, 1)
            }
        });
    }

    addOverlay = (data, type) => {
        this.map.clearOverlays();
        if (type) {
            this.createCircleMaker(data)
        } else {
            this.createPointMaker(data)
        }
    }

    createCircleMaker = data => {
        data.forEach(item => {
            this.myGeo.getPoint(item.countyName, (point) => {
                if (point) {
                    const labelText = `<div>${item.countyName}</div><div>${item.number} 台</div>`;
                    const label = new BMap.Label(labelText, {
                        offset: new BMap.Size(30, 30)
                    });
                    label.setStyle({ color: '#fff', fontSize: '14px', background: 'transparent', border: 'none' });
                    const marker = new BMap.Marker(point, { icon: this.iconMouseover });
                    marker.setLabel(label);

                    marker.addEventListener('mouseover', () => marker.setIcon(this.iconMouseout));
                    marker.addEventListener('mouseout', () => marker.setIcon(this.iconMouseover));
                    marker.addEventListener('click', () => this.circleClick(item, point));
                    this.map.addOverlay(marker)
                } else {
                    message.error(item.countyName + '没有解析到地图坐标!');
                }
            });
        })
    }

    circleClick = (item, point) => {
        this.map.centerAndZoom(point, 13);
        this.props.dispatch({ type: 'monitorPointModel/setActive', item });
        const { provinceCode, cityCode } = this.props.monitorPointModel;
        this.props.dispatch({
            type: 'monitorPointModel/getList', provinceCode, cityCode, countyCode: item.countyCode, callback: res => {
                this.addOverlay(res, 0)
            }
        })
    }

    createPointMaker = data => {
        data.forEach((item, index) => {
            const labelText = `<div>${item.endCustomerName} ${item.number} 台</div><div>${item.detailAddress}</div>`;
            const label = new BMap.Label(labelText, {
                offset: new BMap.Size(20, 10)
            });
            const marker = new BMap.Marker(new BMap.Point(item.longitude, item.latitude));
            marker.setLabel(label);
            marker.addEventListener('click', () => this.pointClick(item));
            this.map.addOverlay(marker)
        })
    }

    pointClick = item => {
        const { provinceCode, cityCode, countActive } = this.props.monitorPointModel;
        this.props.dispatch({ type: 'monitorDataModel/setAddrLinkValue', value: [provinceCode, cityCode, countActive.countyCode] });
        this.props.dispatch({ type: 'monitorDataModel/setLinkActiveCode', code: item.endCustomerCode });
        this.props.dispatch(routerRedux.push('/monitor/data'))
    }

    onSearch = value => {
        this.props.dispatch({ type: 'monitorPointModel/setSearch', search: value });
    }

    pointSelected = item => {
        this.map.centerAndZoom(new BMap.Point(item.longitude, item.latitude), 15);
    }

    mapMenuCont = pointList => {
        const { search } = this.props.monitorPointModel;
        if (search) {
            pointList = pointList.filter(item => item.endCustomerName.indexOf(search) > -1)
        }
        return (
            <div className="mapMenuCont">
                <div className="search">
                    <Input.Search
                        placeholder="请输入终端客户名称"
                        onSearch={value => this.onSearch(value)}
                    />
                </div>
                <List
                    size="small"
                    className="listCont"
                    header={false}
                    footer={false}
                    dataSource={pointList}
                    renderItem={item => {
                        return (
                            <List.Item>
                                <div title={item.endCustomerName} className="menuItem"
                                    onClick={() => this.pointSelected(item)}
                                >
                                    <label>{item.endCustomerName}</label>
                                    <span>{item.number} 台</span>
                                </div>
                            </List.Item>
                        )
                    }}
                />
            </div>
        )
    }

    render() {
        const { countActive, pointList } = this.props.monitorPointModel;
        return (
            <div className="monitorPoint baseListStyle">
                <div className="topCon">
                    <span className="currentTitle">地图位置</span>
                </div>
                {countActive && this.mapMenuCont(pointList)}
                <div className="addrOption" >
                    地区选择 <Components.AddrOptions
                        selectChange={this.addrOptionsChange} isCity={true}
                        value={this.addrDefaultValue}
                        callCityName={this.callCityName}
                    />
                </div>
                <Spin className="mapLoading" spinning={this.state.loading} size="large" tip="地图加载中...">
                    <div style={{ height: window.innerHeight - 164, minHeight: 500 }} className="mapCont" ref={e => this.mapCont = e} />
                </Spin>
            </div>
        )
    }
}

export default MonitorPoint
