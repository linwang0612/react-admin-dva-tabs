import React from 'react';
import { Progress } from 'antd';
import Components from '../../../base/components';
const { IconFont } = Components

class HeaderIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            countAll: 0,
            countNormal: 0,
            countAbnormal: 0
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const { countStatus } = nextProps;
        if (countStatus && !countStatus.provinceCode) {
            let { countAll, countNormal, countAbnormal } = countStatus;
            return {
                countAll, countNormal, countAbnormal,
            };
        }
        return null;
    }
    render() {
        let { countAll, countNormal, countAbnormal } = this.state;
        let iconStyle = { fontSize: 40, lineHeight: '20px' };
        return (
            <div className="headerIndex">
                <div className="card">
                    <div className="data">
                        <div>
                            <p>实时监控数(台)</p>
                            <h3>{countAll}</h3>
                        </div>
                        <div style={iconStyle}><IconFont type="iconshijijiankongshu" /></div>
                    </div>
                    <Progress percent={100} showInfo={false} strokeColor="#796AEE" />
                </div>
                <div className="card">
                    <div className="data">
                        <div>
                            <p>运转正常数(台)</p>
                            <h3>{countNormal}</h3>
                        </div>
                        <div style={iconStyle}><IconFont type="iconyunzhuanzhengchangshu" /></div>
                    </div>
                    <Progress percent={(countNormal / countAll) * 100} showInfo={false} strokeColor="#23BC08" />
                </div>
                <div className="card">
                    <div className="data">
                        <div>
                            <p>设备异常数(台)</p>
                            <h3>{countAbnormal}</h3>
                        </div>
                        <div style={iconStyle}><IconFont type="iconshebeiyichangshu" /></div>
                    </div>
                    <Progress percent={(countAbnormal / countAll) * 100} showInfo={false} strokeColor="#E52C00" />
                </div>
            </div>
        )
    }
}

export default HeaderIndex
