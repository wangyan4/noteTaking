import React, { Component } from 'react';
import { List, message } from 'antd';
import http from '../../server';
import './index.css';
function GenNonDuplicateID(randomLength) {
  return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36)
}
let data =[
  {
    id: GenNonDuplicateID(8),
    title: '你好，李焕英',
    description: "这是一段描述",
    content: "<p>你好，李焕英</p>"
  },
  {
    id: GenNonDuplicateID(8),
    title: '你好，李焕英',
    description: "这是一段描述",
    content: "<p>你好，李焕英</p>"
  },
  {
    id: GenNonDuplicateID(8),
    title: '你好，李焕英',
    description: "这是一段描述",
    content: "<p>你好，李焕英</p>"
  },
]
let _this;
export default class index extends Component {
  constructor(){
    super();
    _this =this;
    this.state={
      myapprove:[],
      approve:[]
    }
  }
  componentDidMount(){
    this.getList()
  }
  getList(){
    // http.get( `allnotes/`)
    //   .then(()=>{

    //   });
    var user = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("user"))));
    http.get(`clonelist/${user.id}`)
      .then((data)=>{
        if(data.data.data){
          // message.warning('success')
          _this.setState({
            myapprove:data.data.data
          })
        }
    })
    http.get(`reqlist/${user.id}`)
      .then((data)=>{
        if(data.data.data){
          // message.warning('success')
          _this.setState({
            approve:data.data.data
          })
        }
        
    })
  }
  agree = (id)=>{
    console.log("I'm agree %s", id);
  }
  disagree = (id)=>{
    console.log("I'm disagree %s", id);
  }
  render() {
    // let {myapprove, approve} = this.state;
    let {myapprove, approve} = this.state;
    return (
      <div className="myContent">
        <div className="mytop">

        </div>

        <div className="mybottomleft">
          <List
              itemLayout={"horizontal"}
              dataSource={myapprove}
              renderItem={item => (
                <List.Item
                  style={{marginLeft:50}}
                  actions={[
                  <a style={{ marginRight: 30 }} key="list-myapprove" onClick={() => {  }}>{Math.random()>0.5?"已同意":"已拒绝"}</a>
                  ]}
                >
                  <List.Item.Meta
                    title={<a onClick={() => {  }}>{item.title}</a>}
                    description={item.description}
                  />
                </List.Item>
              )}
            />
        </div>

        <div className="mybottomright">
          <List
            itemLayout={"horizontal"}
            dataSource={approve}
            renderItem={item => (
              <List.Item
                style={{marginLeft:50}}
                actions={[
                  <a key="list-approve-agree" onClick={() => { this.agree(item.id) }}>同意</a>,
                  <a style={{ marginRight: 30 }} key="list-approve-disagree" onClick={() => { this.disagree(item.id) }}>拒绝</a>
                ]}
              >
                <List.Item.Meta
                  title={<a onClick={() => {  }}>{item.title}</a>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    )
  }
}
