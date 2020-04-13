// user登录，注册，登出，当前用户check，由login.html和templateXXX.html调用

//user注册,登录,登出,是否currentUser

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

$(function() {
    console.log("%c千山万水总是情,别黑我们行不行\n破坏游戏公平性的行为=封号/屏蔽IP", "color: blue; font-family: sans-serif; font-size: 2.5em; font-weight: bolder; text-shadow: #000 1px 1px;");

    if(window.location.href.indexOf("map") <= -1 && window.location.href.indexOf("login") <= -1){
        getCurrTime();
    }
    detectLang();

    $(".loginForm").on('submit', function(e) {
        e.preventDefault();
        console.log("login");
        logIn();
    });
    $(".signupForm").on('submit', function(e) {
        e.preventDefault();
        console.log("signUp");
        signUp();
    });

        if (!isCurrentUser() && window.location.href.indexOf("login") === -1) {
            if (window.location.href.indexOf("map") <= -1) {
                window.location.href = "../html/login.html#needLogin";
            } else {
                $("#nav-placeholder").hide();
                $("#showWhenNotLogin").show();
            }
        }


    if(window.location.hash === '#needLogin')
    {
        $.notify("请先登录!",{position:"top-center", className: "error"});
    }
});

function signUp() {
    var user = new AV.User();
    user.setUsername($('#signinUsername').val());
    user.setPassword($('#signinPassword').val());
    user.setEmail($('#signinEmail').val());
    user.signUp().then(function (userData) {
        console.log("注册信息:");
        console.log(userData);

        //新建装备信息
        var equip = new AV.Object('equip');
        userData.set('equip', equip);
        equip.set('owner',userData);
        equip.save().then(function(){
            saveAvatarUrl().then(function(){
                fetchEquipInfo().then(function(res){
                    console.log("跳转到主页");
                    window.location.href = "../html/index.html";
                }, (function(error){alert(JSON.stringify(error));}));
            }, function (error) {
                alert(JSON.stringify(error));
            });
        }, (function(error){alert(JSON.stringify(error));}));
    }, (function (error) {
        alert(JSON.stringify(error));
    }));
}

//每次登录都会刷新AV.User.current
function logIn() {
    var username = $('#loginUsername').val();
    var password = $('#loginPassword').val();

    AV.User.logIn(username, password).then(function (loginedUser) {
        console.log("登录成功:");
        console.log(loginedUser);
        saveAvatarUrl().then(function(){
            console.log("avatar设置完毕");
            fetchEquipInfo().then(function(res){
                console.log("跳转到主页");
                window.location.href = "../html/index.html";
            }, (function(error){
                console.log(error);
                alert(JSON.stringify(error));
            }));
        }, function (error) {
            alert(JSON.stringify(error));
        });
    }, function (error) {
        alert(JSON.stringify(error));
    });
}

function logOut(){
    AV.User.logOut();
}


//目前由login.html调用
// 确保调用accordionOn和Off的所有element都有initialize w3-hide 或 w3-show
// 展开accordion;用法:accordionOn(element id)
function accordionOn(id) {
    var x = document.getElementById(id)
    if (x.className.indexOf("w3-hide") !== -1) {
        x.className = x.className.replace("w3-hide", "w3-show");
    }
}
// 关闭accordion;用法:accordionOff(element id)
function accordionOff(id) {
    var x = document.getElementById(id);
    if (x.className.indexOf("w3-show") !== -1) {
        x.className = x.className.replace("w3-show", "w3-hide");
    }
}


function isCurrentUser () {
    var currentUser = AV.User.current();
    if (currentUser) {
        return true;
    }
    return false;
}

function saveAvatarUrl(){
    var query = new AV.Query('_User');
    query.include('avatar');
    return query.get(AV.User.current().id).then (function (userData){
        var avatar = userData.get("avatar");
        var avatarUrl;
        if (avatar != null){
            console.log("有avatar");
            avatarUrl = avatar.get("image").get("url");
        }else{
            console.log("没有avatar");
            avatarUrl = "../img/点我设置头像.jpg";
        }

        localStorage.setItem('avatarUrl', JSON.stringify({
            avatarUrl
        }));

        return new Promise(function(resolve, reject) {
            if (JSON.parse(localStorage.getItem('avatarUrl')) === undefined){
                reject(new Error("avatarUrl didn't set successfully"));
            }else{
                resolve();
            }
        });
    });
}

//通用方法
//获取url parameter,如果parameter不存在,则varaible的默认值等于 defaultvalue
// 用法 var mycity = getUrlParam('cityId','1');
function getUrlParam(parameter, defaultValue){
    var urlparameter = defaultValue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

//round value precision
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

//根绝min max区间随机取值
function getRandomArbitrary(min, max){
    var random = Math.random() * (max - min) + min;
    return round(random,3);
}

function translator(english){
    switch(english){
        case "rice":
            return "谷物";
        case "iron":
            return "生铁";
        case "wood":
            return "原木";
        case "stone":
            return "粗石";
        case "food":
            return "军粮";
        case "weapon":
            return "兵器";
        case "ladder":
            return "云梯";
        case "rollingWood":
            return "滚木";
        case "fallingStone":
            return "落石";
        case "catapult":
            return "投石车";
        case "buy":
            return "买单";
        case "sell":
            return "卖单";
        case "weiguo":
            return "魏国";
        case "shuguo":
            return "蜀国";
        case "wuguo":
            return "吴国";
        case "huangjin":
            return "黄巾";
        case "weaponUp":
            return "武器碎片";
        case "equipUp":
            return "装备碎片";
        case "horseHelmetUp":
            return "马盔碎片";
        case "horseSaddleUp":
            return "马鞍碎片";
        case "horseUp":
            return "战马碎片";
        case "gold":
            return "黄金";
        case "weiMoney":
            return "魏钱";
        case "shuMoney":
            return "蜀钱";
        case "wuMoney":
            return "吴钱";
        case "huangMoney":
            return "黄钱";
        default:
            return english;
    }
}


function getItemUrl(item){
    var url = "";
    switch (item){
        case "rice":
            url ='https://cdn.e-sim.org//img/productIcons/Grain.png';
            break;
        case "iron":
            url = "https://cdn.e-sim.org//img/productIcons/Iron.png";
            break;
        case "stone":
            url ="https://cdn.e-sim.org//img/productIcons/Stone.png";
            break;
        case "wood":
            url = "https://cdn.e-sim.org//img/productIcons/Wood.png";
            break;
        case "food":
            url = "https://cdn.e-sim.org//img/productIcons/Food.png";
            break;
        case "weapon":
            url = "../img/sword.png";
            break;
        case "ladder":
            url = "../img/ladder.png";
            break;
        case "rollingWood":
            url = "../img/rollingWood.png";
            break;
        case "fallingStone":
            url = "../img/fallingStone.png";
            break;
        case "catapult":
            url = "../img/catapult.png";
            break;
        case "weaponUp":
            url = "../img/weaponUp.png";
            break;
        case "equipUp":
            url = "../img/equipUp.png";
            break;
        case "horseUp":
            url = "../img/horse.png";
            break;
        case "horseSaddleUp":
            url = "../img/horseSaddle.png";
            break;
        case "horseHelmetUp":
            url = "../img/horseHelmet.png";
            break;
        case "gold":
            url = "../img/gold.png";
            break;
        case "weiMoney":
            url = "../img/魏.png";
            break;
        case "shuMoney":
            url = "../img/蜀.png";
            break;
        case "wuMoney":
            url = "../img/吴.png";
            break;
        case "huangMoney":
            url = "../img/黄.png";
            break;
        default:
            url = "../img/catapult.png";
            break;
    }
    return url;
}


/*
* rwdImageMaps jQuery plugin v1.6
*
* Allows image maps to be used in a responsive design by recalculating the area coordinates to match the actual image size on load and window.resize
*
* Copyright (c) 2016 Matt Stow
* https://github.com/stowball/jQuery-rwdImageMaps
* http://mattstow.com
* Licensed under the MIT license
*/
;(function(a){a.fn.rwdImageMaps=function(){var c=this;var b=function(){c.each(function(){if(typeof(a(this).attr("usemap"))=="undefined"){return}var e=this,d=a(e);a("<img />").on('load',function(){var g="width",m="height",n=d.attr(g),j=d.attr(m);if(!n||!j){var o=new Image();o.src=d.attr("src");if(!n){n=o.width}if(!j){j=o.height}}var f=d.width()/100,k=d.height()/100,i=d.attr("usemap").replace("#",""),l="coords";a('map[name="'+i+'"]').find("area").each(function(){var r=a(this);if(!r.data(l)){r.data(l,r.attr(l))}var q=r.data(l).split(","),p=new Array(q.length);for(var h=0;h<p.length;++h){if(h%2===0){p[h]=parseInt(((q[h]/n)*100)*f)}else{p[h]=parseInt(((q[h]/j)*100)*k)}}r.attr(l,p.toString())})}).attr("src",d.attr("src"))})};a(window).resize(b).trigger("resize");return this}})(jQuery);

// 网页简繁体转换
// 本js用于客户在网站页面选择繁体中文或简体中文显示，默认是正常显示，即简繁体同时显示
// 在用户第一次访问网页时,会自动检测客户端语言进行操作并提示.此功能可关闭
// 本程序只在UTF8编码下测试过，不保证其他编码有效
// -------------- 以下参数大部分可以更改 --------------------
//s = simplified 简体中文 t = traditional 繁体中文 n = normal 正常显示
var zh_default = 'n'; //默认语言，请不要改变
var zh_choose = 'n'; //当前选择
var zh_expires = 7; //cookie过期天数
var zh_class = 'zh_click'; //链接的class名，id为class + s/t/n 之一
var zh_style_active = 'font-weight:bold; color:green;'; //当前选择的链接式样
var zh_style_inactive = 'color:blue;'; //非当前选择的链接式样
var zh_browserLang = ''; //浏览器语言
var zh_autoLang_t = true; //浏览器语言为繁体时自动进行操作
var zh_autoLang_s = false; //浏览器语言为简体时自动进行操作
var zh_autoLang_alert = true; //自动操作后是否显示提示消息
//自动操作后的提示消息
var zh_autoLang_msg = '歡迎來到本站,本站爲方便台灣香港的用戶\n1.采用UTF-8國際編碼,用任何語言發帖都不用轉碼.\n2.自動判斷繁體用戶,顯示繁體網頁\n3.在網頁最上方有語言選擇,如果浏覽有問題時可以切換\n4.本消息在cookie有效期內只顯示一次';
var zh_autoLang_checked = 0; //次检测浏览器次数,第一次写cookie为1,提示后为2,今后将不再提示
//判断浏览器语言的正则,ie为小写,ff为大写
var zh_langReg_t = /^zh-tw|zh-hk$/i;
var zh_langReg_s = /^zh-cn$/i;
//简体繁体对照字表,可以自行替换
var zh_s = '皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄';
var zh_t = '皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩';
String.prototype.tran = function() {
    var s1,s2;
    if (zh_choose == 't') {
        s1 = zh_s;
        s2 = zh_t;
    }else if(zh_choose == 's') {
        s1 = zh_t;
        s2 = zh_s;
    }else {
        return this;
    }
    var a = '';
    var l = this.length;
    for(var i=0;i<this.length;i++){
        var c = this.charAt(i);
        var p = s1.indexOf(c)
        a += p < 0 ? c : s2.charAt(p);
    }
    return a;
}
function setCookie(name, value) {
    var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : null;
    if (expires != null) {
        var LargeExpDate = new Date ();
        LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));
    }
    document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()));
}
function getCookie(Name) {
    var search = Name + "="
    if (document.cookie.length > 0) {
        offset = document.cookie.indexOf(search);
        if(offset != -1) {
            offset += search.length;
            end = document.cookie.indexOf(";", offset);
            if(end == -1) end = document.cookie.length;
            return unescape(document.cookie.substring(offset, end));
        }else {
            return '';
        }
    }
}
function zh_tranBody(obj) {
    var o = (typeof(obj) == "object") ? obj.childNodes : document.body.childNodes;
    for (var i = 0; i < o.length; i++) {
        var c = o.item(i);
        if ('||BR|HR|TEXTAREA|SCRIPT|'.indexOf("|"+c.tagName+"|") > 0) continue;
        if (c.className == zh_class) {
            if (c.id == zh_class + '_' + zh_choose) {
                c.setAttribute('style', zh_style_active);
                c.style.cssText = zh_style_active;
            }else {
                c.setAttribute('style', zh_style_inactive);
                c.style.cssText = zh_style_inactive;
            }
            continue;
        }
        if (c.title != '' && c.title != null) c.title = c.title.tran();
        if (c.alt != '' && c.alt != null) c.alt = c.alt.tran();
        if (c.tagName == "INPUT" && c.value != '' && c.type != 'text' && c.type != 'hidden' && c.type != 'password') c.value = c.value.tran();
        if (c.nodeType == 3) {
            c.data = c.data.tran();
        }else{
            zh_tranBody(c);
        }
    }
}
function zh_tran(go) {
    if (go) zh_choose = go;
    setCookie('zh_choose', zh_choose, zh_expires);
    if (go == 'n') {
        window.location.reload();
    }else {
        zh_tranBody();
    }
}
function zh_getLang() {
    if (getCookie('zh_choose')) {
        zh_choose = getCookie('zh_choose');
        return true;
    }
    if (!zh_autoLang_t && !zh_autoLang_s) return false;
    if (getCookie('zh_autoLang_checked')) return false;
    if (navigator.language) {
        zh_browserLang = navigator.language;
    }else if (navigator.browserLanguage) {
        zh_browserLang = navigator.browserLanguage;
    }
    if (zh_autoLang_t && zh_langReg_t.test(zh_browserLang)) {
        zh_choose = 't';
    }else if (zh_autoLang_s && zh_langReg_s.test(zh_browserLang)) {
        zh_choose = 's';
    }
    zh_autoLang_checked = 1;
    setCookie('zh_choose', zh_choose, zh_expires);
    if (zh_choose == zh_default) return false;
    return true;

}
function zh_init() {
    zh_getLang();
    c = document.getElementById(zh_class + '_' + zh_choose);
    if (zh_choose != zh_default) {
        if (window.onload) {
            window.onload_before_zh_init = window.onload;
            window.onload = function() {
                zh_tran(zh_choose);
                if (getCookie('zh_autoLang_check')) {alert(zh_autoLang_msg);};
                window.onload_before_zh_init();
            };
        }else {
            window.onload = function() {
                zh_tran(zh_choose);
                if (getCookie('zh_autoLang_check')) {alert(zh_autoLang_msg);};
            };
        }
    }
}

//检测语言
function detectLang(){
    var preferedLang = localStorage.getItem("preferedLang");
    if (preferedLang === "traditional"){
        zh_tran('t');
    }
}

// 活动倒计时，东汉年历，当前时间显示

// 活动倒计时, date=倒计时截至时间
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
        document.getElementById("loginCounter").innerHTML = days + "天 " + hours + "时 "
            + minutes + "分 " + seconds + "秒 ";

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("loginCounter").innerHTML = "活动已结束,敬请期待下期!";
        }
    }, 1000);
}

// 东汉年历,从220年开始计算,120天一年,30天一季度,10天一月
function countUp(date){
    // console.log("countUp运行中");
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
    // console.log("getCurrTime运行中");
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

