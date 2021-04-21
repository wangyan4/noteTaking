import axios from 'axios';
import qs from 'qs';

let root = 'http://xpmxia.cn.utools.club/';
let http = {
  post: "",
  get: "",
  delete:""
}
http.post = function (api, data) {
  let url = root+api;
  let params = data;
  return new Promise((resolve, reject) => {
    axios.post(url, params).then((res) => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}
http.get = function (api, data) {
  let url = root+api;
  let params = data;
  return new Promise((resolve, reject) => {
    axios.get(url, params).then((res) => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}
http.delete = function (api, data) {
  let url = root+api;
  let params = data;
  return new Promise((resolve, reject) => {
    axios.delete(url, params).then((res) => {
      resolve(res);
    }).catch(error => {
      reject(error);
    })
  })
}

export default http;