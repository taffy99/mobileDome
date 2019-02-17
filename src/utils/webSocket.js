import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

import { MessageBox } from "mint-ui";
let res; //行情查询
let futureInfo;//全部合约信息
let futureLogin;//期货——登录
let ftdcQryTradingAccount;//期货-资金查询
let ftdcQryInvestorPosition;//期货-投资者持仓查询
let stompClient = null;

function initWebSocket(){ //初始化websocket
    //ws地址
    let socket = new SockJS(process.env.BASE_API+'/websocket-server');
    stompClient = Stomp.over(socket);
    stompClient.connect(
        {},//传参
        function connectCallback(frame) { //成功回调
            console.log("WebSocket连接成功");
            //subscribeSock();
            subscribeGroup();
    },function errorCallBack(error) {
        // 连接失败时（服务器响应 ERROR 帧）的回调方法
        console.log("WebSocket连接发生错误");
        //initWebSocket();
    });
   
}   
function sendSock(message) {//发送
    stompClient.send("/listen/client", {}, JSON.stringify(message));
}
function subscribeSingle(userName){//单个订阅 
    stompClient.subscribe('/user/'+userName+'/message', responseCallback); 
}

function responseCallback(greeting){ //订阅回调
    let bodyContent = JSON.parse(greeting.body);
    if(bodyContent.head && bodyContent.body && bodyContent.head.functionId=="50000105"){ //行情订阅
        if(bodyContent.body.code && bodyContent.body.code.length>0)
        res=[];
        res = bodyContent.body.code;
    }else if(bodyContent.content){ //期货交易
        let content = JSON.parse(bodyContent.content);
         if(content.msgCode==0 && content.data){
            let resData =  JSON.parse(content.data);
            if(content.functionId && content.functionId=="71000129"){ //ORS登录
                if(content.token){
                    resData.token = content.token;
                    futureLogin = resData;
                };
            };
            if(content.functionId && content.functionId == "71000123"){ //ORS资金查询
                ftdcQryTradingAccount = resData[0];
            };
            if(content.functionId && content.functionId == "71000122"){ //ORS投资者持仓查询
                ftdcQryInvestorPosition = resData;
            };
        }else{
            MessageBox.alert(content.msgContent);
        };
        }else if(bodyContent.head && bodyContent.body && bodyContent.head.functionId=="50000106"){ //查询所有合约信息
                if(bodyContent.body.info && bodyContent.body.info.length>0){
                    futureInfo=[];
                    futureInfo = bodyContent.body.info;
                }
        }   
    return res,futureLogin,futureInfo,ftdcQryTradingAccount,ftdcQryInvestorPosition;
}
function subscribeGroup(){ //群体订阅
    stompClient.subscribe('/orsSystemTopic/message', function (greeting) {//群体订阅
        let body = JSON.parse(greeting.body);
        let content = JSON.parse(body.content);
        if(content.body.code&&content.body.code.length>0){
            text = text + body.data.serviceCode+"; 发送内容:"+body.data.content;
        }
    });
}
function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
}
initWebSocket();
export{sendSock,subscribeSingle,res,futureInfo,futureLogin,ftdcQryTradingAccount,ftdcQryInvestorPosition}


