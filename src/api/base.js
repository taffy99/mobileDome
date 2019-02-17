import request from '@/utils/request'

//登录接口
export function login(params){
    return request({
        url:'/user/login',
        method:'get',
        params:{
            id:params.loginId,
            password:params.password
        }
    })
}
//登出
export function logout(params){
    return request({
        url:'/user/logout',
        method:'get',
        params:{
            id:params.userId,
            
        }
    })
}
//用户认证
export function userComfirm(params){
    return request({
        url:'/externalInterface/commonService',
        method:'get',
        params:{
            functionId:10000001,
            loginId:params.loginId,
            password:params.password,
            institutionId:params.institutionId
        }
    })
}
//机构认证
export function getInstitution(params){
    return request({
        url:'/externalInterface/commonService',
        method:'get',
        params:{
            functionId:10000005,
            userId:params.userId
        }
    })
}

//添加自选
export function addSelfInfo(params){
    return request({
        url:'/contractUser/save',
        method:'post',
        data:params
    })
}

//查询自选
export function querySelfInfo(params){
    return request({
        url:'/contractUser/findAllContractUser',
        method:'get',
        params:{
            userId:params.userId
        }
    })
}

//删除自选
export function deleteSelfInfo(params){
    return request({
        url:"/contractUser/delete",
        method:'post',
        data:params
    })
}

//选择开户公司
export function brokerList(params){
  return request({
    url:"/broker/brokerList",
    method:'post',
    data:params
  })
}

//策略监控 —— 终端状态
 export function terminalState(params){
     return request({
         url:"/externalInterface/commonService",
         method:'get',
         params:{
            functionId:"10000008",
            loginId:params.loginId
         }
     })
 }
 //策略监控 —— 启停启停策略
 export function strategyAction(params){
    return request({
        url:"/externalInterface/commonService",
        method:'post',
        data:{
           functionId:"10000009",
           playState:params.playState, //策略运行状态
           id:params.loginId,
           token:params.token,
           strategies:params.strategies
        }
    })
}
 //微信认证 —— 查询绑定用户
 export function getUserWx(params){
    return request({
        url:"/userWx/getUserWx",
        method:'get',
        params:{
            wxOpenId:params.wxOpenId
        }
    })
}
//微信认证 —— 认证登陆
export function loginByUserId(params){
    return request({
        url:"/user/loginByUserId",
        method:'get',
        params:{
            userId:params.userId
        }
    })
}
//微信认证 —— 新增认证
export function addUserWx(params){
    return request({
        url:"/userWx/addUserWx",
        method:'get',
        params:{
            userId:params.userId,
            wxOpenId:params.wxOpenId,
            wxImgUrl:params.wxImgUrl

        }
    })
}
