import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let res;
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
    // let bodyContent = body.content;
    // let content = JSON.parse(bodyContent).data;
    // let data = JSON.parse(content);
    // if(content){
    //     res = data; 
    // }
    if(bodyContent.head && bodyContent.body && bodyContent.head.functionId=="50000105"){ //单个行情订阅
        if(bodyContent.body.code && bodyContent.body.code.length>0)
        res = bodyContent.body.code;
    }else if(bodyContent.content){ //期货——登录
        
    }
    return res; 
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
export{sendSock,subscribeSingle,res}


