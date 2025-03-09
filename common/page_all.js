/*自定义全局函数，公用js*/
/*建议放公共函数*/

const search_data_default = [
    {
        "name": "Bing",  // 引擎描述，可视5个字
        "engine": "bing", // 引擎名称
    },
    {
        "name": "百度Baidu",
        "engine": "baidu",
    },
    {
        "name": "搜狗Sogou",
        "engine": "sogou",
    },
    {
        "name": "Google", // 引擎描述，可视5个字
        "engine": "google", // 引擎名称
    },
    {
        "name": "DuckDuckGo",
        "engine": "duckduckgo",
    },
    {
        "name": "Yandex",
        "engine": "yandex",
    },
    {
        "name": "Yahoo!",
        "engine": "yahoo",
    },
    // {
    //     "name": "Github",
    //     "engine": "github",
    // },
    // {
    //     "name": "X",
    //     "engine": "x",
    // },
    // {
    //     "name": "Youtube",
    //     "engine": "youtube",
    // },
    // {
    //     "name": "TikTok",
    //     "engine": "tiktok",
    // },
    // {
    //     "name": "抖音",
    //     "engine": "douyin",
    // },
    {
        "name": "Icon Images",
        "engine": "icons",
    },
    {
        "name": "IP & Domain",
        "engine": "ipdomain",
    },
    {
        "name": "Whois",
        "engine": "whois",
    },

];

// 搜索条件
function jump_to_url_location(engine, word) {
    view.show_loading(0);

    // 屏蔽词
    let del_fake_news = view.get_data(app_class+"search_del_fake_news");
    del_fake_news = decodeURIComponent(del_fake_news)?" "+decodeURIComponent(del_fake_news):"";

    // 重定向到search页进行
    let search_host= "";
    let param_data = "";
    let history = "no";
    let target = "_blank";
    return new Promise(resolve => { // param
        if (!view.is_wails()){ // web
            if (view.is_mobile_pwa() || view.is_pc_pwa()){ // PWA
                target = "_blank";
            }else{ // 网页
                if (view.is_mobile_screen() === 0){ // PC
                    target = "_blank";
                }else{ // mobile
                    // target = "_self";
                }
            }
            resolve(window.location.host);
        }else{ // wails
            js_call_go.WebServerHost().then(_host=>{resolve(_host);});
        }
    }).then(host=>{ // open
        search_host= "http://"+host+assets_html_dir_name+assets_html_index_name;
        param_data = "?route=search&engine="+engine+"&history="+history+"&word="+word+del_fake_news;
        let search_url = search_host+param_data;
        //
        // if (!view.is_user_screen() || !view.is_mobile_pwa() || !view.is_pc_pwa()){ // 拦截调试
        //     target = "_self";
        //     search_url = app_url.jump_url+"&error=不支持功能";
        //     window.location.replace(search_url);
        //     return;
        // }
        view.window_open(search_url, target);
    });
}
// 开始搜索
function jump_to_search_engine(engine, word) {
    if (!engine){ // 初始值
        let search_eq = view.get_data(app_class+"search_index");
        search_eq = 1*search_eq;
        if (search_eq === 0){
            engine = "bing";
        }
        else if (search_eq === 1){
            engine = "baidu";
        }
        else if (search_eq === 2){
            engine = "google";
        }
        else if (search_eq === 3){
            engine = "duckduckgo";
        }
        else {
            engine = "bing";
        }
    }
    view.log([word, engine]);
    jump_to_url_location(engine, word).then(r => {});
}


// 复制
// 需要设置：class="copy-text"，data-clipboard-text=""
let clipboard = new ClipboardJS('.copy-text');
clipboard.on('success', function(e) {
    e.clearSelection();
    view.notice_txt(view.language_txt("copied"), 2000);
});
clipboard.on('error', function(e) {
    view.notice_txt(view.language_txt("copy_failed"), 2000);
});

// 清除所有配置记录、数据库记录
function clear_all_data(){
    view.alert_confirm("⚠️", "清除全部配置数据 ？", function (state){
        if (state){ // yes
            view.show_mask(3000);
            view.clear_data();
            view.refresh_page(1000);
        }else { // no
            //
        }
    });

}

// 绑定跳转
$(document).on("click", ".a-click", function (){
    let that = $(this);
    view.show_mask(1200);
    let href = that.attr("data-href");
    let target = that.attr("data-target");
    target = target?target:"_self";
    if (href){
        view.window_open(href, target);
    }else {
        view.notice_txt("未设置data-href", 2000);
    }
});


// switch按钮初始化渲染
// 控件：<input class="input-switch input-switch-animate" type="checkbox" data-tag="tag1" />
// 回调：function switch_click(state, tag){console.log("click_switch", [state, tag]);}
// 数据：switch_set_data(state, tag)、switch_read_data(tag)
function switch_init(){
    view.log("init_switch");
    // 渲染
    let btn = $(".input-switch");
    if (btn.length < 1){
        view.log("缺失switch控件");
    }else{
        for (let i= 0; i< btn.length; i++){
            let the_btn = btn.eq(i);
            let the_tag = the_btn.attr('data-tag');
            let the_val = switch_read_data(the_tag)*1;
            if (the_val === 1){ // 开
                the_btn.prop('checked', true);
                the_btn.attr('value', 1);
                switch_set_data(1, the_tag);
            }else{ // 关
                the_btn.prop('checked', false);
                the_btn.attr('value', 0);
                switch_set_data(0, the_tag);
            }
        }
    }
}
// 点击事件
$(document).on("click", ".input-switch", function (){
    let that = $(this);
    if (that.attr('value')*1 === 0){ // 打开动作
        let state = 1;
        let tag = that.attr('data-tag');
        that.prop('checked', true);
        that.attr('value', state);
        switch_set_data(state, tag);
        try {switch_click(state, tag);}catch (e) {view.log("switch_click(state, tag)");view.notice_txt("switch_click(state, tag)", 1500);}
    }else{ // 关闭动作
        let state = 0;
        let tag = that.attr('data-tag');
        that.prop('checked', false);
        that.attr('value', state);
        switch_set_data(state, tag);
        try {switch_click(state, tag);}catch (e) {view.log("switch_click(tate, tag)");view.notice_txt("switch_click(state, tag)", 1500);}
    }
});
// 设置已设置的switch数据
function switch_set_data(state, tag){
    let prefix = app_class + "switch_";
    view.log("switch_set_data", [prefix+tag, state]);
    return view.set_data(prefix+tag, state);
}
// 读取已设置的switch数据
function switch_read_data(tag){
    let prefix = app_class + "switch_";
    let state = view.get_data(prefix+tag)*1;
    view.log("switch_read_data", [prefix+tag, state]);
    return state;
}

// 在某些操作系统下隐藏特定dom
function os_hide_item(){
    // 处理操作系统差异的功能显示
    js_call_go.GetOS().then(info=>{
        if (info === "win"){
            $(".mac-hide").removeClass("mac-hide");
        }
        if (info === "mac"){
            $(".win-hide").removeClass("win-hide");
        }
    });
    //
    if (lang_eq === 0){ // 非简体中文
        $(".zh-show").removeClass("zh-show");
    }
    //
    if (lang_eq !== 0){ // 非简体中文
        $(".zh-hide").removeClass("zh-hide");
    }
}

// 点击遮蔽层时的css提醒效果
$(document).on("click", ".mask-div", function (){
    let that = $(this);
    console.log("click");
    $(".confirm-div").css("border", "1px solid rgba(45,144,254,0.5)");
    setTimeout(function (){
        $(".confirm-div").css("border", "1px solid rgba(200,200,200,0.5)");
    }, 100);
});
// 点击遮蔽层时的css提醒效果
$(document).on("click", ".bg-div", function (){
    let that = $(this);
    console.log("click");
    $(".confirm-div").css("border", "1px solid rgba(45,144,254,0.5)");
    setTimeout(function (){
        $(".confirm-div").css("border", "1px solid rgba(200,200,200,0.5)");
    }, 100);
});


// 用值选中
function switch_radio_active(value){
    let item = $(".switch-radio-list").find(".switch-radio-item");
    let old_active = $(".switch-radio-item-active");
    let old_value = old_active.attr("data-value");
    item.removeClass("switch-radio-item-active");
    for (let i=0; i<item.length; i++){
        let _value = item.eq(i).attr("data-value");
        if (_value === value){
            try {
                let changed = -1; // -1未曾选中，0值变化未变化，1值已经变化
                if (old_active.length === 0){
                    changed = -1;
                }else{
                    if (old_value !== value){
                        changed = 1;
                    } else{
                        changed = 0;
                    }
                }
                switch_radio_clicked(_value, i, changed);
            }catch (e){
                view.log("有正确值，但无回调函数：switch_radio_clicked()");
                view.notice_txt("有正确值，但无回调函数", 2000);
            }
            item.eq(i).addClass("switch-radio-item-active");
            break;
        }
    }
}
// 单选点击
$(document).on("click", ".switch-radio-item", function (){
    let that = $(this);
    let value = that.attr("data-value");
    switch_radio_active(value);
});

//===============================

let selected_write_js = "";
let selected_confirm = ""; // must 表示要确认才能切换，其他值为随意切换
let selected_that;
$(document).on("click", ".a-write_js", function (){
    let that = $(this);

    // 获取文件
    let confirm = that.attr("data-confirm");
    let js_url = that.attr("data-write_js");
    let _js_url = cdn_page_file+js_url+"?"+page_time;
    let css_url = that.attr("data-write_css");
    let _css_url = cdn_page_file+css_url+"?"+page_time;
    let html_url = that.attr("data-write_html");
    let _html_url = cdn_page_file+html_url+"?"+page_time;

    //
    let name = that.attr("data-name");
    show_add_btn(name);

    // 渲染点击选中
    that.siblings("div").removeClass("tools-left-item-active");
    that.addClass("tools-left-item-active");

    // 写入目标模块
    function insert_html(insert_class_name){
        $("#tools-right-content").html(""); // 每次正确运行时就初始化dom
        view.write_css([_css_url], function (){},"parts-css");
        view.write_html(_html_url, "tools-right-content", function (_state){
            if (_state){
                view.write_js([_js_url], function (state){
                    if (state){
                        run_parts(name, that.text(), [_js_url, _css_url, _html_url]);
                        // console.log("parts-js=", name, [_js_url, _css_url, _html_url]);
                    }else{
                        view.alert_txt("js_js加载失败！", 3000);
                    }
                });
            }else{
                view.alert_txt("js_html加载失败！", 3000);
            }
        }, insert_class_name);
    }

    // 跳过重复点击的动作
    if (selected_write_js === js_url){ // 重复
        let insert_class_name = "tab-"+view.md5(js_url);
        view.log("执行一样的item", [name, that.text(), selected_write_js, js_url]);
        // view.notice_txt("当前工具就是目标工具", 2000);
        // 判断是否能直接切换新的item
        if (selected_confirm === "must" || selected_confirm === "true"){ // 不可以直接切换
            view.alert_confirm("⚠️ 内容可能丢失", "是否重置「"+that.text()+"」 ？", function (state){
                if (!state){
                    // view.notice_txt("取消了重置", 2000);
                }else{ // 确认切换
                    // view.notice_txt("已重置", 2000);
                    //
                    insert_html(insert_class_name);
                }
            });
        }else{ // 可以直接切换
            // view.notice_txt("已重置「"+that.text()+"」", 2000);
            //
            insert_html(insert_class_name);
        }
    }else{ // 不重复
        let insert_class_name = "tab-"+view.md5(js_url);
        // 判断是否能直接切换新的item
        if (selected_confirm === "must" || selected_confirm === "true"){ // 不可以直接切换
            view.alert_confirm("⚠️ 内容可能丢失", "是否切换到 "+that.text()+"  ？", function (state){
                if (!state){
                    // view.notice_txt("取消了切换", 2000);
                    // 返回选中
                    selected_that.siblings("div").removeClass("tools-left-item-active");
                    selected_that.addClass("tools-left-item-active");
                }else{ // 确认切换
                    // view.notice_txt("已切换", 2000);
                    // 新值
                    selected_write_js = js_url;
                    selected_confirm = confirm;
                    selected_that = that;
                    //
                    insert_html(insert_class_name);
                }
            });
        }else{ // 可以直接切换
            // 新值
            selected_write_js = js_url;
            selected_confirm = confirm;
            selected_that = that;
            //
            insert_html(insert_class_name);
        }
    }
});

// 展示add按钮
function show_add_btn(name){
    $(".nav-span-btn").addClass("hide");
    $(".add-"+name).removeClass("hide");
}

// 按钮为链接点击时
$(document).on("click", ".a-write_page", function () {
    let that = $(this);
    $(".tools-left-item").removeClass("tools-left-item-active");
    that.addClass("tools-left-item-active");
    let name = that.attr("data-name");
    let from = that.attr("data-from");
    // let href = "/?route="+name+"&from="+from
    // view.window_open(href, "_self");
    let href = "http://127.0.0.1:"+api_port+assets_html_dir_name+assets_html_index_name+"?route="+name+"&from="+from;
    $(".run-tools-content").attr("id", "run-tools-content");
    view.xss_iframe("run-tools-content", href + "&iframe=yes", function (){

    });
});

// 查找局域网文件
$(document).on("click", ".search-lan-btn", function (){
    let that = $(this);
    let value = $(".search-lan-input").val().trim();
    let list = $(".list-files").find(".list-files-item");
    if (!value){
        view.notice_txt(view.language_txt("notes_search_null_alert"), 2000);
        $(".search-notes-input").focus();
        for (let i=0; i<list.length; i++){
            let info = list.eq(i);
            info.removeClass("hide");
        }
    }else{
        for (let i=0; i<list.length; i++){
            let info = list.eq(i);
            let text = info.find(".item-name").text();
            if (view.string_include_string(text, value) !== -1){
                info.removeClass("hide");
            }else{
                info.addClass("hide");
            }
        }
    }
});

//===============================

