import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';

@connect(state => ({ global: state.global }))
class PageTwo extends React.Component {
    toPage3 = () => {
        this.props.dispatch({ type: 'global/addTabs', path: 'page3' })
    }
    render() {
        return (
            <div>
                <h1>Page Tow</h1>
                <Button onClick={this.toPage3}>打开页面3</Button>
            </div>
        )
    }
}

export default PageTwo
