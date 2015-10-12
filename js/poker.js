/**
 * Created with JetBrains WebStorm.
 * User: vali
 * Date: 15-9-15
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 */
//页面函数入口
$(function() {
    //点击重新洗牌按钮后的动作
    CreatCompeleteCard();
    $("#washCards").click(function(){window.location.reload();});
    //点击摸牌
    $("#getCards").click(function(){Start()});

    $("div").on("click",function(){
            alert("123");

    });

});

//卡片构造器
//Modified by Cindy at 2015.09.24:add "text" property to store the text of Poker
var Cards = (function () {
    var Card = function (number, type, text) {
        this.number = number;
        this.type = type;
        this.text = text;
    }
    return function (number, type, text) {
        return new Card(number, type, text);
    }
})()


var RandomCards = [];//随机牌存储数组
var MyCards = [];//存储摸过来的牌
//花色0-黑桃 1-梅花 2-方块  3-红桃 4-大鬼  5-小鬼
//数值0-13代表 鬼,1,2,3,4,5,6,7,8,9,10,J,Q,K;
function CreatCompeleteCard() {
    var index = 2;
    var arr = [];
    for (var i = 0; i <= 13; i++) {
        if (i == 0) {
            //初始化大鬼，小鬼，并且填入初始化数组中的0位和1位
            arr[0] = new Cards(i, 4, "☻");//[0,4]
            arr[1] = new Cards(i, 5, "☺");//[1,5]
        } else {
            for (var j = 0; j <= 3; j++) {
                //初始化其余的牌数，放入数组中去
                //从数组的第三位(下标位2开始，0，1已经被大鬼和小鬼占去)，每次初始化的是同一牌号下的同花色的牌,1-A,11-J,12-Q,13-K
                //例如初始化［2，0］，代表♠️2，之后是♣️2，♦️2和♥️2，然后初始化3...直到K
                //花色0-黑桃 1-梅花 2-方块  3-红桃 4-大鬼  5-小鬼
                if(i==11){
                    arr[index] = new Cards(i, j, "J");
                }else if(i==12){
                    arr[index] = new Cards(i, j, "Q");
                }else if(i==13){
                    arr[index] = new Cards(i, j, "K");
                }else if(i==1){
                    arr[index] = new Cards(i, j, "A");
                }else{
                    arr[index] = new Cards(i, j, i.toString());
                }
                index++;
            }
        }
    }
    RandomCards = SortCards(arr);
    show4Play();
}
//洗牌，一个随机种子产生来保证每次的顺序在一定意义上的不重复
function SortCards(arr) {
    arr.sort(function (a, b) {
        return 0.5 - Math.random();
    })
    return arr;
}

//摸牌方法
function GetCards(CardObj) {
    var k = InCardsIndex(MyCards, CardObj);//考虑下插入的位置
    MyCards.splice(k, 0, CardObj); // 插入形成新的顺序
}
/*【获取牌应该插入的位置】
 *arr:当前手里的牌
 *obj:新摸到的牌
 */
function InCardsIndex(arr, obj) {
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

function Start() {//摸牌方法，一次摸一张
    if (RandomCards.length > 0) {
        GetCards(RandomCards.shift());
        show4Play();
    } else {
        alert("没有了");
    }
}

function show4Play(){
    var lenOld = RandomCards.length;
    var lenNew = MyCards.length;
    var html = "";
    var types = ["suitspades", "suitclubs", "suitdiamonds", "suithearts", "", ""];
    for (var i = 0; i < lenOld; i++) {
        html+="<div class='card "+types[RandomCards[i].type]+"'><p>"+RandomCards[i].text+"</p></div>";
        //花色0-黑桃 1-梅花 2-方块  3-红桃 4-大鬼  5-小鬼
        if(RandomCards[i].number==11){
            RandomCards[i].number=="J";
        }else if(RandomCards[i].number==12){
            RandomCards[i].number=="Q";
        }else if(RandomCards[i].number==13){
            RandomCards[i].number=="K";
        }else if(RandomCards[i].number===1){
            RandomCards[i].number=="A";
        }

        if(RandomCards[i].type==0){
            html+="<div class='card suitspades'><p>"+RandomCards[i].number+"</p></div>";
        }else if(RandomCards[i].type==1){
            html+="<div class='card suitclubs'><p>"+RandomCards[i].number+"</p></div>";
        }else if(RandomCards[i].type==2){
            html+="<div class='card suitdiamonds'><p>"+RandomCards[i].number+"</p></div>";
        }else if(RandomCards[i].type==3){
            html+="<div class='card suithearts'><p>"+RandomCards[i].number+"</p></div>";
        }else if(RandomCards[i].type==4){
            html+="<div class='card'><p>☻</p></div>";
        }else if(RandomCards[i].type==5){
            html+="<div class='card'><p>☺</p></div>";
        }
    }
    //$("#whole").html(html);
    html="";
    //刷新手牌信息
    for (var i = 0; i < lenNew; i++) {
        //花色0-黑桃 1-梅花 2-方块  3-红桃 4-大鬼  5-小鬼
        if(MyCards[i].number==11){
            MyCards[i].number=="J";
        }else if(MyCards[i].number==12){
            MyCards[i].number=="Q";
        }else if(MyCards[i].number==13){
            MyCards[i].number=="K";
        }else if(MyCards[i].number==1){
            MyCards[i].number=="A";
        }

        if(MyCards[i].type==0){
            html+="<div class='card suitspades'><p>"+MyCards[i].number+"</p></div>";
        }else if(MyCards[i].type==1){
            html+="<div class='card suitclubs'><p>"+MyCards[i].number+"</p></div>";
        }else if(MyCards[i].type==2){
            html+="<div class='card suitdiamonds'><p>"+MyCards[i].number+"</p></div>";
        }else if(MyCards[i].type==3){
            html+="<div class='card suithearts'><p>"+MyCards[i].number+"</p></div>";
        }else if(MyCards[i].type==4){
            html+="<div class='card'><p>☻</p></div>";
        }else if(MyCards[i].type==5){
            html+="<div class='card'><p>☺</p></div>";
        }

    }
    $("#mine").html(html);

}

