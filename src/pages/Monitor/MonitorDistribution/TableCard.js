import React from 'react';
import { Card, List } from 'antd';
import moment from 'moment';
import { ReqApi, Urls } from '../../../base/common';

const clearWindowInter = () => {
    if (window.tableCardTetInerval) {
        clearInterval(window.tableCardTetInerval);
        delete window.tableCardTetInerval
    }
}

class TabbleCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            list: [],
            slice: 0,
            total: 0
        }
    }

    componentDidMount() {
        this.getData()
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.active) !== JSON.stringify(this.props.active)) {
            this.getData()
        }
    }

    componentWillUnmount() {
        clearWindowInter()
    }

    getData = () => {
        const today = moment().format('YYYY-MM-DD');
        ReqApi.get({
            url: Urls.alertsRecordList,
            pm: {
                createDateStart: today + ' 00:00:00',
                createDateEnd: today + ' 23:59:59',
                provinceCode: this.props.active ? this.props.active.code : ''
            }
        }).then((data) => {
            this.setState({
                data: data.records,
                list: data.total > 50 ? data.records.slice(0,50) : data.records,
                slice: data.total > 50 ? 50 : data.total,
                total: data.total
            }, () => {
                this.listBox.scrollTop = 0;
                this.roll()
            })
        })
    }

    roll = () => {
        if (this.state.total * 46 < this.listBox.offsetHeight) {
            return false
        }
        clearWindowInter()
        window.tableCardTetInerval = setInterval(() => {
            this.rollStart()
        }, 50)
        this.listBox.onmouseover = function () {
            clearWindowInter()
        }
        this.listBox.onmouseout = () => {
            this.roll()
        }
    }

    rollStart = () => {
        if (this.listBox) {
            if (this.listBox.scrollTop >= (this.state.list.length * 46 - this.listBox.offsetHeight - 1)) {
                let slice = this.state.slice;
                this.listBox.scrollTop = 0;
                let list = this.state.data.slice(slice, slice + 50);
                if (list.length > 0) {
                    this.setState({
                        list,
                        slice: list.length + slice
                    }, ()=> {
                        this.roll();
                    })
                } else {
                    this.setState({
                        list: this.state.total > 50 ? this.state.data.slice(0,50) : this.state.data,
                        slice: this.state.total > 50 ? 50 : this.state.total,
                    }, ()=> {
                        this.roll();
                    })
                }
            } else {
                this.listBox.scrollTop++;
            }
        }
    }

    render() {
        let boxHeight = this.props.active ? 498 : 181;
        return (
            <Card className="tableCard" title="实时监控预警数据" extra={<div style={{ fontSize: 16 }} >{this.props.active ? this.props.active.name : '全国'}</div>}>
                <div className="title">
                    <span>时间</span>
                    <span>地区</span>
                    <span>设备编号</span>
                    <span>预警</span>
                </div>
                <div ref={e => this.listBox = e} className="listBox" style={{ height: boxHeight }}>
                    <div className="listCont">
                        <List
                            header={false}
                            footer={false}
                            dataSource={this.state.list}
                            renderItem={item => (
                                <List.Item>
                                    <div className="item" style={{ width: '100%' }}>
                                        <span>{item.createDate}</span>
                                        <span>{item.area}</span>
                                        <span>{item.deviceCode}</span>
                                        <span style={{ color: item.info ? '#E52C00' : '#F49505' }}>{`${item.item ? '湿度' : '温度'}${item.info ? '过高' : '过低'}`}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </Card>
        )
    }
}

export default TabbleCard
