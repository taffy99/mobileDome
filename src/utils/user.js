import Cookies from 'js-cookie'

let UserId = 'userId';
let UserName = 'userName';
    // 有效期 1 天
const expires = 1 

export function getUserId() {
    return Cookies.get(UserId)
}

export function setUserId(userId) {
    //不设置有效期则关闭浏览器清除cookie
    // return Cookies.set(TokenKey, token, { expires: expires })
    return Cookies.set(UserId, userId)
}

export function removeUserId() {
    return Cookies.remove(UserId)
}