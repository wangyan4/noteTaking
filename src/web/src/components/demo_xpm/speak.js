import React, { Component } from 'react'
import AudioAnalyser from "react-audio-analyser";  //npm install react-audio-analyser --save
import {myFetch} from './fetch/util';
//import Textaudio from './recorder/Recorder';



var timer; //录音进度条定时器
var rectimer; //录音计时
var audioBlob='';

export default class AppHome extends Component {
    constructor(){
        super();
        this.state = {
            showrecord:false,//录音控件
            percent: 0, //录音进度条
            mtime:0,
            stime:0,
            status: '',
            flag:0,
            src:'',
            istext:false//是否进行语音识别

        }
    }
    
    componentDidMount(){        
        this.setState({
            src:`http://xpmxia.cn.utools.club/getaudio`
        });        
    }
    
    render() {
        let { status, audioSrc, audioType} = this.state;
        const audioProps = {
            audioType,
            audioOptions: {sampleRate: 16000}, // 设置输出音频采样率
            status,
            audioSrc,
            timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
            startCallback: (e) => {
                console.log("succ start", e)
            },
            pauseCallback: (e) => {
                console.log("succ pause", e)
            },
            stopCallback: (e) => {
                this.setState({
                    audioSrc: window.URL.createObjectURL(e)
                })
                console.log("succ stop", window.URL.createObjectURL(e));
                audioBlob=e;
            },
            onRecordCallback: (e) => {
                console.log("recording", e)
            },
            errorCallback: (err) => {
                console.log("error", err)
            }
        }
        return (
            <div>
                <audio controls src={this.state.audioSrc} className='audio_nt' style={{display:'none'}} />
                
                <div>                                

                            {status !== "recording" && <button onClick={() => this.controlAudio("recording")}>录音开始</button>}
                            {status === "recording" && <button onClick={() => this.controlAudio("paused")}>录音暂停</button>}        
                            <button onClick={() => this.controlAudio("inactive")}>录音停止</button>                

                            <div className="show-info">
                                <div className="progress" style={this.state.flag == 0 ? {display:'none'} : {display:'block'}}>正在录音...</div>
                                <div aria-hidden="true" className="redtime_nt">{this.state.mtime==0?'00':this.state.mtime}:{this.state.stime==0?'00':this.state.stime}</div>
                            </div>        

                </div>

                <button onClick={this.saveAudio}>音频上传</button>

                <div><AudioAnalyser {...audioProps}></AudioAnalyser></div>

                <p>最新上传的音频</p>

                <audio controls src={this.state.src} className='audio_nt'/>

                
            </div>
        )
    }

    /**录音 */
    recording = ()=> {
        this.setState({
            showrecord:true,
            flag:1
        });
    }
    controlAudio(status) {
        this.setState({
            status
        });
        if(status=='inactive'){
            this.setState({
                showrecord:false,
                percent:0,
                mtime:0,
                stime:0,
                flag:0
            });
            clearInterval(timer);
            clearInterval(rectimer);
        }else if(status=='recording'){
            timer=setInterval(() => {
                this.add();
            }, 100);
            rectimer=setInterval(() => {
                var m = Number(this.state.mtime);
                var s = Number(this.state.stime);
                console.log(m,s,'lll');
                s=s+1;
                s=s+'';
                console.log(m,s,'ppp');
                if(s.length==1){
                    s='0'+s;
                    this.setState({
                        stime:s
                    });
                }else if(s.length==2){
                    if(Number(s)<60){
                        this.setState({
                            stime:s
                        });        
                    }else{
                        m=m+1;
                        m=m+'';
                        this.setState({
                            stime:0
                        });
                        if(m.length==1){
                            m='0'+m;
                            this.setState({
                                mtime:m
                            });
                        }else if(m.length==2){
                            this.setState({
                                mtime:m
                            });
                        }
                    }
                }
            }, 1000);
        }else if(status=='paused'){
            clearInterval(timer);
            clearInterval(rectimer);
            
        }
    }
    changeScheme(e) {
        this.setState({
            audioType: e.target.value
        });
    }
    add = () => {
        let p = this.state.percent + 0.1;
        if (this.state.percent >= 100) {
          p = 0;
        }
        this.setState({ percent: p });
    }
    saveAudio = () => {
        //存储录音
        var nid = 1;
        if(audioBlob!=''){
            this.getAudioblob(audioBlob,nid);
            audioBlob='';
        }
    }
    //音频Blob对象封装成FormData对象
    getAudioblob = (e,nid)=> {
        let formData = new FormData();
        formData.append('audiofile', e);//'file.webm'
        console.log(formData);
        myFetch.audiopost(`/audionote`,formData)
        .then(res=>{
            console.log(res,'语音存储');
        });
    }

    
   

   

   
   
}