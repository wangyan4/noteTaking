import React, { Component } from 'react';
import { List, Avatar, message, Modal } from 'antd';
import http from '../../server';

// function GenNonDuplicateID(randomLength) {
//   return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
// }
export default class NoteList extends Component {
  state = {
    listData: [],
    isHorizontal:true
  }
  // 在getDerivedStateFromProps中进行state的改变
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      listData: nextProps.data,
    };
  }
  //编辑当前列表项
  editList = (item, flag) => {
    item.flag = flag;
    item.preview = false;
    item._status = "edit";
    this.props.preview({ item })
  }
  //删除当前列表项
  delList = (item) => {
    item._status = "delete";
    this.props.delItem({ item });

  }
  //广场预览分享数据
  previewList = (item, flag) => {
    item.preview = flag;
    item._status = "preview";
    this.props.preview({ item });
    this.setState({
      isHorizontal:false
    })
  }

  gitClone = (item, flag) => {
    // message.info(JSON.stringify(item));
    Modal.confirm({
      title: '确认',
      content: '确认要克隆该笔记吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        var user = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("user"))));
        var params = {
          "nid":item.id,
          "uid":user.id
        }
        http.post('clone',params)
          .then(data=>{
            if(data.data.success){
              message.success('克隆成功');
            } else {
              message.success('克隆失败');
            }
          })
      }
    });
  }
  shareNote = (item)=>{
    var msg = item.ispub ? "确认要取消分享吗?":"确认要分享吗?"
    Modal.confirm({
      title: '确认',
      // icon: <ExclamationCircleOutlined />,
      content: msg,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        http.get(`setShare/id=${item.id}&flag=${!item.ispub}`).then(()=>{
          this.props.getList();
        });
      }
    });
  }

  render() {
    let { listData } = this.state;
    return (
      <div>
        {
          // 分享广场
          this.props.isPersonal
            ? <List
              itemLayout={this.state.isHorizontal?"horizontal":"vertical"}
              dataSource={listData}
              renderItem={item => (
                <List.Item
                  style={{marginLeft:50}}
                  actions={[
                    <a key="list-loadmore-edit" onClick={() => { this.previewList(item, true) }}>预览</a>,
                    <a style={{ marginRight: 30 }} key="list-loadmore-clone" onClick={() => { this.gitClone(item, false) }}>克隆</a>
                  ]}
                >
                  <List.Item.Meta
                    title={<a onClick={() => { this.previewList(item, true) }}>{item.title}</a>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
            : <List
              itemLayout="vertical"
              dataSource={listData}
              renderItem={item => (
                <List.Item
                  style={{marginLeft:50}}
                  actions={[<a key="list-loadmore-delete" onClick={() => { this.shareNote(item)  }}>{item.ispub?"取消":"分享"}</a>, 
                  <a  key="list-loadmore-edit" onClick={() => { this.editList(item, true) }}>编辑</a>, 
                  <a key="list-loadmore-delete" onClick={() => { this.delList(item) }}>删除</a>
                  
                ]}
                >
                  <List.Item.Meta
                    title={<a onClick={() => { this.editList(item, true) }}>{item.title}</a>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
        }

      </div>
    );
  }
}
