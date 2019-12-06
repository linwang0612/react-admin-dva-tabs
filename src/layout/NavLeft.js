import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import menuList from '../base/config/menuList';
import tabsConfig from '../base/config/tabsConfig';

@connect(state => ({ global: state.global }))
class NavLeft extends Component {
    constructor(props) {
        super(props);
        this.renderMenu = this.creatMenu()
    }
    jump(path) {//路由跳转
        this.props.dispatch({ type: 'global/addTabs', path: path })
    }
    creatMenu() {
        return menuList.map((item, index) => {
            const itemTab = tabsConfig[item.path]
            return (
                <Menu.Item
                    key={index}
                    onClick={() => this.jump(item.path)}
                >
                    {item.icon ? <Icon type={item.icon} /> : ''}
                    <span>{itemTab.name}</span>
                </Menu.Item>
            )
        })
    }
    render() {
        return (
            <React.Fragment>
                <Menu theme="dark" mode="vertical">
                    {this.renderMenu}
                </Menu>
            </React.Fragment>
        )
    }
}

export default NavLeft
