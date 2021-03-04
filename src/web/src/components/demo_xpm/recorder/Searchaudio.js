import React, {Component} from 'react';
import {myFetch} from '../fetch/util';
import Recorder from 'js-audio-recorder';

let recorder = new Recorder({
    sampleBits: 16,                 
    sampleRate: 16000,          
    numChannels: 1       
});

let timer;
let flag=0;

export default class Searchaudio extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>   
                <div id="box" onTouchStart={this.startRecord} onTouchEnd={this.transRecord}>
                    <img src={require('./imgs/speak.png')} />
                </div>
                
            </div>
        );
    }
    startRecord = ()=> {   
        console.log('开始');
        timer = setTimeout(()=>{
            recorder.start();
            flag=1;
        },500)
    }
    transRecord = (e)=> {
        console.log('结束');
        clearTimeout(timer);
        if(flag){
            let pcm = recorder.getWAVBlob();
            let formdata = new FormData();
            formdata.append('textaudio', pcm);
            myFetch.audiopost('/autotext',formdata)
            .then(res=>{
                console.log('语音识别结果',res.data); 
                this.props.parent.getSearchMsg(this,res.data);
            });
            flag=0;
        }
    }



}
