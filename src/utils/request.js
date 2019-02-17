import axios from "axios";
import { MessageBox } from "mint-ui";
import store from "../store"
import { getToken } from '@/utils/token'
//创建axios实例
const service = axios.create({
    baseURL:process.env.BASE_API,//api的base_url
    //baseURL:"https://172.16.1.53:443/ams-uic",
    timeout:10000 //请求超时时间
});

//request拦截器
service.interceptors.request.use(config =>{
    if (config.method === 'get') {
        if (config.params === undefined) {
            config.params = {}
        } 
        //store.commit('showLoading')
    }
    if(store.getters.token){
        //为每次请求添加token
        if(config.method === 'get'){
            if(config.params === undefined){
                config.params ={};
            }
            config.params['param'].token = getToken()
        }else if(config.method === 'post'){
            config.data.token = getToken();
        }
        store.commit('showLoading')
    } 
    return config
},error => {
    console.log(error);
    Promise.reject(error);
})

//response拦截器
service.interceptors.response.use(response =>{
    if(response.data.code === '1'){
        //store.commit('hideLoading')
        return response.data
    }else{
        MessageBox.alert(response.data.message);
        store.commit('hideLoading')
        return Promise.reject('error');
    }
},error => {
    console.log(error);
    Promise.reject(error);
    store.commit('hideLoading')
    MessageBox.alert("请求超时，请稍后再试！");
})

export default service