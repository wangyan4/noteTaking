import React, { Component } from 'react';
import { List, Avatar, message, Modal } from 'antd';

// function GenNonDuplicateID(randomLength) {
//   return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
// }
export default class NoteList extends Component {
  state = {
    listData: []
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
    this.props.delItem({item});

  }
  //广场预览分享数据
  previewList = (item, flag) => {
    item.preview = flag;
    item._status = "preview";
    this.props.preview({item})
  }

  gitPull = (item,flag)=>{
    // message.info(JSON.stringify(item));
    Modal.confirm({
      title: '确认',
      content: '确认要克隆该笔记吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        
      }
    });
  }

  render() {
    let { listData } = this.state;
    return (
      <div>
        {
          this.props.isPersonal
            ? <List
              itemLayout="horizontal"
              dataSource={listData}
              renderItem={item => (
                <List.Item
                  actions={[
                  <a key="list-loadmore-edit" onClick={() => { this.previewList(item, true) }}>预览</a>,
                  <a style={{ marginRight: 30 }} key="list-loadmore-edit" onClick={() => { this.gitPull(item, false) }}>克隆</a>
                ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a onClick={() => { this.editList(item.id, item.content, true) }}>{item.title}</a>}
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
                  actions={ [<a style={{ marginLeft: 50 }} key="list-loadmore-edit" onClick={() => { this.editList(item, false) }}>编辑</a>, <a key="list-loadmore-delete" onClick={() => { this.delList(item) }}>删除</a>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
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
