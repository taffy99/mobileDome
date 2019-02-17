import SockJS from 'sockjs-client';
import { MessageBox } from "mint-ui";
import store from "../store"
let websock = null;
let global_callback = null;
//let serverPort = '9999';	//webSocket连接端口
let res; //行情查询
let futureInfo;//全部合约信息
let futureLogin;//期货——登录
let ftdcQryTradingAccount;//期货-资金查询
let ftdcQryInvestorPosition;//期货-投资者持仓查询
let entrust;//当日委托查询
let scsTrading;//当日成交查询
let removerOrder;//当日委托撤单
let holdDetail;//持仓明细查询

let transactionPush; //成交推送

function getWebIP(){
    //let  curIP = window.location.hostname;
    let curIP = process.env.BASE_API+"/withSocketJs";
	return curIP;
}
function initWebSocket(token){ //初始化weosocket
    //ws地址
    let wsuri = getWebIP()+ "?token=" + token;
    websock = new SockJS(wsuri);
    websock.onmessage = function(e){
    	websocketonmessage(e);
    }
    websock.onclose = function(e){
    	websocketclose(e);
    }
    websock.onopen = function () {
	    websocketOpen();
	}

    //连接发生错误的回调方法
	websock.onerror = function () {
		console.log("WebSocket连接发生错误");
	}
}

// 实际调用的方法
function sendSock(agentData,callback){
    global_callback = callback;
    if (websock && websock.readyState === 1) { //1-连接建立成功
    	//若是ws开启状态
        websocketsend(agentData)
    }else if (websock && websock.readyState === 0) {//0-正在建立连接
    	// 若是 正在开启状态，则等待1s后重新调用
        setTimeout(function () {
        	sendSock(agentData,callback);
        }, 1000);
    }else {
        // 若未开启 ，则等待1s后重新调用
        if(store.state.token){
            initWebSocket(store.state.token);//重新连接
        }
        setTimeout(function () {
            sendSock(agentData,callback);
        }, 1000);
    }
}
//数据接收
function websocketonmessage(greeting){
    let bodyContent = JSON.parse(greeting.data);
    if(bodyContent.transferType&& bodyContent.transferType=="d"){
        if(bodyContent.serviceCode=="10000702"){ //mqs行情中心
            store.commit('hideLoading');
            MessageBox.alert("行情中心连接失败。");
            MessageBox.close();
            return;
        }else if(bodyContent.serviceCode=="10000701"){ //ORS期货平台
            store.commit('hideLoading');
            MessageBox.alert("期货平台连接失败。");
            MessageBox.close();
            return;
        }
    }
    if(bodyContent.content){
        let content = JSON.parse(bodyContent.content);
        if(content.head && content.head.functionId=="50000106"){ //mqs全部合约查询
            if(content.body && content.body.info.length>0){
                futureInfo=[];
                futureInfo = content.body.info;
            }
        }else if(content.head && content.head.functionId=="50000105"){ //mqs行情查询
            if(content.body && content.body.code.length>0){
                res = [];
                res = content.body.code;
            }
        }else if(content.msgCode==0 && content.data){
            let resData =  JSON.parse(content.data);
            if(content.functionId && content.functionId=="71000129"){ //ORS登录
                if(content.successFlag==1 && content.token){ //成功
                    resData.token = content.token;
                    futureLogin = resData;
                }else{//失败
                    store.commit('SET_FUTURETOKEN','');
                }
            };
            if(content.functionId && content.functionId == "71000123"){ //ORS资金查询
                ftdcQryTradingAccount = resData[0];
            }

            if(content.functionId && content.functionId == "71000122"){ //ORS投资者持仓查询
                ftdcQryInvestorPosition = resData;

            };
            if(content.functionId && content.functionId == "71000104"){ //ORS成交推送
                transactionPush = resData;
            }
            /*今日委托查询*/
            if(content.functionId && content.functionId == "71000120"){
              entrust = resData;

            }
            /*今日成交查询*/
            if(content.functionId && content.functionId == "71000121"){
              scsTrading = resData;
            }
            /*今日委托撤单  成功*/
            if(content.functionId && content.functionId == '71000103'){
              removerOrder = content.data;
            }
          /*持仓明细查询*/
          if(content.functionId && content.functionId == '71000132'){
            holdDetail = content.data;
          }
        }else{
          let functionId = JSON.parse(bodyContent.content).functionId
          /*委托撤单返回失败*/
          if(functionId == '71000126'){
            removerOrder = 'failure'
          }else if(functionId == '71000129'){ //登录失败
            futureLogin = undefined;
          }
          store.commit('hideLoading');
          if(content.msgContent && content.msgContent!="查询无数据"){
                MessageBox.alert(content.msgContent);
                //MessageBox.close();
            }
        };
    }
    return res,futureLogin,futureInfo,ftdcQryTradingAccount,ftdcQryInvestorPosition,entrust,scsTrading,transactionPush;

}

//数据发送
function websocketsend(agentData){
    console.log("send>>"+JSON.stringify(agentData))
    websock.send(JSON.stringify(agentData));
}

//关闭
function websocketclose(e){
    console.log(" WebSocke connection closed (" + e.code + ")");
}

function websocketOpen(e){
	console.log("WebSocket连接成功");
}

//initWebSocket();
export{sendSock,initWebSocket,res,futureInfo,futureLogin,ftdcQryTradingAccount,ftdcQryInvestorPosition,entrust,scsTrading,removerOrder,transactionPush,holdDetail}


