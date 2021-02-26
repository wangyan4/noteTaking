import React, { Component, createRef } from 'react';
import { Menu, Button, Modal } from 'antd';
import _ from 'loadsh';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined
} from '@ant-design/icons';
import Editor from '../Editor/editor';
import NoteList from '../note/note';


import './body.css';
function GenNonDuplicateID(randomLength) {
  return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
}
const data = [
  {
    id: GenNonDuplicateID(8),
    title: '你好，李焕英',
    description: "这是一段描述",
    content: "<p>你好，李焕英</p>"
  },
  {
    id: GenNonDuplicateID(8),
    title: '沐浴之王',
    description: "这是一段描述",
    content: "<p>沐浴之王</p>"
  }
];
const data1 = [
  {
    id: GenNonDuplicateID(8),
    title: '战狼2',
    description: "这是一段描述",
    content: "<p>战狼2</p>"
  },
  {
    id: GenNonDuplicateID(8),
    title: '功夫之王',
    description: "这是一段描述",
    content: "<p>功夫之王</p>"
  }
];

export default class NavBar extends Component {
  constructor() {
    super();
    this.preview = createRef();
    this.state = {
      collapsed: false,
      showPage: 1,
      isShow: true,
      editItem: data[0],
      data: data,
      data1: data1,
      flag: false,
      modalVisible: false
    };
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  menuChange = (code) => {
    var changeObj = {
      note: "1",
      ground: "2",
      my: "3"
    }
    this.setState({ showPage: changeObj[code], isShow: true, flag:false });
  }
  previewStatus = (editItem) => {
    console.log(editItem);
    this.setState({ editItem, isShow: editItem.flag, flag: editItem.preview }, () => {
      console.log(this.state)
    })
    if (editItem.preview) {
      this.preview.current.innerHTML = editItem.content;
    }
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  delItem = (editItem) => {
    this.setModalVisible(true);
    this.setState({ editItem });
  }

  addItem = () => {

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
            <Menu.Item key="1" icon={<PieChartOutlined />} onClick={this.menuChange.bind(this, 'note')}>
              笔记
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />} onClick={this.menuChange.bind(this, 'ground')}>
              分享广场
            </Menu.Item>
            <Menu.Item key="3" icon={<ContainerOutlined />} onClick={this.menuChange.bind(this, 'my')}>
              我的
            </Menu.Item>
          </Menu>
        </div>
        <div className="content">
          {
            this.state.showPage == 1 && this.state.isShow
              ? <div className="noteList">
                <Button type="primary" shape="round" onClick={() => { this.setState({ isShow: false }) }}>新建</Button>
                {/* <Button type="default">新增</Button> */}
                <NoteList preview={this.previewStatus} data={this.state.data} delItem={this.delItem} />
              </div>
              : null
          }
          {
            this.state.showPage == 1
              ? <div className="editor">
                <Editor editItem={this.state.editItem} />
              </div>
              : null
          }
          {
            this.state.showPage == 2
              ? <div className="noteList">
                <NoteList preview={this.previewStatus} isPersonal data={this.state.data1} delItem={this.delItem} />
              </div>
              : null
          }
          {
              <div className="editorPreview" ref={this.preview} style={!this.state.flag?{display:"none"}:{display:"block"}}>

              </div>
          }
        </div>
        <Modal
          title="删除"
          style={{ top: 20 }}
          visible={this.state.modalVisible}
          onOk={() => {
            this.setModalVisible(false);
            let _this = this;
            let newList = _.filter(_this.state.data, function (o) {
              return o.id != _this.state.editItem.id;
            })
            this.setState({ data: newList })
          }}
          onCancel={() => this.setModalVisible(false)}
        >
          <p>确认要删除吗?</p>
        </Modal>
      </div>
    );
  }
}