import React, { Component } from 'react';
import { List, Avatar, Skeleton } from 'antd';

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  }
];

export default class NoteList extends Component {
  render() {
    return (
      <div>
        <List
          itemLayout="vertical"
          dataSource={data}
          renderItem={item => (
            <List.Item 
              actions={[<a style={{marginLeft:30}} key="list-loadmore-edit">edit</a>, <a key="list-loadmore-delete">delete</a>]}
            >
              <List.Item.Meta
                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                title={<a href="https://ant.design">{item.title}</a>}
                description="这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述"
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}
