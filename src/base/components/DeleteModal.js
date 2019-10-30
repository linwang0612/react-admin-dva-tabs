import React from 'react';
import { Modal } from 'antd';
import { IconFont } from './IconFont';
class DeleteModal extends React.Component {
  open = () => {
    Modal.confirm({
      title: '提示',
      icon: <IconFont type="icondankuangtishianniu" />,
      content: '是否进行删除操作？',
      style: { top: 'calc(50% - 96px)', position: 'relative', top: 100 },
      onOk: () => this.props.deleteOk()
    });
  }
  render() {
    return React.cloneElement(this.props.children, {
      onClick: this.open
    })
  }
}

export default DeleteModal
