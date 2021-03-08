import React, { Component } from 'react'


export default class AppHome extends Component {
    constructor(){
        super();
        this.state = {
            getsrc:'',
            vsrc:''
        }
    }
    componentDidMount(){
        this.setState({ //http://192.168.88.144:8002/video
            vsrc:`http://xpmxia.cn.utools.club/getvideo`
        });           
    }
    getfile = (e) => {
        //var uid = this.state.uid;
        console.log(e.target);
        var r= new FileReader();
        var f=document.getElementById('Photo').files[0];

        console.log(f);
        var windowURL = window.URL || window.webkitURL;
        var dataURL;
        dataURL = windowURL.createObjectURL(f);

        r.readAsDataURL(f);

        r.onload=function (e) {
            document.getElementById('mPhoto').src=dataURL;
        //   console.log(dataURL);
        //   console.log(this.result);

            var formData = new FormData();
            formData.append('videofile', f);
          
            fetch(`http://xpmxia.cn.utools.club/video`,{           
                method:"POST",
                //headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                body:formData  //把提交的内容转字符串
            })
            .then(res =>res.json())
            .then(data =>{
                console.log(data);
                console.log('上传ok');
            });

        }


    }
    render() {
        var getsrc = this.state.getsrc;
        return (
            <div>              
                
                <video width='100%' height='80%' controls='controls' id='mPhoto' style={{width:'40vw',height:'50vw'}}>
                    <source src={getsrc} type='video/mp4' />
                    您的浏览器不支持Video
                </video>
                <input type='file' onChange={this.getfile} id='Photo' style={{marginTop:'10px'}} />

                <div>
                    <p>最近上传视频</p>                    
                    <video width='100%' height='80%' controls='controls'  style={{width:'40vw',height:'50vw'}}>
                        <source src={this.state.vsrc} type='video/mp4' />
                        您的浏览器不支持Video
                    </video>
                </div>
                
            </div>
        )
    }

   

   

   
   
}