// LeanCloud - 初始化 - 将这里的 APP_ID 和 APP_KEY 替换成自己的应用数据
// https://leancloud.cn/docs/sdk_setup-js.html#初始化
var { Query, User } = AV;
var APP_ID = 'O9GHcEFbihPbkFea2k8O0pMF-MdYXbMMI';
var APP_KEY = 'R7fGX5O4XzBgUL27lKopp8XP';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

