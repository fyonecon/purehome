/*框架自带公共函数。解密https://www.sojson.com/jscodeconfusion.html*/
"use strict";

// 框架依赖的其他js文件，注意这里是框架依赖的，最先载入的依赖文件。
const map_cache = new Map(); // 设置页面键-值对缓存
let lang_eq = 0; // 翻译的数组的下标
let dbl_click_timer = 0; // 单击双击共有事件时
let mp3_info_timer;
const view = {
    log: function (txt, info) { // 日志打印统一函数
        if (txt === 0 || txt === "0") {}else {if (!txt){txt = "空txt，-log";} }
        debug === true ? console.log(JSON.stringify(txt), info): "";
    },
    info: function (txt, info){
        if (txt === 0 || txt === "0") {}else {if (!txt){txt = "空txt，-info";} }
        debug === true ? console.info(txt, info): "";
    },
    error: function (txt, info) { // 日志打印统一函数
        if (txt === 0 || txt === "0") {}else {if (!txt){txt = "空txt，-error";} }
        console.error(txt, info);
    },
    title: function (txt){ // 改写title标签内容
        let that = this;
        if (that.is_wails()){
            window.runtime.WindowSetTitle(txt);
        }else{
            document.getElementsByTagName("title")[0].innerText = txt;
        }
    },
    get_route: function (){
        let that = this;
        return that.get_url_param("", "route")?that.get_url_param("", "route"):"home";
    },
    set_lang_eq: function (_lang_eq){ // 设置中英翻译的下标
        let that = this;
        if (_lang_eq || _lang_eq === 0){ // 0 为简体中文
            lang_eq = _lang_eq;
        }else{
            let browserLang = (navigator.language).toLowerCase();
            //
            if(browserLang.indexOf('zh-cn') !== -1 || browserLang.indexOf('zh-sg') !== -1 || browserLang.indexOf('zh_cn') !== -1 || browserLang.indexOf('zh_sg') !== -1 ) { // 简体中文
                lang_eq = 0;
            }
            else if(browserLang.indexOf('en-') !== -1 || browserLang.indexOf('en_') !== -1 ) { // 英语
                lang_eq = 1;
            }
            else if(browserLang.indexOf('en') !== -1) { // 其他英文
                lang_eq = 1;
            }
            else if(browserLang.indexOf('zh-hk') !== -1 || browserLang.indexOf('zh-mo') !== -1 || browserLang.indexOf('zh-tw') !== -1 || browserLang.indexOf('zh_hk') !== -1 || browserLang.indexOf('zh_mo') !== -1 || browserLang.indexOf('zh_tw') !== -1 ) { // 繁体中文
                lang_eq = 2;
            }
            else if(browserLang.indexOf('zh') !== -1) { // 其他中文
                lang_eq = 0;
            }
            else if(browserLang.indexOf('jp-') !== -1 || browserLang.indexOf('jp_') !== -1 ) { // 日语
                lang_eq = 3;
            }
            else if(browserLang.indexOf('fr-') !== -1 || browserLang.indexOf('fr_') !== -1 ) { // 法语
                lang_eq = 4;
            }
            else if(browserLang.indexOf('de-') !== -1 || browserLang.indexOf('de_') !== -1 ) { // 德语
                lang_eq = 5;
            }
            else if(browserLang.indexOf('ru-') !== -1 || browserLang.indexOf('ru_') !== -1 ) { // 俄语
                lang_eq = 6;
            }
            else if(browserLang.indexOf('es-') !== -1 || browserLang.indexOf('es_') !== -1 ) { // 西班牙语
                lang_eq = 7;
            }
            else if(browserLang.indexOf('vi-') !== -1 || browserLang.indexOf('vi_') !== -1 ) { // 越南语
                lang_eq = 8;
            }
            else{ // 默认英语
                lang_eq = 1;
                console.log("lang_eq=", browserLang);
            }
        }
    },
    language_txt: function (lang_key) {
        let that = this;
        // console.log("翻译：" + lang_key, lang_eq);
        let txt = "";
        try {
            txt = lang_txt_data[lang_key][lang_eq];
            if (txt === ""){txt = lang_txt_data[lang_key][1]} // 默认英文
        }catch (e){
            txt = "Null Key : " + lang_key;
        }
        return txt;
    },
    // 切换主题色
    set_theme: function (){
        let that = this;
        let theme_key = app_class + "switch_radio_theme";
        let theme_value = that.get_data(theme_key);
        if (theme_value === "theme_1"){ // light
            try {
                that.init_theme(theme_value, "light");
            }catch (e){
                that.log("无对接主题色init_theme(light)函数，可忽略，1。", e);
            }
        }else if (theme_value === "theme_2"){ // dark
            try {
                that.init_theme(theme_value, "dark");
            }catch (e){
                that.log("无对接主题色init_theme(dark)函数，可忽略，2。", e);
            }
        }else{ // 系统自动判断 = theme_0
            try {
                that.init_theme(theme_value, that.scheme_model());
            }catch (e){
                that.log("无对接主题色init_theme("+that.scheme_model()+")函数，可忽略，0-2。", e);
            }
        }
    },
    // 设置软件主题
    init_theme: function (value, model){
        let that = this;
        that.log("当前主题颜色：", [value, model, view.scheme_model()]);
        that.write_css([cdn_page_file + "static/css/themes_"+model+".css"], function (){}, "themes-class");
    },
    // 切换页面缩放
    set_page_zoom: function (){
        let that = this;
        let page_zoom_key = app_class + "switch_radio_page_zoom";
        let page_zoom_value = that.get_data(page_zoom_key)*1;
        if (page_zoom_value > 1.50 || page_zoom_value < 0.50){if (that.is_wails()){page_zoom_value = 0.95;}else{page_zoom_value = 1.00;}} // 默认值
        //
        $(".body").css({"zoom": page_zoom_value+""});
    },
    click_choose: function (call_one_click_func, call_dblclick_func){
        let that = $(this);
        dbl_click_timer++;
        setTimeout(function() {
            if (dbl_click_timer === 1) { // 单击
                try {
                    call_one_click_func(1);
                }catch (e) {}
            }
            else if (dbl_click_timer === 2) { // 双击
                try {
                    call_dblclick_func(2);
                }catch (e) {}
            } else { // 次数过多时，双击
                try {
                    call_dblclick_func(2);
                }catch (e) {}
            }
            dbl_click_timer = 0;
        }, 400);
    },
    write_html: function (file_path, by_id, call_func, class_name) {  // 注射文件 | 写入html dom
        let that = this;
        if (!class_name){class_name=by_id+view.time_date("YmdHi00");}
        $.ajax({ // 利用ajax的get请求获取文本内容
            url: file_path + "?" + page_time,
            async: true,
            success: function (data) {
                // let div = document.createElement("div");
                // if(class_name){div.classList.add(class_name);}
                // div.classList.add("part-div");
                // div.classList.add("clear");
                // div.classList.add("part-div-" + that.time_ms());
                // div.setAttribute("data-view", ""+that.time_date("YmdHis"));
                // div.innerHTML = data;
                // try {
                //     document.getElementById(by_id).appendChild(div); // 将模块渲染入主文件
                // }catch (e){
                //     console.error("不能写入id_Dom", by_id);
                // }

                $("#"+by_id).append("<div class='write_html-class_name "+class_name+"' data-by_id='"+by_id+"' >"+data+"</div>");

                try {
                    call_func(true);
                }catch (e) {
                    that.log("可选回调函数没有设置。1");
                }
            },
            error: function (error) {
                console.log("缺失模块htm文件=" + error);
                try {
                    call_func(false);
                }catch (e) {
                    that.log("可选回调函数没有设置。2");
                }
            }
        });

    },
    write_js: function (js_src_array, call_func, clear_class) { // 写入外部js，["xxx1.js","xxx2.js"]
        let that = this;
        if (js_src_array.constructor !== Array){
            that.log("js_src_array不是数组。");
            return;
        }
        //
        let head = document.head || document.getElementsByTagName("head")[0];
        let js_all = [];
        for (let i=0; i<js_src_array.length; i++){
            let the_p = new Promise((resolve, reject) => {
                // 判断是否重复js
                let len = js_src_array[i].indexOf("?");
                if (len<10){len = js_src_array[i].length;}
                let js_nonce= that.md5(js_src_array[i].substring(0, len)); //取前部分（指定开始的字符串的之前）
                if ($(".js-nonce-"+js_nonce).attr("src")){ // 有老的，则跳过
                    that.log("重复添加的js", js_src_array[i]);
                    resolve(i);
                }else{
                    if (clear_class){
                        $("."+clear_class).remove();
                    }else{
                        clear_class = "";
                    }
                    // 添加js
                    let script = document.createElement("script");
                    script.setAttribute("class", "write-js js-nonce-"+js_nonce + " " +clear_class);
                    script.setAttribute("src", js_src_array[i]);
                    script.setAttribute("nonce", ""+that.time_date("YmdHis"));
                    // script.setAttribute("type", "module");
                    try {
                        head.appendChild(script);
                        script.onload = function () {resolve(i); };
                    }catch (e){
                        console.log("js文件拉取错误：", e);
                        resolve(i);
                    }
                }
            });
            js_all.push(the_p);
        }
        Promise.all(js_all).then((result) => {
            try {
                call_func(true);
            }catch (e) {
                that.log("可选回调函数没有设置。1");
            }
        }).catch((error) => {
            console.error(error);
            try {
                call_func(false);
            }catch (e) {
                that.log("可选回调函数没有设置。2");
            }
        });
    },
    write_css: function (css_src_array, call_func, clear_class) { // 写入外部css，["xxx1.css", "xxx2.css"]
        let that = this;
        if (css_src_array.constructor !== Array){
            that.log("css_src_array不是数组。");
            return;
        }
        let had_onload = 0;
        let head = document.head || document.getElementsByTagName("head")[0];
        for (let i=0; i<css_src_array.length; i++){
            let link = document.createElement("link");

            // 判断是否重复js
            let len = css_src_array[i].indexOf("?");
            let css_nonce= that.md5(css_src_array[i].substring(0, len)); //取前部分（指定开始的字符串的之前）
            if ($(".css-nonce-"+css_nonce).attr("src")){ // 有老的，则跳过
                that.log("重复添加的css", css_src_array[i]);
                // $(".css-nonce-"+css_nonce).remove();
            }else{
                if (clear_class){
                    $("."+clear_class).remove();
                }else{
                    clear_class = "";
                }
                // 添加css
                link.setAttribute("id", "depend-css");
                link.setAttribute("class", "css-nonce-"+css_nonce + " " +clear_class);
                link.setAttribute("href",css_src_array[i] + "?" + page_time);
                link.setAttribute("rel", "stylesheet");
                head.appendChild(link);
            }
            //
            had_onload++;
            if (had_onload === css_src_array.length) {
                try {
                    call_func(true);
                }catch (e) {
                    that.log("可选回调函数没有设置。");
                }
            }
        }
    },
    get_url_param: function (url, key) { // 获取url中的参数
        // 兼容模式url地址，例如：poop.html?page=3&ok=222#p=2#name=kd
        let url_str = "";
        if(!url){ url_str = window.location.href; } else {url_str = url; }
        let regExp = new RegExp("([?]|&|#)" + key + "=([^&|^#]*)(&|$|#)");
        let result = url_str.match(regExp);
        if (result) {
            return decodeURIComponent(result[2]); // 转义还原参数
        }else {
            return ""; // 没有匹配的键即返回空
        }
    },
    insert_html: function (by_id, html) { // 根据id插入html
        document.getElementById(by_id).innerHTML = html;
    },
    base64_encode: function (string) {
        try {
            return btoa(string);
        }catch (e) {
            return null;
        }
    },
    base64_decode: function (string) {
        try {
            return atob(string);
        }catch (e) {
            return null;
        }
    },
    md5: function (string) {
        return hex_md5(string);
    },
    string_to_unicode: function (string){ // 字符串转unicode，任意字符串
        let back = "";
        for (let i=0; i<string.length; i++){
            if (back){
                back += ","+string.charCodeAt(i);
            }else{
                back = string.charCodeAt(i);
            }

        }
        return back;
    },
    unicode_to_string: function (unicode){
        const _unicode = unicode.split(",");
        let back = "";
        for (let i=0; i<_unicode.length; i++){
            back += String.fromCharCode(_unicode[i]);
        }
        return back;
    },
    hex16_to_string: function (hex16) { // 除了不支持emoji外都支持
        return decodeURIComponent(hex16);
    },
    string_to_hex16: function (string){ // 字符串转16进制，任意字符串（中文、emoji）
        let hex = "";
        for (let i = 0; i < string.length; i++) {
            if (hex){
                hex += "&#x"+string.charCodeAt(i).toString(16)+";";
            }else{
                hex = "&#x"+string.charCodeAt(i).toString(16)+";";
            }
        }
        return hex;
    },
    set_cache: function (_key, _value) { // key-value对 存入系统运存，页面关闭即key-value消失
        let that = this;
        // 校验是否已经存在key
        const cache = new Map(map_cache);
        const items = [
            [_key, _value],
        ];
        items.forEach(
            ([key, value]) => map_cache.set(key, value)
        );
        return cache.get(_key);
    },
    get_cache: function (_key) {
        let that = this;
        const cache = new Map(map_cache);
        return cache.get(_key)?cache.get(_key):"";
    },
    string_to_json: function (string) { // 将string转化为json，注意，里面所有key的引号为双引号，否则浏览器会报错。
        let json;
        let back = string;

        if(typeof back === "string"){
            json = JSON.parse(back);
        } else {
            json = back;
        }

        return json;
    },
    json_to_string: function (json) { // 将json转化为string
        let string;
        let back = json;

        if(typeof back === "object"){
            string = JSON.stringify(back);
        } else {
            string = back;
        }

        return string;
    },
    post: function (api, json_data, call_func, call_data) { // 由于存在异步操作，所以设置回调函数。
        let that = this;
        if (call_data) {

        }else {
            call_data = "none";
        }
        if (api === "") {
            that.log("没有设置api接口，请保持 'view.post(api, json_data, call_func);' 写法。");
            return;
        }
        if (typeof json_data !== "object"){
            that.log("请保持data为json格式");
            return;
        }
        if (!call_func){
            that.log("post没有设置回调函数！请求的结果将无法输出！");
            return;
        }

        // 请求POST数据
        $.ajax({
            url: api,
            type: "POST",
            dataType: "json",
            async: true,
            // 字典数据
            data: json_data,
            success: function(back, status){
                let json = view.string_to_json(back);

                call_func([1, "POST请求完成，结果格式转换完成。", call_data, json]);
            },
            error: function (xhr) {
                console.log(xhr);
                call_func([0, xhr, call_data, {}]);
            }
        });

    },
    get: function (api, call_func, call_data) {
        let that = this;
        if (call_data) {

        }else {
            call_data = "none";
        }
        if (api === "") {
            that.log("没有设置api接口，请保持 'view.get(api, call_func);' 写法。");
            return;
        }
        if (!call_func){
            that.log("get没有设置回调函数！请求的结果将无法输出！");
            return;
        }
        $.get(api, function(result){
            call_func([1, "GET请求完成", call_data, result]);
        });
    },
    js_rand: function (min, max) { // [min, max]
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    js_rand_blank: function (min_len, max_len){ // 制作换行
        let that = this;
        let rand_n = "&nbsp;";
        let rand = that.js_rand(min_len, max_len);
        for (let n=0;n<rand;n++){
            rand_n += "&nbsp;";
        }
        return rand_n;
    },
    set_data: function (key, value){ // 新增或更新数据，总和最大4M，请不要存大文件
        localStorage.setItem(key,value);
        return localStorage.getItem(key);
    },
    get_data: function (key) { // 获取一个
        let value = localStorage.getItem(key);
        if (value){
            return value;
        }else {
            return "";
        }
    },
    del_data: function (key) { // 删除一个
        return localStorage.removeItem(key);
    },
    clear_data: function () { // 全部清空
        return localStorage.clear();
    },
    cache_file: function (cache_key, file_url, del_old_state, call_func){ // 缓存css，js文件到本地localstorage
        let that = this;
        file_url = file_url + "?" + that.time_date("YmdHis");
        let cache_js = "";
        if (del_old_state){
            that.del_data(cache_key);
            that.log("已清除缓存cache_key=", cache_key);
        }else {
            cache_js = that.get_data(cache_key);
        }
        if (!cache_js){ // 本地没有缓存就请求新的
            $.ajax({ // 利用ajax的get请求获取文本内容
                url: file_url,
                async: true,
                success: function (data) {
                    that.log(["本地写入缓存", cache_key, file_url]);
                    that.set_data(cache_key, data);
                    try {
                        call_func(cache_key, file_url);
                    }catch (e) {
                        that.log("可选的call_func不存在，可忽略，1");
                    }
                },
                error: function (error) {
                    console.error(error);
                    console.error("缺失文件：", file_url);
                }
            });
        }else { // 本地有js缓存
            that.log(["本地已有缓存", cache_key, file_url]);
            try {
                call_func(cache_key, file_url);
            }catch (e) {
                that.log("可选的call_func不存在，可忽略，2");
            }
        }
    },
    time_s: function () {
        return Math.floor((new Date()).getTime()/1000);
    }, // 秒时间戳，s
    time_ms: function(){
        return (new Date()).getTime();
    }, // 毫秒时间戳，ms
     time_date: function(format){ // YmdHisW，日期周
        let that = this;
        let t = new Date();
        let seconds = t.getSeconds(); if (seconds<10){seconds = "0"+seconds;}
        let minutes = t.getMinutes(); if (minutes<10){minutes = "0"+minutes;}
        let hour = t.getHours(); if (hour<10){hour = "0"+hour;}
        let day = t.getDate(); if (day<10){day = "0"+day;}
        let month = t.getMonth() + 1; if (month<10){month = "0"+month;}
        let year = t.getFullYear();
         let week = [
             that.language_txt("week")[0],
             that.language_txt("week")[1],
             that.language_txt("week")[2],
             that.language_txt("week")[3],
             that.language_txt("week")[4],
             that.language_txt("week")[5],
             that.language_txt("week")[6]][t.getDay()]; // 周

         format = format.replaceAll("Y", year);
         format = format.replaceAll("m", month);
         format = format.replaceAll("d", day);
         format = format.replaceAll("H", hour);
         format = format.replaceAll("i", minutes);
         format = format.replaceAll("s", seconds);
         format = format.replaceAll("W", week);

        return format;
    },
    timeMS_format: function (timeMS, format){ // 毫秒时间戳转日期
        let that = this;
        let t = new Date(timeMS*1);
        let seconds = t.getSeconds(); if (seconds<10){seconds = "0"+seconds;}
        let minutes = t.getMinutes(); if (minutes<10){minutes = "0"+minutes;}
        let hour = t.getHours(); if (hour<10){hour = "0"+hour;}
        let day = t.getDate(); if (day<10){day = "0"+day;}
        let month = t.getMonth() + 1; if (month<10){month = "0"+month;}
        let year = t.getFullYear();
        let week = [
            that.language_txt("week")[0],
            that.language_txt("week")[1],
            that.language_txt("week")[2],
            that.language_txt("week")[3],
            that.language_txt("week")[4],
            that.language_txt("week")[5],
            that.language_txt("week")[6]][t.getDay()]; // 周

        format = format.replaceAll("Y", year);
        format = format.replaceAll("m", month);
        format = format.replaceAll("d", day);
        format = format.replaceAll("H", hour);
        format = format.replaceAll("i", minutes);
        format = format.replaceAll("s", seconds);
        format = format.replaceAll("W", week);

        return format;
    },
    date_format: function (date, format){ // (只YmdHis格式, 新YmdHis格式)
        date = date+""; // 必须string
        let year = date.slice(0,4);
        let month = date.slice(4,6);
        let day = date.slice(6,8);
        let hour = date.slice(8,10);
        let minutes = date.slice(10,12);
        let seconds = date.slice(12,14);

        format = format.replaceAll("Y", year);
        format = format.replaceAll("m", month);
        format = format.replaceAll("d", day);
        format = format.replaceAll("H", hour);
        format = format.replaceAll("i", minutes);
        format = format.replaceAll("s", seconds);

        return format;
    },
    input_confirm: function (title, old_value, call_func, value_must, clear, type, watch_input_func) { // 文字input输入框弹窗，会遮挡页面操作。(文字，超时时间，清除所有提示<仅限不为long时>)，old_value为input的初始值。
        let that = this;

        if (!type){
            type = "text";
        }

        // 只显示一个
        if (clear === "clear"){
            $(".div-input_confirm").remove();
        }

        // input_txt层级形态显示
        let input_confirm_index = that.get_cache("input_confirm_index")*1;
        if (!input_confirm_index){
            input_confirm_index = 20240104;
        }else {
            input_confirm_index = input_confirm_index + 10;
        }
        that.set_cache("input_confirm_index", input_confirm_index);

        //that.log(["input_txt", txt, timeout, clear, input_txt_index]);
        let class_name = "input_confirm_" + input_confirm_index;
        let class_yes = "input_txt-btn-yes_" + input_confirm_index;
        let class_no = "input_txt-btn-no_" + input_confirm_index;

        let div = '<div class="'+class_name+' div-input_confirm confirm-div select-none" style="z-index:'+input_confirm_index+';">' +
            '   <div class="div-input_txt-title font-text" style="--wails-draggable:drag">'+title+'</div>' +
            '   <div class="div-input_txt-msg font-text"><input class="input_txt-input input_theme font-text" value="'+old_value+'" placeholder="" maxlength="200" autofocus type="'+type+'" /></div>' +
            '   <div class="div-input_txt-btn"><span class="'+class_no+' div-input_txt-btn-no click float-left font-black font-text">Cancel</span><span class="'+class_yes+' div-input_txt-btn-yes click float-right font-white font-text bg-blue">OK</span><div class="clear"></div></div>' +
            '   <div class="clear"></div>' +
            '</div>';
        $("#depend").append(div);
        $(".input_txt-input").focus();
        that.show_bg("long");
        // 确认
        $(document).on("click", "."+class_yes, function (){
            let new_value = $("."+class_name).find(".input_txt-input").val().trim();
            if (value_must === "true" || value_must === true){
                if (!new_value){
                    that.log("input=", new_value)
                    that.notice_txt(view.language_txt("input_not_null"), 3000);
                    return
                }
            }
            call_func(true, class_name, new_value);
            $("."+class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 200);
        });
        // 取消
        $(document).on("click", "."+class_no, function (){
            call_func(false, class_name, old_value);
            $("." + class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 200);
        });
        // 监听输入时的实时操作
        try {
            $(document).on("input", "."+class_name, function (){
                let new_value = $("."+class_name).find(".input_txt-input").val().trim();
                try {
                    watch_input_func(class_name, new_value);
                }catch (e){}
            });
        }catch (e){}

    },
    alert_confirm: function (title, msg, call_func, clear) { // 文字提醒弹窗，会遮挡页面操作。(文字，超时时间，清除所有提示<仅限不为long时>)
        let that = this;

        // 只显示一个
        if (clear === "clear"){
            $(".div-alert_confirm").remove();
        }

        // alert_txt层级形态显示
        let alert_confirm_index = that.get_cache("alert_confirm_index")*1;
        if (!alert_confirm_index){
            alert_confirm_index = 20230330;
        }else {
            alert_confirm_index = alert_confirm_index + 10;
        }
        that.set_cache("alert_confirm_index", alert_confirm_index);

        //that.log(["alert_txt", txt, timeout, clear, alert_txt_index]);
        let class_name = "alert_confirm_" + alert_confirm_index;
        let class_yes = "alert_txt-btn-yes_" + alert_confirm_index;
        let class_no = "alert_txt-btn-no_" + alert_confirm_index;

        let div = '<div class="'+class_name+' div-alert_confirm confirm-div select-none" style="z-index:'+alert_confirm_index+';">' +
            '   <div class="div-alert_txt-title font-text" style="--wails-draggable:drag">'+title+'</div>' +
            '   <div class="div-alert_txt-msg font-text break">'+ msg +'</div>' +
            '   <div class="div-alert_txt-btn"><span class="'+class_no+' div-alert_txt-btn-no click float-left font-black font-text">No</span><span class="'+class_yes+' div-alert_txt-btn-yes click float-right font-white font-text bg-blue">Yes</span><div class="clear"></div></div>' +
            '   <div class="clear"></div>' +
            '</div>';
        $("#depend").append(div);
        that.show_bg("long");
        // 确认
        $(document).on("click", "."+class_yes, function (){
            call_func(true, class_name);
            $("."+class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 200);
        });
        // 取消
        $(document).on("click", "."+class_no, function (){
            call_func(false, class_name);
            $("." + class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 100);
        });

    },
    alert_txt: function (txt, timeout, clear) { // 文字提醒弹窗，会遮挡页面操作。(文字，超时时间，清除所有提示<仅限不为long时>)
        let that = this;

        // alert_txt层级形态显示
        let alert_txt_index = that.get_cache("alert_txt_index")*1;
        if (!alert_txt_index){
            alert_txt_index = 20230300;
        }else {
            alert_txt_index = alert_txt_index + 10;
        }
        that.set_cache("alert_txt_index", alert_txt_index);

        //that.log(["alert_txt", txt, timeout, clear, alert_txt_index]);
        let class_name = "alert_txt_" + alert_txt_index;

        let div = '<div class="'+class_name+' div-alert_txt select-none">' +
            '   <div class="div-alert_txt-box" style="z-index:'+ (alert_txt_index + 800000) +';"><div class="div-alert_txt-text break">'+ txt +'</div></div>' +
            '   <div class="div-alert_txt-bg" style="z-index:'+ (alert_txt_index + 700000)  +';"></div>' +
            '   <div class="clear"></div>' +
            '</div>';
        $("#depend").append(div);

        if (!timeout || timeout < 200 || timeout > 60*60*1000){ // 默认
            timeout = 3000;
            setTimeout(function () {
                $("." + class_name).remove();
            }, timeout);
        }else if (timeout === "long"){ // 一直显示
            //that.log("使用long参数值，则会一直显示");
        }else{
            setTimeout(function () {
                $("." + class_name).remove();
                if (clear === "clear" || clear === "remove"){ // 清除所有提示框
                    //that.log("清除所有提示框，clear=" + clear);
                    $(".div-alert_txt").remove();
                }
            }, timeout);
        }
    },
    notice_txt: function (txt, timeout, bg_color) { // 临时重要通知专用，不会遮挡页面操作
        let that = this;
        if (!bg_color){bg_color="notice-black";}

        // 制作容器盒子
        if (!$(".notice_txt-box").length){
            $("#depend").append('<div class="notice_txt-box"></div>');
        }

        // notice_txt层级形态显示
        let notice_txt_index = that.get_cache("notice_txt_index")*1;
        if (!notice_txt_index){
            notice_txt_index = 7000000;
        }else {
            notice_txt_index = notice_txt_index*1 + 100;
        }
        that.set_cache("notice_txt_index", notice_txt_index);

        let class_name = "notice_txt_" + notice_txt_index;

        // 渲染
        let div = '<div><div class="notice_txt-li '+class_name + ' ' + bg_color +' " style="display: none;"><div class="notice_txt-text">'+txt+'</div><div class="notice_txt-close click" onclick="$(this).parent().slideUp(400);let li_out=setTimeout(function(){$(this).parent().remove();clearTimeout(li_out)}, 400);">x</div></div></div>';
        $(".notice_txt-box").prepend(div);
        $("." + class_name).slideDown(400);

        // 清除
        if (!timeout || timeout < 200){ // 默认
            timeout = 3000;
        }else if (timeout > 8*60*60*1000){
            timeout = 8*60*60*1000;
        }

        let len = $("." + class_name).length;
        //that.log([len, class_name]);

        if (len === 0){
            that.alert_txt("参数缺失，提醒失败", 1500);
        }else {
            let the_out = setTimeout(function () {
                $("." + class_name).slideUp(400);
                let a_out = setTimeout(function () {
                    //that.log(['out==', class_name, the_out, a_out]);
                    $("." + class_name).remove();
                    clearTimeout(the_out);
                    clearTimeout(a_out);
                }, 500);
            }, timeout);
        }

    },
    check_phone: function (phone) {
        let that = this;
        let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/; //验证规则
        let res = reg.test(phone); // true、false
        if(res){
            view.log("不是手机号：" + phone);
            return false;
        }else {
            view.log("是手机号：" + phone);
            return true;
        }
    },
    show_loading: function (timeout){ // ms后自动消失
        if (timeout === "long"){ // 一直显示
            $(".loading-div").removeClass("hide");
        }else{
            let _timeout = timeout*1;
            if (_timeout<=0 || _timeout > 6000*1000){_timeout=0;}
            $(".loading-div").removeClass("hide");
            setTimeout(function (){
                $(".loading-div").addClass("hide");
            }, _timeout);
        }
    },
    hide_loading: function (){
        $(".loading-div").addClass("hide");
    },
    play_mp3: function (dom_id, params, call_func, mp3_onload, mp3_info){ // 播放音频，支持.mp3、.flac、.m4a
        let that = this;
        // let params = {
        //     src: "xxx.mp3", // 何时取决于浏览器所支持的
        //     display: "none",
        //     volume: 1,
        //     loop: false,
        //     autoplay: true,
        // }
        let dom = document.getElementById(dom_id);
        let audio = document.getElementById("audio-play_mp3-"+dom_id);
        if (!audio){
            audio = document.createElement("audio");
            audio.setAttribute("id", "audio-play_mp3-"+dom_id);
        }
        //
        audio.setAttribute("src", params.src);
        audio.style.display = params.display; // none，block
        audio.volume = params.volume; // (0, 1]
        audio.loop = params.loop; // false
        audio.autoplay = params.autoplay; // true
        dom.appendChild(audio);
        audio.addEventListener("loadeddata", function (){ // onload
            clearInterval(mp3_info_timer);
            try{ // 加载完成
                mp3_onload(audio);
            }catch (e) {}
            try { // mp3的参数
                mp3_info_timer = setInterval(function (){
                    mp3_info(audio);
                }, 200);
            }catch (e){}
        });
        audio.addEventListener("ended", function () { // 播放结束
            clearInterval(mp3_info_timer);
            try{
                call_func(dom, 1);
            }catch (e) {}
        }, false);
        audio.onerror = function (){ // error
            clearInterval(mp3_info_timer);
            try{
                call_func(dom, 0);
            }catch (e) {that.error(e);}
        };
    },
    start_mp3: function(dom_id){ // 播放音乐
        let audio = document.getElementById("audio-play_mp3-"+dom_id);
        clearInterval(mp3_info_timer);
        if (audio){
            audio.play();
        }
    },
    stop_mp3: function(dom_id){ // 暂停音乐
        let audio = document.getElementById("audio-play_mp3-"+dom_id);
        clearInterval(mp3_info_timer);
        if (audio){
            audio.pause();
        }
    },
    del_mp3: function (dom_id){ // 删除音乐，或初始化音乐
        let dom = document.getElementById(dom_id);
        let audio = document.getElementById("audio-play_mp3-"+dom_id);
        clearInterval(mp3_info_timer);
        if (audio){
            dom.html("");
        }
    },
    play_mp4: function (dom_id, params, call_func){ // 播放视频
        let that = this;
        // let params = {
        //     src: "xxx.mp4", // 何时取决于浏览器所支持的
        //     autoplay: true,
        //     loop: false,
        //     width: "100%",
        //     height: "auto",
        //     filter:  "blur(0px)",
        //     preload: true,
        //     muted: true,
        //     rate: 1,
        // }
        let dom = document.getElementById(dom_id);
        // dom.innerHTML = ""; // 每次都初始化dom
        // video
        let video = document.createElement("video");
        video.setAttribute("id", "video-play_mp4-"+dom_id);
        video.setAttribute("src", params.src);
        video.classList.add("video-play_mp4-"+dom_id);
        video.autoplay = params.autoplay;
        video.loop = params.loop;
        video.style.width = params.width; // "100%"
        video.style.height = params.height; // "auto"
        video.style.filter = params.filter; // "blur(0px)"
        video.preload = params.preload;
        video.muted = params.muted; // false 打开视频声音，true 静音
        video.playbackRate = params.rate; // 播放速度 (0, 1]
        dom.appendChild(video);
        video.onerror = function (){
            try{
                call_func(dom, false);
            }catch (e) {that.error(e);}
        };
        video.addEventListener('ended', function () { // 播放结束
            try{
                call_func(dom, true);
            }catch (e) {}
        }, false);
    },
    start_mp4: function(dom_id){ // 播放视频
        let video = document.getElementById("video-play_mp4-"+dom_id);
        if (video){
            video.play();
        }
    },
    stop_mp4: function(dom_id){ // 暂停视频
        let video = document.getElementById("video-play_mp4-"+dom_id);
        if (video){
            video.pause();
        }
    },
    del_mp4: function (dom_id){ // 删除视频，或初始化视频
        let video = document.getElementById("video-play_mp4-"+dom_id);
        if (video){
            video.remove();
        }
    },
    voice: function (read_txt, volume, loop) { // 自动语音朗读文字
        let that = this;
        that.log(["voice", read_txt, volume, loop]);

        that.notice_txt("语音接口已失效", 3000);
    },
    string_include_string: function (big_string, small_string) { // 判断大字符串是否包含小字符串
        let that = this;
        //that.log([big_string, small_string]); // -1表示不包含
        let index = big_string.indexOf(small_string);
        if ( index !== -1){ // 包含该字符串 >=0
            return index;
        }else {
            return -1;
        }
    },
    refresh_page: function (timeout){ // ms
        let second = 0;
        let _second = timeout*1;
        if (_second){
            second = _second;
        }
        setTimeout(function () {
            window.location.reload();
        }, second);
    },
    back_page: function (second_waiting, delta){
        let second = 0;
        let _second = second_waiting*1;
        if (_second){
            second = _second;
        }
        if (!delta){delta=-1;}
        setTimeout(function () {
            window.history.go(delta);
        }, second);
    },
    is_webdriver: function (){ // 是否是模拟浏览器运行时环境
        return navigator.webdriver;
    },
    is_url: function (url){ // 检查是否是完整网址
        let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)+([A-Za-z0-9-~\/])/;
        return reg.test(url);
    },
    make_qr: function (id, txt){ // 生成二维码
        let qrcode = new QRCode(id, {
            text: txt,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.L
        });
    },
    auto_textarea: function (elem, extra, maxHeight){ // 自动设置textarea高度：// var ele = document.getElementById("textarea");auto_textarea(ele);
        let that = this;

        extra = extra || 0;
        try {
            var isFirefox = !!document.getBoxObjectFor || 'mozInnerScreenX' in window,
                isOpera = !!window.opera && !!window.opera.toString().indexOf('Opera'),
                addEvent = function (type, callback) {
                    elem.addEventListener ?
                        elem.addEventListener(type, callback, false) :
                        elem.attachEvent('on' + type, callback);
                },
                getStyle = elem.currentStyle ? function (name) {
                    var val = elem.currentStyle[name];

                    if (name === 'height' && val.search(/px/i) !== 1) {
                        var rect = elem.getBoundingClientRect();
                        return rect.bottom - rect.top -
                            parseFloat(getStyle('paddingTop')) -
                            parseFloat(getStyle('paddingBottom')) + 'px';
                    };

                    return val;
                } : function (name) {
                    return getComputedStyle(elem, null)[name];
                },
                minHeight = parseFloat(getStyle('height'));

            elem.style.resize = 'none';

            var change = function () {
                var scrollTop, height,
                    padding = 0,
                    style = elem.style;

                if (elem._length === elem.value.length) return;
                elem._length = elem.value.length;

                if (!isFirefox && !isOpera) {
                    padding = parseInt(getStyle('paddingTop')) + parseInt(getStyle('paddingBottom'));
                };
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                elem.style.height = minHeight + 'px';
                if (elem.scrollHeight > minHeight) {
                    if (maxHeight && elem.scrollHeight > maxHeight) {
                        height = maxHeight - padding;
                        style.overflowY = 'auto';
                    } else {
                        height = elem.scrollHeight - padding;
                        style.overflowY = 'hidden';
                    };
                    style.height = height + extra + 'px';
                    scrollTop += parseInt(style.height) - elem.currHeight;
                    document.body.scrollTop = scrollTop;
                    document.documentElement.scrollTop = scrollTop;
                    elem.currHeight = parseInt(style.height);
                };
            };

            addEvent('propertychange', change);
            addEvent('input', change);
            addEvent('focus', change);
            change();
        }catch (e){console.error("调用view.auto_textarea(ele)的document.getElementById('id')不正确");}
    },
    is_weixin: function (){
        let ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/MicroMessenger/i) == 'micromessenger';
    },
    is_qq: function (){
        let ua = window.navigator.userAgent.toLowerCase();
        return ua.match(/QQ/i) == 'qq';
    },
    is_dingding: function (){
        let ua = window.navigator.userAgent.toLowerCase();
        return ua.indexOf("dingtalk")!=-1;
    },
    is_white_ua: function (ua){ // 检测ua是否在正常范围
        let white_ua = [
            "safari/604.1",
        ];
        let has_ua = false;
        for (let r=0; r<white_ua.length; r++){
            if (ua.indexOf(white_ua[r]) !== -1){ // 含有
                has_ua = true;
                break;
            }
        }
        return has_ua;
    },
    is_user_screen: function (inner_w, inner_h, screen_w, screen_h){
        let that = this;
        if (!inner_w){inner_w = window.innerWidth;}
        if (!inner_h){inner_h = window.innerHeight;}
        if (!screen_w){screen_w = window.screen.width;}
        if (!screen_h){screen_h = window.screen.height;}
        let screen_h_foot = screen_h - inner_h;
        that.log([screen_w, screen_h, inner_w, inner_h, screen_h_foot]);
        if (screen_h < 200 || screen_w < 200 || inner_h < 200 || inner_w < 200){
            return false;
        }else{
            return Math.abs(screen_h_foot) > 10;
        }
    },
    xss_iframe: function (div_id, url, call_func, call_data1, call_data2){ // 加载内嵌落地页。示例：<div id="iframe-div-1"></div>
        let that = this;
        // 页面需要放置锚点：<div class="iframe-div"></div>
        let iframe = document.createElement("iframe");
        let iframe_div = document.getElementById(div_id);
        let href = location.href; href = encodeURIComponent(href);
        let refer = document.referrer; refer = encodeURIComponent(refer);
        iframe_div.innerHTML = "";
        iframe.setAttribute("width", "100%");
        // iframe.setAttribute("width", window.innerWidth);
        let height = window.innerHeight;
        if (height<300){height=300;}
        iframe.setAttribute("height", height + "px");
        iframe.setAttribute("scrolling", "yes");
        iframe.setAttribute("frameborder", "0");
        iframe.classList.add("iframe-content");
        iframe.classList.add("iframe-content-xss");
        iframe.setAttribute("id", "iframe_"+div_id);
        iframe.setAttribute("data-src", url);
        iframe.setAttribute("data-href", href);
        iframe.setAttribute("data-refer", refer);
        iframe.setAttribute("src", "javascript:(function(){var fs=parent.document.getElementsByTagName('iframe');var src=fs[0].getAttribute('data-src');if(!navigator.webdriver){fs[0].src=src;fs[0].setAttribute('data-src', 'true');}})()");
        iframe_div.appendChild(iframe);
        iframe.onload = function (){
            that.log("iframe落地页加载完毕！url=" + url);
            // 此处可以放置统计代码或其他
            try {call_func(call_data1, call_data2);}catch (e){}
        };
    },
    del_xss_iframe: function(div_id){ // 删除内嵌落地页
        let that = this;
        that.log("删除内嵌落地页！div_id=" + div_id);
        try{document.getElementById(div_id).innerHTML = "";}catch (e){}
    },
    make_app_uid: function (app_class){
        let that = this;
        let rand = that.js_rand(10000000000, 999999999999);
        let ua = window.navigator.userAgent.toLowerCase();
        let app_date = that.time_date("YmdHisW");
        let href = window.location.href.toLowerCase();
        return [that.md5(app_class+"@"+ua+"@"+app_date+"@"+href+"@"+window.innerWidth+"@"+rand), app_date];
    },
    open_full_screen: function (div_id, call_func, call_data1, call_data2){ // 打开全屏（仅支持手动触发），div_id为需要全屏显示的dom区块的id
        let that = this;
        let el = document.getElementById(div_id);
        let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
        that.log(["打开全屏", div_id, rfs]);
        // let demo = '<div class="demo"><button id="open_full-btn">打开全屏</button><div id="full_div" style="background:yellow;width:200px;height:300px;"><button id="close_full-btn">关闭全屏</button></div></div><script>;document.getElementById("open_full-btn").onclick = function(){open_full_screen("full_div");};document.getElementById("close_full-btn").onclick = function(){exit_full_screen();};</script> 文档：https://www.jb51.net/article/76695.htm'; // 示例代码
        // view.log(demo);
        if(typeof rfs != "undefined" && rfs) {
            rfs.call(el);
            return false;
        }else {
            if(typeof window.ActiveXObject != "undefined") {
                let wscript = new ActiveXObject("WScript.Shell");
                if(wscript) {
                    wscript.SendKeys("{F11}");
                    try {call_func(call_data1, call_data2);}catch (e){}
                    return true;
                }else {
                    return false;
                }
            }
        }
    },
    exit_full_screen: function (call_func, call_data1, call_data2){ // 手动点击DOM按钮调用此函数退出全屏
        let that = this;
        let el= document;
        let cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen;
        that.log(["退出全屏", cfs]);
        if (typeof cfs != "undefined" && cfs) {
            cfs.call(el);
            return false;
        }else {
            if (typeof window.ActiveXObject != "undefined") {
                let wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                    try {call_func(call_data1, call_data2);}catch (e){}
                    return true;
                }else {
                    return false;
                }
            }
        }
    },
    close_full_screen: function (call_func, call_data1, call_data2){ // 手动按快捷键（ESC或F11）退出全屏
        let that = this;
        function is_full_screen() {
            let is_full = document.fullscreenEnabled || window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
            if (is_full === undefined) {is_full = false;}
            return is_full;
        }
        window.onresize = function (){
            if (!is_full_screen){ // 已退出全屏
                try {call_func(call_data1, call_data2);}catch (e){}
            }
        };
    },
    scheme_model: function (){ // 获取浏览器当前处于light还是dark
        let light = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (light){
            return "light";
        }else {
            return "dark";
        }
    },
    show_mask: function (timeout){
        let that = this;
        // 初始化
        try {
            document.getElementById("mask-div").remove();
        }catch (e) {}

        //
        if (timeout<100){timeout=100;}
        let div =  document.createElement("div");
        div.setAttribute("id", "mask-div");
        div.setAttribute("style", "--wails-draggable:drag;");
        div.classList.add("mask-div");
        div.classList.add("select-none");
        div.style.position = "fixed";
        div.style.zIndex = "20230315";
        div.style.left = "0px";
        div.style.top = "0px";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.filter = "blur(4px)";
        div.style.backgroundColor = "rgba(30,30,30, 0.9)";
        document.getElementById("depend").appendChild(div);
        if (timeout === "long"){
            that.log("显示切不可关闭");
        }else{
            setTimeout(function (){
                div.remove();
            }, timeout);
        }
    },
    del_mask: function (){
        $("#mask-div").remove();
    },
    show_bg: function (timeout){
        let that = this;
        // 初始化
        try {
            document.getElementById("bg-div").remove();
        }catch (e) {}

        //
        if (timeout<100){timeout=100;}
        let div =  document.createElement("div");
        div.setAttribute("id", "bg-div");
        div.setAttribute("style", "--wails-draggable:drag;");
        div.classList.add("bg-div");
        div.classList.add("select-none");
        div.style.position = "fixed";
        div.style.zIndex = "20230320";
        div.style.left = "0px";
        div.style.top = "0px";
        div.style.width = "100%";
        div.style.height = "100%";
        div.style.filter = "blur(4px)";
        div.style.backgroundColor = "rgba(30,30,30, 0.9)";
        document.getElementById("depend").appendChild(div);
        if (timeout === "long"){
            that.log("显示切不可关闭");
        }else{
            setTimeout(function (){
                div.remove();
            }, timeout);
        }
    },
    del_bg: function (){
        $("#bg-div").remove();
    },
    load_img: function(img_class, cdn_url){ // 保护性加载图片 // <img class="xxx" src="" data-src="xxx" >
        try {
            let img = document.getElementsByClassName(img_class);
            for (let i=0; i<img.length; i++){
                setTimeout(function (){
                    let src = img[i].getAttribute("data-src");
                    img[i].setAttribute("src", cdn_url+src);
                }, 100+i*200);
            }
        }catch (e){
            view.error("load_img报错："+e);
        }
    },
    set_txt_logo: function (_class, txt1, txt2){
        let that = this;
        let txt_logo = '<div class="txt-logo-div phb-div select-none hover a-click" data-href="./" data-target="_self"><div class="phb-1">'+txt1+'</div><div class="phb-2">'+txt2+'</div><div class="clear"></div></div>';
        $("."+_class).html(txt_logo);
    },
    set_html_lang: function (lang){
        let that = this;
        if (!lang){lang = navigator.language;}
        $("html").attr("lang", lang);
    },
    pure_page_extensions: function (){ // 清除加入页面的扩展程序（如：运营商广告、浏览器插件）。建议只在页面启动后运行一次，不建议多次运行。
        let that = this;
        // 节点
        let div = $("#pure-browser-div").nextAll();
        let body = $("body").nextAll();
        let head = $("head").prevAll();
        // 非法节点数量
        let num = div.length + body.length + head.length;
        // 清除节点
        div.remove();
        body.remove();
        head.remove();

        return num;
    },
    filter_xss: function (html){
        let that = this;
        const list = [
            {
                "black": "<script",
                "white": "< scrip_t"
            },
            {
                "black": "</script>",
                "white": "< / scrip_t>"
            },
            {
                "black": "<SCRIPT",
                "white": "< SCRIP_T"
            },
            {
                "black": "</SCRIPT>",
                "white": "< / SCRIP_T>"
            },
            {
                "black": "javascript",
                "white": "javascrip_t"
            },
            {
                "black": "JAVASCRIPT",
                "white": "JAVASCRIP_T"
            },
            {
                "black": "localstorage",
                "white": "localstorag_e"
            },
            {
                "black": "onload",
                "white": "onloa_d"
            },
            {
                "black": "onclick",
                "white": "onclic_k"
            },
            {
                "black": "onerror",
                "white": "onerro_r"
            },
            {
                "black": "function",
                "white": "functio_n"
            },
            {
                "black": "FUNCTION",
                "white": "FUNCTIO_N"
            },
            // {
            //     "black": "request",
            //     "white": "reques_t"
            // },
            // {
            //     "black": "window",
            //     "white": "windo_w"
            // },
            // {
            //     "black": "WINDOW",
            //     "white": "WINDO_W"
            // },
            {
                "black": "target",
                "white": "targe_t"
            },
            {
                "black": "console",
                "white": "consol_e"
            },
            {
                "black": "alert",
                "white": "aler_t"
            },
            {
                "black": "object",
                "white": "objec_t"
            },
            {
                "black": "document",
                "white": "documen_t"
            },
            // {
            //     "black": "replace",
            //     "white": "replac_e"
            // },
            {
                "black": "eval",
                "white": "eva_l"
            },
            {
                "black": "EVAL",
                "white": "EVA_L"
            },
            {
                "black": "exec",
                "white": "exe_c"
            },
            // {
            //     "black": "src",
            //     "white": "sr_c"
            // },
            // {
            //     "black": "SRC",
            //     "white": "SR_C"
            // },
            // {
            //     "black": "href",
            //     "white": "hre_f"
            // },
            // {
            //     "black": "HREF",
            //     "white": "HRE_F"
            // },
            {
                "black": "test",
                "white": "Test"
            },
            {
                "black": "navigator",
                "white": "navigatoR"
            },
            {
                "black": "display",
                "white": "displaY"
            },
            {
                "black": "opacity",
                "white": "opacitY"
            },
            {
                "black": "position",
                "white": "positioN"
            },
            {
                "black": "iframe",
                "white": "iframE"
            },
            {
                "black": "location",
                "white": "locatioN"
            },
            {
                "black": "class=",
                "white": "Class="
            },
            {
                "black": "id=",
                "white": "Id="
            },
            {
                "black": "data-",
                "white": "dat_a-"
            },
            {
                "black": "v-",
                "white": "_v-"
            },
            {
                "black": "title=",
                "white": "titl_e="
            },
            {
                "black": "overflow",
                "white": "overfloW"
            },
            {
                "black": "className",
                "white": "CLassname"
            },
            {
                "black": ".js",
                "white": "-Js"
            },
            {
                "black": ".json",
                "white": "-json"
            },
            {
                "black": "this.",
                "white": "this-"
            },
            {
                "black": "that.",
                "white": "that-"
            },
        ];
        // html = html.toLowerCase();
        list.forEach((ele, index)=>{
           html = html.replaceAll(ele.black, ele.white);
        })
        return html;
    },
    text_encode: function (text){
        let that = this;
        return that.string_to_unicode(text);
    },
    text_decode: function (text){
        let that = this;
        return that.unicode_to_string(text);
    },
    ping_url: function (url, call_func){ // 检查 网址、文件地址 是否可访问
        $.ajax({
            type: "GET",
            cache: false,
            url: url,
            data: "",
            success: function (back) {
                call_func(1, back);
            },
            error: function (xhr) {
                call_func(0, xhr);
            }
        });
    },
    is_wails: function (){
        let that = this;
        let url = window.location.host;
        // return (url.toLowerCase().indexOf("wails") !== -1);
        return url === "wails.localhost" || url === "wails";
    },
    window_open: function (url, target){ // 打开链接
        let that = this;
        if (target === "_blank"){
            if (that.is_wails()){
                if (that.is_url(url)){
                    let key = app_class + "switch_radio_choose_browser";
                    let value = view.get_data(key);
                    if (!value){
                        try {
                            window.runtime.BrowserOpenURL(url); // 注意，启动此函数需要完整的网址（如http、https开头的）
                        }catch (e){
                            that.notice_txt(view.language_txt("view_window_open_func_error")+"：BrowserOpenURL", 3000);
                        }
                    }else{
                        let key = app_class + "switch_radio_choose_browser";
                        let value = view.get_data(key);
                        js_call_go.WebServerPort().then(port=>{
                            js_call_go.OpenURL(
                                "http://127.0.0.1:"+port+"/jump_url?uri=" + encodeURIComponent(url), // 某些操作系统对 & 符号识别不了，所以用辅助跳转的方式跳转目标URL
                                value
                            ).then(err=>{
                                if (err){ // 报错
                                    that.notice_txt(view.language_txt("view_window_open_error"), 3000);
                                }else{}
                            });
                        });
                    }
                }else{
                    that.notice_txt(view.language_txt("view_window_open_url_error"));
                }
            }else{
                window.open(url, target);
            }
        }else{
            window.open(url, target);
        }
    },
    window_close: function (){ // 关闭标签或App
        let that = this;
        if (that.is_wails()){
            try {
                window.runtime.Quit();
            }catch (e){
                that.notice_txt("不被支持的语法", 3000);
            }
        }else{
            window.location.replace("about:blank");
            window.close();
        }
    },
    window_show: function (){
        let that = this;
        if (that.is_wails()){
            try {
                window.runtime.WindowShow();
            }catch (e){
                that.notice_txt("不被支持的语法", 3000);
            }
        }else{
            that.notice_txt("Web中不支持此JS语法", 3000);
        }
    },
    window_hide: function (){
        let that = this;
        if (that.is_wails()){
            try {
                window.runtime.WindowHide();
            }catch (e){
                that.notice_txt("不被支持的语法", 3000);
            }
        }else{
            that.notice_txt("Web中不支持此JS语法", 3000);
        }
    },
    window_unfullscreen: function (){
        let that = this;
        if (that.is_wails()){
            try {
                window.runtime.WindowUnfullscreen();
            }catch (e){
                that.notice_txt("不被支持的语法", 3000);
            }
        }else{
            that.notice_txt("Web中不支持此JS语法", 3000);
        }
    },
    window_fullscreen: function (){
        let that = this;
        if (that.is_wails()){
            try {
                window.runtime.WindowFullscreen();
            }catch (e){
                that.notice_txt("不被支持的语法", 3000);
            }
        }else{
            that.notice_txt("Web中不支持此JS语法", 3000);
        }
    },
    push_web_notice: function (title, content, icon, call_func){  // 实时发送web通知（使用https），state === 1为查看消息详情
        let that = this;
        // 校验数据
        title = title?title:"（未设置标题）"
        content = content?content:"点击查看"
        icon = icon?icon:cdn_page_file+"static/img/launcher.png"
        // 校验消息权限
        function ask_web_notice(_title, _content, _icon, _call_func){
            // 判断浏览器是否支持Notification
            if (window.Notification) {
                that.log('支持消息通知：', Notification.permission);
                switch (Notification.permission) {
                    case 'default':
                        that.log('用户暂未开启该网站消息通知');
                        // 请求用户授权通知
                        try {
                            Notification.requestPermission().then(permission => {
                                switch (permission) {
                                    case 'default':
                                        that.log('用户关闭了授权');
                                        break;
                                    case 'granted':
                                        that.log('用户同意授权');
                                        send_notice(_title, _content, _icon, _call_func);
                                        break;
                                    case 'denied':
                                        that.log('用户还是拒绝了该网站消息通知');
                                        break;
                                }
                            });
                        }catch (e){
                            console.info("消息通知权限校验异常：", e);
                        }
                        break;
                    case 'granted':
                        that.log('用户已开启该网站消息通知');
                        send_notice(_title, _content, _icon, _call_func);
                        break;
                    case 'denied':
                        that.log('用户拒绝该网站消息通知');
                        break;
                }
            } else {
                that.log('暂不支持消息通知');
            }
        }
        // 发送消息
        function send_notice(__title, __content, __icon, __call_func){
            that.log('消息通知：', [__title, __content, __icon, __call_func]);
            let state = 0;
            const options = {
                body: __content,
                dir: 'auto',
                icon: __icon
            };
            const notification = new Notification(__title, options);
            notification.onshow = e => {state = 2; try {call_func(state);}catch (e) {that.log('push_web_notice未设置回调函数');}}
            notification.onclick = e => {
                state = 1;
                try {call_func(state);}catch (e) {that.log('push_web_notice未设置回调函数');}
                setTimeout(function (){
                    notification.close(); // 点击哪条就关闭哪条
                }, 400);
            }
            notification.onclose = e => {state = 0; try {call_func(state);}catch (e) {that.log('push_web_notice未设置回调函数');}}
            notification.onerror = e => {state = 0; try {call_func(state);}catch (e) {that.log('push_web_notice未设置回调函数');}}
        }
        // 调用
        ask_web_notice(title, content, icon, call_func);
    },
    download_file: function (filename, fileURL){ // 下载文件
        let that = this;
        let a = document.createElement('a');
        a.style.display = "none";
        a.setAttribute("download", filename); // 文件名
        a.setAttribute("href", fileURL); // 文件地址
        a.setAttribute("target", "_self");
        document.body.appendChild(a);
        a.click();
        that.notice_txt(view.language_txt("download_file_start")+"："+filename, 2000);
        document.body.removeChild(a);
    },
    allow_drop: function (call_func){ // 元素可以拖拽
        let that = this;
        // dom
        // <div className="drop_list" allowdrop id="drop_list">
        //    <div className="drag_item" draggable="true">item01</div>
        //    <div className="drag_item" draggable="true">item02</div>
        //    <div className="drag_item" draggable="true">item03</div>
        // </div>
        // css
        // /*拖拽*/
        // [draggable=true][dragging] {
        //     box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
        // }
        // [allowdrop][over]{
        //     border-color: wheat;
        // }
        // .drop_list{
        //     padding: 0 0;
        //     margin: 0 0;
        //     width: 100%;
        //     min-height: 20px;
        // }
        // .drag_item{
        //     min-height: 20px;
        //     margin-bottom: 10px;
        // }
        let currentDragItem = null;
        let offsetY = 0;
        document.querySelectorAll('#drop_list>.drag_item').forEach(function(el){
            el.addEventListener('dragstart',function(ev){
                ev.dataTransfer.setData('text', '');
                offsetY = ev.offsetY;
                currentDragItem = this;
            },true);
            el.addEventListener('dragend',function(ev){
                currentDragItem = null;
                // console.log("drop完成3", el.innerHTML);
                try {
                    let state = true;
                    let item_dom = document.getElementsByClassName("drop_item");
                    view.log("拖拽已完成:[state, that_item, item_dom]=", [state, item_dom.length]);
                    call_func(state);
                }catch (e) {
                    console.error("拖拽已完成，但无回调函数", e);
                    view.notice_txt("Callback Function Error", 2000)
                }
            });
            el.addEventListener('dragenter',()=>{
                // console.log("drop完成2", el.innerHTML);
            });
        });
        drop_list.ondragover = function (ev) { // 拖拽效果
            ev.preventDefault();
            if(!currentDragItem){ return }
            let drag_item = ev.target.closest('.drag_item');
            if(drag_item){
                if(ev.offsetY>offsetY){
                    drag_item.after(currentDragItem);
                }else{
                    drag_item.before(currentDragItem);
                }
            }
        }
    },
    check_lock_pwd: function (input_value){ // 检测解锁密码
        let key = app_class + "lock_" + "pwd";
        let has_pwd = view.get_data(key);
        if (!has_pwd){ // 无密码则默认正确
            return false;
        }else{
            let input_pwd = view.md5(encodeURIComponent(input_value) + app_class);
            return has_pwd === input_pwd;
        }
    },
     // 纯js网速测试， KB/s，speed_test(图片网址, 循环次数<次数越大越精准，但是图片不一定要大>)
     // speed_test("", 20).then(speed=>{});
     speed_test: function(img_url, loop){
        let that = this;
        // 限制循环次数
        let num = loop*1;
        if (num<3){
            num = 3;
        }else if (num>1000){
            num = 1000;
        }
        function measureSpeed(fn,time) {
            time = time || 1;
            let startTime, endTime, fileSize;
            let count = time ;
            function measureSpeedSimple () {
                let xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        if(!fileSize){
                            fileSize = xhr.responseText.length;
                        }
                        count --;
                        if(count<=0){
                            endTime = Date.now();
                            let speed = fileSize * time  / ((endTime - startTime)/1000) / 1024;
                            fn && fn(Math.floor(speed));
                        }
                    }
                }
                xhr.open("GET", img_url + "#cache=" + Math.random(), true);
                xhr.send();
            }
            startTime = Date.now();
            for(let x=time; x>0; x--){
                measureSpeedSimple()
            }
        }
        return new Promise(function (resolve, reject) {
            measureSpeed((speed)=>{
                resolve(speed);
            }, num);
        });
    },
    check_update: function (log_api){ // 检测软件更新： 0 不更新，1提示更新，2强制更新
        let ld_state = 0;
        let dl_page = "";
        return new Promise(function (resolve, reject) {
            resolve(ld_state, dl_page);
            return;
            /*开始-请求数据*/
            $.ajax({
                url: log_api + "check_update/new_version.json",
                type: "POST",
                dataType: "json",
                async: true,
                data: { // 字典数据
                    app_class: app_class,
                    app_version: app_version,
                    app_name: app_name,
                    login_id: view.base64_encode(view.string_to_unicode(login_id)),
                },
                success: function(back, status){
                    // 数据转换为json
                    let data = "";
                    let text = "";
                    if(typeof back === "string"){
                        data = JSON.parse(back);
                        text = back;
                    } else {
                        data = back;
                        text = JSON.stringify(back);
                    }
                    // 校验数据规格
                    if (typeof data.state !== "undefined" && typeof data.msg !== "undefined"){
                        ld_state = data.state;
                        dl_page = data.content.dl_page;
                        resolve(ld_state, dl_page);
                    }else {
                        let info = "类型：" + typeof back + "\n数据：" + text +"\n状态：" + status + "。";
                        view.error("=接口返回未知规格的参数=\n" + info);
                        resolve(ld_state, dl_page);
                    }
                },
                error: function (xhr) {
                    console.error(xhr);
                    resolve(ld_state, dl_page);
                }
            });
            /*结束-请求数据*/
        });
    },
    filter_dir: function (dir){
        // dir = dir.replaceAll(" ", "_");
        // dir = dir.replaceAll("+", "_");
        dir = dir.replaceAll("/", "-");
        dir = dir.replaceAll("&", "-");
        dir = dir.replaceAll("$", "-");
        dir = dir.replaceAll("*", "-");
        dir = dir.replaceAll("!", "-");
        dir = dir.replaceAll("^", "-");
        dir = dir.replaceAll("|", "-");
        dir = dir.replaceAll(":", "-");
        dir = dir.replaceAll("?", "-");
        dir = dir.replaceAll("#", "-");
        dir = dir.replaceAll("<", "-");
        dir = dir.replaceAll(">", "-");
        dir = dir.replaceAll("'", "_");
        dir = dir.replaceAll("`", "_");
        dir = dir.replaceAll(",", "_");
        dir = dir.replaceAll("\\", "_");
        return dir
    },
    trans_file_size: function (size){ // 转换文件大小成可读文字
        if (size < 1024){
            size = size + "Bytes";
        }else{
            if (size/1024 < 1024){
                size = (size/1024).toFixed(2) + "KB";
            }else{
                if (size/1024/1024 < 1024){
                    size = (size/1024/1024).toFixed(2) + "MB";
                }else{
                    if (size/1024/1024/1024 < 1024){
                        size = (size/1024/1024/1024).toFixed(2) + "GB";
                    }else{
                        if (size/1024/1024/1024/1024 < 1024){
                            size = (size/1024/1024/1024/1024).toFixed(2) + "TB";
                        }else{
                            if (size/1024/1024/1024/1024/1024 < 1024){
                                size = (size/1024/1024/1024/1024/1024).toFixed(2) + "PB";
                            }else{
                                size = (size/1024/1024/1024/1024/1024).toFixed(2) + "EB";
                            }
                        }
                    }
                }
            }
        }
        return size
    },
    is_email: function (email) { // 是否是邮箱
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        return  reg.test(email);
    },
    span_show_loading: function (dom_class){
        $("."+dom_class).html('<div class="span-loading"><img class="span-loading-img" src="data:image/gif;base64,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" alt="Loading.."/><div class="clear"></div></div>');
    },
    span_del_loading: function (dom_class){
        $("."+dom_class).html("");
    },
    ip_to_string: function (ip){
        return ip.replaceAll(".", "_");
    },
    notice_img: function (url_array, width, type, msg, clear){ // 弹出通知图片、预览图片等
        let that = this;
        if (!type){type = "img";}
        if (!msg){msg="";}
        that.log("notice_img", [url_array, width, type]);
        // 只显示一个
        if (clear === "clear") {
            $(".div-notice_img").remove();
        }
        // alert_txt层级形态显示
        let notice_img_index = that.get_cache("notice_img_index")*1;
        if (!notice_img_index){
            notice_img_index = 20230330;
        }else {
            notice_img_index =notice_img_index + 10;
        }
        that.set_cache("notice_img_index", notice_img_index);

        //that.log(["alert_txt", txt, timeout, clear, alert_txt_index]);
        let class_name = "notice_img_" + notice_img_index;
        let class_no = "alert_txt-btn-no_" + notice_img_index;

        let div = '<div class="'+class_name+' div-notice_img confirm-div select-none" style="z-index:'+notice_img_index+';">' +
            '   <div class="div-notice_img-img font-text"><span class="span-notice_img-img" id="span-notice_img-img"></span></div>' +
            '   <div class="div-notice_img-msg font-text">'+ msg +'</div>' +
            '   <div class="div-notice_img-btn"><span class="'+class_no+' div-notice_img-btn-no click font-blue font-text">OK</span><div class="clear"></div></div>' +
            '   <div class="clear"></div>' +
            '</div>';
        $("#depend").append(div);
        that.show_bg("long");
        // 取消
        $(document).on("click", "."+class_no, function (){
            $("." + class_name).remove();
            that.del_bg();
        });

        if (type === "img"){
            let img = '<img class="notice_img-img" style="width:'+width+';max-width: 300px;" src="'+url_array[0]+'" />';
            $(".div-notice_img-img").html(img);
        }
        else if (type === "qr"){ // 暂时只能显示一张QR图片
            view.make_qr("span-notice_img-img", url_array[0]);
        }else{
            that.notice_txt("type Error", 2000);
        }
    },
    input2_confirm: function (input_dom, input1_value, input2_value, call_func) { // 双输入框弹窗
        let that = this;

        $(".div-input_confirm").remove();

        let title = input_dom.title;
        let input1_placeholder = input_dom.input1_placeholder;
        let input2_placeholder = input_dom.input2_placeholder;

        // input_txt层级形态显示
        let input_confirm_index = that.get_cache("input_confirm_index")*1;
        if (!input_confirm_index){
            input_confirm_index = 20240100;
        }else {
            input_confirm_index = input_confirm_index + 10;
        }
        that.set_cache("input_confirm_index", input_confirm_index);

        //that.log(["input_txt", txt, timeout, clear, input_txt_index]);
        let class_name = "input_confirm_" + input_confirm_index;
        let class_yes = "input_txt-btn-yes_" + input_confirm_index;
        let class_no = "input_txt-btn-no_" + input_confirm_index;

        let div = '<div class="'+class_name+' div-input_confirm confirm-div select-none" style="z-index:'+input_confirm_index+';">' +
            '   <div class="div-input_txt-title font-text" style="--wails-draggable:drag">'+title+'</div>' +
            '   <div class="div-input_txt-msg font-text"><input class="input_txt-input input_theme font-text " value="'+input1_value+'" placeholder="'+input1_placeholder+'" maxlength="1000" type="text" /></div>' +
            '   <div class="div-input_txt-msg font-text"><input class="input_txt-input2 input_theme font-text font-white" value="'+input2_value+'" placeholder="'+input2_placeholder+'" maxlength="1000" type="text" /></div>' +
            '   <div class="div-input_txt-btn"><span class="'+class_no+' div-input_txt-btn-no click float-left font-black font-text">Cancel</span><span class="'+class_yes+' div-input_txt-btn-yes click float-right font-white font-text bg-blue">OK</span><div class="clear"></div></div>' +
            '   <div class="clear"></div>' +
            '</div>';
        $("#depend").append(div);
        $(".input_txt-input").focus();
        that.show_bg("long");
        // 确认
        $(document).on("click", "."+class_yes, function (){
            let new_input1_value = $("."+class_name).find(".input_txt-input").val().trim();
            let new_input2_value = $("."+class_name).find(".input_txt-input2").val().trim();
            if (!new_input1_value || !new_input2_value){
                that.log("input=", [new_input1_value, new_input2_value])
                that.notice_txt(view.language_txt("input_not_null"), 3000);
                return
            }
            call_func(true, class_name, new_input1_value, new_input2_value);
            $("."+class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 400);
        });
        // 取消
        $(document).on("click", "."+class_no, function (){
            call_func(false, class_name, "", "");
            $("." + class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 400);
        });
    },
    login_confirm: function (title, old_email, old_pwd, call_func) { // 登录输入框弹窗
        let that = this;

        $(".div-input_confirm").remove();

        // input_txt层级形态显示
        let input_confirm_index = that.get_cache("input_confirm_index")*1;
        if (!input_confirm_index){
            input_confirm_index = 20240104;
        }else {
            input_confirm_index = input_confirm_index + 10;
        }
        that.set_cache("input_confirm_index", input_confirm_index);

        //that.log(["input_txt", txt, timeout, clear, input_txt_index]);
        let class_name = "input_confirm_" + input_confirm_index;
        let class_yes = "input_txt-btn-yes_" + input_confirm_index;
        let class_no = "input_txt-btn-no_" + input_confirm_index;

        let div = '<div class="'+class_name+' div-input_confirm confirm-div select-none" style="z-index:'+input_confirm_index+';">' +
            '   <div class="div-input_txt-title font-text" style="--wails-draggable:drag">'+title+'</div>' +
            '   <div class="div-input_txt-msg font-text"><input class="input_txt-input input_theme font-text " value="'+old_email+'" placeholder="'+view.language_txt("login_confirm_input_email")+'" maxlength="100" autofocus type="text" /></div>' +
            '   <div class="div-input_txt-msg font-text"><input class="input_txt-input2 input_theme font-text font-white" value="'+old_pwd+'" placeholder="'+view.language_txt("login_confirm_input_pwd")+'" maxlength="100" autofocus type="text" /></div>' +
            '   <div class="div-input_txt-btn"><span class="'+class_no+' div-input_txt-btn-no click float-left font-black font-text">Cancel</span><span class="'+class_yes+' div-input_txt-btn-yes click float-right font-white font-text bg-blue">OK</span><div class="clear"></div></div>' +
            '   <div class="clear"></div>' +
            '</div>';
        $("#depend").append(div);
        $(".input_txt-input").focus();
        that.show_bg("long");
        // 确认
        $(document).on("click", "."+class_yes, function (){
            let new_email = $("."+class_name).find(".input_txt-input").val().trim();
            let new_pwd = $("."+class_name).find(".input_txt-input2").val().trim();
            if (!new_email || !new_pwd){
                that.log("input=", [new_email, new_pwd])
                that.notice_txt(view.language_txt("input_not_null"), 3000);
                return
            }
            call_func(true, class_name, new_email, new_pwd);
            $("."+class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 400);
        });
        // 取消
        $(document).on("click", "."+class_no, function (){
            call_func(false, class_name, "", "");
            $("." + class_name).remove();
            setTimeout(function (){
                that.del_bg();
            }, 400);
        });
    },
    string_star: function (str, frontLen, endLen) { // //str：要进行隐藏的字符串，frontLen: 前面需要保留几位，endLen: 后面需要保留几位
        let len = str.length - frontLen - endLen;
        let star = "";
        for (let i = 0; i < len; i++) {
            star += "*";
        }
        return (
            str.substring(0, frontLen) + star + str.substring(str.length - endLen)
        );
    },
    // 从 文件地址 获取 目录名 或 文件名。注意win下需要转成mac下的斜杠/
    ext_name: function (pathname){
        let array = pathname.split("/");
        if (array.length){
            return array[array.length-1];
        }else{
            return "";
        }
    },
    is_video: function(filename){ // 是视频
        let ext = filename.substring(filename.lastIndexOf("."));
        ext = ext.toLowerCase();
        let white_ext = [
            ".mp4", ".mkv", ".avi", ".flv", ".mov", ".m4v", ".rmvb", ".rm", ".webm", ".asf", ".wmv",
        ];
        return white_ext.includes(ext);
    },
    is_audio: function(filename){ // 是音频
        let ext = filename.substring(filename.lastIndexOf("."));
        ext = ext.toLowerCase();
        let white_ext = [
            ".mp3", ".wav", ".m3u", ".m4a", ".flac",
        ];
        return white_ext.includes(ext);
    },
    is_img: function(filename){ // 是图片
        let ext = filename.substring(filename.lastIndexOf("."));
        ext = ext.toLowerCase();
        let white_ext = [
            ".gif", ".png", ".jpg", ".jpeg", ".webp", ".ico", ".jpg2", ".tiff", ".tif", ".bmp", ".svg",
        ];
        return white_ext.includes(ext);
    },
    play_video: function (dom_id, params, play_func, ended_func, error_func){ // 文档：plyr.io
        let that = this;
        if (!params){
            params = {
                source: { // 文件信息
                    type: "video", // video、audio
                    title: "Example title",
                    sources: [ // 多清晰度
                        {
                            src: "/movie1080.mp4",
                            type: "video/mp4",
                            size: 1080,
                        },
                    ],
                    poster: "",
                },
                setup: { // 播放器参数
                    volume: 1,
                    autoplay: false, // true时需要浏览器开启自动播放，否则error或需手动播放
                    settings: ['quality', 'speed'],
                    speed: {selected: 1, options: [0.5, 0.75, 1, 1.5, 1.75, 2]},
                    quality: { default: 720, options: [4320, 2160, 1080, 720, 480] },
                },
            };
        }
        // 创建新的video
        $("#play_video").remove();
        const video = document.createElement("video");
        video.setAttribute("id", "play_video");
        video.autoplay = params.setup.autoplay;
        const dom = document.getElementById(dom_id);
        dom.appendChild(video);
        // 播放器
        const player = new Plyr("#play_video", {
            volume: params.setup.volume,
            speed: params.setup.speed,
            quality: params.setup.quality,
            settings: params.setup.settings,
        });
        player.source = params.source;
        player.on("play", function (){
            try {
                play_func();
            }catch (e){}
        });
        player.on("ended", function (){
            try {
                ended_func();
            }catch (e){}
        });
        player.on("error", function (){
            try {
                error_func();
            }catch (e){}
        });
    },
    is_local_ipv4: function (ipv4){
        let that = this;
        // 获取IP数
        function getIpNum(ipAddress) {
            let ip = ipAddress.split(".");
            let a = parseInt(ip[0]);
            let b = parseInt(ip[1]);
            let c = parseInt(ip[2]);
            let d = parseInt(ip[3]);
            return a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d;
        }
        function isInner(userIp,begin,end){
            return (userIp>=begin) && (userIp<=end);
        }
        // 否是内网IPv4
        function isInnerIPFn(ipv4){
            let curPageUrl = ipv4?ipv4:window.location.href;
            let reg1 = /(http|ftp|https|www):\/\//g;//去掉前缀
            curPageUrl =curPageUrl.replace(reg1,'');
            let reg2 = /\:+/g;//替换冒号为一点
            curPageUrl =curPageUrl.replace(reg2,'.');
            curPageUrl = curPageUrl.split('.');//通过一点来划分数组
            let ipAddress = curPageUrl[0]+'.'+curPageUrl[1]+'.'+curPageUrl[2]+'.'+curPageUrl[3];
            let isInnerIp = false;//默认给定IP不是内网IP
            let ipNum = getIpNum(ipAddress);
            /**
             * 私有IP：A类  10.0.0.0    -10.255.255.255
             *       B类  172.16.0.0  -172.31.255.255
             *       C类  192.168.0.0 -192.168.255.255
             *       D类   127.0.0.0   -127.255.255.255(环回地址)
             **/
            let aBegin = getIpNum("10.0.0.0");
            let aEnd = getIpNum("10.255.255.255");
            let bBegin = getIpNum("172.16.0.0");
            let bEnd = getIpNum("172.31.255.255");
            let cBegin = getIpNum("192.168.0.0");
            let cEnd = getIpNum("192.168.255.255");
            let dBegin = getIpNum("127.0.0.0");
            let dEnd = getIpNum("127.255.255.255");
            isInnerIp = isInner(ipNum,aBegin,aEnd) || isInner(ipNum,bBegin,bEnd) || isInner(ipNum,cBegin,cEnd) || isInner(ipNum,dBegin,dEnd);
            return isInnerIp;
        }

        return isInnerIPFn(ipv4);
    },
    compare_version: function (your_version, mini_version){ // 你的version比标准version的大小。格式1.21.3、0.0.20。值-1小，0等，1大
        let array_your_version = your_version.split(".");
        let array_mini_version = mini_version.split(".");
        // 由左向右对比
        if (array_your_version.length < array_mini_version.length){
            return -1;
        }
        if (your_version === mini_version){
            return 0;
        }
        if (array_your_version[0]*1 > array_mini_version[0]*1){
            return 1;
        } else{
            if (array_your_version[1]*1 > array_mini_version[1]*1){
                return 1;
            }else{
                if (array_your_version[2]*1 > array_mini_version[2]*1){
                    return 1;
                }else{
                    if (array_your_version[2]*1 === array_mini_version[2]*1){
                        return 0;
                    }else{
                        return -1;
                    }
                }
            }
        }
    },
    seconds_to_minutes: function (seconds, format){ // 秒转分钟 format：mi
        if (!format){format="m:i";}
        let minute = Math.floor(seconds / 60); minute = (minute<10)?("0"+minute):minute;
        let second = seconds % 60; second = (second<10)?("0"+second):second;
        if (isNaN(minute)){minute = "00";}
        if (isNaN(second)){second = "00";}
        return format.replaceAll("m", minute).replaceAll("i", second);
    },
    is_mobile_screen: function (){ //-1非法，0PC，1mobile
        let width = window.screen.width;
        let height = window.screen.height;
        let max_px = 1280; // 最大 1280X900 px
        let min_px = 280;
        let rate = 40;
        if (width < min_px || height < min_px){
            return -1;
        }else{
            if (Math.abs(width-height) < rate){
                return -1;
            }else{
                if (width>max_px || height>max_px){
                    return 0;
                }else{
                    return 1;
                }
            }
        }
    },
    is_mobile_pwa: function (){ // iOS/Android端pwa
        return window.navigator?.standalone || document.referrer.includes('android-app://');
    },
    is_pc_pwa: function (){ // win/mac端pwa
        const displayModes = ['fullscreen', 'standalone', 'minimal-ui'];
        return displayModes.some(
            displayMode => window.matchMedia('(display-mode: ' + displayMode + ')').matches
        );
    },

};

