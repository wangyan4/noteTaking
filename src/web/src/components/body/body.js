import React, { Component, createRef } from 'react';
import { Menu, Button, Modal, Empty } from 'antd';
import _ from 'loadsh';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import Editor from '../Editor/editor';
import NoteList from '../note/note';
import http from '../../server';


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
    this.previewDom = createRef();
    this.state = {
      collapsed: false,
      showPage: 1,//导航栏标志位
      isShow: true, //notelist是否显示
      editItem: {}, //当前操作项
      showItem: data[0],//editor 展示项
      data: data, //我的笔记列表
      data1: data1, //分享列表
      flag: false, //预览页显示
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
    if (code == 'note') {
      this.setState({
        showPage: changeObj[code],
        showItem: this.state.data[0] ? this.state.data[0] : {},
        isShow: true,
        flag: false
      });
    }
    this.setState({
      showPage: changeObj[code],
      isShow: true,
      flag: false
    });
  }
  preview = (currentItem) => {
    let editItem = currentItem.item;
    if (editItem.preview) {
      this.previewDom.current.innerHTML = editItem.content;
    }
    if (editItem._status == "edit") {
      this.setState({
        editItem,
        showItem: editItem,
        isShow: editItem.flag,
        flag: editItem.preview
      }, () => {
        console.log(this.state)
      })
      return;
    }
    this.setState({
      editItem,
      isShow: editItem.flag,
      flag: editItem.preview
    }, () => {
      console.log(this.state)
    })
  }


  delItem = (currentItem) => {
    let editItem = currentItem.item;
    Modal.confirm({
      title: '确认',
      // icon: <ExclamationCircleOutlined />,
      content: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        let _this = this;
        let newList = _.filter(_this.state.data, function (o) {
          return o.id != editItem.id;
        })
        if (editItem.id == this.state.showItem.id && newList.length != 0) {
          this.setState({
            data: newList,
            editItem,
            showItem: newList[0]
          })
        } else {
          this.setState({
            data: newList,
            editItem,
            showItem: {
              id: null,
              description: null,
              content: null,
              title: null
            }
          });
        }
      }
    });
  }

  addItem = () => {
    this.setState({
      isShow: false,
      showItem: {}
    })
  }

  onSave =(isShow)=>{
    this.setState({
      isShow:isShow
    })
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
            <Menu.Item key="1" icon={<i className="iconfont iconbiji"></i>} onClick={this.menuChange.bind(this, 'note')}>
              笔记
            </Menu.Item>
            <Menu.Item key="2" icon={<i className="iconfont iconguangchang"></i>} onClick={this.menuChange.bind(this, 'ground')}>
              分享广场
            </Menu.Item>
            <Menu.Item key="3" icon={<i className="iconfont iconwode"></i>} onClick={this.menuChange.bind(this, 'my')}>
              我的
            </Menu.Item>
          </Menu>
        </div>
        <div className="content">
          {
            this.state.showPage == 1 && this.state.isShow
              ? <div className="noteList">
                <Button type="primary" shape="round" onClick={() => { this.addItem() }}>新建</Button>
                {/* <Button type="default">新增</Button> */}
                <NoteList preview={this.preview} data={this.state.data} delItem={this.delItem} />
              </div>
              : null
          }
          {
            this.state.showPage == 1
              ? <div className="editor">
                {this.state.data.length && !this.state.isShow
                ?<Editor editItem={this.state.showItem} save={this.onSave}/>
                :<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                }
                {/* {!this.state.isShow
                ?<Editor editItem={this.state.showItem} save={this.onSave}/>
                :<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                } */}
              </div>
              : null
          }
          {
            this.state.showPage == 2
              ? <div className="noteList">
                <NoteList preview={this.preview} isPersonal data={this.state.data1} delItem={this.delItem} />
              </div>
              : null
          }
          <div className="editorPreview"
            ref={this.previewDom}
            style={!this.state.flag ? { display: "none" } : { display: "block" }}
          ></div>
        </div>
      </div>
    );
  }
}