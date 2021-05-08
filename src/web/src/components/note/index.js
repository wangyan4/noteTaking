import React, { Component } from 'react';
import { List, Avatar, message, Modal } from 'antd';
import http from '../../server';
import './index.css'

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
    var user = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("user"))));
    if(flag){
      Modal.confirm({
        title: '确认',
        content: '确认要更新该笔记吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          var params = {
            "nid":item.copy_id,
            "uid":user.id
          }
          http.post('clone',params)
            .then(data=>{
              if(data.data.success){
                message.success('更新成功');
                this.props.getList();
              } else {
                message.success('更新失败');
              }
            })
        }
      });
    }else{
      Modal.confirm({
        title: '确认',
        content: '确认要克隆该笔记吗?',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
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
          var invalidMsg = msg.slice(3,-2)+"成功";
          message.success(invalidMsg);
          this.props.getList();
        });
      }
    });
  }
  submitEdit = (item)=>{
    var msg = item.authority?"作者已同意":"请耐心等待作者同意";
    message.warning('请耐心等待作者同意')
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
                    // avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
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
                  actions={
                    item.authority ? [
                    !item.copy_id?<a key="list-loadmore-delete" onClick={() => { this.shareNote(item)  }}>{item.ispub?"取消":"分享"}</a>
                      :<a key="list-loadmore-delete" onClick={() => { this.gitClone(item, true)  }}>更新</a>, 
                    <a  key="list-loadmore-edit" onClick={() => { this.editList(item, true) }}>编辑</a>, 
                    <a key="list-loadmore-delete" onClick={() => { this.delList(item) }}>删除</a>
                  ]:[
                    <a  key="list-loadmore-edit" onClick={() => { this.submitEdit(item) }}>申请编辑</a>,
                    <a key="list-loadmore-delete" onClick={() => { this.delList(item) }}>删除</a>
                ]}
                >
                  <List.Item.Meta
                    title={<a onClick={() => { this.editList(item, true) }}>{item.title}{!item.version && item.copy_id?<span className="upgrade">更新</span>:""}</a>}
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
