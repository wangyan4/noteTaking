import React, { Component } from 'react'


var data = new Date();
var m = data.getMonth()+1;
var d = data.getDate();
var time=''+m+d;

export default class Register extends Component {
    constructor(){
        super();
        this.state={
            username:'',
            phone:'',
            email:'',
            pwd:'',
            pwd2:'',
            flag:0,
            rad:0,
            uninput:0,
            unname:'',
            data:'',
            captchaStr:''
        }
    }
    

    render() {
     
        return (
            <div>
          
                
            {
                /**
                 * <ul style={{textAlign:'center'}}>
                <li><input style={{paddingLeft:'5%'}} type='text' className='login_input1' placeholder='昵称' onChange={this.inpName} /></li>
                <li><input style={{paddingLeft:'5%'}} type='tel' className='login_input1' placeholder='手机号' onChange={this.inpPhone}/></li>
                <li><input style={{paddingLeft:'5%'}} type='email' className='login_input1' placeholder='邮箱' onChange={this.inpEmail}/></li>
                <li><input style={{paddingLeft:'5%'}} type='password' className='login_input1' placeholder='密码' onChange={this.inpPwd}/></li>
                <li><input style={{paddingLeft:'5%'}} type='password' className='login_input1' placeholder='确认密码' onChange={this.inpPwd2}/></li>
                
            </ul>
                 */
            }
  

            <button onClick={this.registerGo}>注册</button>

            <button onClick={this.getDb}>获取</button>

                
                   
              
            </div>
        )
    }
    
    inpName = (e) => {
        this.setState({
            username:e.target.value
        });
    }
    inpPhone = (e) => {
        this.setState({
            phone:e.target.value
        });
    }
    inpEmail = (e) => {
        this.setState({
            email:e.target.value
        });
    }
    inpPwd = (e) => {
        this.setState({
            pwd:e.target.value
        });
    }
    inpPwd2 = (e) => {
        this.setState({
            pwd2:e.target.value
        });
    }

    

    registerGo = () =>{
        console.log('提交')
        
        // const post ={
        //     username:'hello3',
        //     phone:'15230801658',
        //     email:'1417037714@qq.com',
        //     passwd:'666'
        // };
        const post = {
            uid:1,
            username:'hh',
            title:'aa',
            description:'bb',
            content:'cc',
            time:'dd',
            ispub:true
        }
        console.log(post);
     
        // fetch(`http://xpmxia.cn.utools.club/register`,{
        //     method:"POST",
        //     headers:{'Content-Type': 'application/x-www-form-urlencoded'},
        //     body:JSON.stringify(post)//把提交的内容转字符串
        // })
        fetch(`http://xpmxia.cn.utools.club/notecreate`,{
            method:"POST",
            headers:{'Content-Type': 'application/x-www-form-urlencoded'},
            body:JSON.stringify(post)//把提交的内容转字符串
        })
        .then(res =>res.json())
        .then(data =>{
            console.log(data,'lllll');
            
        });

        
        
    }

    getDb = () => {
        console.log('获取数据库');
        fetch(`http://xpmxia.cn.utools.club//getnote/2`,{
            method: 'GET'
            })
            .then((res)=>res.json())
            .then((res)=>{
                console.log(res);
                

        })
    }
    

}
