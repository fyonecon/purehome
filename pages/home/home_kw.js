// 输入kw@关键词时对应
function check_input_kw(_word){
    let word = decodeURIComponent(_word);
    view.log("对比字符串：", [_word, word]);

    let state = false;
    let url = "";

    // 默认
    if (word === "kw@" || word === "kw@fresh" || word === "kw@reload" || word === "kw@refresh" || word === "@fresh" || word === "@refresh" || word === "@reload"){
        url = "./";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@login" || word === "@login"){
        url = "./?route=login";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@404" || word === "@404"){
        url = "./?route=404";
        view.window_open(url, "_self");
        state = true;
    }
    // 其他
    else if (word === "kw@notes" || word === "kw@paste" || word === "@notes" || word === "@paste"){
        url = "./?route=notes&cache="+view.time_date("YmdHis");
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@coding" || word === "@coding"){
        url = "./?route=coding";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@lan" || word === "@lan"){
        url = "./?route=lan";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@setting" || word === "kw@settings" || word === "@setting" || word === "@settings"){
        url = "./?route=setting";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@sub_app" || word === "kw@sub_apps" || word === "@sub_app" || word === "@sub_apps"){
        url = "./?route=sub_app";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@app" || word === "kw@download" || word === "kw@software" || word === "@app" || word === "@download" || word === "@software"){
        url = "./?route=app";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@help" || word === "@help"){
        url = "./?route=help";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === "kw@info" || word === "@info"){
        url = "./?route=info";
        view.window_open(url, "_self");
        state = true;
    }
    else if (word === white_local_key){
        clear_all_data();
        state = true;
    }

    // 写入一个data到本地，@key=test@value=123
    else if (view.string_include_string(word, "kw@key=") >= 0 || view.string_include_string(word, "@key=") >= 0){
        let data = word.replace("kw@key=", "").replace("@key=", "");
        data = data.split("@value=");
        let key = data[0];
        let value = data[1];
        if (value){
            view.set_data(app_class+"kw@key=" + key, value);
            view.notice_txt("Data Written", 2000);
        }else{
            view.notice_txt("Data Error", 3000);
        }
        state = true;
    }

    // 本页面打开一个网址
    else if (view.string_include_string(word, "kw@url=") >= 0 || view.string_include_string(word, "@url=") >= 0){
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
        state = true;
    }

    // 未匹配
    else {
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