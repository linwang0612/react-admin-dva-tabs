import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Icon } from 'antd';
import menuList from '../base/config/menuList';
import tabsConfig from '../base/config/tabsConfig';

@connect(state => ({ global: state.global }))
class NavLeft extends Component {
    constructor(props) {
        super(props);
    }
    jump(path) {//路由跳转
        this.props.dispatch({ type: 'global/addTabs', path: path })
    }
    renderMenu() {
        const creat = (data, index) => {
            let list = [];
            for (let i = 0; i < data.length; i++) {
                const itemTab = tabsConfig[data[i].path]
                if (data[i].children) {
                    list.push(
                        <Menu.SubMenu
                            key={'' + i}
                            title={<span>{data[i].icon && <Icon type={data[i].icon} />}<span>{itemTab.name}</span></span>}
                        >
                            {creat(data[i].children, i)}
                        </Menu.SubMenu>
                    )
                } else {
                    list.push(
                        <Menu.Item
                            key={index !== undefined ? index + '' + i : '' + i}
                            onClick={() => this.jump(data[i].path)}
                        >
                            {data[i].icon && <Icon type={data[i].icon} />}
                            <span>{itemTab.name}</span>
                        </Menu.Item>
                    )
                }
            }
            return list
        }
        return creat(menuList)
    }
    render() {
        return (
            <React.Fragment>
                <Menu theme="dark" mode="vertical">
                    {this.renderMenu()}
                </Menu>
            </React.Fragment>
        )
    }
}

export default NavLeft
