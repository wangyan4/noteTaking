import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
// import 'braft-editor/dist/output.css'
import { message } from 'antd';

const defaultStr=`
    <p></p>
    <p>标题:<input value = {this.state.title}/></p><br>
    <p>描述:<input value = {this.state.description}/></p>
`
export default class Editor extends React.Component {

    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(defaultStr),
        title:"这是一个标题",
        description:"这是一段描述"
    }

    fetchEditorContent = ()=>{
      return "<p>hello world<p>"
    }

    saveEditorContent = ()=>{ 
      return true
    }

    // async componentDidMount () {
    //     // 假设此处从服务端获取html格式的编辑器内容
    //     // const htmlContent = await fetchEditorContent()
    //     const htmlContent = ""
    //     // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    //     this.setState({
    //         editorState: BraftEditor.createEditorState(htmlContent)
    //     })
    // }

    submitContent = async () => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        message.success('保存成功！',2)
        const htmlContent = this.state.editorState.toHTML()
        console.log(htmlContent);
        // const result = await saveEditorContent(htmlContent)
    }


    handleEditorChange = (editorState) => {
        this.setState({ editorState })
    }

    render () {

        const { editorState } = this.state
        return (
            <div className="braft-output-content">
                <BraftEditor
                    value={editorState}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                />
            </div>
        )

    }

}