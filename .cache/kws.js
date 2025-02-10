
function kws_show_list(){
    let array_a = [ // unicode
        // {
        //     encode_title: "",
        //     encode_href: ""
        // },
        {
            encode_title: "57,49,80,111,114,110",
            encode_href: "104,116,116,112,115,58,47,47,118,105,112,46,57,49,112,48,55,46,99,111,109,47,105,110,100,101,120,46,112,104,112"
        },
        {
            encode_title: "57,49,35270,39057",
            encode_href: "104,116,116,112,58,47,47,57,49,115,112,48,57,46,99,111,109"
        },
        {
            encode_title: "57,49,21507,29916",
            encode_href: "104,116,116,112,58,47,47,57,49,99,103,119,49,54,46,99,111,109"
        },
        {
            encode_title: "27599,26085,22823,36187",
            encode_href: "104,116,116,112,58,47,47,109,114,100,115,50,51,46,99,111,109"
        },
        { // 5
            encode_title: "53,49,21507,29916",
            encode_href: "104,116,116,112,58,47,47,53,49,99,103,122,54,46,99,111,109"
        },
        {
            encode_title: "28023,35282,31934,36873",
            encode_href: "104,116,116,112,115,58,47,47,104,97,105,106,105,97,111,50,48,52,56,46,99,111,109"
        },
        {
            encode_title: "28023,35282,32593",
            encode_href: "104,116,116,112,115,58,47,47,104,106,115,113,48,52,46,99,111,109,47"
        },
        {
            encode_title: "109,105,115,115,97,118",
            encode_href: "104,116,116,112,115,58,47,47,109,105,115,115,97,118,46,119,115,47,100,109,49,50,47,99,110"
        },
        {
            encode_title: "56,88,56,88",
            encode_href: "104,116,116,112,58,47,47,121,121,104,111,111,104,46,108,111,108"
        },
        // {
        //     encode_title: "89,111,117,80,111,114,110",
        //     encode_href: "104,116,116,112,58,47,47,119,119,119,46,119,49,57,50,46,99,99"
        // },
        {
            encode_title: "66,24433,38498,45,51,32423",
            encode_href: "104,116,116,112,115,58,47,47,98,97,98,111,118,101,99,117,114,114,101,110,116,46,120,121,122,47"
        },
        // {
        //     encode_title: "24494,23494,29483,45,31119,21033,23020",
        //     encode_href: "104,116,116,112,115,58,47,47,119,101,109,101,55,46,99,111,109,47"
        // },
        // { // 10
        //     encode_title: "57,49,31934,21697",
        //     encode_href: "104,116,116,112,115,58,47,47,101,120,116,46,57,49,106,112,52,46,104,97,105,114,47,99,110,47,104,111,109,101,47,119,101,98,47"
        // },
        {
            encode_title: "26085,26412,26377,30721",
            encode_href: "104,116,116,112,115,58,47,47,57,53,49,121,117,46,99,111,109,47,57,53,49,121,117,45,109,111,118,105,101,47,114,105,98,101,110,121,111,117,109,97,47"
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
    $(".kws-show-list").append('<hr/>');
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
    view.show_loading(2000);
    setTimeout(function (){
        // window.location.replace(href);
        view.window_open(href, "_self");
    }, 200);
});

let kws_title = "<div><span style='font-weight: 700;'>教育片 @jyp</span><br>内容仅供教育学习。<br>谨防网络赌博诈骗。</div><hr/><div>推荐 联通、电信 的网络。<br>推荐 苹果Safari、谷歌Chrome 浏览器。</div><hr/><div><span style='font-weight: 700;'>[ "+view.time_date("Y/m/d H:i")+" ]</span></div>";
let kws_dom = `<hr/><div class="kws-show-btn select-none click font-blue font-text">展示列表</div><div class="clear"></div><hr/><div class="kws-show-list font-text hide"></div>
<div class="clear"></div><br/><br/><br/>`;
