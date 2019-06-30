function loader() {
    setInterval(transition,500);
}

function transition(){
    if (document.getElementById("loader").style.display === "block"){
        document.getElementById("loader").style.display = "none";
    }
    // if (document.getElementById("afterLoading").style.display === "none"){
    //     document.getElementById("afterLoading").style.display = "block";
    // }
}