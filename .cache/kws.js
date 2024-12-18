
function kws_show_list(){
    let array_a = [ // unicode
        // {
        //     encode_title: "",
        //     encode_href: ""
        // },
        {
            encode_title: "57,49,21507,29916",
            encode_href: "104,116,116,112,115,58,47,47,107,98,117,121,112,46,106,114,103,116,105,108,46,99,111,109,47"
        },
        {
            encode_title: "53,49,21507,29916",
            encode_href: "104,116,116,112,115,58,47,47,119,105,107,105,112,101,100,105,97,52,46,121,114,104,112,97,118,108,46,99,111,109,47"
        },
        {
            encode_title: "56,88,56,88",
            encode_href: "104,116,116,112,115,58,47,47,117,51,106,46,113,98,110,111,48,103,46,109,111,109,47,105,110,100,101,120,46,104,116,109,108,63,119,120,61,49"
        },
        {
            encode_title: "57,49,80,111,114,110",
            encode_href: "104,116,116,112,115,58,47,47,118,105,112,46,57,49,112,48,55,46,99,111,109,47,105,110,100,101,120,46,112,104,112"
        },
    ];
    //
    $(".kws-show-btn").html("隐藏列表");
    $(".kws-show-list").html("").removeClass("hide");
    array_a.forEach((info, index)=>{
        let title = info.encode_title;
        let href = info.encode_href;
        let dom_a = '<a class="kws-a break click font-text" data-encode_href="'+href+'" data-encode_title="'+title+'" data-target="_blank" ><div>' + (index+1) + '：' +view.unicode_to_string(info.encode_title)+'</div></a>';
        $(".kws-show-list").append(dom_a);
    });
}

function kws_hide_list(){
    $(".kws-show-btn").html("展示列表");
    $(".kws-show-list").html("").addClass("hide");
}

$(document).on("click", ".kws-show-btn", function (){
    let that = $(this);
    if ($(".kws-show-list").hasClass("hide")){
        kws_show_list();
    }else{
        kws_hide_list();
    }
});
$(document).on("click", ".kws-a", function (){
    let that = $(this);
    kws_hide_list();
    //
    let target = that.attr("data-target");
    let href = view.unicode_to_string(that.attr("data-encode_href"));
    //
    view.show_loading(3000);
    setTimeout(function (){
        // window.location.replace(href);
        view.window_open(href, "_self");
    }, 200);
});

let kws_title = "👌<br>建议使用联通或电信的网络<br>[ "+view.time_date("Y/m/d H:i")+" ]";
let kws_dom = `<div class="kws-show-btn select-none click font-blue font-text">展示列表</div><div class="clear"></div><div class="kws-show-list font-text hide"></div>
<div class="center"></div>
<div class="clear"></div>`;
