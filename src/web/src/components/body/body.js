import React, { Component, createRef } from 'react';
import { Menu, Button, Modal, Empty, Input, message } from 'antd';
import _ from 'loadsh';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import Editor from '../Editor/editor';
import NoteList from '../note/note';
import http from '../../server';
import './body.css';

const { TextArea } = Input;
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
const groundData = [
  {
    id: GenNonDuplicateID(8),
    title: '战狼2',
    description: "这是一段描述",
    content: `<p>&ensp;&ensp;&ensp;战狼2</p><p>&ensp;&ensp;&ensp;说到爱国心，说到军人梦，暑假里最热门的电影,《战狼2》，大家一定都不陌生吧？</p><p>&ensp;&ensp;&ensp;

    影片讲述了脱下军装的冷锋被卷入了一场非洲国家的叛乱，本来能够安全撤离的他无法忘记军人的职责，重回战场展开救援的故事</p><p>&ensp;&ensp;&ensp;
    
    2015年3月26日起，由沙特阿拉伯和埃及、约旦、苏丹等其他海湾国家参加的国际联军在也门发动打击胡塞武装的军事行动。此次军事行动使得当地局势骤然紧张。当时在也门共有590名中国公民，为了保障这些人的生命财产安全，中国政府决定派正在亚丁湾执行护航任务的临沂舰、潍坊舰和微山湖舰转向也门执行撤侨任务。2015年3月29日中午，海军第十九批护航编队临沂舰抵达也门亚丁港。临沂舰进入一级战斗部署，各战位严密组织观察警戒，全副武装的特战队员和水兵荷枪实弹在码头安全警戒，这是中国第一次使用武装军舰从外国撤侨，临沂舰接回的第一批人员共计124人，这124人在39分钟内全部登舰完毕，可见中国海军的效率之高。3月30日，第二批400多人乘坐中国海军潍坊舰顺利离开也门使得这400多人在80分钟内就全部顺利登舰撤离。全部中国公民都已完成撤离。</p><p>&ensp;&ensp;&ensp;
    
    2015年4月25日，尼泊尔境内发生8.1级大地震，尼泊尔是一个旅游国家，地震发生时有大量中国游客在境内旅游。地震发生后，，中国率先调动国航，南航，东航的客机进入加德满都机场，成为此次灾难中第一个完成撤侨的国家，共安全接回5685名在尼滞留中国公民。</p><p>&ensp;&ensp;&ensp;
    
    一朝是战狼，终身是战狼。军旅已终，情怀犹在;军装已脱，职责难释;军营已别，担当不忘，祖国与人民需要，召必回，他为拯救深陷屠杀的同胞和难民勇闯战区。</p><p>&ensp;&ensp;&ensp;
    
    影片中，空手擒拿一招制敌，飞檐走壁弹无虚发，扑面而来的军人血性、责任担当和爱国情怀感染着每名观众，更唤醒了沉寂在我内心深处的英雄情结和民族血性，唤醒了我的军人梦想。从冷锋的身上，我看到了中国军人身上的阳刚、英雄与担当，看到了新时代军人的英雄血性在新时代的强军征程上焕发出的新活力。</p><p>&ensp;&ensp;&ensp;
    
    我爱我的祖国，我有一个军人梦！</p>`
  },
  {
    id: GenNonDuplicateID(8),
    title: '功夫之王',
    description: "这是一段描述",
    content: "<p>功夫之王</p>"
  }
];
let _this;
export default class NavBar extends Component {
  constructor() {
    super();
    _this = this;
    this.previewDom = createRef();
    this.state = {
      collapsed: false,
      showPage: 1,//导航栏标志位
      isShow: true, //notelist是否显示
      editItem: {}, //当前操作项
      showItem: data[0],//editor 展示项
      data: data, //我的笔记列表
      groundData: groundData, //分享列表
      flag: false, //预览页显示
      modal1Visible:false,
      description:"",
      title:"",
      newStatus:false
    };
  }
  toggleCollapsed = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  componentDidMount(){
   _this.getList();
    
  }

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
    if(code == 'ground'){
      http.get('share')
      .then(data=>{
        console.log(data);
        this.setState({
          groundData:data.data.data
        })
      })
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
    }else {
      this.setState({
        editItem,
        isShow: editItem.flag,
        flag: editItem.preview
      }, () => {
        console.log(this.state)
      })
    }
  }


  async delItem (currentItem) {
    let editItem = currentItem.item;
    Modal.confirm({
      title: '确认',
      // icon: <ExclamationCircleOutlined />,
      content: '确认要删除吗?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // let newList = _.filter(_this.state.data, function (o) {
        //   return o.id != editItem.id;
        // })
        http.delete(`delnote/${editItem.id}`).then(data=>{
          if(data.data.success){
            _this.getList();
            if (_this.state.showItem && _this.state.showItem.id && editItem.id == _this.state.showItem.id && _this.state.data.length != 0) {
              _this.setState({
                editItem,
                showItem: _this.state.data[0]
              })
            } else {
              _this.setState({
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
        })
      }
    });
  }

  addItem = () => {
    this.setState({
      isShow: false,
      showItem: {},
      modal1Visible:true,
      newStatus:true,
      title:"",
      description:""
    })
  }

  onSave =(isShow)=>{
    _this.getList()
    this.setState({
      isShow:isShow
    })
  }
  getList = ()=>{
    var user = JSON.parse(decodeURIComponent(window.atob(localStorage.getItem("user"))));
    http.get( `allnotes/${user.id}`).then((data)=>{
      if(data.data.success){
        _this.setState({
          data:data.data.data,
        })
      } else {
        message.error('获取列表失败')
      }
    });
      
  }
  setModal1Visible = (showState)=>{
    this.setState({
      modal1Visible:showState
    })
  }
  onDescriptionChange = ({ target: { value } })=>{
    this.setState({
      description: value
    })
  }
  onTitleChange = ({ target: { value } })=>{
    this.setState({
      title: value
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
                {this.state.showItem && !this.state.isShow
                ?<Editor editItem={this.state.showItem} aritcle={{"title":this.state.title,"description":this.state.description}} newStatus={this.state.newStatus} save={this.onSave}/>
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
                <NoteList preview={this.preview} isPersonal data={this.state.groundData} delItem={this.delItem} />
              </div>
              : null
          }
          {
            this.state.showPage == 3
              ? <div className="noteList">
                <NoteList preview={this.preview} isPersonal data={this.state.groundData} delItem={this.delItem} />
              </div>
              : null
          }
          <div className="editorPreview"
            ref={this.previewDom}
            style={!this.state.flag ? { display: "none" } : { display: "block" }}
          ></div>
        </div>
        <Modal
          title="新建笔记"
          style={{ top: 20 }}
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
          
          <p>
            标题:<Input placeholder="请输入标题" onChange = {this.onTitleChange} value={this.state.title}/>
          </p>
          <p>
            描述:
            <TextArea
              value={this.state.description}
              onChange={this.onDescriptionChange}
              placeholder="请输入描述"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </p>
        </Modal>
      </div>
    );
  }
}