import React, { Component } from 'react';

import { Input, Button, Tooltip, message } from 'antd';
import utils from '../utils'
import { UserOutlined, UnlockOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './login.css';

export default class Login extends Component {
  state = {
    status: 'login',
    registeruser: "",
    registerpwd: "",
    comfirmpwd: "",
    loginuser: "",
    loginpwd: ""
  }

  loginState = [0, 0]

  registerState = [0, 0]

  statusChage = (status) => {
    this.setState({
      status,
      registeruser: "",
      registerpwd: "",
      comfirmpwd: "",
      loginuser: "",
      loginpwd: "",
    })
  }

  userInput = (v, type) => {

    switch (type) {
      case "registeruser":
        this.setState({ registeruser: v.target.value })
        break;
      case "registerpwd":
        this.setState({ registerpwd: v.target.value })
        break;
      case "comfirmpwd":
        this.setState({ comfirmpwd: v.target.value })
        break;
      case "loginuser":
        this.setState({ loginuser: v.target.value })
        break;
      case "loginpwd":
        this.setState({ loginpwd: v.target.value })
        break;
      default:
        return;
    }
  }
  userBlur = (v, type) => {
    switch (type) {
      case "registeruser":
        if (utils.isPhoneOrEmail(v.target.value)) {
          //手机号
          if (!utils.isPhoneAvailable(v.target.value)) {
            message.info('请输入正确的手机号');
          }
        } else {
          //邮箱
          if (!utils.isEmailAvailable(v.target.value)) {
            message.info('请输入正确邮箱')
          }
        }
        break;
      case "registerpwd":
        if (utils.passwordAvailable(v.target.value)) {

        } else {
          message.info('密码格式不正确')
        }
        break;
      case "comfirmpwd":
        if (this.state.registerpwd == v.target.value) {

        } else {
          message.info('确认密码保持一致')
        }
        break;
      case "loginuser":
        if (utils.isPhoneOrEmail(v.target.value)) {
          //手机号
          if (!utils.isPhoneAvailable(v.target.value)) {
            message.info('请输入正确的手机号');
          }
        } else {
          //邮箱
          if (!utils.isEmailAvailable(v.target.value)) {
            message.info('请输入正确邮箱')
          }
        }
        break;
      case "loginpwd":
        break;
      default:
        return;
    }
  }

  userLogin = () => {
    // if(utils.isPhoneOrEmail(this.state.loginuser)){
    //   if(utils.passwordAvailable(this.state.loginpwd)){

    //   }else{

    //   }
    // }else{
    //   message.info('请检查账户密码')
    // }
    this.props.change(true);
    return true
  }

  userRegester = () => {

  }

  render() {
    return (
      this.state.status === "login"
        ? <div className="loginPage">
          <div className="userContent">
            <div className='loginTitle'>
              <h1>用户登录</h1>
            </div>
            <Input className='user'
              size="large"
              placeholder="请输入邮箱/手机号"
              value={this.state.loginuser}
              onChange={(v) => {
                this.userInput(v, 'loginuser');
              }}
              onBlur={(v) => {
                this.userBlur(v, 'loginuser');
              }}
              prefix={<UserOutlined />} />
            <Input.Password className="password"
              size="large"
              placeholder="请输入密码"
              value={this.state.loginpwd}
              onChange={(v) => {
                this.userInput(v, 'loginpwd');
              }}
              onBlur={(v) => {
                this.userBlur(v, 'loginpwd');
              }}
              prefix={<UnlockOutlined />} />
            <div className="loginFooter">
              <div className="left">
                <Button type="link" onClick={() => { this.statusChage('register') }}>
                  还没账户注册一个？
                </Button>
              </div>
              <div className="right">
                {/* <Button className="register" type="default" shape="round">注册</Button> */}
                <Button className="login"
                  type="primary"
                  shape="round"
                  onClick={() => { this.userLogin() }}>
                  登录
                  </Button>
              </div>
            </div>
          </div>
        </div>
        : <div className="registerPage">
          <div className="userContent">
            <div className='loginTitle'>
              <h1>用户注册</h1>
            </div>

            <Input className='user'
              size="large"
              placeholder="请输入用户名/手机号"
              prefix={<UserOutlined />}
              value={this.state.registeruser}
              onChange={(v) => {
                this.userInput(v, 'registeruser');
              }}
              onBlur={(v) => {
                this.userBlur(v, 'registeruser');
              }}
            />

            <Tooltip
              trigger={['focus']}
              title={`1、密码必须由数字、字符、特殊字符三种中的两种组成;
              2、密码长度不能少于8个字符;`}
              placement="topLeft"
              overlayClassName="numeric-input"
            >
              <Input.Password className="password"
                size="large"
                visibilityToggle={false}
                placeholder="请输入密码"
                value={this.state.registerpwd}
                onChange={(v) => {
                  this.userInput(v, 'registerpwd');
                }}
                onBlur={(v) => {
                  this.userBlur(v, 'registerpwd');
                }}
                prefix={<UnlockOutlined />}
              />
            </Tooltip>

            <Input.Password className="password"
              size="large"
              visibilityToggle={false}
              value={this.state.comfirmpwd}
              onChange={(v) => {
                this.userInput(v, 'comfirmpwd');
              }}
              onBlur={(v) => {
                this.userBlur(v, 'comfirmpwd');
              }}
              placeholder="请再次确认密码"
              prefix={<UnlockOutlined />}
            />

            <div className="loginFooter">
              <div className="left">
                <Button type="link" onClick={() => { this.statusChage('login') }}>
                  有账户直接登录！
                </Button>
              </div>
              <div className="right">
                <Button className="cancle"
                  type="default"
                  shape="round"
                  onClick={() => { this.statusChage('login') }}>
                  取消
                  </Button>
                <Button className="register"
                  type="primary"
                  shape="round"
                  onClick={() => { this.userRegester() }}>
                  注册
                  </Button>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
