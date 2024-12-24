// 输入kw@关键词时对应
function check_input_kw(_word){
    let word = decodeURIComponent(_word);
    view.log("对比字符串：", [_word, word]);
    let state = true;
    let url = "";
    if (word === "kw@" || word === "kw@fresh" || word === "kw@reload" || word === "kw@refresh" || word === "@fresh" || word === "@refresh" || word === "@reload"){
        url = "./";
        view.window_open(url, "_self");
    }
    else if (word === "kw@login" || word === "@login"){
        url = "./?route=login";
        view.window_open(url, "_self");
    }
    else if (word === "kw@404" || word === "@404"){
        url = "./?route=404";
        view.window_open(url, "_self");
    }
    //
    else if (word === "kw@notes" || word === "kw@paste" || word === "@notes" || word === "@paste"){
        url = "./?route=notes&cache="+view.time_date("YmdHis");
        view.window_open(url, "_self");
    }
    else if (word === "kw@coding" || word === "@coding"){
        url = "./?route=coding";
        view.window_open(url, "_self");
    }
    else if (word === "kw@lan" || word === "@lan"){
        url = "./?route=lan";
        view.window_open(url, "_self");
    }
    else if (word === "kw@setting" || word === "kw@settings" || word === "@setting" || word === "@settings"){
        url = "./?route=setting";
        view.window_open(url, "_self");
    }
    else if (word === "kw@sub_app" || word === "kw@sub_apps" || word === "@sub_app" || word === "@sub_apps"){
        url = "./?route=sub_app";
        view.window_open(url, "_self");
    }
    else if (word === "kw@app" || word === "kw@download" || word === "kw@software" || word === "@app" || word === "@download" || word === "@software"){
        url = "./?route=app";
        view.window_open(url, "_self");
    }
    else if (word === "kw@help" || word === "@help"){
        url = "./?route=help";
        view.window_open(url, "_self");
    }
    else if (word === "kw@info" || word === "@info"){
        url = "./?route=info";
        view.window_open(url, "_self");
    }
    else if (word === "kw@translator" || word === "kw@biyingfanyi" || word === "kw@必应翻译" || word === "@biyingfanyi" || word === "@必应翻译" || word === "@translator"){
        url = "https://www.bing.com/translator";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@fanyi" || word === "kw@翻译" || word === "@fanyi" || word === "@翻译"){
        url = "https://fanyi.baidu.com/";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@youdao" || word === "kw@有道" || word === "@youdao" || word === "@有道")
    {
        url = "https://fanyi.youdao.com/";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@font" || word === "kw@fontawesome" || word === "@font" || word === "@fontawesome"){
        url = "https://fontawesome.com/icons";
        view.window_open(url, "_blank");
    }
    else if (word === "kw@png" || word === "kw@icon" || word === "@png" || word === "@icon"){
        url = "https://www.flaticon.com/";
        view.window_open(url, "_blank");
    }
    else if (word === white_local_key){
        clear_all_data();
    }
    //
    else if (view.string_include_string(word, "kw@url=") >= 0 || word === view.string_include_string(word, "@url=") >= 0){
        view.notice_txt("打开网址", 2000);
        let dom_id = "content-bg";
        let url = word.replace("kw@url=", "").replace("@url=", "");
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