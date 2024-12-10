
function show_info(){
    // 参数与值
    let infos = [
        {
            "title": "类型：",
            "title_class": "font-class",
            "value": "值：",
            "value_class": "font-class",
        },
        {
            "title": "当前访问地址",
            "title_class": "font-text",
            "value": window.location.href,
            "value_class": "font-text",
        },
        {
            "title": "当前地址的Host",
            "title_class": "font-text",
            "value": window.location.host,
            "value_class": "font-text",
        },
        {
            "title": "当前地址的Refer",
            "title_class": "font-text",
            "value": document.referrer,
            "value_class": "font-text",
        },
        {
            "title": "浏览器当前语言",
            "title_class": "font-text",
            "value": window.navigator.languages,
            "value_class": "font-text",
        },
        {
            "title": "浏览器当前主题",
            "title_class": "font-text",
            "value": view.scheme_model(),
            "value_class": "font-text",
        },
        {
            "title": "框架解析用时",
            "title_class": "font-text",
            "value": (time_loaded - time_start) + " ms",
            "value_class": "font-text",
        },
        {
            "title": "APP UID",
            "title_class": "font-text",
            "value": view.get_data(app_class + "app_uid"),
            "value_class": "font-text",
        },
        {
            "title": "API URL",
            "title_class": "font-text",
            "value": api_url,
            "value_class": "font-text",
        },
        {
            "title": "Files Version",
            "title_class": "font-text",
            "value": files_version,
            "value_class": "font-text",
        },
        {
            "title": "Files appVersion",
            "title_class": "font-text",
            "value": app_version,
            "value_class": "font-text",
        },
        {
            "title": "Files assets_file_dir_name",
            "title_class": "font-text",
            "value": assets_file_dir_name,
            "value_class": "font-text",
        },
        {
            "title": "Files assets_html_dir_name",
            "title_class": "font-text",
            "value": assets_html_dir_name,
            "value_class": "font-text",
        },
        {
            "title": "Screen尺度参数",
            "title_class": "font-text",
            "value": "width=" + window.screen.width + "<br/>height=" + window.screen.height+ "<br/>availWidth=" + window.screen.availWidth+ "<br/>availHeight=" + window.screen.availHeight,
            "value_class": "font-text",
        },
        {
            "title": "Pages尺度参数",
            "title_class": "font-text",
            "value": "innerWidth=" + window.innerWidth + "<br/>innerHeight=" + window.innerHeight,
            "value_class": "font-text",
        },
        {
            "title": "IsMobileScreen",
            "title_class": "font-text",
            "value": view.is_mobile_screen(),
            "value_class": "font-text",
        },
        {
            "title": "平台参数userAgent",
            "title_class": "font-text",
            "value": window.navigator.userAgent,
            "value_class": "font-text",
        },
        {
            "title": "平台参数appVersion",
            "title_class": "font-text",
            "value": window.navigator.appVersion,
            "value_class": "font-text",
        },
        {
            "title": "平台参数特性",
            "title_class": "font-text",
            "value": [!!window.localStorage, !!window.indexedDB, navigator.webdriver],
            "value_class": "font-text",
        },
        {
            "title": "CDN加速",
            "title_class": "font-text",
            "value": [cdn_page_file, cdn_depend_file],
            "value_class": "font-text",
        },
        {
            "title": "是否处于PWA(Mobile/PC)",
            "title_class": "font-text",
            "value": [view.is_mobile_pwa(), view.is_pc_pwa()],
            "value_class": "font-text",
        },
        //
    ];

    // 展示数据
    $(".div-box").html("");
    infos.forEach((info, index)=>{
        $(".div-box").append('<div class="div-line"><div class="div-title '+info.title_class+'">'+info.title+'</div><div class="div-value '+info.value_class+'">'+info.value+'</div><div class="clear"></div></div>');
    });
}

function start_page(info) {
    show_info();
    // setInterval(function (){show_info();}, 8000);
}