import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/geo';
import 'echarts/lib/chart/scatter';
import { ReqApi, Urls } from '../../../base/common';
import { geoCoordMap } from './geoData';

class ChinaMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provinceCodeList: [],
        }
    }
    componentDidMount() {
        this.initCharts();

        ReqApi.get({
            url: Urls.provinceList,
        }).then((data) => {
            this.setState({
                provinceCodeList: data.map(({ provinceCode, provinceName }) => ({ provinceCode, provinceName }))
            });
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize',() => {
            this.myChart.resize()
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.provinceCount !== this.props.provinceCount) {
            let option = this.creatOptions();
            option.series[0].data = this.creatScatterData();
            this.myChart.setOption(option);
        }
        if (JSON.stringify(prevProps.active) !== JSON.stringify(this.props.active)) {
            let option = this.creatOptions();
            if (this.props.active) {
                option.geo.regions = [{
                    name: this.props.active.name,
                    selected: true
                }]
            } else {
                option.geo.regions = []
            }
            this.myChart.setOption(option);
        }
    }

    creatScatterData = () => {
        const { provinceCount } = this.props;
        let res = [];
        for (var i = 0; i < provinceCount.length; i++) {
            const geoCoord = geoCoordMap[provinceCount[i].provinceName];
            if (geoCoord) {
                res.push({
                    name: provinceCount[i].provinceName,
                    value: geoCoord.concat(provinceCount[i].number)
                });
            }
        }
        return res;
    }

    creatOptions = () => {
        return {
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: true,
                        color: '#fff'
                    }
                },
                left: '5%',
                roam: true,
                itemStyle: {
                    normal: {
                        areaColor: '#7fa2df',
                        borderColor: '#fff'
                    },
                    emphasis: {
                        areaColor: '#2c77dc',
                    }
                }
            },
            series: [
                {
                    name: '设备数量',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: this.creatScatterData(),
                    symbolSize: 8,
                    itemStyle: {
                        color: '#dac280'
                    },
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    }
                }
            ],
        }
    }

    initCharts() {
        this.myChart = echarts.init(this.chart);
        const geoJSon = require('./china.json');
        echarts.registerMap('china', geoJSon)
        this.myChart.setOption(this.creatOptions());
        this.myChart.on('click', params => {
            let provinceCodeList = this.state.provinceCodeList;
            for (let i = 0; i < provinceCodeList.length; i++) {
                if (provinceCodeList[i].provinceName === params.name) {
                    this.props.changeActiveCode({
                        code: provinceCodeList[i].provinceCode,
                        name: provinceCodeList[i].provinceName
                    })
                    break;
                }
            }
            this.setCenter(params.name)
        });

        window.addEventListener(
            'resize', () => {
                this.myChart.resize()
            },false
        );
    }

    setCenter = name => {
        let option = this.creatOptions();
        // option.geo.center = name ? geoCoordMap[name] : [115.97, 29.71];
        // option.geo.zoom = 10;
        option.geo.regions = [{
            name: name,
            selected: true
        }]
        this.myChart.setOption(option);
    }

    render() {
        return (
            <div className="chinaMap" ref={e => this.chart = e} />
        )
    }
}

export default ChinaMap
