import { message } from 'antd'
/**
 * 
 * @param {string}gphoneInput 
 * 验证手机号格式
 */
function isPhoneAvailable(phoneInput) {
  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(phoneInput)) {
    return false;
  } else {
    return true;
  }
}
/**
 * 
 * @param {string} emailInput 
 * 验证邮箱格式
 */
function isEmailAvailable(emailInput) {
  var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
  if (!myreg.test(emailInput)) {
    return false;
  }
  else {
    return true;
  }
}
function passwordAvailable(pwdInput) {
  var myreg = /^(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}$/
  if (!myreg.test(pwdInput)) {
    return false;
  }
  else {
    return true;
  }
}

function isPhoneOrEmail(userInput) {
  var flag = /^[0-9]*$/.test(userInput);
  
  if (flag) {//手机号
    return true;
    if (!isPhoneAvailable(userInput)) {
      message.info('请输入正确的手机号');
      return 0;
    } else {
      return true;
    }
  } else {//邮箱
    return false;
    if (!isEmailAvailable(userInput)) {
      message.info('请输入正确邮箱')
    } else {
      return false;
    }
  }
}
// 1、密码必须由数字、字符、特殊字符三种中的两种组成;
// 2、密码长度不能少于8个字符;
// (?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}

export default {
  isPhoneAvailable,
  isEmailAvailable,
  passwordAvailable,
  isPhoneOrEmail
}