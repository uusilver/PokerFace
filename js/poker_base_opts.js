/**
 * Created with JetBrains WebStorm.
 * User: vali
 * Date: 15-9-18
 * Time: 下午5:03
 * To change this template use File | Settings | File Templates.
 */

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


var RadomCards = [];//随机牌存储数组
var MyCards = [];//存储摸过来的牌


//花色0-黑桃 1-梅花 2-方块  3-红桃 4-大鬼  5-小鬼
//数值0-13代表 鬼,1,2,3,4,5,6,7,8,9,10,J,Q,K;
function CreatCompeleteCard() {
    var index = 2;
    var arr = [];
    for (var i = 0; i <= 13; i++) {
        if (i == 0) {
            //初始化大鬼，小鬼，并且填入初始化数组中的0位和1位
            arr[0] = new Cards(i, 4);//[0,4]
            arr[1] = new Cards(i, 5);//[1,5]
        } else {
            for (var j = 0; j <= 3; j++) {
                //初始化其余的牌数，放入数组中去
                //从数组的第三位(下标位2开始，0，1已经被大鬼和小鬼占去)，每次初始化的是同一牌号下的同花色的牌
                //例如初始化［2，0］，代表♠️2，之后是♣️2，♦️2和♥️2，然后初始化3...直到K
                arr[index] = new Cards(i, j);
                index++;
            }
        }
    }
    RadomCards = SortCards(arr);
    Show();
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
    if (RadomCards.length > 0) {
        GetCards(RadomCards.shift());
        Show();
    } else {
        alert("没有了");
    }
}
//该show方法是用来在页面展示当前牌的动向
function Show() {
    var lenOld = RadomCards.length;
    var lenNew = MyCards.length;
    var html = "";
    for (var i = 0; i < lenOld; i++) {
        html += "<div class='pai'><b>" + RadomCards[i].type + "</b>-<div class='nu'>" + RadomCards[i].number + "</div></div>";
    }
    document.getElementById("old").innerHTML=html;
    html = "";
    for (var i = 0; i < lenNew; i++) {
        html += "<div class='pai new'><b>" + MyCards[i].type + "</b>-<div class='nu'>" + MyCards[i].number + "</div></div>";
    }
    document.getElementById("new").innerHTML=html;
}