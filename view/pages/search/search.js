// 更新历史记录
function s_update_history(input_value){
    let data_key = app_class + "input_history";
    let array_key = "@=history=@";

    try {
        if (input_value){
            let data_string = view.get_data(data_key)
            // 去重历史记录
            if (view.string_include_string(data_string, input_value+"@=") !== -1){
                view.log("已存在历史记录：" + input_value);
            }else {
                // 限制历史记录长度
                let len = 200;
                let array_history = data_string.split(array_key)
                let new_data_string = "";
                for (let i=0; i<array_history.length; i++){
                    let the_history = array_history[i];
                    if (i<len){
                        new_data_string = the_history + array_key;
                        let new_data = input_value + array_key + data_string;
                        view.set_data(data_key, new_data)
                    }
                }
            }
        }else {
            view.log("input_value不能为空");
        }
    }catch (e){
        view.notice_txt("更新历史记录时报错", 3000);
    }

    try {
        // 自动处理历史记录，规则：start_history - new_history > 60 day，即表示无法在”长时间连续使用“的情况下，以前的历史即为fake历。
        let len_day = 6*30; // 默认存6个月
        let input_history_start_time_key = app_class + "input_history_start_time";
        let input_history_new_time_key = app_class + "input_history_new_time";
        let input_history_start_time = view.get_data(input_history_start_time_key)*1;
        let input_history_new_time = view.get_data(input_history_new_time_key)*1;
        let input_history_len_time = len_day * 24 * 60 * 60; // 间隔时间，s
        // 初始值
        if (!input_history_start_time || input_history_start_time<0){
            input_history_start_time = view.time_s()*1;
        }
        if (!input_history_new_time || input_history_new_time<0){
            input_history_new_time = view.time_s()*1;
        }
        // 判断连续时间
        if (input_history_new_time - input_history_start_time >= input_history_len_time){ // 不连续，重新计算时间
            s_clear_history();
        }else{ // 连续，更新最新的时间，即连续使用时，数据都为有效数据。
            view.set_data(input_history_start_time_key, input_history_new_time);
        }
    }catch (e) {}
}

// 清除历史记录
function s_clear_history(){
    let input_history_start_time_key = app_class + "input_history_start_time";
    let input_history_new_time = view.time_s()*1;
    view.set_data(input_history_start_time_key, input_history_new_time);

    let data_key = app_class + "input_history";
    return view.del_data(data_key);
}

// 最终跳转
function jump_url_location(engine, word, url) {
    try {word = decodeURIComponent(word);}catch (e) {}
    const search_url= "http://"+window.location.host+assets_html_dir_name+assets_html_index_name;

    // 是链接就直接打开, http/https开头
    if (view.is_url(word)){
        view.hide_loading();
        view.title("直接打开网址");
        window.location.replace(word);
    }

    // 匹配展示本网站文字
    else if (word === "kw@bing" || word === "@bing" || word === "@必应"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        let show_txt = search_url + "?route=search&engine=bing&history=yes&word=%s";
        $(".match-kw-span-msg").html("自定义 PH-必应 搜索引擎");
        $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
    }
    else if (word === "kw@baidu" || word === "@baidu" || word === "@百度"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        let show_txt = search_url + "?route=search&engine=baidu&history=no&word=%s";
        $(".match-kw-span-msg").html("自定义 PH-百度 搜索引擎：");
        $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
    }
    else if (word === "kw@sogou" || word === "kw@sougou" || word === "@sogou" || word === "@sougou" || word === "@搜狗"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        let show_txt = search_url + "?route=search&engine=sogou&history=no&word=%s";
        $(".match-kw-span-msg").html("自定义 PH-搜狗 搜索引擎：");
        $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
    }
    else if (word === "kw@yandex" || word === "@yandex"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        let show_txt = search_url + "?route=search&engine=yandex&history=yes&word=%s";
        $(".match-kw-span-msg").html("自定义 PH-Yandex 搜索引擎：");
        $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
    }
    else if (word === "kw@google" || word === "@google" || word === "@谷歌"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        let show_txt = search_url + "?route=search&engine=google&history=yes&word=%s";
        $(".match-kw-span-msg").html("自定义 PH-Google 搜索引擎：");
        $(".match-kw-span-txt").html(show_txt).attr("data-clipboard-text", show_txt);
    }

    //
    else if (word === "@ph" || word === "@purehome" || word === "@yindaoye" || word === "@引导页" || word === "@suoyin" || word === "@索引" || word === "@index"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./");
    }
    else if (word === "kw@home" || word === "@home" || word === "@zhuye" || word === "@主页" || word === "@kaishiye" || word === "@开始页" || word === "@qishiye" || word === "@起始页" || word === "@shouye" || word === "@首页"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=home");
    }
    else if (word === "kw@app" || word === "@app"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=app");
    }
    else if (word === "kw@info" || word === "@info"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=info");
    }
    else if (word === "kw@coding" || word === "@coding"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=info");
    }
    else if (word === "kw@404" || word === "@404"){
        view.hide_loading();
        view.title("请查看 kw 对应的内容");

        window.location.replace("./?route=404");
    }

    // 触发
    else if (word === "kw@xdy" || word === "kw@jyp" || word === "@xdy" || word === "@jyp"){
        view.hide_loading();
        let white_data = view.get_data(app_class+"kw@key=kws.js.0"); // 格式 @key=test@value=123
        if ((view.is_mobile_screen() && view.is_user_screen()) || (view.is_user_screen() && view.is_pc_pwa()) || (view.is_mobile_screen() && view.is_mobile_pwa()) || white_data === "OK"){
            view.title(" 😂教育片 ");
            $(".match-kw-span-msg").html("正在加载...");
            view.write_js([cdn_page_file + ".cache/kws.js?cache="+view.time_date("YmdHi")], function (state){
                if (state){
                    $(".match-kw-span-msg").html(kws_title);
                    $(".match-kw-span-txt").html(kws_dom);
                }else{
                    $(".match-kw-span-msg").html("Error：");
                    $(".match-kw-span-txt").html("kw.js文件未正确加载，详情请看log。");
                }
            });
        }else{
            view.title(" 😂··· ");
            // $(".match-kw-span-msg").html("提示🔔：");
            // $(".match-kw-span-txt").html("不支持此口令。");
            window.location.replace(app_url.jump_url+"&error=不支持口令");
        }
    }

    // 打开网站
    else if (word === "kw@translator" || word === "kw@biyingfanyi" || word === "kw@必应翻译" || word === "@biyingfanyi" || word === "@必应翻译" || word === "@translator"){
        url = "https://www.bing.com/translator";
        window.location.replace(url);
    }
    else if (word === "kw@fanyi" || word === "kw@翻译" || word === "@fanyi" || word === "@翻译"){
        url = "https://fanyi.baidu.com/";
        window.location.replace(url);
    }
    else if (word === "kw@youdao" || word === "kw@有道" || word === "@youdao" || word === "@有道")
    {
        url = "https://fanyi.youdao.com/";
        window.location.replace(url);
    }
    else if (word === "kw@font" || word === "kw@fontawesome" || word === "@font" || word === "@fontawesome"){
        url = "https://fontawesome.com/icons";
        window.location.replace(url);
    }
    else if (word === "kw@png" || word === "kw@icon" || word === "@png" || word === "@icon"){
        url = "https://www.flaticon.com/";
        window.location.replace(url);
    }

    // 3-匹配搜索引擎
    else {
        view.show_loading(0);
        let name = "";
        //
        if (engine === "baidu"){
            url = "https://www.baidu.com/s?ie=utf-8";
            url = url + "&wd=" + word;
            name = "Baidu";
        }
        else if (engine === "bing"){
            url = "https://www.bing.com/?ensearch=1";
            url = url + "&q=" + word;
            name = "Bing";
        }
        else if (engine === "google"){
            url = "https://www.google.com/search?q=";
            url = url + word ;
            name = "Google";
        }
        else if (engine === "duckduckgo"){
            url = "https://duckduckgo.com/?ia=web";
            url = url + "&q=" + word ;
            name = "DuckDuckGo";
        }
        else if (engine === "yandex"){
            url = "https://yandex.com/search/?text=";
            url = url+ word ;
            name = "Yandex";
        }
        else if (engine === "yahoo"){
            url = "https://search.yahoo.com/search?p=";
            url = url+ word;
            name = "Yahoo";
        }
        else if (engine === "m_toutiao"){
            url = "https://m.toutiao.com/search/?keyword=";
            url = url + word ;
            name = "头条搜索";
        }
        else if (engine === "toutiao"){
            url = "https://www.toutiao.com/search/?keyword=";
            url = url + word ;
            name = "头条搜索";
        }
        else if (engine === "m_sogou" || engine === "m_sougou"){
            url = "https://wap.sogou.com/web/searchList.jsp?from=index&keyword=";
            url = url + word ;
            name = "搜狗搜索";
        }
        else if (engine === "sogou" || engine === "sougou"){
            url = "https://sogou.com/web?query=";
            url = url + word ;
            name = "搜狗搜索";
        }
        else if (engine === "weixin"){
            url = "https://weixin.sogou.com/weixin?type=2&s_from=input&ie=utf8&query=";
            url = url + word ;
            name = "微信文章搜索";
        }
        else if (engine === "music"){
            url = "https://www.hifini.com/search-";
            url = url + word + "-1-1-1.htm";
            name = "Music搜索";
        }
        else if (engine === "video"){
            url = "https://www.bing.com/search?ensearch=1&q=tokyvideo+";
            url = url + word ;
            name = "Bing+Toky搜索";
        }
        else if (engine === "ipdomain"){
            url = "https://ipchaxun.com/";
            url = url + word;
            name = "IP&网址";
        }
        else if (engine === "whois"){
            url = "https://www.whois.com/whois/";
            url = url + word;
            name = "域名Whois";
        }
        else if (engine === "dpxz_download"){
            url = "http://s.uzzf.com/sousuo/pc/?k=";
            url = url + word;
            name = "东坡下载";
        }
        else if (engine === "github"){
            url = "https://github.com/search?&type=Repositories";
            url = url + "&q=" + word;
            name = "Github";
        }
        else if (engine === "x"){
            url = "https://twitter.com/search?q=";
            url = url+ word;
            name = "X";
        }
        else if (engine === "youtube"){
            url = "https://www.youtube.com/results?search_query=";
            url = url+ word;
            name = "Youtube";
        }
        else if (engine === "douyin"){
            url = "https://www.douyin.com/search/";
            url = url+ word;
            name = "Douyin";
        }
        else if (engine === "tiktok"){
            url = "https://www.tiktok.com/search?q=";
            url = url+ word;
            name = "TikTok";
        }
        else if (engine === "icons"){
            url = "https://www.flaticon.com/search?word=";
            url = url+ word;
            name = "icon图标";
        }
        else if (engine === "zh_en"){
            url = "https://fanyi.baidu.com/translate#zh/en/";
            url = url + word ;
            name = "中英翻译";
        }
        else if (engine === "en_zh"){
            url = "https://fanyi.baidu.com/translate#en/zh/";
            url = url + word ;
            name = "英中翻译";
        }

        //
        else {
            view.alert_txt("engine参数为空，不能选择跳转的目标地址");
            view.log("/?route=search&engine=&word=");
            return;
        }
        view.title("Opening keywords" + " with " + name);
        window.location.replace(url);
    }
}

// 校验搜索引擎
function jump_search_engine(state) {
    view.log(state);
    let engine = ""; // 哪个搜索引擎
    let word = ""; // 搜索的关键词
    let url = "";

    engine = view.get_url_param("", "engine");
    try {
        word = view.get_url_param("", "word");
    }catch (e) {
        view.error(["可忽略的错误", e]);
        word = "";
    }

    if (view.get_url_param("", "history") === "yes"){
        s_update_history(word); // 更新历史
    }

    if (!engine){
        let search_eq = view.get_data("search__eq");
        search_eq = 1*search_eq;

        if (search_eq === 0){
            engine = "bing";
        }
        else if (search_eq === 1){
            engine = "baidu";
        }
        else if (search_eq === 2){
            engine = "toutiao";
        }
        else if (search_eq === 3){
            engine = "google";
        }
        else if (search_eq === 4){
            engine = "duckduckgo";
        }
        else {
            engine = "bing";
        }

        view.log([word, engine, search_eq]);
    }else {
        view.log([engine]);
    }
    jump_url_location(engine, word, url);
}


// 复制文字
// let clipboard = new Clipboard('.copy-txt-btn');
// clipboard.on('success', function(e) {
//     view.info('Action:', e.action);
//     view.info('Text:', e.text);
//     view.info('Trigger:', e.trigger);
//     view.notice_txt("已复制");
//     e.clearSelection();
// });
// clipboard.on('error', function(e) {
//     view.error('Action:', e.action);
//     view.error('Trigger:', e.trigger);
//     view.notice_txt("复制失败！");
//     try {call_func();}catch (e){}
// });


function start_page(e) {
    view.log(e);
    jump_search_engine();
}