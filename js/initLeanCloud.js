// 每跳转一个单页都要initialize一下，由templateXXX.html调用，嵌入的html不能调用，不然会报错

var { Query, User } = AV;
var APP_ID = 'Q48Bubuw4qRahc1XEU6TeTYu-9Nh9j0Va';
var APP_KEY = '2oTfqHRvabH89qAX4eDLIWqP';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

