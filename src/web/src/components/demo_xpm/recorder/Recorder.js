import React, {Component} from 'react';
//import AudioAnalyser from "react-audio-analyser";
import {myFetch} from '../fetch/util';
import Recorder from 'js-audio-recorder';

let recorder = new Recorder({
    sampleBits: 16,                 // 采样位数，支持 8 或 16，默认是16
    sampleRate: 16000,              // 采样率，支持 11025、16000、22050、24000、44100、48000 阿里云要求16000
    numChannels: 1                  // 声道，支持 1 或 2， 默认是1
});

let timer;
let flag=0;

export default class Recordertotext extends Component{
    constructor(props) {
        super(props)
        this.state = {
            // status: "",
            // audioType:"audio/wav"
        }
    }

    componentDidMount() {
    }

    // controlAudio(status) {
    //     this.setState({
    //         status
    //     });
    //     // if(status=='inactive'){
    //     //     this.props.parent.getAudioMsg(this, this.state.audioSrc);
    //     //     console.log('向父组件传audio');
    //     // }
    // }

    render() {
        
        // const {status, audioSrc, audioType} = this.state;
        // const audioProps = {
        //     audioType,
        //     audioOptions: {sampleRate: 30000}, // 设置输出音频采样率
        //     status,
        //     audioSrc,
        //     timeslice: 1000, // timeslice（https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/start#Parameters）
        //     startCallback: (e) => {
        //         console.log("succ start", e)
        //     },
        //     pauseCallback: (e) => {
        //         console.log("succ pause", e)
        //     },
        //     stopCallback: (e) => {
        //         this.setState({
        //             audioSrc: window.URL.createObjectURL(e)
        //         });
        //         let formData = new FormData();
        //         formData.append('textaudio', e);
        //         console.log(formData);
        //         myFetch.audiopost(`/autotext`,formData)
        //         .then(res=>{
        //             console.log(res);
        //         });
        //         console.log('语音识别');
        //         //this.props.parent.getAudioMsg(this, window.URL.createObjectURL(e));
        //         //console.log('向父组件传');
        //         //audioSrc=window.URL.createObjectURL(e);
        //         console.log("succ stop", e);
        //     },
        //     onRecordCallback: (e) => {
        //         console.log("recording", e)
        //     },
        //     errorCallback: (err) => {
        //         console.log("error", err)
        //     }
        // }

        return (
            <div>
                {/**
                <AudioAnalyser {...audioProps}>
                <div className="btn-box">
                        {status !== "recording" &&
                        <button onClick={() => this.controlAudio("recording")}>开始</button>}
                        {status === "recording" &&
                        <button onClick={() => this.controlAudio("paused")}>暂停</button>}
                        <button onClick={() => this.controlAudio("inactive")}>停止</button>
                </div>
                </AudioAnalyser>
                 */}     
                <div id="box" onTouchStart={this.startRecord} onTouchEnd={this.transRecord}>语音转文字</div>
            </div>
        );
    }
    startRecord = ()=> {   
        timer = setTimeout(()=>{
            recorder.start();
            flag=1;
        },500)
    }
    transRecord = (e)=> {
        clearTimeout(timer);
        if(flag){
            let pcm = recorder.getWAVBlob();
            let formdata = new FormData();
            formdata.append('textaudio', pcm);
            myFetch.audiopost('/autotext',formdata)
            .then(res=>{
                console.log('语音识别结果',res.data); 
                this.props.parent.getAudioMsg(this,res.data);
            });
            flag=0;
        }
    }



}
