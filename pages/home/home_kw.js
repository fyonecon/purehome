// 输入kw@关键词时对应
function check_input_kw(_word){
    let word = decodeURIComponent(_word);
    view.log("对比字符串：", [_word, word]);
    let state = true;
    let url = "";
    if (word === "kw@首页" || word === "kw@home" || word === "kw@" || word === "kw@fresh" || word === "kw@refresh"){
        url = "./";
        view.window_open(url, "_self");
    }
    else if (word === "kw@login"){
        url = "./?route=login";
        view.window_open(url, "_self");
    }
    else if (word === "kw@404"){
        url = "./?route=404";
        view.window_open(url, "_self");
    }
    //
    else if (word === "kw@notes" || word === "kw@paste"){
        url = "./?route=notes&cache="+view.time_date("YmdHis");
        view.window_open(url, "_self");
    }
    else if (word === "kw@coding"){
        url = "./?route=coding";
        view.window_open(url, "_self");
    }
    else if (word === "kw@lan"){
        url = "./?route=lan";
        view.window_open(url, "_self");
    }
    else if (word === "kw@setting" || word === "kw@settings"){
        url = "./?route=setting";
        view.window_open(url, "_self");
    }
    else if (word === "kw@sub_app" || word === "kw@sub_apps"){
        url = "./?route=sub_app";
        view.window_open(url, "_self");
    }
    else if (word === "kw@app" || word === "kw@download" || word === "kw@software"){
        url = "./?route=app";
        view.window_open(url, "_self");
    }
    else if (word === "kw@help"){
        url = "./?route=help";
        view.window_open(url, "_self");
    }
    else if (word === "kw@info"){
        url = "./?route=info";
        view.window_open(url, "_self");
    }
    //
    else if (word === "kw@bing" || word === "kw@baidu" || word === "kw@yandex" || word === "kw@google"){
        url = "./?route=search&engine=&word="+word;
        view.window_open(url, "_blank");
    }
    else if (word === "kw@bing#127" || word === "kw@baidu#127" || word === "kw@yandex#127" || word === "kw@google#127"){
        url = "http://127.0.0.1:"+api_port+assets_html_dir_name+assets_html_index_name+"?route=search&engine=&word="+word;
        view.window_open(url, "_blank");
    }
    //
    else if (word === "kw@translator" || word === "kw@biyingfanyi" || word === "kw@必应翻译"){
        url = "https://www.bing.com/translator";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@fanyi" || word === "kw@翻译"){
        url = "https://fanyi.baidu.com/";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@youdao" || word === "kw@有道")
    {
        url = "https://fanyi.youdao.com/";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@font" || word === "kw@fontawesome"){
        url = "https://fontawesome.com/icons";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@png" || word === "kw@icon"){
        url = "https://www.flaticon.com/";
        view.window_open(url, "_blank");
    }
    else if (word === white_local_key){
        clear_all_data();
    }
    //
    else if (view.string_include_string(word, "kw@url=") >= 0){
        view.notice_txt("打开网址", 2000);
        let dom_id = "content-bg";
        let url = word.replace("kw@url=", "");
        // 初始化
        view.del_xss_iframe(dom_id);
        $("#"+dom_id).css({"z-index": 80});
        // 重新渲染
        view.xss_iframe(dom_id, url, function (url){
            $("#"+dom_id).css({"z-index": 120});
        });
        return true;
    }

    else { // 未匹配
        state = false;
    }
    return state;
}

// PWA Lock
// function close_pwa_lock(){
//
// }
// function show_pwa_lock(){
//     let pwa_lock_pwd_key = app_class+"pwa_lock_pwd";
//     let pwa_lock_state_key = app_class+"pwa_lock_state";
//     let pwa_lock_state_value = view.get_data(pwa_lock_state_key);
//     if (pwa_lock_state_value === "on"){
//
//     } else if (pwa_lock_state_value === "off"){
//
//     } else { // new
//         view.set_data(pwa_lock_state_key, "on");
//         //  请设置锁
//     }
// }
// $(document).on("click", ".pwa-lock-btn", function (){
//     show_pwa_lock();
// });