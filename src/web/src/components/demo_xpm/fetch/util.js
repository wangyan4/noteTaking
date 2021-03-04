import queryString from 'query-string';

let rootUrl = 'http://xpmxia.cn.utools.club';


let myFetch = {
    get(url,queryParams){
        url = rootUrl+url
        if(queryParams){
            url += "?"+queryString.stringify(queryParams);
        }
        
        return fetch(url,{
            method:"GET"})
        .then(res=>res.json())
    },
    post(url,body){
        return fetch(rootUrl+url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:JSON.stringify(body)
        })
        .then(res=>res.json())
    },
    chatpost(url,body){
        return fetch(rootUrl+url,{
            method:'POST',
            body:body
        })
        .then(res=>res.json())
    },
    chatput(url,body){
        return fetch(rootUrl+url,{
            method:'PUT',
            body:body
        })
        .then(res=>res.json())
    },
    audiopost(url,body){
        return fetch(rootUrl+url,{
            method:'POST',
            // headers:{
            //     'Content-Type': 'application/x-www-form-urlencoded'
            // },
            body:body
        })
        .then(res=>res.json())
    },
    audioput(url,body){
        return fetch(rootUrl+url,{
            method:'PUT',
            // headers:{
            //     'Content-Type': 'application/x-www-form-urlencoded'
            // },
            body:body
        })
        .then(res=>res.json())
    },
    put(url,body){
        return fetch(rootUrl+url,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:JSON.stringify(body)
        })
        .then(res=>res.json())
    },
    fileput(url,body){
        return fetch(rootUrl+url,{
            method:'PUT',
            // headers:{
            //     "Content-Type": "multipart/form-data"
            // },
            body:body
        })
        .then(res=>res.json())
    },
    filepost(url,body){
        return fetch(rootUrl+url,{
            method:'POST',
            // headers:{
            //     "Content-Type": "multipart/form-data"
            // },
            body:body
        })
        .then(res=>res.json())
    }
}

export {myFetch};