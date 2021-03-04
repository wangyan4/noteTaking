import React, { Component } from 'react'


export default class AppHome extends Component {
    constructor(){
        super();
        this.state = {
            imgsrc:''
        }
    }
    componentDidMount(){
        this.setState({
            imgsrc:`http://xpmxia.cn.utools.club/getimg`
        }); 
    }
    getfile = (e) => {        
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
            formData.append('image', f);

          
            fetch(`http://xpmxia.cn.utools.club/img`,{
                method:"POST",
                //headers:{'Content-Type': 'application/x-www-form-urlencoded'},
                body:formData  
            })
            .then(res =>res.json())
            .then(data =>{
                console.log(data);
                console.log('上传ok');
            });

        }


    }
    render() {
        var imgsrc = this.state.imgsrc;
        return (
            <div>
              
                <img src={''} id='mPhoto' style={{marginLeft:'16px',width:'30vw',height:'50vw',marginTop:'10px'}} />
                <input type='file' onChange={this.getfile} id='Photo' style={{marginTop:'10px'}} />

                <div>
                    <p>最近上传图片</p>
                    <img src={`${imgsrc}`} id='mPhoto' style={{marginLeft:'16px',width:'30vw',height:'50vw',marginTop:'10px'}} />
                </div>
                
            </div>
        )
    }

   

   

   
   
}