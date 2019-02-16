import request from '@/utils/request'

//登录接口
export function login(params){
    return request({
        url:'/user/login',
        method:'get',
        params:{
            id:params.loginId,
            password:params.password
            //institutionId:params.institutionId
        }
    })
}

//获取机构信息
export function getInstitution(params){
    return request({
        url:'/NoAuthentication/getInstitution',
        method:'get',
        params:{
            loginId:params.loginId
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
export function querySelfInfo(){
    return request({
        url:'contractUser/findAllContractUser',
        method:'post'
    })
}

//删除自选
export function deleteSelfInfo(params){
    return request({
        url:"contractUser/delete",
        method:'post',
        data:params
    })
}