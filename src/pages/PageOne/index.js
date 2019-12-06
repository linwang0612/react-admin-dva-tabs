import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

@connect(state => ({ global: state.global }))
class PageOne extends React.Component {
    toChild1 = () => {
        this.props.dispatch({ type: 'global/addRemoveTabs', path: 'page1', targetPath: 'children1' })
    }
    toChild2 = () => {
        const param = {
            path: 'page1',
            targetPath: 'children2',
            trans: {
                path: 'children2',
                data: 123
            }
        }
        this.props.dispatch({ type: 'global/addRemoveTabs', ...param })
    }
    render() {
        return (
            <div>
                <h1>Page One</h1>
                <Button onClick={this.toChild1}>切换到内页1</Button>
                <Button onClick={this.toChild2}>切换传数据</Button>
            </div>
        )
    }
}

export default PageOne
