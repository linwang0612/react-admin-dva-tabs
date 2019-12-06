import React, { lazy, Component } from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd';
import TabsConfig from '../base/config/tabsConfig';

const Home = lazy(() => import('../layout/Index'));
const { TabPane } = Tabs;

@connect(state => ({ global: state.global }))
class AppContent extends Component {
  constructor(props) {
    super(props);
  }

  tabChange = (activeKey) => {
    this.props.dispatch({ type: 'global/setActiveKey', key: activeKey })
  }
  onEdit = (targetKey, action) => {
    this.props.dispatch({ type: 'global/removeTabs', targetKey: targetKey })
  }
  closeOtherTab = () => {
    this.props.dispatch({ type: 'global/closeOtherTab' })
  }
  render() {
    const { tabsList } = this.props.global;
    return (
      <Home>
        <Tabs
          tabBarExtraContent={
            <div className="close-close-other-tab-btn" onClick={this.closeOtherTab}>关闭其他页签</div>
          }
          animated={false}
          hideAdd
          onChange={this.tabChange}
          activeKey={this.props.global.activeKey}
          type="editable-card"
          onEdit={this.onEdit}
        >
          {tabsList.map(item => {
            const itemTab = TabsConfig[item];
            return (
              <TabPane tab={itemTab.name} key={item}>
                {itemTab.component()}
              </TabPane>
            )
          })}
        </Tabs>
      </Home>
    )
  }
}

export default AppContent
