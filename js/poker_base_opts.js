/**
 * Created with JetBrains WebStorm.
 * User: vali
 * Date: 15-9-18
 * Time: 下午5:03
 * To change this template use File | Settings | File Templates.
 */

var RadomCards = [];//随机牌存储数组
var MyCards = [[],[],[],[],[],[]];//存储摸过来的牌，最多6位玩家
var currentHand = [];//存储当前出牌
var shownHand = [];//存储已出牌
var players = 1;//玩家数
var token = 0;//存储庄家序号
var tokenControl=[0];//存储出牌顺序
var preHand = [];//存储上家出牌的规则，比如[22,5]代表一对5，[43,8]代表4张连牌，最大到8

/*==================== 初始化 ====================*/
//卡片构造器
var Cards = (function () {
    var Card = function (number, type) {
        this.number = number;
        this.type = type;
    }
    return function (number, type) {
        return new Card(number, type);
    }
})()

//花色0-黑桃 1-梅花 2-方块  3-红桃 4-大鬼  5-小鬼
//数值0,2-14代表 鬼,2,3,4,5,6,7,8,9,10,J,Q,K,A;
function CreatCompeleteCard() {
    var arr = [];
    if(RadomCards!=null && RadomCards.length>0){
        arr = RadomCards;
    }else {
        var cardID = 0;
        var index = 2;
        for (var i = 0; i <= 14; i++) {
            if (i == 0) {
                //初始化大鬼，小鬼，并且填入初始化数组中的0位和1位
                arr[0] = new Cards(i, 4);//[0,4,"Joker"]
                arr[0].id = '04';
                arr[1] = new Cards(i, 5);//[1,5,"Joker"]
                arr[1].id = '05';
            } else if (i > 1) {
                for (var j = 0; j <= 3; j++) {
                    //初始化其余的牌数，放入数组中去
                    //从数组的第三位(下标位2开始，0，1已经被大鬼和小鬼占去)，每次初始化的是同一牌号下的同花色的牌
                    //例如初始化［2，0］，代表♠️2，之后是♣️2，♦️2和♥️2，然后初始化3...直到K
                    //花色0-黑桃 1-梅花 2-方块  3-红桃 4-大鬼  5-小鬼
                    arr[index] = new Cards(i, j);
                    arr[index].id = i + '' + j;
                    index++;
                }
            }
        }
    }
    RadomCards = SortCards(arr);
    Show4Play(null, '0');

    //初始化有两位玩家
    addBanker();
    addBanker();
    //发牌
    DealCard();
}

//洗牌，一个随机种子产生来保证每次的顺序在一定意义上的不重复
function SortCards(arr) {
    arr.sort(function (a, b) {
        return 0.5 - Math.random();
    })
    return arr;
}

//显示所有牌
function Show4Play(newCard, index) {
    document.getElementById("old").innerHTML = "";
    for (var i = 0; i < RadomCards.length; i++) {
        var node = drawCardByType(RadomCards[i], "pai");
        document.getElementById("old").appendChild(node);
        if(i>0){
            node.style.position ="absolute";
            if(node.previousElementSibling.style.left=='' || node.previousElementSibling.lastChild.style.left==null){
                node.previousElementSibling.style.left = "0px";
            }
            node.style.left = (parseInt(node.previousSibling.style.left)+20)+"px";
        }
    }

    document.getElementById("new"+index).innerHTML = "";
    for (var i = 0; i < MyCards[index].length; i++) {
        if(newCard!=null && newCard.id==MyCards[index][i].id){
            document.getElementById("new"+index).appendChild(drawCardByType(MyCards[index][i], "pai new highlight"));
        }else{
            document.getElementById("new"+index).appendChild(drawCardByType(MyCards[index][i], "pai new"));
        }
    }
}

//根据不同花式显示
function drawCardByType(card, className) {
    var newNode = document.createElement("div");
    newNode.id = card.id;

    var types = ["suitspades", "suitclubs", "suitdiamonds", "suithearts", " ", " "];
    var cardText = "";
    if (card.number == 0) {
        if(card.type == '4'){
            cardText = "☻";
        }else if(card.type == '5'){
            cardText = "☺";
        }
    }else if (card.number == 11) {
        cardText = "J";
    } else if (card.number == 12) {
        cardText = "Q";
    } else if (card.number == 13) {
        cardText = "K";
    } else if (card.number == 14) {
        cardText = "A";
    } else {
        cardText = card.number.toString();
    }
    //摸到的牌和打出的牌
    if (className == "pai new highlight" || className == "pai new") {
        newNode.className = className + " " + types[card.type];
        newNode.onclick = function(){
            chooseCard(this);
        };
        var pNode = document.createElement("p");
        pNode.textContent = cardText;
        newNode.appendChild(pNode);
    }
    //底牌
    else {
        newNode.className = "pai blank";
        var imgNode = document.createElement("img");
        imgNode.src = "img/poker-back.png";
        imgNode.className = "img";
        newNode.appendChild(imgNode);
    }
    return newNode;
}

/*==================== 发牌 ====================*/
function DealCard(){
    for(var i=0; i<5; i++){
        for(j=0;j<players;j++){
            DrawCards(j);
        }
    }
    DrawCards(token);
}

/*==================== 添加玩家 ====================*/
function addBanker(){
    if(players>6){
        alert("最多只能6位玩家！");
    }else{
        var newDivNode = "<div id=\"player"+players+"\">"
            +"<span>玩家 - "+(players+1)+"：</span>"
            +"<input type=\"button\" class=\"button disabled\" id=\"drawCard"+players+"\" value=\"摸牌\" onclick=\"DrawCards('"+players+"')\"  disabled/>"
            +"<input type=\"button\" class=\"button disabled\" id=\"showCard"+players+"\" value=\"出牌\" onclick=\"ShowHand('"+players+"')\" disabled/>"
            +"<input type=\"button\" class=\"button disabled\" id=\"noShowCard"+players+"\" value=\"不出\" onclick=\"NoShowHand('"+players+"')\" disabled/>"
            +"<br/>"
            +"<div id=\"new"+players+"\" class=\"div card\"></div>"
            +"<div class=\"div clear\"></div>"
            //+"<hr/>"
            +"</div>";
        var playGroundName;
        if(players%2 == 1){
            playGroundName ="leftPlayground";
        }else{
            playGroundName ="rightPlayground";
        }

        document.getElementById(playGroundName).innerHTML += newDivNode;
        tokenControl = tokenControl.concat(players);
        players++;

        document.getElementById("leftPlayground").style.height = 150*parseInt(players/2)+"px";
        document.getElementById("playground").style.height = 150*parseInt(players/2)+"px";
        document.getElementById("rightPlayground").style.height = 150*parseInt(players/2)+"px";
    }
}

/*==================== 摸牌 ====================*/
//摸牌，一次摸一张，第一个摸牌可以摸6张，之后每一轮赢的人可以摸牌
function DrawCards(index) {
    if (RadomCards.length == 0) {
        alert("牌摸完了！");
    } else {
        if((index == token && MyCards[index].length <= 6) || (index != token && MyCards[index].length <= 5)){
            var newCard = RadomCards.shift();
            GetCards(newCard, index);
            Show4Play(newCard, index);
            DisEnablePlayer("disable", index, "drawCard");
            if(index == token){
                DisEnablePlayer("enable", index, "showCard");
            }
        }else{
            alert("不能再摸牌了！");
        }
    }
}

function DisEnablePlayer(flag, index, buttonName){
    if(flag == "enable") {
        document.getElementById(buttonName + index).disabled = false;
        document.getElementById(buttonName + index).className = "button blue";
    }else if(flag == "disable"){
        document.getElementById(buttonName+index).disabled = true;
        document.getElementById(buttonName+index).className = "button disabled";
    }
}

//顺牌
function GetCards(CardObj, index) {
    var k = InsertCardsIndex(MyCards[index], CardObj);//考虑下插入的位置
    MyCards[index].splice(k, 0, CardObj); // 插入形成新的顺序
}

/*==================== 出牌／接牌 ====================*/
//出牌／接牌
function ShowHand(index) {
    var showCardsIndex = 0;
    var cardDiv = document.getElementById("new" + index).getElementsByTagName("div");
    var currentHandToBeProcessed = [];
    var currentHandNodesToBeProcessed = [];
    for (var i = 0; i < cardDiv.length; i++) {
        if (cardDiv[i].className.indexOf(" highlight bold") != -1) {
            var card = new Cards(cardDiv[i].id.substring(0, cardDiv[i].id.length-1),cardDiv[i].id.substring(cardDiv[i].id.length-1));
            card.id = card.number + '' + card.type;
            currentHandNodesToBeProcessed[showCardsIndex] = cardDiv[i];
            currentHandToBeProcessed[showCardsIndex++] = card;
        }
    }
    if (showCardsIndex <1) {
        alert("请选择要出的牌！")
    }else{
        //出牌校验
        var result = ShowHandCheck(currentHandToBeProcessed);
        //校验通过
        if(result != null) {
            //跟上家出牌比大小
            // 若上家不是炸弹，则只能比上家大一个点或者炸弹，
            // 若上家是炸弹，则炸弹要比上家大
            if(preHand == null || CompareCards(result)){
                preHand = result;

                //出牌从从玩家的牌中移出
                for (var i = 0; i < currentHandToBeProcessed.length; i++) {
                    var deleteCardsIndex = DeleteCardsIndex(MyCards[index], currentHandToBeProcessed[i]);
                    if (deleteCardsIndex >= 0) {
                        MyCards[index].splice(deleteCardsIndex, 1);
                    }
                }
                //把当前出牌存入已出牌数组
                shownHand.push.apply(shownHand, currentHandToBeProcessed);
                currentHand = null;
                currentHand = currentHandToBeProcessed;
                //将已出牌显示在出牌区域
                for(var i=0; i<currentHandNodesToBeProcessed.length; i++){
                    var nodeTobeProcessed = currentHandNodesToBeProcessed[i];
                    nodeTobeProcessed.remove();
                    nodeTobeProcessed.onclick = "";
                    document.getElementById("public").appendChild(nodeTobeProcessed);
                }
                token = index;

                //转换出牌顺序
                var preTokenControl = tokenControl;
                var sliceIndex = -1;
                for(var i=0; i<preTokenControl.length; i++){
                    if(preTokenControl[i] == index){
                        sliceIndex = i;
                    }
                }
                if(sliceIndex>-1){
                    tokenControl = preTokenControl.slice(sliceIndex);
                }
                tokenControl = tokenControl.concat(preTokenControl.slice(0,sliceIndex));

                WinThisRound(index);

            }else{
                alert("您出的牌不能接上！")
                return;
            }
        }
    }
}

//不出牌
function NoShowHand(index) {
    WinThisRound(index);
}

//赢了一轮
function WinThisRound(index){
    DisEnablePlayer("disable", index, "showCard");
    DisEnablePlayer("disable", index, "noShowCard");

    //判断是否到达本轮最后一位，若是，决定出本轮当胜者，重新开始新一轮，摸牌
    if(index==tokenControl[tokenControl.length-1]){
        alert("一局结束，玩家［"+token+"］获胜，清空本局结果。");
        //清空所有出牌
        document.getElementById("public").innerHTML = "";

        DisEnablePlayer("enable", token, "drawCard");
        DisEnablePlayer("disable", token, "showCard");
        DisEnablePlayer("disable", token, "noShowCard");
        preHand=null;
    }else{
        //在尚未出牌时，自动时下一位玩家可以继续摸牌
        var nextIndex = GetNextPlayer(index);
        DisEnablePlayer("enable", nextIndex, "showCard");
        DisEnablePlayer("enable", nextIndex, "noShowCard");
    }
    if(MyCards[index].length==0){
        alert("玩家["+index+"]赢了！");
    }
}

function CompareCards(curHand){
    var compareResult = false;
    if(preHand==null || preHand.length==0) {
        compareResult = true;
    } else {
        //炸弹
        if(preHand[1]==0){
            if(preHand[0]==2){//王炸
                compareResult = false;
            } else if(curHand[0]==2 || curHand[0]>=preHand[0] || (curHand[0]==preHand[0] && parseInt(curHand[2])>parseInt(preHand[2]))){
                compareResult = true;
            }
        }
        //单牌
        else if(preHand[1]==1){
            if(curHand[1]==0
                || (preHand[2]!=2 && curHand[0]==preHand[0] && curHand[1]==preHand[1] && (parseInt(curHand[2])-parseInt(preHand[2])==1 || curHand[2]==2))){
                compareResult = true;
            }
        }
        //对子
        else if(preHand[1]==2){
            if(curHand[1]==0
                || (preHand[2]!=2 && curHand[0]==preHand[0] && curHand[1]==preHand[1] && (parseInt(curHand[2])-parseInt(preHand[2])==1 || curHand[2]==2))){
                compareResult = true;
            }
        }
        //连牌
        else if(preHand[0]==3){
            if(curHand[1]==0
                || (curHand[0]==preHand[0] && curHand[1]==preHand[1] && parseInt(curHand[2])-parseInt(preHand[2])==1)){
                compareResult = true;
            }
        }
    }
    return compareResult;
}
/*==================== 公共方法 ====================*/
//找到一张牌在插入当前序列的准确位置
function InsertCardsIndex(arr, obj) {
    var len = arr && arr.length || 0;
    if (len == 0) {
        return 0;
    }else if (len == 1) {
        if (obj.number >= arr[0].number) {
            return 1;
        } else {
            return 0;
        }
    } else {
        var backi = -1;
        for (var i = 0; i < len; i++) {
            if (obj.number <= arr[i].number) {
                backi = i;
                break;
            }
        }
        if (backi == -1) {
            backi = len;
        }
        return backi;
    }
}

//找到一张牌在当前序列的准确位置
function DeleteCardsIndex(arr, obj){
    var len = arr && arr.length || 0;
    var index = -1;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            if (obj.id==arr[i].id || (obj.number == arr[i].number && obj.type == arr[i].type)) {
                index = i;
                break;
            }
        }
    }
    return index;
}

//将牌组组装成字符串
function cardsToString(cards){
    var str = "";
    for(var i=0; i<cards.length; i++){
        str += cards[i].id + "@" + cards[i].number + "-" + cards[i].type + ",";
    }
    return str;
}

//将牌组的下标组装成数组
function cardsNumberToArr(cards){
    var arr = [];
    for(var i=0; i<cards.length; i++){
        arr[i] = cards[i].number;
    }
    return arr;
}

//选中一张牌后，改变其样式
function chooseCard(obj){
    var before = obj.className;
    if(obj.className.indexOf(" highlight bold") == -1){
        obj.className = obj.className + " highlight bold";
    }else{
        obj.className = obj.className.substring(0, obj.className.indexOf(" highlight bold"));
    }
}

/*==================== 牌型校验 ====================*/
//牌型校验
function ShowHandCheck(cards){
    //返回类型:
    // 1－单牌，1-;
    // 2-两张牌,0－王炸; 2－对子;
    // 3-三张牌,0－三张炸弹; 3－三张连牌;
    // 4-四张牌,0－四张炸弹; 2－两连对; 3－四张连牌;
    // 5-五张牌,0－五张炸弹; 3－五张连牌;
    // 6-六张牌,0－六张炸弹; 2－三连对; 3－六张连牌;
    //炸弹校验
    var cardsNumberStr = cardsNumberToArr(cards).join(",");
    //需要考虑：2不能作为连牌出牌
    if(cards!=null && cards.length>0) {
        if(cards.length == 1){
            //鬼不能单出
            if(cards[0].number!=0){
                alert("cardsNumberStr:[" + cardsNumberStr + "] 是 一张单牌");
                return [1, 1, cards[0].number];
            }
        }else{
            //校验是否是炸弹
            var result = ValidateBombQueue(cardsNumberToArr(cards));
            //若不是炸弹，校验是否是连牌
            if (result != null) {
                return result;
            } else {
                result = ValidateInlineQueue(cardsNumberToArr(cards));
            }
            //若也不是连牌，校验是否是对子
            if (result != null) {
                return result;
            } else {
                if(cards.length == 2 && (cards[0].number==cards[1].number || cards[0].number==0)){
                    alert("cardsNumberStr:[" + cardsNumberStr + "] 是 一对对子");
                    return [2, 2, cards[1].number];
                }else if(cards.length == 4 &&
                    (parseInt(cards[0].number)+1==parseInt(cards[2].number)
                    && cards[0].number==cards[1].number && cards[2].number==cards[3].number)){
                    alert("cardsNumberStr:[" + cardsNumberStr + "] 是 两连对");
                    return [4, 2, cards[3].number];
                }else if(cards.length == 6 &&
                    (parseInt(cards[0].number)+1==parseInt(cards[2].number)
                    && parseInt(cards[0].number)+2==parseInt(cards[4].number)
                    && cards[0].number==cards[1].number && cards[2].number==cards[3].number && cards[4].number==cards[5].number)){
                    alert("cardsNumberStr:[" + cardsNumberStr + "] 是 三连对");
                    return [6, 2, cards[5].number];
                }else{
                    alert("cardsNumberStr:[" + cardsNumberStr + "] 不能出牌");
                    return null;
                }
            }
        }
    }
}

//连牌校验
function ValidateInlineQueue(arr){
    var cardsNumberStr = arr.join(",");
    //返回结果:
    //null-校验不通过；[33-63.d]-校验通过，33-三张连牌，43-四张连牌，53-五张连牌，63-六张连牌，序列的最大值是d
    var returnCode=0;
    var returnMax=null;
    //三张以上才能连牌
    if(arr!=null && arr.length>=3){
        var preValue;
        var breakCount=0;
        for(var i=0; i<arr.length; i++){
            if(arr[i] == 2){
                //2不能连牌
                alert("validateInlineQueue:[" + cardsNumberStr + "] 2不能连牌！");
                return null;
            }
        }
        //没有炸弹
        if(arr[0]!=0){
            for(var i=0; i<arr.length; i++){
                if(i>0 && parseInt(arr[i]) - parseInt(preValue) != 1){
                    return null;
                }
                preValue = arr[i];
            }
            returnMax = arr[arr.length-1];
        }else{
            //一个鬼，最多允许一次断序
            if(arr[1] != 0){
                preValue = arr[1];
                for(var i=2; i<arr.length; i++){
                    if(parseInt(arr[i]) - parseInt(preValue) == 1){
                        continue;
                    }else if(breakCount == 0 && parseInt(arr[i]) - parseInt(preValue) == 2){
                        breakCount++;
                    }else{
                        return null;
                    }
                    preValue = arr[i];
                }
                if(breakCount == 0){
                    returnMax = parseInt(arr[arr.length-1])+1;
                }else if(breakCount == 1){
                    returnMax = arr[arr.length-1];
                }else{
                    return null;
                }
            }
            //两个鬼，最多允许两次断序
            else{
                preValue = arr[2];
                for(var i=3; i<arr.length; i++){
                    if(parseInt(arr[i]) - parseInt(preValue) == 1){
                        continue;
                    }else if((breakCount == 0||breakCount == 1) && parseInt(arr[i]) - parseInt(preValue) == 2){
                        breakCount++;
                    }else if(breakCount == 0 && parseInt(arr[i]) - parseInt(preValue) == 3){
                        breakCount = breakCount+3;
                    }else{
                        return null;
                    }
                    preValue = arr[i];
                }
                //没有断序,则4(5)(6),max=6
                if(breakCount == 0){
                    returnMax = parseInt(arr[arr.length-1])+2;
                }
                //一次断1序,则4(5)6(7),max=7
                else if(breakCount == 1){
                    returnMax = arr[arr.length-1]+1;
                }
                //两次断1序,则4(5)6(7)8,max=8
                //或者,一次断2序,则4(5)(6)7,max=7
                else if(breakCount == 2 || breakCount == 3){
                    returnMax = arr[arr.length-1];
                }else {
                    return null;
                }
            }
        }
        returnCode = "3";
    }
    if(returnCode!=0){
        alert("validateInlineQueue:[" + cardsNumberStr + "] 是 连牌，"+returnCode+"/"+returnMax);
        return [arr.length , returnCode,returnMax];
    } else {
        return null;
    }
}

//炸弹校验
function ValidateBombQueue(arr){
    var cardsNumberStr = arr.join(",");
    //返回结果:
    //null-校验不通过；[3-5.d]-校验通过，2,0-王炸，3,0-三张炸弹，4,0-四张炸弹，5,0-五张炸弹，6,0-六张炸弹，炸弹的最大值是d
    var returnCode=0;
    var returnMax=0;
    if(arr!=null && arr.length>=2){
        if(arr.length==2){
            if(arr[0]==0 && arr[1] == 0){
                alert("cardsNumberStr:[" + cardsNumberStr + "] 是 王炸");
                returnCode = 20;
            }
        }else if(arr.length==3){
            if(((arr[0]==0 || arr[0] == arr[1]) && arr[1]==arr[2])
                || (arr[0]==0 && arr[1]==0)){
                alert("cardsNumberStr:[" + cardsNumberStr + "] 是 三张炸弹");
                returnCode = 30;
                returnMax = arr[2];
            }
        }else if(arr.length==4){
            if((((arr[0]==0 || arr[0] == arr[1]) && arr[1]==arr[2]) || (arr[0]==0 && arr[1]==0))
                && arr[2]==arr[3]){
                alert("cardsNumberStr:[" + cardsNumberStr + "] 是 四张炸弹");
                returnCode = 40;
                returnMax = arr[3];
            }
        }else if(arr.length==5){
            if(arr[0]==0 && arr[1]==arr[2] && arr[2]==arr[3] && arr[3]==arr[4]){
                alert("cardsNumberStr:[" + cardsNumberStr + "] 是 五张炸弹");
                returnCode = 50;
                returnMax = arr[4];
            }
        }else if(arr.length==6){
            if(arr[0]==0 && arr[1]==0 && arr[2]==arr[3] && arr[3]==arr[4] && arr[4]==arr[5]){
                alert("cardsNumberStr:[" + cardsNumberStr + "] 是 六张炸弹");
                returnCode = 60;
                returnMax = arr[5];
            }
        }
    }
    if(returnCode>0){
        alert("validateBombQueue:[" + cardsNumberStr + "] 是 炸弹，"+returnCode+"/"+returnMax);
        return [arr.length, 0,returnMax];
    } else {
        return null;
    }
}

function GetNextPlayer(index){
    if(index == players-1){
        return 0;
    }else{
        return (parseInt(index)+1);
    }
}

