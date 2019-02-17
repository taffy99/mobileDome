<template>
    <div class='key-container' @click.stop='_handleKeyPress'>
        <div v-if="isInput" :class='[isInput?fadeIn:fadeOut,keyboard]'>
            <div class="tips">
               <span v-if="isPrice">最小变动价为{{priceTick}}，涨停{{upperLimitPrice}}，跌停{{lowerLimitPrice}}</span>
               <span v-else-if="isLots">最大开仓手数：{{maxOpenLots}}</span>
               <i class="iconfont icon-keyboardhide" data-num="O"></i>
            </div>
            <ul v-show="isPrice" class="priceTab">
                <li data-num="opponent">对手价</li>
                <li data-num="market">市价</li>
                <li data-num="new">最新价</li>
            </ul>
            <div class='key-row'>
                <div class='key-cell' data-num='1'>1</div>
                <div class='key-cell' data-num='2'>2</div>
                <div class='key-cell' data-num='3'>3</div>
                <div class='key-cell' data-num='-1'></div>
            </div>
            <div class='key-row'>
                <div class='key-cell' data-num='4'>4</div>
                <div class='key-cell' data-num='5'>5</div>
                <div class='key-cell' data-num='6'>6</div>
                <div class='key-cell' data-num='C'>清空</div>
            </div>
            <div class='key-row'>
                <div class='key-cell' data-num='7'>7</div>
                <div class='key-cell' data-num='8'>8</div>
                <div class='key-cell' data-num='9'>9</div>
                <div class='key-cell' data-num='-1'></div>
            </div>
            <div class='key-row'>
                <div class='key-cell' data-num='.' v-if="isPrice">.</div>
                <div class='key-cell disabled' data-num='-1' v-else></div>
                <div class='key-cell' data-num='0'>0</div>
                <div class='key-cell' data-num='D'><i class="iconfont icon-delete" data-num='D'></i></div>
                <div class='key-cell' data-num='-1'></div>
            </div>
            <div class='key-add' data-num='A'><span class="mark" data-num='A'>+</span></div>
            <div class='key-minus' data-num='M'><span class="mark" data-num='M'>－</span></div>
        </div>
    </div>
</template>

<script>
    export default{
        props:[
            'isInput',
            'isPrice',
            'isLots',
            'maxOpenLots', //最大开仓手数
            'priceTick', //最小变动价
            'maketPrice',//市价
            'opponentPrice',//对手价
            'upperLimitPrice',//涨停价
            'lowerLimitPrice'//跌停价
        ],
        mounted(){
        },
    	data(){
    		return{
                inputNum:"0",//手数
                fadeIn: 'fadeIn',
                fadeOut:'fadeOut',
                keyboard:'keyboard'
            }
        },
        methods : {
            _closeKeyBoard(){
                this.$emit('closeKeyBoard')
            },
			//处理按键
			_handleKeyPress(e) {
                let num = e.target.dataset.num;
                let S = this.inputNum
				//不同按键处理逻辑
				// -1 代表无效按键，直接返回
				if (num == -1) return false;
				switch (String(num)) {
					//小数点
					case '.':
						S = this._handleDecimalPoint();
						break;
					//删除键
					case 'D':
						S = this._handleDeleteKey();
                        break;
                    //加号
                    case 'A':
                        S = this._handleAddKey();
                        break;
                    //减号
                    case "M":
                        S = this._handleMinusKey();
                        break;
					//清空键
					case 'C':
						S = this._handleClearKey();
						break;
					//确认键
					case 'S':
						S = this._handleConfirmKey();
                        break;
                    //关闭键盘
                    case 'O':
                        this._closeKeyBoard();
                        break;
                    case 'opponent': //对手价
                        S = this._handleOpponentkey();
                        break;
                    case 'market'://市价
                        S = this._handleMarketKey();
                        break;
                    case 'new'://最新价
                        S = this._handleNewKey();
                        break;
                    default:
						S = this._handleNumberKey(num);
						break;
				}
                this.$emit('keyPressEvent',S)
			},
			//处理小数点函数
			_handleDecimalPoint() {
				//如果包含小数点，直接返回
				if (this.inputNum.indexOf('.') > -1) return false;
				//如果小数点是第一位，补0
				if (!this.inputNum.length)
					return this.inputNum = '0.';

				//如果不是，添加一个小数点
				else
					return this.inputNum = this.inputNum + '.';

			},
			//处理删除键
			_handleDeleteKey() {
				let S = this.inputNum.toString();
				//如果没有输入，直接返回
				if (!S.length) return false;
				//否则删除最后一个
				return this.inputNum = S.substring(0, S.length - 1);

			},
			//处理清空键
			_handleClearKey() {
				return this.inputNum = '';
			},
			//处理数字
			_handleNumberKey(num) {
                if(num===undefined){
                    num="";
                } 
				let S = this.inputNum.toString().replace(/[^0-9]+/g,"");
				//如果有小数点且小数点位数不小于2
				if ( S.indexOf('.') > -1 && S.substring(S.indexOf('.') + 1).length < 2)
					return this.inputNum = S + num;

				//没有小数点
				if (!(S.indexOf('.') > -1)) {
					//如果第一位是0，只能输入小数点
					if (num === 0 && S.length == 0)
						return this.inputNum = '0.';

					else {
						if (S.length && Number(S.charAt(0)) === 0) return this.inputNum = num;
						return this.inputNum = S + num;
					}
				}

            },
            //加号
            _handleAddKey() {
                if(this.inputNum ==""){
                    this.inputNum = "0";
                }
                let S = parseInt(this.inputNum);
                return this.inputNum = S+1;
            },
            //减号
            _handleMinusKey() {
                let S = parseInt(this.inputNum);
                if(this.inputNum == "" || this.inputNum == "0"||this.inputNum < 0){
                   return  this.inputNum = "0";
                }else{
                    return this.inputNum=S-1;
                }

            },
            //对手价
            _handleOpponentkey(){
                return this.inputNum="对手价";
            },
            //市价
            _handleMarketKey(){
                return this.inputNum = "市价";
            },
            //最新价
            _handleNewKey(){
                return this.inputNum = "最新价";
            },
			//提交
			_handleConfirmKey() {
				let S = this.inputNum;
				//未输入
				// if (!S.length){
				// 	alert( '您目前未输入!' )
				// 	return false;
				// }

				//将 8. 这种转换成 8.00
				if (S.indexOf('.') > -1 && S.indexOf('.') == (S.length - 1))
					S = Number(S.substring(0, S.length - 1)).toFixed(2);
				//保留两位
				S = Number(S).toFixed(2);
				this.$emit('confirmEvent',S)
			}
        }
    }
</script>

<style scoped>
    .tips{
        margin:0.5em;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .tips span{
        color:#007aff;
    }
    .tips i{
        font-size: 1.8em;
        color: rgba(0, 0, 0, 0.5);
    }
    .key-container {
        margin-top: 50px;
        width: 100%;
        display: flex;
        display : -webkit-flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

    }
    .input-box {
        font-size: 35px;
        font-weight: bold;
        height: 40px;
        border-bottom: 1px solid #aaa;
        padding: 10px 15px;
        text-align: right;
        width: 90%;
    }

    .keyboard {
        position: fixed;
        bottom: 4em;
        left: 0;
        width: 100%;
        background: rgba(210,213,219,1);
        color: #000000;
        z-index: 99;
    }
    .fadeIn{
        animation: keyboard-fade-in 0.6s;
        -webkit-animation: keyboard-fade-in 0.6s;
    }
    .fadeOut{
        animation: keyboard-fade-out 1s;
        -webkit-animation: keyboard-fade-out 1s;
    }
    @keyframes keyboard-fade-in {
        0% {
            transform: translate3d(0, 100%, 0);
            opacity: 0;
        }
        100% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
    }
    @keyframes keyboard-fade-out {
        0% {
            transform: translate3d(0, 0, 0);
            opacity: 1;
        }
        100% {
            transform: translate3d(0, -100%, 0);
            opacity: 0;
        }
    }
    .keyboard .key-row {
        display: flex;
        display: -webkit-flex;
        position: relative;
        height: 60px;
        line-height: 60px;
    }

    .keyboard .key-row::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .keyboard .key-cell {
        flex: 1;
        -webkit-box-flex: 1;
        text-align: center;
        position: relative;
        background: #fff;
        border-radius: 8px;
        margin: 0.2em;
        height: 3.5em;
        line-height: 3.5em;
        box-shadow: 0 2px 0 0 #848688;
    }
    .key-cell:active{
        background: rgba(0, 0, 0, 0.1);
    }
    .key-cell i{
        font-size:25px;
    }
    .keyboard .key-cell::after {
        content: '';
        position: absolute;
        overflow: hidden;
        top: 0;
        right: 0;
        bottom: 0;
        height: 200%;
        border-right: 1px solid #d5d5d6;
        color: #d5d5d6;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }

    .keyboard .key-cell:nth-last-child(1)::after {
        border-right: 0;
    }

    .keyboard .disabled {
        background: rgba(0, 0, 0, 0.2);
    }
    .keyboard .key-add{
        position: absolute;
        text-align: center;
        height: 7.5em;
        width: 24%;
        line-height: 7.5em;
        background: #fff;
        z-index: 5;
        right: .1em;
        bottom: 8.3em;
        border-radius: 8px;
    }
    .keyboard .key-minus {
        position: absolute;
        text-align: center;
        height: 7.5em;
        width: 24%;
        line-height: 7.5em;
        background: #fff;
        z-index: 5;
        right: .1em;
        bottom: .2em;
        border-radius: 8px;
    }
    .key-add:active,.key-minus:active{
        background:#eaeaea;
    }
    .mark{
        font-size: 38px;
        color: #007aff;
    }
    .priceTab{
        list-style: none;
        display: flex;
        margin:0.5em;
        padding:0;
        background:#d8d8d8;
        border:1px solid #979797;
        border-radius:10px;
        width:95%;
        height:2.5em;
        line-height: 2.5em;

    }
    .priceTab li{
            width:33%;
            text-align: center;
            border-right: 1px solid #979797
        }
    .priceTab li:last-child{
        border-right: none;
    }

</style>
