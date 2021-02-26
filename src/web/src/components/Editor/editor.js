import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import './editor.css'
// import 'braft-editor/dist/output.css'
import { message } from 'antd';

const defaultStr = `
    <p></p>
    <p class="title">标题:</p><br>
    <p class="description">描述:</p><br><hr>
`;
export default class Editor extends React.Component {
    
    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null),
        title: "这是一个标题",
        description: "这是一段描述",
        editItem:{}
    }

    //后台请求数据
    fetchEditorContent = () => {
        return defaultStr;
    }
    //向后台发送请求保存当前数据
    saveEditorContent = () => {
        return true
    }
    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if(nextProps.editItem.id){
    //         var state = BraftEditor.createEditorState(defaultStr + nextProps.editItem.content);
    //         console.log(state)
            
    //         editorInstance && editorInstance.clearEditorContent();
    //         editorInstance && editorInstance.setValue(state);
    //         return {
    //             editItem: nextProps.editItem
    //         };
    //     }
    //     return null;
    // }
    componentWillReceiveProps (nextProps) {
        if(nextProps.editItem.id){
            this.setState({
                editItem:nextProps.editItem,
                editorState:BraftEditor.createEditorState(defaultStr + nextProps.editItem.content)
            })
        }
    }
    async componentDidMount () {
        // 假设此处从服务端获取html格式的编辑器内容
        // const htmlContent = await this.fetchEditorContent()
        const htmlContent = this.props.editItem.content;
        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        this.setState({
            editorState: BraftEditor.createEditorState(defaultStr + htmlContent)
        })
    }

    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        message.success('保存成功！', 2)
        const htmlContent = this.state.editorState.toHTML()
        console.log(htmlContent);
        // const result = await saveEditorContent(htmlContent)
    }


    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }
    //由于图片上传、视频上传项目中都是单独走的接口，需要一个上传的方法
    myUploadFn = (param) => {
        console.log('param',param);
        const serverURL =`${window.sessionStorage.baseURL ? JSON.parse(window.sessionStorage.baseURL):""}/fileHandle/upload`//上传接口地址
        const xhr = new XMLHttpRequest();
        const fd = new FormData();
        if(param.file.type.indexOf("image")!="-1"&&(param.file.size/1024/1024)>9){
            param.error({
                msg: '请上传小于10M的图片'
            })
            message.warning("请上传小于10M的图片")
        }
        if(param.file.type.indexOf("video")!="-1"){
            if(param.file.type.indexOf("mp4")=="-1"){
                param.error({
                    msg: '请上传mp4格式的视频'
                })
                message.warning("请上传mp4格式的视频")
                return
            }
            if((param.file.size/1024/1024)>100){
                param.error({
                msg: '请上传小于100M的视频'
            })
            message.warning("请上传小于100M的视频")
            }
        }
        const successFn = (response) => {
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            const upLoadObject = JSON.parse(response && response.currentTarget && response.currentTarget.response);
            // console.log("JSON.parse(xhr.responseText).data",JSON.parse(xhr.responseText).data)
            param.success({
                 url:`${window.sessionStorage.baseURL ? JSON.parse(window.sessionStorage.baseURL)+"/fileHandle/video/preview?videoUrl=":""}${JSON.parse(xhr.responseText).data}`,
                meta: {
                    id: upLoadObject && upLoadObject.id,
                    title: upLoadObject && upLoadObject.fileName,
                    alt: upLoadObject && upLoadObject.fileName,
                    loop: false, // 指定音视频是否循环播放
                    autoPlay: true, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    poster: '', // 指定视频播放器的封面
                }
            })
        };

        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)

        };

        const errorFn = (response) => {
            // 上传发生错误时调用param.error
            param.error({
                msg: 'unable to upload.'
            })
        };

        xhr.upload.addEventListener("progress", progressFn, false);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);
        fd.append('file', param.file);
        xhr.open('POST', serverURL, true);
        //  xhr.setRequestHeader("X-Auth-Token", User.getToken());//header中token的设置
        xhr.send(fd)

    }

    render() {
        const { editorState } = this.state;
        return (
            <div className="braft-output-content">
                <BraftEditor
                    placeholder="请输入正文内容"
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                    media={{ uploadFn: this.myUploadFn }}
                />
            </div>
        )

    }

}