
$(document).on("click", ".kws-show-btn", function (){
    let that = $(this);
    $(".kws-show-btn").addClass("hide");
    $(".kws-show-list").removeClass("hide");
    //
    let array_a = [
        // {
        //     encode_title: "", // unicode
        //     encode_href: "" // unicode
        // },
        // {
        //     encode_title: "21507,29916,32593", // unicode
        //     encode_href: "104,116,116,112,115,58,47,47,98,111,111,107,46,106,117,102,105,110,102,115,122,107,46,99,111,109,47" // unicode
        // },
        {
            encode_title: "57,49,21507,29916", // unicode
            encode_href: "104,116,116,112,115,58,47,47,107,98,117,121,112,46,106,114,103,116,105,108,46,99,111,109,47" // unicode
        },
        {
            encode_title: "53,49,21507,29916", // unicode
            encode_href: "104,116,116,112,115,58,47,47,119,105,107,105,112,101,100,105,97,52,46,121,114,104,112,97,118,108,46,99,111,109,47" // unicode
        },
        {
            encode_title: "56,88,56,88", // unicode
            encode_href: "104,116,116,112,115,58,47,47,117,51,106,46,113,98,110,111,48,103,46,109,111,109,47,105,110,100,101,120,46,104,116,109,108,63,119,120,61,49" // unicode
        },
        {
            encode_title: "53,71,24433,38498", // unicode
            encode_href: "104,116,116,112,115,58,47,47,117,51,106,46,113,98,110,111,48,103,46,109,111,109,47,105,110,100,101,120,46,104,116,109,108,63,119,120,61,49" // unicode
        },
    ];
    //
    $(".kws-show-list").html("");
    array_a.forEach((info, index)=>{
        let title = info.encode_title;
        let href = info.encode_href;
        let dom_a = '<a class="kws-a break click font-text" data-encode_href="'+href+'" data-encode_title="'+title+'" data-target="_blank" ><div>' + (index+1) + '：' +view.text_decode(info.encode_title)+'</div></a>';
        $(".kws-show-list").append(dom_a);
    });
});
$(document).on("click", ".kws-a", function (){
    let that = $(this);
    $(".kws-show-btn").removeClass("hide");
    $(".kws-show-list").addClass("hide");
    //
    let target = that.attr("data-target");
    let href = view.text_decode(that.attr("data-encode_href"));
    //
    const search_url= "http://"+window.location.host+assets_html_dir_name+assets_html_index_name;
    let url = search_url + "?route=search&engine=&history=no&word=" + encodeURIComponent(href);
    view.show_loading(2000);
    setTimeout(function (){
        view.window_open(url, target);
    }, 100);
});

let kws_title = "👌（建议使用联通或电信的网络）";
let kws_dom = `<div class="kws-show-list font-text hide"></div>
<div class="center"><div class="kws-show-btn select-none click font-blue font-text">展示内容</div></div>
<div class="clear"></div>`;
