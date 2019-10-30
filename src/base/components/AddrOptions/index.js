import React from 'react';
import { Cascader } from 'antd';
import PropTypes from 'prop-types';
import { ReqApi, Urls } from '../../common';

/**
 * 地址级联选择器
 */

class AddrOptions extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.didLoadData = this.didLoadData.bind(this);
    this.state = {
      options: [],
    }
  }

  componentDidMount() {
    //获取省份
    ReqApi.get({
      url: Urls.provinceList,
    }).then((data) => {
      this.setState({
        options: data.map(item => ({
          value: item.provinceCode,
          label: item.provinceName,
          type: 'province',
          isLeaf: false,
        }))
      }, () => {
        if (this.props.value && Object.prototype.toString.call(this.props.value) === '[object Array]') {
          this.didLoadData()
        }
      })
    })
  }

  onChange = (value, selectedOptions) => {
    this.props.selectChange(selectedOptions)
  }

  resetOption = () => {
    this.setState({
      option: []
    })
  }

  async didLoadData() {
    let options = this.state.options.slice(0);
    if (this.props.value[0]) {
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === this.props.value[0]) {
          options[i].children = await this.getCityList(options[i])
          let optionChild = options[i].children;
          for (let j = 0; j < optionChild.length; j++) {
            if (optionChild[j].value === this.props.value[1]) {
              if (this.props.callCityName) {
                this.props.callCityName(optionChild[j].label)
              }
              optionChild[j].children = await this.getCountyList(optionChild[j])
              break;
            }
          }
          break;
        }
      }
    }
    this.setState({ options })
  }

  async loadData(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (targetOption.type === 'county' && targetOption.value !== '') {
      //区县不用继续选
      return;
    } else {
      targetOption.loading = true;
      if (targetOption.type === 'city' && targetOption.value !== '') {
        //城市选区县
        targetOption.children = await this.getCountyList(targetOption);
      } else if (targetOption.type === 'province' && targetOption.value !== '') {
        //省份选城市
        targetOption.children = await this.getCityList(targetOption);
      }
      targetOption.loading = false;
      this.setState({
        options: [...this.state.options]
      })
    }
  }

  getCityList = targetOption => {
    return new Promise((resolve, reject) => {
      ReqApi.get({
        url: Urls.cityList,
        pm: { provinceCode: targetOption.value }
      }).then((data) => {
        resolve(
          data.map(item => ({
            value: item.cityCode,
            label: item.cityName,
            type: 'city',
            isLeaf: this.props.isCity || false,
          }))
        )
      })
    });
  }

  getCountyList = targetOption => {
    return new Promise((resolve, reject) => {
      ReqApi.get({
        url: Urls.countyList,
        pm: { cityCode: targetOption.value }
      }).then((data) => {
        resolve(
          data.map(item => ({
            value: item.countyCode,
            label: item.countyName,
            type: 'county',
            isLeaf: true,
          }))
        )
      })
    });
  }

  render() {
    return (
      <Cascader
        defaultValue={this.props.value || []}
        placeholder="请选择城市"
        options={this.state.options}
        loadData={this.loadData}
        changeOnSelect
        size="large"
        onChange={this.onChange}
      />
    );
  }
}

export default AddrOptions

AddrOptions.propTypes = {
  isCity: PropTypes.bool,// 是否只选到市， 默认false
  selectChange: PropTypes.func.isRequired
}
