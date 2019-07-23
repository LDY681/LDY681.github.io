// 活动倒计时，东汉年历，当前时间显示

// 活动倒计时
function counter(date){
// Set the date we're counting down to
var countDownDate = new Date(date).getTime();

// Update the count down every 1 second
var x = setInterval(function() {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="demo"
    document.getElementById("counter").innerHTML = days + "天 " + hours + "时 "
        + minutes + "分 " + seconds + "秒 ";

    // If the count down is over, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("counter").innerHTML = "活动已结束,敬请期待下期!";
    }
}, 1000);
}

// 东汉年历,从220年开始计算,120天一年,30天一季度,10天一月
function countUp(date){
    console.log("countUp运行中");
// Set the date we're counting up from
    var countUpDate = new Date(date).getTime();

// Update the count down every 1 second
    var x = setInterval(function() {
        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = now - countUpDate;

        // Time calculations for days, hours, minutes and seconds
        var years = Math.floor(distance / (1000 * 60 * 60 * 24 * 120)) + 220;
        var seasonNum = Math.floor( (distance % (1000 * 60 * 60 * 24 * 120)) / (1000 * 60 * 60 * 24 * 30) ) + 1;
        var months = Math.floor( (distance % (1000 * 60 * 60 * 24 * 120)) / (1000 * 60 * 60 * 24 * 10) ) + 1;
        var days = Math.floor(((distance % (1000 * 60 * 60 * 24 * 120)) / (1000 * 60 * 60 * 24))%10) + 1;

        var seasons = "春";
        switch (seasonNum) {
            case 1:
                seasons = "春";
                break;
            case 2:
                seasons = "夏";
                break;
            case 3:
                seasons = "秋";
                break;
            case 4:
                seasons = "冬";
                break;
            default:
                seasons = "春";
        }

        // Output the result in an element with id="demo"
        document.getElementById("counter").innerHTML = "东汉" + years + "年" + months + "月" + days + "日  " + seasons + "季";

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("counter").innerHTML = "年历已爆炸";
        }
    }, 1000);
}

//获取当前北京时间
function getCurrTime(){
    console.log("getCurrTime运行中");
// Update the count down every 1 second
var x = setInterval(function() {
    // Get today's date and time
    var currDate = new Date();
    var hours = ('0' + currDate.getHours()).slice(-2);
    var minutes = ('0' + currDate.getMinutes()).slice(-2);
    var seconds = ('0' + currDate.getSeconds()).slice(-2) ;

    // Output the result in an element with id="currTime"
    console.log();
    document.getElementById("currTime").innerHTML = hours + ":"+ minutes + ":" + seconds;

    // Find the distance between now and the count down date
    var distance = 0;

    // If the count down is over, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("currTime").innerHTML = "时间已爆炸";
    }
}, 1000);
}