### 服务地址

> http://xpmxia.cn.utools.club

------


### 1. 用户注册   

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


### 2. 用户登录   

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
	"data":{ 
		'id': '1618923467556',
		'username': '18332171990',
        'passwd': 'wy123456',
        'em_ph': '18332171990',
        'headsrc': '' 
	}
}
//登录失败(手机号/邮箱/密码错误)
{
    "success":false,
	"message":"login fail"
}
```

### 3. 媒体文件上传（图片，音频，视频） 

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

### 4. 编辑修改，保存笔记（适用源仓库更新，无权限的克隆仓库更新）  

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

### 5. 获取某笔记详细内容  

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

### 6. 广场知识分享-获取分享列表（ispub=true） 

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

### 7. 广场知识分享-获取开源列表，所有可克隆的源仓库（clone=true&uid=bid） 

**必选参数：**

**接口地址：get，/getClone** 

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

### 8. 新建笔记仓库(默认可分享可克隆)   

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

### 9. 删除笔记仓库（被克隆的源仓库删除后，其克隆仓库copy_id值置为空） 

**必选参数：**

**接口地址：delete，/delnote/:id（笔记仓库id）** 

**返回数据：**

```json
{
    "success":true,
	"message":"delete success"
}
```


### 10. 获取某用户所有笔记仓库（含克隆）  

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


### 11. 是否同意分享 

**必选参数：id(笔记id),flag**

**接口地址：get，/setShare** 

**请求数据：flag=true(同意分享)；false(取消分享)**

```json

'http://xpmxia.cn.utools.club/setShare/id=1619079568333&flag=true'

```

**返回数据：**

```json
{
    "success":true,
	"message":"share set success"
}
```

### 12. 是否同意开源（克隆）  

**必选参数：id(笔记id),flag**

**接口地址：get，/setClone** 

**请求数据：flag=true(同意开源)；false(取消开源)**

```json

'http://xpmxia.cn.utools.club/setClone/id=1619079568333&flag=true'

```

**返回数据：**

```json
{
    "success":true,
	"message":"clone set success"
}
```

### 13. 克隆他人开源笔记仓库（首次调用是克隆，再次则是更新） （默认authority=false,原作者授权后可协作更新笔记） 

**必选参数：nid,uid**

**接口地址：post，/clone** 

**请求数据：**

```json
const post = {
    "nid":"1619079568333", "源笔记仓库id"
	"uid":"1618923351959", "当前用户id，非该笔记作者id"
}
```

**返回数据：**

```json
{
    "success":true,
	"message":"clone success"
}
```

### 14. 原创授权克隆该笔记的某用户推送原笔记仓库，默认为false   

**必选参数：nid,uid,flag(true为授权；false取消授权)**

**接口地址：post，/agree** 

**请求数据：**

```json
const post = {
    "nid":"1619079568333","该笔记仓库id(源仓库)"
    "uid":"1618923351959", "源仓库作者授权给该uid用户 授权后该uid用户可往源仓库推送笔记 非源作者id"
	"flag":true
}
```

**返回数据：**

```json
{
    "success":true,
	"message":"set authority success"
}
```



### 15. 用户某源仓库获取所有克隆本仓库的用户信息（用于授权）  

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

### 16. 克隆仓库的更新，同步推送此克隆仓库和原仓库（有权限时调用）

**必选参数：id（该克隆仓库id）,content**

**接口地址：post，/teampush** 

**请求数据：**

```json
const post = {
    "id":"1619099791222",
    "content":"<p>你好，李焕英</p><div class=\"media-wrap image-wrap\"><img autoplay=\"\" controls=\"\" poster=\"\" src=\"http://192.168.88.144:8002/getmediafile/1618497829078.png\"/></div><p>哈哈哈</p>"
}
```

**返回数据：**

```json
//有权限
{
    "success":true,
	"message":"push success"
}
//无权限
{
    "success":false,
	"message":"no authority push!clone note push success,but origin note push fail!"
}
//有权限，但笔记仓库非最新版本，需先克隆更新，再推送
{
    "success":false,
	"message":"please clone and update note again!"
}
```


### 17. 获取所有用户列表  

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



### 18. 用户更新头像

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

### 19. 获取用户头像

**必选参数：**

**接口地址：get，/gethead/:id（用户id）**：

**请求示例：**

```json
`http://xpmxia.cn.utools.club/gethead/1` 
```



### 20. 获取图片测试

**必选参数：**

**接口地址：/getimg** 

**返回数据：**

### 21. 获取音频测试

**必选参数：**

**接口地址：/getaudio** 

**返回数据：**

### 22. 获取视频测试

**必选参数：**

**接口地址：/getvideo** 

**返回数据：**

### 23. 上传图片测试

**必选参数：**

**接口地址：formData**：`formData.append('image', e);`

**返回数据：**

### 24. 上传录音测试

**必选参数：formData**：`formData.append('audiofile', e);`

**接口地址：/audionote** 

**返回数据：**

### 25. 上传视频测试

**必选参数：formData**：`formData.append('videofile', e);`

**接口地址：/video** 

**返回数据：**

### 26. 说明
判断源仓库和克隆仓库的方法：
-笔记信息的copy_id字段非空则为克隆笔记，值为源仓库id;反之为源仓库，即copy_id='';

数据库note表version字段：
-源仓库始终为最新版本，团队协作的最新笔记；
-对于源仓库，version值为false表示他人有新推送，源仓库有更新；查看后可置version=true;
-对于克隆仓库，version值为false表示笔记非最新版本，需再次克隆进行更新；version=true即已为最新版本。

创建笔记时，默认笔记可分享可克隆

笔记二次更新修改时，所调用的接口需要区分，源仓库用updatenote，克隆仓库用teampush(通过copy_id字段判断)
注意：克隆仓库没有权限时只能推送自己仓库 不能推送源仓库，克隆仓库有权限但没有更新至最新版本 都不能推送；