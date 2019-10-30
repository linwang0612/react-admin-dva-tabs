import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import { routerRedux } from 'dva/router';
import menuDate from '../router/menuDate';
import { UserInfo } from '../base/common';

const { SubMenu } = Menu;
@connect(state => ({ global: state.global }))
class NavLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openKeys: []
        };
        this.renderMenu = this.creatMenu()
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        let select = nextProps.global.selectedMenuKeys;
        if (Object.prototype.toString.call(select) === '[object Array]') {
            select = select[select.length - 1];
            if (select !== prevState.openKeys[0]) {
                return {
                    openKeys: [select]
                }
            }
        }
        return null;
    }
    jump(path, keyPath) {//路由跳转
        this.props.dispatch(routerRedux.push(path))
        const selectedKeysStr = keyPath.keyPath[0]
        const newList = [];
        for (var nI = 0; nI < selectedKeysStr.length - 1; nI++) {
            newList.push(selectedKeysStr.substr(0, nI + 1))
        }
        this.setState({
            openKeys: newList
        })
    }
    changeOpen(openKeys) {//点击SubMenu回调
        this.setState({
            openKeys: openKeys
        })
    }
    creatMenu() {
        const tenantType = UserInfo.getData().tenantType;
        const _this = this;
        function creatMenuf(data, index) {
            let list = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].show && !data[i].show.includes(tenantType)) {
                    continue;
                } else {
                    if (data[i].children) {
                        list.push(
                            <SubMenu
                                key={'' + i}
                                title={<span>{data[i].icon ? <Icon type={data[i].icon} /> : ''}<span>{data[i].name}</span></span>}
                            >
                                {creatMenuf(data[i].children, i)}
                            </SubMenu>
                        )
                    } else {
                        list.push(
                            <Menu.Item
                                key={index !== undefined ? index + '' + i : '' + i}
                                onClick={(keyPath) => _this.jump(data[i].path, keyPath)}
                            >
                                {data[i].icon ? <Icon type={data[i].icon} /> : ''}<span>{data[i].name}</span>
                            </Menu.Item>
                        )
                    }
                }
            }
            return list
        }
        return creatMenuf(menuDate)
    }
    render() {
        return (
            <React.Fragment>
                <Menu theme="light" mode="inline"
                    defaultSelectedKeys={this.props.global.selectedMenuKeys}
                    defaultOpenKeys={this.state.openKeys}
                    onOpenChange={(openKeys) => this.changeOpen(openKeys)}
                >
                    {this.renderMenu}
                </Menu>
            </React.Fragment>
        )
    }
}

export default NavLeft
