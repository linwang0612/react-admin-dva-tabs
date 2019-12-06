import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Pagination } from 'antd';
import './pagination.scss';

class FooterPagination extends PureComponent {
    render() {
        const widthCalc = 160 //this.props.global.collapsed ? 80 : 160;
        return (
            <div className="footerPagination" style={{ width: `calc(100% - ${widthCalc}px)` }}>
                <span className="totalText">{`共 ${this.props.total} 条记录`}</span>
                <Pagination
                    className="_pagintion"
                    size="small"
                    current={this.props.current.current}
                    defaultCurrent={1}
                    showSizeChanger
                    showQuickJumper
                    onChange={(page, pageSize) => this.props.pageChange({ current: page, size: pageSize })}
                    onShowSizeChange={(page, pageSize) => this.props.pageChange({ current: page, size: pageSize })}
                    total={this.props.total}
                />
            </div>
        )
    }
}

export default FooterPagination;

FooterPagination.propTypes = {
    total: PropTypes.number.isRequired,
    current: PropTypes.object.isRequired,
    pageChange: PropTypes.func.isRequired
}
