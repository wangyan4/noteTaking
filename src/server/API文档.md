### 服务地址

> http://xpmxia.cn.utools.club

------

## 接口尚在测试阶段...

### 1. 用户注册

**必选参数：username,passwd,email,phone**

**接口地址：post，/register**

**请求数据：**

```json
const post ={
            "username":"hello",
            "phone":"15230801658",
            "email":"1417037714@qq.com",
            "passwd":"123"
};
```

**返回数据：**

```json
{
    "status":"register success"
}
```

### 2. 用户登录

**必选参数：loginid,passwd**

**接口地址：post，/login**

**请求数据：**

```json
const post ={
            "username":"hello",
            "phone":"15230801658",
            "email":"1417037714@qq.com",
            "passwd":"123"
};
```

**返回数据：**

```json
//登录成功
{
    "status":"login success"
}
//登录失败
{
    "status":"login fail"
}
```

### 3. 用户更新头像

**必选参数：**

**接口地址：post，/headimg/:id（用户id）** 

**请求示例：**

```json
var formData = new FormData();
formData.append('image', f);
fetch(`http://xpmxia.cn.utools.club/headimg/1`,{
    method:"POST",
    body:formData  
})
```

**返回数据：**

```json
{
    "status":"update success"
}
```

### 4. 获取用户头像

**必选参数：**

**接口地址：get，/gethead/:id（用户id）**：

**请求示例：**

```json
this.setState({
    imgsrc:`http://xpmxia.cn.utools.club/gethead/1`
}); 
`<img src={`${imgsrc}`} />`
```

### 5. 创建新笔记仓库

**必选参数：uid,username,title,description,content,time,ispub（是否开源）**

**接口地址：post，/notecreate**：

**请求数据：**

```json
const post = {
            "uid":"1",
            "username":"hh",
            "title":"aa",
            "description":"bb",
            "content":"cc",
            "time":"dd",
            "ispub":true
}
```

**返回数据：**

```json
{
    "status":"create success"
}
```

### 6. 修改笔记（非克隆）

**必选参数：id（笔记仓库id）,content,time**

**接口地址：post，/updatenote**

**返回数据：**

```json
{
    "status":"update success"
}
```

### 7. 获取某个笔记仓库详细信息

**必选参数：**

**接口地址：get，/getnote/:id（笔记仓库id）** 

**返回数据：**

```json
{
	"status":0,
	"data":[{
		"title":"aa",
		"description":"bb",
		"content":"cc",
		"time":"dd"
	}]
}
```

### 8. 获取某用户所有笔记仓库（含克隆）

**必选参数：**

**接口地址：get，/allnotes/:id（用户id）** 

**返回数据：**

```json
{
	"status":0,
	"data":[{
		"uid":1,
		"title":"aa",
		"description":"bb",
		"content":"cc",
		"time":"dd",
		"ispub":true,
		"bid":1
	},
	{
		"uid":1,
		"title":"aa",
		"description":"bb",
		"content":"cc",
		"time":"dd",
		"ispub":false,
		"bid":2  //原仓库用户id
	}]
}

```

### 9. 删除笔记仓库

**必选参数：**

**接口地址：delete，/delnote/:id（笔记仓库id）** 

**返回数据：**

```json
{
    "status":"delete success"
}
```

### 10. 克隆他人开源笔记仓库

**必选参数：nid,uid,username**

**接口地址：post，/clone** 

**请求数据：**

```json
const post = {
            "nid":"1", "需要克隆的笔记仓库id"
            "uid":"1", "克隆他人笔记的用户的id"
			"username":"hello" "uid的用户名"
}
```

**返回数据：**

```json
{
    "status":"clone success"
}
```

### 11. 原创授权他人更新推送原笔记仓库

**必选参数：title,uid,bid;**

**接口地址：post，/agree** 

**请求数据：**

```json
const post = {
            "title":", "该笔记仓库名"
            "uid":"1", "克隆该笔记的用户id，授权后有权更新原仓库"
			"bid":"2"  ；"该笔记仓库创建用户id"
}
```

**返回数据：**

```json
{
    "status":"agree success"
}
```

### 12. 取消授权他人更新推送源笔记仓库

**必选参数：**

**接口地址：delete，/delnote/:id（笔记仓库id）** 

**请求数据：**

```json
const post = {
            "title":"标题1", "该笔记仓库名"
            "uid":"1", "克隆该笔记的用户id，取消授权后该用户不可更新原创仓库"
			"bid":"2"  "该笔记仓库创建用户id"
}
```

**返回数据：post，/refuse**

```json
{
    "status":"refuse success"
}
```

### 13. 原创获取所有克隆本仓库的用户

**必选参数：**

**接口地址：get，/copeuser/:id（笔记仓库id）** 

**返回数据：**

```json
{
    "status":"0",
    "data":[{
		"uid":1,
		"username":"hello",
		"authority":false
	},
	{
		"uid":2,
		"username":"hello2",
		"authority":true
	}]
}
```

### 14. 克隆笔记的用户同步推送自己仓库和原仓库

**必选参数：id（克隆笔记仓库id）,content,time;**

**接口地址：post，/otherudt** 

**返回数据：**

```json
//授权用户
{
    "status":"push success"
}
//非授权用户
{
    "status":"no authority,push fail!"
}
```

### 15. 广场知识分享-获取所有开源笔记仓库

**必选参数：**

**接口地址：get，/share** 

**返回数据：**

```json
{
    "status":"0",
    "data":[{
		"id":1, //笔记id
		"uid":1, //该笔记仓库用户
		"username":"hello",
		"title":"标题1",
		"description":"hhh",
		"content":"ttt",
		"time":"12:00",
		"bid":1,  //该仓库原创用户id，bid==uid为非克隆仓库，bid!=uid为uid克隆bid的笔记
		"buser":"hello"  //原创用户名
	}]
}
```
### 16. 获取所有用户列表

**必选参数：**

**接口地址：get，userlist** 

**返回数据：**

```json
{
    "status":"0",
    "data":[{		
		"id":1, 
		"username":"hello",
		"passwd":"123",
		"email":"14170377@qq.com",
		"phone":"15230801658"		
	},
	{		
		"id":2, 
		"username":"hello2",
		"passwd":"123",
		"email":"14170377@qq.com",
		"phone":"15230801658"		
	}]
}
```

### 16. 获取图片测试

**必选参数：**

**接口地址：/getimg** 

**返回数据：**

### 17. 获取音频测试

**必选参数：**

**接口地址：/getaudio** 

**返回数据：**

### 18. 获取视频测试

**必选参数：**

**接口地址：/getvideo** 

**返回数据：**

### 19. 上传图片测试

**必选参数：**

**接口地址：formData**：`formData.append('image', e);`

**返回数据：**

### 20. 上传录音测试

**必选参数：formData**：`formData.append('audiofile', e);`

**接口地址：/audionote** 

**返回数据：**

### 21. 上传视频测试

**必选参数：formData**：`formData.append('videofile', e);`

**接口地址：/video** 

**返回数据：**

