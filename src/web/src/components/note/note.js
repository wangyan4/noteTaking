import React, { Component } from 'react';
import { List, Avatar, message } from 'antd';

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
  editList = (id, content, flag) => {
    this.props.preview({ id, content, flag, preview: false })
  }
  //删除当前列表项
  delList = (item) => {
    this.props.delItem(item);
  }
  //广场预览分享数据
  previewList = (item, flag) => {
    item.preview = flag;
    this.props.preview(item)
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
                  actions={[<a style={{ marginRight: 30 }} key="list-loadmore-edit" onClick={() => { this.previewList(item, true) }}>预览</a>]}
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
                  actions={this.props.isPersonal ? "" : [<a style={{ marginLeft: 50 }} key="list-loadmore-edit" onClick={() => { this.editList(item.id, item.content, false) }}>编辑</a>, <a key="list-loadmore-delete" onClick={() => { this.delList(item) }}>删除</a>]}
                >
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={<a onClick={() => { this.editList(item.id, item.content, true) }}>{item.title}</a>}
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
