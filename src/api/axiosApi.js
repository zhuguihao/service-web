import axios from 'axios';
import utils from './variable'
import util from '@/api/util'


// 使用由库提供的配置的默认值来创建实例
// 此时超时配置的默认值是 `0`
let instance = axios.create();

// 覆写库的超时默认值
// 现在，在超时前，所有请求都会等待 2.5 秒
instance.defaults.timeout = utils.instanceTimeout;
//设置基本接口地址
instance.defaults.baseURL = utils.instanceBaseUrl;


const post = function (url, params) {
    return new Promise((resolve, reject) => {
        let token = util.getToken()
        instance.defaults.headers = {
            token: token
        }
        console.log("token:"+token)
        console.log("axiosUrl:"+url)
        console.log("axiosParams:"+JSON.stringify(params))
        instance.post(url,params).then(function (response) {
            if (200 === response.status){
                console.log("axiosData:"+JSON.stringify(response.data))
                resolve(response.data);
            } else {
                console.log("超时了")
                reject(error);
            }
        }).catch(function (error) {
            console.log("超时了111")
            console.log(error);
            reject(error);
        })
    });
}

export default post;