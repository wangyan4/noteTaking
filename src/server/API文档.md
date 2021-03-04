### 服务地址

> http://xpmxia.cn.utools.club

------

### 1. 用户注册

**必选参数：username,passwd,email,phone**

**接口地址：/register**

**返回数据：**

```json
{
    status:0,
    data:['ok']
}
```

### 2. 用户登录

**必选参数：**

**接口地址：/login**：

**返回数据：**

```json
{
    status:0,
    data:['ok']
}
```

### 3. 某用户创建笔记仓库

**必选参数：uid,username,title,description,content,time,ispub（boolean类型，是否开源）**

**接口地址：/notecreate**

**返回数据：**

```json
{
    status:0,
    data:['ok']
}
```

### 4. 获取某个笔记仓库详细信息

**必选参数：**

**接口地址：/getnote/:id** 

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

### 5. 获取某用户所有笔记仓库

**必选参数：**

**接口地址：** 

**返回数据：**

```json

```

### 6. 获取图片测试

**必选参数：**

**接口地址：/getimg** 

**返回数据：**

### 7. 获取音频测试

**必选参数：**

**接口地址：/getaudio** 

**返回数据：**

### 8. 获取视频测试

**必选参数：**

**接口地址：/getvideo** 

**返回数据：**

### 9. 上传图片测试

**必选参数：**

**接口地址：formData**：`formData.append('image', e);`

**返回数据：**

### 6. 上传录音测试

**必选参数：formData**：`formData.append('audiofile', e);`

**接口地址：/audionote** 

**返回数据：**

### 6. 上传视频测试

**必选参数：formData**：`formData.append('videofile', e);`

**接口地址：/video** 

**返回数据：**

