import React from 'react';
import { Card } from 'antd';
import Components from '../../../base/components';
const { IconFont } = Components

export default function DeviceCard(props) {
    let {
        alias = '', status = 0,
        temperature, humidity,
        temperatureLowThreshold, temperatureHighThreshold,
        humidityLowThreshold, humidityHighThreshold
    } = props;
    if (status === 0) {
        temperature = '--'; humidity = '--';
    }
    const extra = status
        ? <span style={{ color: '#23BC08' }}>通讯正常</span>
        : <span style={{ color: '#E52C00' }}>通讯中断</span>;

    const temState = (temperatureLowThreshold && temperature < temperatureLowThreshold) ||
                    (temperatureHighThreshold && temperature > temperatureHighThreshold);
    const humState = (humidityLowThreshold && humidity < humidityLowThreshold) ||
                    (humidityHighThreshold && humidity > humidityHighThreshold);
    return (
        <Card hoverable className="deviceCard" title={alias} extra={extra}>
            <div className="dataItem">
                <div className="title">
                    <IconFont type="iconshiducolor"/> 温度
                </div>
                <div className={`data ${temState ? 'error' : ''}`}>
                    {temperature} ℃
                    { !!temState && <IconFont type="iconjingshi"/> }
                </div>
            </div>
            <div className="dataItem">
                <div className="title">
                    <IconFont type="iconwendu"/> 湿度
                </div>
                <div className={`data ${humState ? 'error' : ''}`}>
                    {humidity} %
                    { !!humState && <IconFont type="iconjingshi"/> }
                </div>
            </div>
        </Card>
    )
}
