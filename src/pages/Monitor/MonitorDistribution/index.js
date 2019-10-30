import React from 'react';
import { connect } from 'dva';
import { message, List, Input } from 'antd';
import { UserInfo } from '../../../base/common';
import HeaderIndex from './HeaderIndex';
import TabsCard from './TabsCard';
import ChinaMap from './ChinaMap';
import PieCard from './PieCard';
import TableCard from './TableCard';
import BarCard from './BarCard';
import './monitorDistribution.scss';

@connect(state => ({ monitorDistributionModel: state.monitorDistributionModel }))
class MonitorDistribution extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch({ type: 'monitorDistributionModel/getProvinceCount' });
        this.props.dispatch({ type: 'monitorDistributionModel/getCountByStatus' });
    }

    componentWillUnmount() {
        this.props.dispatch({ type: 'monitorDistributionModel/resetData' });
    }

    changeActiveCode = code => {
        this.props.dispatch({ type: 'monitorDistributionModel/setActive', code: code || null });
        this.props.dispatch({ type: 'monitorDistributionModel/getCountByStatus' });
    }

    render() {
        const { provinceCount, active, countStatus } = this.props.monitorDistributionModel;
        return (
            <div className="monitorDistribution baseListStyle">
                <div className="topCon">
                    <span className="currentTitle">数据监控</span>
                </div>
                <HeaderIndex countStatus={countStatus} />
                <TabsCard provinceCount={provinceCount} changeActiveCode={this.changeActiveCode} active={active} />
                <div className="countryData">
                    <ChinaMap provinceCount={provinceCount} active={active} changeActiveCode={this.changeActiveCode} />
                    <div className="linkage">
                        <PieCard countStatus={countStatus} active={active} />
                        <TableCard active={active} />
                        { !active && <BarCard /> }
                    </div>
                </div>
            </div>
        )
    }
}

export default MonitorDistribution
