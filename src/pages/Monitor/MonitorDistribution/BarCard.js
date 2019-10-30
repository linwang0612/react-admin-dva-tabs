import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/grid';
import 'echarts/lib/chart/bar';
import { ReqApi, Urls } from '../../../base/common';
import { Card } from 'antd';

class BarCard extends React.PureComponent {
    componentDidMount() {
        this.initCharts();
    }

    componentWillUnmount() {
        window.removeEventListener('resize',() => {
            this.myChart.resize()
        });
    }

    initCharts() {
        this.myChart = echarts.init(this.chart);

        ReqApi.get({
            url: Urls.countStatistics,
        }).then((data) => {
            let countList = data.map(item => item.count)
            let nameList = data.map(item => {
                let text = item.provinceName ? item.provinceName : '其他';
                if (text.length > 3) {
                    text = text.substring(0, 3) + '...'
                }
                return text
            })
            this.myChart.setOption({
                color: '#AA5BF9',
                grid: {
                    right: '10%',
                    left: '5%',
                    bottom: '10%',
                    top: '10%',
                },
                xAxis: [
                    {
                        type: 'category',
                        data: nameList,
                        axisLine: {
                            lineStyle: {
                                color: '#090909'
                            }
                        },
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        minInterval: 1,
                        axisLine: {
                            show: false,
                        },
                        splitLine: {
                            show: true,
                            lineStyle: {
                                color: 'rgba(0,0,0,0.3)'
                            }
                        },
                    }
                ],
                series: [
                    {
                        name: '次数',
                        type: 'bar',
                        barWidth: '60%',
                        data: countList
                    }
                ]
            })
            window.addEventListener(
                'resize', () => {
                    this.myChart.resize()
                },false
            );
        })
    }

    render() {
        return (
            <Card className="barCard" title="最近7天内发生预警数据" extra={<div style={{ fontSize: 16 }} >全国</div>} >
                <div className="barChart" style={{ height: 200 }} ref={e => this.chart = e} />
            </Card>
        )
    }
}

export default BarCard
