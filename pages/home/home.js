/*
 * 局部模块js
 * */
"use strict";

const search_debug = false; // 调试日志，false关闭日志，true显示日志

// 调试日志
function console_log(txt) {
    search_debug === true ? console.info(txt) : "";
}

// 二维码图位置<img class="qr_img" id="qr-img" />
// 使用call_func来获取<img class="qr_img" id="qr-img" />中src的值即可
function make_new_qr(content, width, height, call_func, id) {
    let _content = content ? content : "没有设置二维码参数";
    let _width = width ? width : 200;
    let _height = height ? height : 200;
    try {
        document.getElementById("qrcode").remove(); // 每次都移除老的
    } catch (e) {
        console_log("不存在qrcode-div节点，无法移除老QR");
    }
    let div = document.createElement("div");
    div.classList.add("qrcode");
    div.style.display = "none";
    div.setAttribute("id", "qrcode");
    document.getElementById("content").appendChild(div);
    let qrcode = new QRCode("qrcode", {
        text: _content,
        width: _width,
        height: _height,
        colorDark: "#000000",
        colorLight: '#f5f5f5',
        correctLevel: QRCode.CorrectLevel.L
    });

    setTimeout(function() {
        try {
            call_func(1, id);
        } catch (e) {
            console_log([call_func, id]);
        }
    }, 100);

}

function get_url_param(url, key) { // 获取url中的参数
    // 兼容模式url地址，例如：poop.html?page=3&ok=222#p=2#name=kd
    let url_str = "";
    if (!url) { url_str = window.location.href; } else { url_str = url; }
    let regExp = new RegExp("([?]|&|#)" + key + "=([^&|^#]*)(&|$|#)");
    let result = url_str.match(regExp);
    if (result) {
        return decodeURIComponent(result[2]); // 转义还原参数
    } else {
        return ""; // 没有匹配的键即返回空
    }
}

function timestamp() {
    return new Date().getTime();
}

const search_cookie_pre = app_class + "search_";
const search_eq = search_cookie_pre + "index";
let search_time_style = 0; // 自动校正iframe

function set_search(val) { // 配置当前的搜索引擎
    view.set_data(search_eq, val);
    for (let i = 0; i < document.getElementsByClassName("option").length; i++) {
        document.getElementsByClassName("option")[i].removeAttribute("selected");
    }
    document.getElementsByClassName("option-" + val)[0].setAttribute("selected", "selected");
}

function create_input(pre, swiper_dom) { // 渲染模板
    // 搜索按钮
    let search_btn_dom =
        '<div class="search-btn-center do-btn-center must-btn select-none">' +
        '   <div class="search-btn-style history-btn-span click red" title="Clear History" data-clipboard-text=" ">'+view.language_txt("clear_history")+'</div>' +
        '   <div class="search-btn-style refresh-btn-span click " title="Rewrite Keywords" >'+view.language_txt("reenter")+'</div>' +
        '   <div class="search-btn-style search-btn-span click" title="Search"><i class="fas fa-search"></i>'+view.language_txt("search")+'</div>' +
        '   <div class="clear"></div>' +
        '</div>';

    let search_swiper_btn_dom =
        '<div class="swiper-container select-none">' +
        '    <div class="swiper-wrapper">' +
        //--
        '       <div class="swiper-slide more-btn"></div>' +
        //--
        swiper_dom +
        //--
        '       <div class="swiper-slide more-btn"><div class="edit-website_mark click font-text font-blue select-none a-click break" data-href="./?route=setting&from=&right_parts_name=website_mark-item" data-target="_self"><i class="fa-light fa-pen-to-square"></i> '+view.language_txt("setting_website_mark")+'</div></div>' +

        //--
        '    </div>' +
        '    <div class="swiper-pagination hide"></div>' +
        '    <div class="swiper-button-next hide"></div>' +
        '    <div class="swiper-button-prev hide"></div>' +

        '</div>';

    // 输入框
    let content = document.getElementsByClassName("content")[0];
    content.innerHTML =
        '<div class="input-div" id="input-div">' +
        '   <select class="select search-style div_theme select-none" id="select"></select>' +
        '   <input type="text" value="" maxlength="1500" autocomplete="off" id="input" class="input search-style div_theme"  placeholder="' + pre + view.language_txt("input_placeholder") + '" title="Keywords"/>' +
        '   <div class="clear"></div>' +
        '</div>' +
        '<div class="search-btn-div" id="search-btn">'+search_btn_dom+'</div>' +
        '<div class="clear"></div>' +
        '<div class="input-history-div" id="input-history"></div>' +
        '<div class="clear"></div>' +
        '<div class="search-swiper-btn-div" id="search-swiper-btn">'+search_swiper_btn_dom+'</div>' +
        '<div class="clear"></div>';
    let append_tag = [];
    for (let i = 0; i < search_data_default.length; i++) {
        let tag = '<option class="option option-' + i + '" value="' + i + '">' + search_data_default[i]["name"] + '</option>';
        append_tag.push(tag);
    }
    document.getElementsByClassName("select")[0].innerHTML = append_tag.join("");
    document.getElementById("input-div").classList.add("input-div-blur");
    let _eq = view.get_data(search_eq);
    if (_eq) { set_search(_eq); } else { set_search(0); }

    setTimeout(function() {
        delete_loading();
    }, 100);

}

function run_search() { // 执行搜索
    //
    let _input = document.getElementById("input").value;
    update_history(_input);
    change_blur();
    try {
        clearInterval(search_time_style);
    } catch (e) {
        console_log("第一次进入页面是没有定时器的");
    }
    let _select = document.getElementById("select");
    let engine = search_data_default[_select.options[_select.selectedIndex].value].engine;

    if (!_input.trim()) {
        console_log("内容不能为空");
        view.notice_txt(view.language_txt("keywords_null"), 1500);
        change_focus();
        return;
    }

    // 提示
    show_loading();
    change_blur(); // 主动退去键盘
    show_history();
    setTimeout(function() {
        delete_loading();
        document.getElementById("input").value = "";
    }, 2000);

    // 校验input值
    let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)+([A-Za-z0-9-~\/])/; // 至少是 http://a 或 https://a这种格式
    if (!reg.test(_input)) { // 不是网址
        console_log("不是网址");
        _input = encodeURIComponent(_input);
        // 校验关键词
        try{
            let kw_state = check_input_kw(_input);
            if (!kw_state){ // false
                view.log("未匹配到关键词，开始执行跳转："+kw_state, _input);
                jump_to_search_engine(engine, _input);
            }else{ // true
                view.log("匹配到了关键词，跳过在此执行。", kw_state);
            }
        }catch (e){
            console.error(e);
            console.error("匹配关键词运行时报错", _input);
            jump_to_search_engine(engine, _input);
        }
    } else { // 为网址
        console_log("是网址");
        view.window_open(_input, "_blank");
    }
}

function init_dom(swiper_dom) {
    // 输入框
    create_input("", swiper_dom);

    // 各种按钮事件绑定
    document.getElementsByClassName("input")[0].addEventListener("mouseover", function(e) {
        console_log("鼠标over了输入框，输入框自动聚焦");
        let that = this;
        that.focus();
    });
    document.getElementById("select").onchange = function(e) { // 设置历史和当前选中的搜索引擎
        console_log("选择搜素引擎");
        let that = this;
        set_search(that.value);
    };
    document.getElementById("input").onfocus = function(e) {
        console_log("监听输入框状态-onfocus");
        // document.getElementsByClassName("select")[0].classList.add("liner-color");
        document.getElementById("input-div").classList.remove("input-div-blur");
        document.getElementById("input-div").classList.add("input-div-focus");
    };
    document.getElementById("input").onblur = function(e) {
        console_log("监听输入框状态-onblur");
        // document.getElementsByClassName("select")[0].classList.remove("liner-color");
        document.getElementById("input-div").classList.remove("input-div-focus");
        document.getElementById("input-div").classList.add("input-div-blur");
    };

    // 注册要监听的input id
    setTimeout(function (){
        register_input_id("input");
    }, 200);

    //
    document.getElementsByClassName("search-btn-span")[0].addEventListener("click", function() {
        // view.show_mask(200);
        run_search();
    });

    document.getElementsByClassName("history-btn-span")[0].addEventListener("click", function() {
        let that = this;
        //
        view.alert_confirm("⚠️", view.language_txt("clear_history_alert"), function (state, class_name){
            view.log(state, class_name);
            if (state){
                view.show_mask(400);
                clear_history();
                document.getElementById("input").value = "";
                clear_copy(that, "history-btn-span");
            }else{
                clear_copy(that, "history-btn-span");
            }

        });
    });
    document.getElementsByClassName("refresh-btn-span")[0].addEventListener("click", function() {
        view.show_mask(200);
        document.getElementById("input").value = "";
        // view.notice_txt("已清空输入框", 600);
        change_focus();
    });

    setTimeout(function (){
        make_swiper();
    }, 200);

}

/*
*  处理历史记录
* */
$(document).on("click", ".history-span", function (){
    let that = $(this);
    let data = that.attr("data-history");
    document.getElementById("input").value = data;
    // run_search();
});

function show_history(){
    let data_key = app_class + "input_history";
    let array_key = "@=history=@";

    try {
        $("#input-history").html("");

        let data_string = view.get_data(data_key)
        // 限制显示历史记录长度
        let len = 42;
        let array_history = data_string.split(array_key)
        for (let i=0; i<len; i++){
            let the_history = array_history[i];
            if (the_history){
                let span = '<div class="history-span click select-none blue" data-history="'+the_history+'" title="'+the_history+'" data-title="'+the_history+'">'+(array_history.length-1-i)+'#'+the_history+'</div>'
                $("#input-history").append(span);
            }
        }
    }catch (e) {
        $("#input-history").html("");
        view.notice_txt("获取历史记录时报错", 3000);
    }

}
function update_history(input_value){
    // let input_history = document.getElementById("input-history");
    // let input_value = document.getElementById("input").value;

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
        // 自动处理历史记录，规则：start_history - new_history > 30 day，即表示无法在”长时间连续使用“的情况下，以前的历史即为fake历。
        let len_day = 30*6; // 默认存6月
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
            clear_history();
        }else{ // 连续，更新最新的时间，即连续使用时，数据都为有效数据。
            view.set_data(input_history_start_time_key, input_history_new_time);
        }
    }catch (e) {}
}
function clear_history(){
    $("#input-history").html("");

    let input_history_start_time_key = app_class + "input_history_start_time";
    let input_history_new_time = view.time_s()*1;
    view.set_data(input_history_start_time_key, input_history_new_time);

    let data_key = app_class + "input_history";
    return view.del_data(data_key);
}

function change_focus() {
    document.getElementById("input").focus();
}

function change_blur() {
    document.getElementById("input").blur();
}

function show_loading() {
    console_log("展示遮蔽层");
    document.getElementById("loading-div").classList.remove("hide");
}

function delete_loading() {
    console_log("删除遮蔽层");
    document.getElementById("loading-div").classList.add("hide");
}

// 打开网址
function href_ext(that) {
    let el_href = that.attr("data-href");
    console_log(el_href);
    if (el_href) {
        view.window_open(el_href, "_blank");
    } else {
        view.alert_txt(view.language_txt("home_a_click_null_alert"), 2000);
        console_log("参数不能为空");
    }
}

//
function make_swiper(){
    let swiper = new Swiper('.swiper-container', {
        autoHeight: true, //enable auto height
        spaceBetween: 200,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) { // 底部数字
                return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
        },
        keyboard: { // 键盘方向键控制
            enabled: true,
        },
        mousewheel: true, // 鼠标滚轮控制
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // 是否展示导航标签
    setTimeout(function (){
        let state = switch_read_data("swiper_pagination_display");
        if (state){
            $(".swiper-pagination").removeClass("hide");
        }
    }, 50);

}

//
function clear_copy(that, _class){
    // view.notice_txt(view.read_clipboard());

    let clipboard = new Clipboard("."+_class);
    clipboard.on('success', function(e) {
        // console.info('Action:', e.action);
        // console.info('Text:', e.text);
        // console.info('Trigger:', e.trigger);
        // view.alert_txt("已生成随机数到记事本", 1200);
        e.clearSelection();
    });
    clipboard.on('error', function(e) {
        // console.error('Action:', e.action);
        // console.error('Trigger:', e.trigger);
        // view.alert_txt("记事本操作失败", 800);
    });

}

let timer_span_flash = 0
function timer1() {
    let time_txt = "";
    if (timer_span_flash === 0){
        time_txt = view.time_date('Y/m/d W H.i');
        timer_span_flash = 1;
    }else{
        time_txt = view.time_date('Y/m/d W H:i');
        timer_span_flash = 0;
    }
    document.getElementsByClassName("timer-span")[0].innerHTML = time_txt;
}

// 节能模式
function battery_model(){
    if (!switch_read_data("battery_state")){
        view.log("当前节能模式：关闭");
        view.write_js([cdn_page_file+"parts/bg_animate/bg_animate.js"+"?"+page_time]);
    }else {
        view.log("当前节能模式：打开");
    }
}

$(document).on("click", ".href-btn-span", function (){
    let that = $(this);
    view.show_mask(200);
    href_ext(that);
});
$(document).on("click", ".qr-div", function (){
    let that = $(this);
    if (that.hasClass("qr-60")){
        that.removeClass("qr-60").addClass("qr-20");
    }else if (that.hasClass("qr-20")) {
        that.removeClass("qr-20").addClass("qr-60");
    }
});

$(document).on("click", ".open_lang-span", function (){
    let that = $(this);
    let url = "./?route=setting&from=&right_parts_name=language-item";
    view.window_open(url, "_self");
});

// 解析数据
function list_website(website_data){
    // 制作swiper dom格式
    function make_swiper_dom(list){
        // 将点数组转化成行数组
        function trans_foot(list, foot){
            let x = list.length % foot;
            let x1 = list.slice(0, list.length - x);
            let x2 = list.slice(list.length - x, list.length);
            let y = [];
            let x_array = [];
            let x_num = 0;
            for (let m=0; m<x1.length; m++){
                if (x_num<foot){
                    x_array.push(x1[m]);
                    x_num++;
                    if (x_num === foot){
                        y.push(x_array);
                        x_array = [];
                        x_num = 0;
                    }
                }
            }
            y.push(x2);
            return y;
        }
        // 行数组值插入对应dom
        function trans_dom(list){
            let p_dom = '';
            let y_dom = '';
            let x_dom = '';
            let blank_dom1 = '<div class="search-btn-center quick-btn-center"><div class="clear"></div></div>';
            let blank_dom2 = '<div class="swiper-slide more-btn"></div>';

            list.forEach((p)=>{
                p.forEach((y)=>{
                    y.forEach((x)=>{
                        let title = x.title;
                        let href = x.href;
                        let icon = x.icon;
                        x_dom = x_dom + '<span class="search-btn-style href-btn-span click"  data-href="'+href+'">' + title + '</span>';
                    });
                    y_dom = y_dom +'<div class="search-btn-center quick-btn-center">' + x_dom + '<div class="clear"></div></div>';
                    x_dom = ''; // init
                });
                p_dom = p_dom + '<div class="swiper-slide more-btn">' + y_dom + '</div>';
                y_dom = ''; // init
            });
            return p_dom.replaceAll(blank_dom1, "").replaceAll(blank_dom2, "");
        }
        // 开始转化
        let x = trans_foot(list, 3);
        let y = trans_foot(x, 4);
        return trans_dom(y);
    }
    return make_swiper_dom(website_data);
}

// 读取数据
function read_list_data(){
    let user_email_key = app_class+"login_email";
    let user_id = view.unicode_to_string(view.get_data(user_email_key));
    let key = app_class + "key_db_website_mark";
    let tag1 = "@-item-@";
    let tag2 = "#-value-#";
    //
    return get_KeyDB(key, user_id).then(list=>{
        if (list.length > 0){
            let website_data = [];
            list.forEach((row, index)=>{
                let key_id = row.key_id;
                let user_id = row.user_id;
                let key = row.key;
                let value = row.value;
                //
                let item = value.split(tag1);
                for (let i=0; i<item.length; i++){
                    let info = item[i].split(tag2);
                    //
                    let title = info[0];
                    let href = info[1];
                    let icon = info[2];
                    let data = {
                        "title": title,
                        "href": href,
                        "icon": icon,
                    };
                    website_data.push(data);
                    if (i === item.length-1){
                        // view.notice_txt("已读取新数据", 2000);
                        let dom = list_website(website_data);
                        init_dom(dom);
                    }
                }
            });
        }else{
            view.log("无数据");
            let dom = list_website(website_data_default);
            init_dom(dom);
        }
    });
}

function start_page(info) {

    if (view.is_wails()){
        os_hide_item();
        //
        $(".notes-span").removeClass("hide");
        $(".lan-span").removeClass("hide");
        $(".settings-span").removeClass("hide");
        // init_dom();
        read_list_data().then(()=>{
            show_history();
            battery_model();
            // dom重新渲染
            setTimeout(function (){
                let swiper_container_show = view.get_data("swiper_container_show");
                if (swiper_container_show === "show"){ // show
                    $(".swiper-container").removeClass("hide");
                }else if (swiper_container_show === "hide") { // hide
                    $(".swiper-container").addClass("hide");
                }else{
                    $(".swiper-container").removeClass("hide");
                }
            }, 200);
        });
    }else{ // web
        init_dom("");
        setTimeout(function (){
            show_history();
            //
            $(".swiper-container").addClass("hide");
            // if (view.is_mobile_screen()){$(".pwa-lock-span").removeClass("hide");}
        }, 200);
        // 二维码
        make_new_qr(window.location.href, 200, 200, function (){
            let src = $(".qr_img").attr("src");
            if (src){$(".new-qr-img").attr("src", src);}
            $(".qr-div-div").removeClass("hide");
        }, "qr-div");
    }

    // 木鱼
    if (switch_read_data("muyu")){
        $(".muyu-div").removeClass("hide");
        $(".muyu-img").attr("src", cdn_page_file + "static/img/muyu-1.png");
        view.write_js([cdn_page_file + "pages/sub_app/muyu/muyu-click.js"], function (){});
    }else{
        $(".muyu-div").addClass("hide");
    }

    // 设置html里面的翻译文字
    function set_lang_html(){
        // <span class="lang-span lang-"></span>
        // $(".lang-").html(view.language_txt(""));
        // // $(".lang-placeholder-").attr("placeholder", view.language_txt(""));
        $(".lang-lang").html(view.language_txt("lang"));
        $(".lang-notes").html(view.language_txt("notes"));
        $(".lang-lan").html(view.language_txt("lan"));
        $(".lang-help").html(view.language_txt("help"));
        $(".lang-coding").html(view.language_txt("coding"));
        $(".lang-lock").html(view.language_txt("lock"));
        $(".lang-setting").html(view.language_txt("setting"));
    }
    set_lang_html();

}

function hide_page(){
    view.log("后台状态，清除定时器");
}

function show_page(){
    view.log("前台状态，重新开启定时器");
    show_history();
}