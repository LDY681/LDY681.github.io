//为navSideBar提供支持
//侧边栏 展开或隐藏,展开时修改topNav的左margin为0
function w3_open() {
    // 调整正文内容
    var custom = document.getElementById("customContent");
    if (custom) {
        custom.style.marginLeft = "200px";
    }

    //调整导航侧边栏
    document.getElementById("main").style.marginLeft = "180px";
    document.getElementById("mySidebar").style.width = "196px";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
    var x = document.getElementById("topNav");
    x.style.marginLeft = "";
}

function w3_close() {
    //调整正文内容
    var custom = document.getElementById("customContent");
    if (custom) {
        custom.style.marginLeft = "0";
    }

    //调整导航侧边栏
    document.getElementById("main").style.marginLeft = "0";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
    var x = document.getElementById("topNav");
    x.style.marginLeft = "38px";
}
