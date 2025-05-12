// 初始化页面所有路由文件后，负责框架事件。早于start_page()一步。
function frame_loaded(e, route){
    // 页面载入完成，隐藏加载动画
    view.hide_loading();

    // 获取手动设置的主题色值
    let theme_key = app_class + "switch_radio_theme";
    let theme_value = view.get_data(theme_key);
    if (!theme_value){ // 默认跟随系统
        theme_value = "theme_0";
        view.set_data(theme_key, theme_value);
    }

    // 页面缩放
    let page_zoom_key = app_class + "switch_radio_page_zoom";
    let page_zoom_value = view.get_data(page_zoom_key);
    if (!page_zoom_value){ // 默认跟随系统
        if (view.is_wails()){
            page_zoom_value = "0.95";
        }else{
            page_zoom_value = "1.00"; // 1
        }
        view.set_data(page_zoom_key, page_zoom_value);
    }

    // 组件加载时间
    console.info("当前显示语言：" + view.language_txt("lang"), window.navigator.languages);
    console.info("当前显示主题：" + theme_value, view.scheme_model());
    console.info("框架解析用时：" + (time_loaded - time_start) + " ms");
    view.log("框架报错时间：" + time_error);

    // 动态设置网站标题
    function set_lang_title(){
        // view.title("");
        if (!route){route = "home";}
        for(let key in lang_txt_data["route"]){
            try {
                let _route = lang_txt_data["route"][key];
                if (key === route){
                    view.title(_route[lang_eq]);
                    break;
                }
            }catch (e){break;}
        }
    }
    set_lang_title();

    // 监听页面尺寸改变
    window.onresize = function (){
        let width = window.innerWidth;
        //
    };

    // 监听滚动：局域网文件列表
    if ($("#tools-right-content")){
        function scroll_trc(){
            let dom_top = $("#fixed-dir-div").offset().top;
            let dom_height = $("#fixed-dir-div").height();
            let scroll = $("#tools-right-content").scrollTop();
            //
            if (dom_top >= scroll){ // show
                // console.log("show");
                $("#fixed-dir-div").removeClass("fixed_dir-nav");
                $("#list-files-box").css({"margin-top":0+"px"});
            }else{ // fixed
                // console.log("fixed");
                $("#fixed-dir-div").addClass("fixed_dir-nav");
                $("#list-files-box").css({"margin-top":dom_height+"px"});
            }
        }
        $("#tools-right-content").scroll(function (){
            scroll_trc();
        });
    }

    // 监听页面应用进入后台
    document.addEventListener("visibilitychange",function(){
        // 进入前台（已经在前台不触发，仅在有动作后触发））
        if(document.visibilityState === "visible"){
            view.log("切换到前台："+view.time_date("YmdHis"));
            try {show_page(["可选初始切换到前台函数"]);}catch (e){view.log("show_page()：可忽略的可选初始切换到前台函数");}
        }
        // 进入后台
        if(document.visibilityState === "hidden"){
            view.log("切换到后台："+view.time_date("YmdHis"));
            try {hide_page(["可选初始切换到后台函数"]);}catch (e){view.log("hide_page()：可忽略的可选初始切换到后台函数");}
        }
    });

    // 监听系统切换主题色
    let scheme = window.matchMedia('(prefers-color-scheme: light)');
    scheme.addEventListener('change', (event) => { // if (event.matches){}。// 监听主题色，切换浏览器主题色时会触发此函数
        view.log("自动切换到主题色：", view.scheme_model());
        if (theme_value === "theme_0"){
            try {
                view.init_theme(theme_value, view.scheme_model());
            }catch (e){
                view.log("无对接主题色init_theme("+view.scheme_model()+")函数，可忽略，0-0。", e);
            }
        }
    });

    // 设置全局登录信息
    let user_email_key = app_class+"login_email";
    login_id = view.unicode_to_string(view.get_data(user_email_key));
    let user_pwd_key = app_class+"login_pwd";
    login_pwd = view.get_data(user_pwd_key);

    // 歌曲播放
    // function run_play_songs(route){
    //     // 加载HTML
    //     view.write_css([cdn_page_file + "parts/player/player.css"], function (){});
    //     view.write_html(cdn_page_file + "parts/player/player.html", "route-page",function (){
    //         view.write_js([cdn_page_file + "parts/player/player.js"], function (){
    //             run_parts_play_songs(route);
    //         });
    //     }, "depend");
    // }
    // run_play_songs(route);

    // 监听Enter按键
    watch_input_enter( function (enter_state, the_input_id){
        if (enter_state === 1){ // 条件满足
            view.show_loading(200);
            if (the_input_id === "input"){ // 首页搜索
                run_search();
            }
            else if (the_input_id === "input1"){ // 顶部搜索
                $(".back-do-input-btn-btn").click();
            }
            else if (the_input_id === "search-lan-input"){
                $(".search-lan-btn").click();
            }
            else if (the_input_id === "search-notes-input"){
                $(".search-notes-btn").click();
            }else{
                view.notice_txt("超范围的值1："+the_input_id, 5000);
            }
        }
        else if (enter_state === 0){ // input内容为空
            view.show_loading(200);
            if (the_input_id === "input"){ // 首页搜索
                view.notice_txt(view.language_txt("keywords_null"), 2000);
            }
            else if (the_input_id === "input1"){ // 顶部搜索
                $(".back-do-input-btn-btn").click();
            }
            else if (the_input_id === "search-lan-input"){
                $(".search-lan-btn").click();
            }
            else if (the_input_id === "search-notes-input"){
                $(".search-notes-btn").click();
            }else{
                view.notice_txt("超范围的值2："+the_input_id, 5000);
            }
        }
        else{ // 其他非法情况
            view.log("Enter其他非法情况：", enter_state);
        }
    });

    // footer
    // if ((route === "preview_file") && $("#footer-dom")){
    //     let footer_file = "./parts/footer/";
    //     view.write_css([footer_file+"footer.css"], function (){});
    //     view.write_js([footer_file+"footer.js"], function (){
    //         start_footer(footer_file);
    //     });
    // }

    // 屏蔽词（默认值）
    let search_del_fake_news =  view.get_data(app_class+"search_del_fake_news");
    if (!search_del_fake_news){
        // view.set_data(app_class+"search_del_fake_news", "-zhihu.com");
    }else{
        view.set_data(app_class+"search_del_fake_news", "");
    }

}