import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

@connect(state => ({ global: state.global }))
class ChildTwo extends React.Component {
    toBack = () => {
        const param = {
            path: 'children2',
            targetPath: 'page1',
        }
        this.props.dispatch({ type: 'global/addRemoveTabs', ...param })
    }
    render() {
        const { tabTrans } = this.props.global;
        return (
            <div>
                <h1>Child Two</h1>
                {
                    tabTrans.path === 'children2' &&
                    <h3>传过来的数据：<span>{tabTrans.data}</span></h3>
                }
                <Button onClick={this.toBack}>返回</Button>
            </div>
        )
    }
}

export default ChildTwo
