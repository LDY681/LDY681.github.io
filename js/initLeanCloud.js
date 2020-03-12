// 每跳转一个单页都要initialize一下，由templateXXX.html调用，嵌入的html不能调用，不然会报错

var { Query, User } = AV;
var { Realtime, TextMessage } = AV;
var APP_ID = 'GWIBfipLqh868acSJVJFbl1q-MdYXbMMI';
var APP_KEY = 'pFE0XYlY4QlTDwlrbbL4IQIY'
var server = 'https://jvchwdgn.lc-cn-n1-shared.com';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    serverUrls: server
});

