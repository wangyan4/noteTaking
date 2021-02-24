import React, { Component } from 'react';
import { Button } from 'antd';

export default class Header extends Component {
  render() {
    return (
      <div>
        <Button type="primary" onClick={()=>alert('click')}>点击一下</Button>
      </div>
    );
  }
}
