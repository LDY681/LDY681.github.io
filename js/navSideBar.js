//为navSideBar提供支持

// 小屏幕的导航栏 展开或隐藏
// function navBar_small_show() {
//   var x = document.getElementById("navBar_small");
//
//   if (x.className.indexOf("w3-show") == -1) {
//     x.className += " w3-show";
//   } else {
//     x.className = x.className.replace(" w3-show", "");
//   }
// }
// function navBar_small_close() {
//   var x = document.getElementById("navBar_small");
//   if (x.className.indexOf("w3-show") != -1) {
//     x.className = x.className.replace(" w3-show", "");
//   }
// }

//侧边栏 展开或隐藏,展开时修改topNav的左margin为0
function w3_open() {
  // 调整正文内容
  document.getElementById("customContent").style.marginLeft = "200px";

  //调整导航侧边栏
  document.getElementById("main").style.marginLeft = "180px";
  document.getElementById("mySidebar").style.width = "196px";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("openNav").style.display = 'none';
  var x = document.getElementById("topNav");
  x.style.marginLeft = "";
}
function w3_close() {
    // 调整正文内容
    document.getElementById("customContent").style.marginLeft = "0";

    //调整导航侧边栏
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("openNav").style.display = "inline-block";
	var x = document.getElementById("topNav");
	x.style.marginLeft = "38px";
}
