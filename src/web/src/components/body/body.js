import React, { Component } from 'react';
import { Menu, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import Editor from '../Editor/editor'
import NoteList from '../note/note'

import './body.css';
// const { SubMenu } = Menu;


export default class NavBar extends Component {
  state = {
    collapsed: false,
    showPage:1
  };

  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  menuChange = (code) => {
    var changeObj={
      note:"1",
      ground:"2",
      my:"3"

    }
    // message.info(code, 2)
    this.setState({showPage:changeObj[code]});
  }
  render() {
    return (
      <div className="bodyContent" >
        <div className="navList" >
          <Menu
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            theme="light"
            inlineCollapsed={this.state.collapsed}
          >
            <Button type="primary" onClick={this.toggleCollapsed} style={this.state.collapsed ? { width: 80 } : { width: "100%" }}>
              {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            </Button>
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={this.menuChange.bind(this,'note')}>
              笔记
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />} onClick={this.menuChange.bind(this,'ground')}>
              分享广场
            </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />} onClick={this.menuChange.bind(this,'my')}>
              我的
            </Menu.Item>
          </Menu>
        </div>
        <div className="content">
          {
            this.state.showPage == 1 
            ?<div className="noteList">
              <NoteList />
              </div>
            :""
          }
          {
            this.state.showPage == 1 
            ?<div className="editor">
              <Editor />
            </div>
            :""
          }
        </div>
      </div>
    );
  }
}