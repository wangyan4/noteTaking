import React, { Component } from 'react';
import { List, Avatar, Skeleton } from 'antd';

function GenNonDuplicateID(randomLength){
  return Number(Math.random().toString().substr(3,randomLength) + Date.now()).toString(36)
}
const data = [
  {
    id:GenNonDuplicateID(8),
    title: 'Ant Design Title 1',
  },
  {
    id:GenNonDuplicateID(8),
    title: 'Ant Design Title 2',
  }
];

export default class NoteList extends Component {
  state = {

  }

  componentDidMount() {
    console.log(this.props.preview)
  }

  render() {
    console.log(this)
    return (
      <div>
        {
          this.props.isPersonal
            ?<List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => (
              <List.Item 
                actions={[<a style={{marginRight:30}} key="list-loadmore-edit">预览</a>]}
              >
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="#" onClick={()=>{this.props.preview(item.id)}}>{item.title}</a>}
                  description="这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述"
                />
              </List.Item>
            )}
          />
            :<List
            itemLayout="vertical"
            dataSource={data}
            renderItem={item => (
              <List.Item 
                actions={this.props.isPersonal?"":[<a style={{marginLeft:50}} key="list-loadmore-edit">编辑</a>, <a key="list-loadmore-delete">删除</a>]}
              >
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a href="#" onClick={()=>{this.props.preview(item.id)}}>{item.title}</a>}
                  description="这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述这是一段很长很长的描述"
                />
              </List.Item>
            )}
          />
        }
        
      </div>
    );
  }
}
