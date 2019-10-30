import React from 'react';
import { Card } from 'antd';

export default function TabsCard(props) {
    let provinceCount = [ ...props.provinceCount ];
    let count = 0;
    provinceCount.forEach(item => {
        count += item.number
    })
    let extra = <div onClick={() => props.changeActiveCode()} style={{ fontSize: 16, cursor: 'pointer', color: props.active ? '#333' : '#1890FF' }}>全国 ({count})</div>;
    if (provinceCount.length > 10) {
        provinceCount = provinceCount.slice(0, 10)
    }
    return (
        <Card className="tabsCard" title="全国分布情况 TOP 10" extra={extra}>
            {
                provinceCount.map(item => {
                    return (
                        <div key={item.provinceCode}
                            className={props.active && props.active.code === item.provinceCode ? 'item active' : 'item'}
                            onClick={() => props.changeActiveCode({ code: item.provinceCode, name: item.provinceName })}
                        >
                            {item.provinceName} ({item.number})
                        </div>
                    )
                })
            }
        </Card>
    )
}
