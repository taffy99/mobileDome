import Cookies from 'js-cookie'

const TokenKey = 'User-Token'
    // 有效期 1 天
 const expires = 1 
let FutureToken = "future-Token"

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    //不设置有效期则关闭浏览器清除cookie
    // return Cookies.set(TokenKey, token, { expires: expires })
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}

export function getFutureToken() {
    return Cookies.get(FutureToken)
}

export function setFutureToken(futureToken) {
    //不设置有效期则关闭浏览器清除cookie
    // return Cookies.set(TokenKey, token, { expires: expires })
    return Cookies.set(FutureToken, futureToken)
}

export function removeFutureToken() {
    return Cookies.remove(FutureToken)
}