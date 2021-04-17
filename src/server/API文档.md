### 服务地址

> http://xpmxia.cn.utools.club

------

## 部分接口尚在测试阶段...

### 1. 用户注册（已测，OK）

**必选参数：em_ph,passwd**

**接口地址：post，/register**

**请求数据：**

```json
const post ={
            "em_ph":"15230801658",
            "passwd":"123"
};
```
**返回数据：**

```json
//注册成功
{
    "success":true,
	"message":"register success"
}
//注册失败
{
    "success":false,
	"message":"手机号/邮箱已注册！"
}
```


### 2. 用户登录（已测，OK）

**必选参数：em_ph,passwd**

**接口地址：post，/login**

**请求数据：**

```json
const post ={
            "em_ph":"15230801658",
            "passwd":"123"
};
```

**返回数据：**

```json
//登录成功
{
    "success":true,
	"message":"login success"
}
//登录失败(手机号/邮箱/密码错误)
{
    "success":false,
	"message":"login fail"
}
```

### 3. 媒体文件上传（图片，音频，视频）（已测，OK）

**必选参数：**

**接口地址：post，/mediaUpload**

**请求数据：**

```json
const fd = new FormData();
fd.append('file', param.file);
```

**返回数据：**

```json
{
    "success":true,
	"data":"http://192.168.88.144:8002/getmediafile/1618479214325.jpeg"
}
{
    "success":true,
	"data":"http://xpmxia.cn.utools.club/getmediafile/1618479214325.jpeg"
}

```

### 4. 编辑修改，保存笔记 （已测，OK）

**必选参数：id（笔记仓库id）,content（HTML格式笔记内容）**

**接口地址：post，/updatenote**

**请求数据：**

```json
const post ={
    "id":"1",
    "content":'<p>你好，李焕英</p>
	<p></p>
	<div class="media-wrap image-wrap">
	<img autoplay="" controls="" poster="" src="http://192.168.88.144:8002/getmediafile/1618496098764.jpeg"/>
	</div>
	<p>我的笔记，这是一段描述</p>'
};
```

**返回数据：**

```json
{
    "success":true,
    "message":"save success"
}
```

### 5. 获取某笔记详细内容（已测，OK）

**必选参数：**

**接口地址：get，/getnote/:id（笔记仓库id）** 

**返回数据：**

```json
{
	"success":true,
	"data":[{
		"id":1,
		"uid":"1",
		"username":"hh",
		"title":"aa",
		"description":"bb",
		"content":"<p>你好，李焕英</p><div class=\"media-wrap image-wrap\"><img autoplay=\"\" controls=\"\" poster=\"\" src=\"http://192.168.88.144:8002/getmediafile/1618497829078.png\"/></div><p>哈哈哈</p>","time":"2021-4-15 10:53:44 PM",
		"ispub":true,
		"bid":"1",
		"buser":"hh",
		"authority":true
	}]
}
```

### 6. 广场知识分享-获取所有开源笔记列表（已测，OK）

**必选参数：**

**接口地址：get，/share** 

**返回数据：**

```json
{
	"success":true,
	"data":[
		{
			"id":1,
			"uid":"1",
			"username":"hh",
			"title":"aa",
			"description":"bb",
			"content":"<p>你好，李焕英</p><div class=\"media-wrap image-wrap\"><img autoplay=\"\" controls=\"\" poster=\"\" src=\"http://192.168.88.144:8002/getmediafile/1618497829078.png\"/></div><p>哈哈哈</p>",
			"time":"2021-4-15 10:53:44 PM",
			"bid":"1",
			"buser":"hh"
		},
		{
			"id":2,
			"uid":"1",
			"username":"hh",
			"title":"aa",
			"description":"bb",
			"content":"cc",
			"time":"dd",
			"bid":"1",
			"buser":"hh"
		}
	]
}
```

### 7. 新建笔记仓库 

**必选参数：uid,username,title,description,content,ispub（是否开源）**

**接口地址：post，/notecreate**：

**请求数据：**

```json
const post = {
    "uid":"1",
    "username":"xiapeimin",
    "title":"笔记标题",
    "description":"这是笔记描述",
    "content":"<p>你好，李焕英</p><div class=\"media-wrap image-wrap\"><img autoplay=\"\" controls=\"\" poster=\"\" src=\"http://192.168.88.144:8002/getmediafile/1618497829078.png\"/></div><p>哈哈哈</p>",
    "ispub":true
}
```

**返回数据：**

```json
{
    "success":true,
	"message":"create success"
}
```

### 8. 删除笔记仓库（已测，OK）

**必选参数：**

**接口地址：delete，/delnote/:id（笔记仓库id）** 

**返回数据：**

```json
{
    "success":true,
	"message":"delete success"
}
```


### 9. 获取某用户所有笔记仓库（含克隆）（已测，OK）

**必选参数：**

**接口地址：get，/allnotes/:id（用户id）** 

**返回数据：**

```json
{
	"success":true,
	"data":[
		{
			"id":2,
			"uid":"1",
			"username":"hh",
			"title":"aa",
			"description":"bb",
			"content":"cc",
			"time":"dd",
			"ispub":true,
			"bid":"1",
			"buser":"hh",
			"authority":true
		},
		{
			"id":1,
			"uid":"1",
			"username":"hh",
			"title":"aa",
			"description":"bb",
			"content":"<p>hhh</p>",
			"time":"2021-4-16 3:35:54 PM",
			"ispub":true,
			"bid":"1",
			"buser":"hh",
			"authority":true
		}
	]
}

```

### 10. 克隆他人开源笔记仓库 （默认authority=false,原作者授权后可协作更新笔记） （已测，OK）

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
    "success":true,
	"message":"clone success"
}
```

### 11. 原创授权他人更新推送原笔记仓库

**必选参数：title,uid,bid;**

**接口地址：post，/agree** 

**请求数据：**

```json
const post = {
    "title":"笔记标题","该笔记仓库名"
    "uid":"1", "克隆该笔记的用户id，授权后有权更新原仓库"
	"bid":"2" "该笔记仓库创建用户id"
}
```

**返回数据：**

```json
{
    "success":true,
	"message":"agree success"
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
    "success":true,
	"message":"refuse success"
}
```

### 13. 原创获取所有克隆本仓库的用户

**必选参数：**

**接口地址：get，/copeuser/:id（笔记仓库id）** 

**返回数据：**

```json
{
    "success":true,
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
    "success":true,
	"message":"push success"
}
//非授权用户
{
    "success":true,
	"message":"no authority,push fail!"
}
```


### 15. 获取所有用户列表

**必选参数：**

**接口地址：get，userlist** 

**返回数据：**

```json
{
    "success":true,
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

### 16. 用户更新头像

**必选参数：**

**接口地址：post，/headimg/:id（用户id）** 

**请求示例：**

```json

```

**返回数据：**

```json
{
    "success":true,
	"message":"update success"
}
```

### 17. 获取用户头像

**必选参数：**

**接口地址：get，/gethead/:id（用户id）**：

**请求示例：**

```json
`http://xpmxia.cn.utools.club/gethead/1` 
```


### 18. 获取图片测试

**必选参数：**

**接口地址：/getimg** 

**返回数据：**

### 19. 获取音频测试

**必选参数：**

**接口地址：/getaudio** 

**返回数据：**

### 20. 获取视频测试

**必选参数：**

**接口地址：/getvideo** 

**返回数据：**

### 21. 上传图片测试

**必选参数：**

**接口地址：formData**：`formData.append('image', e);`

**返回数据：**

### 22. 上传录音测试

**必选参数：formData**：`formData.append('audiofile', e);`

**接口地址：/audionote** 

**返回数据：**

### 23. 上传视频测试

**必选参数：formData**：`formData.append('videofile', e);`

**接口地址：/video** 

**返回数据：**

