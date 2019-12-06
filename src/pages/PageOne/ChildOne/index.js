import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

@connect(state => ({ global: state.global }))
class ChildOne extends React.Component {
    toBack = () => {
        const param = {
            path: 'children1',
            targetPath: 'page1',
        }
        this.props.dispatch({ type: 'global/addRemoveTabs', ...param })
    }
    render() {
        return (
            <div>
                <h1>Child One</h1>
                <Button onClick={this.toBack}>返回</Button>
            </div>
        )
    }
}

export default ChildOne
