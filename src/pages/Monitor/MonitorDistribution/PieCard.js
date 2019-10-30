import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/pie';
import { Card } from 'antd';

class PieCard extends React.PureComponent {
    componentDidMount() {
        this.initCharts()
    }

    componentWillUnmount() {
        window.removeEventListener('resize',() => {
            this.myChart.resize()
        });
    }

    initCharts() {
        this.myChart = echarts.init(this.chart);
        this.myChart.setOption({
            color: ['#e52c00', '#4985FF'],
            grid: {
                containLabel: true
            },
            series: [
                {
                    name: '设备',
                    type: 'pie',
                    radius: '73%',
                    center: ['45%', '50%'],
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            formatter: '{b}, {d}%',
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontWeight: 'bold'
                            }
                        }
                    },
                }
            ]
        })

        window.addEventListener(
            'resize', () => {
                this.myChart.resize()
            },false
        );
    }

    componentDidUpdate(prevProps) {
        let { countStatus } = this.props;
        if (countStatus) {
        let option = this.myChart.getOption();
        option.series[0].data = [
            {
                name: '发生预警',
                value: countStatus.countAbnormal
            },
            {
                name: '运转正常',
                value: countStatus.countNormal
            }
        ];
        this.myChart.setOption(option);
        }
    }

    render() {
        let countAll = 0, countNormal = 0, countAbnormal = 0;
        if (this.props.countStatus) {
            let { countStatus } = this.props;
            countAll = countStatus.countAll;
            countNormal = countStatus.countNormal;
            countAbnormal = countStatus.countAbnormal;
        }
        return (
            <Card className="pieCard" title="当前设备运转情况" extra={<div style={{ fontSize: 16 }} >{this.props.active ? this.props.active.name : '全国'}</div>} >
                <div className="pieChart" ref={e => this.chart = e} />
                <div className="data">
                    <div className="item">
                        <label>当前监控设备数(台)</label><span>{countAll}</span>
                    </div>
                    <div className="item">
                        <label>运转正常(台)</label><span style={{ color: '#23BC08' }}>{countNormal}</span>
                    </div>
                    <div className="item">
                        <label>发生预警(台)</label><span style={{ color: '#E52C00' }}>{countAbnormal}</span>
                    </div>
                </div>
            </Card>
        )
    }
}

export default PieCard
