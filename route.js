/*页面和模块信息配置*/
/*路由注册（白名单）*/

"use strict";

// 1. 所有页面公用js、css文件，全局有效
// 2. 注册全局组件
const page_public_file = {
    "js": [
        // "static/js/play_songs.js",
        "static/js/input_enter.js",
    ],
    "css": [
        "static/css/page_all.css",
        // "static/fontawesome-6-web/css/all.css", // https://fontawesome.com/search?q=
    ],
};


// pages模块页面白名单配置
const pages = [
    // 开始-必要路由
    { // 页面模块
        "route"     : "",
        "file_path" : "pages/direct/direct.view",
        "title"     :  "请选择需要进入的页面",
        "file"      : [
            {
                "js": [
                    "pages/direct/direct.js",
                ],
                "css": [
                    "pages/direct/direct.css",
                ],
            },
        ],
    }, //
    // 开始-必要路由
    { // 页面模块-404
        "route"     : "404",  // url中#route=xxx，便于定位页面
        "file_path" : "pages/404/404.view", // 实际文件路径+文件名，为了方便起见，文件后缀统一用“htm”
        "title"     : "页面404 - 页面没找到路由地址",  // 页面title
        "file"      : [  // 本页面需要引入的局部资源文件
            {
                "js": [
                    "pages/404/404.js",  // 模块页面js，模块中有效
                ],
                "css": [
                    "pages/404/404.css?",  // 模块页面css，模块中有效
                ],
            },
        ],
    },
    { // 页面模块
        "route"     : "login",
        "file_path" : "pages/login/login.view",
        "title"     : "请登录...",
        "file"      : [
            {
                "js": [
                    "pages/login/login.js",
                ],
                "css": [
                    "pages/login/login.css",
                ],
            },
        ],
    }, //
    // 结束-必要路由

    { // 页面模块
        "route"     : "app",
        "file_path" : "pages/app/app.view",
        "title"     :  "App详情介绍",
        "file"      : [
            {
                "js": [
                    "pages/app/app.js",
                ],
                "css": [
                    "pages/app/app.css",
                ],
            },
        ],
    }, //
    { // 页面模块
        "route"     : "info",
        "file_path" : "pages/info/info.view",
        "title"     :  "App与浏览器参数",
        "file"      : [
            {
                "js": [
                    "pages/info/info.js",
                ],
                "css": [
                    "pages/info/info.css",
                ],
            },
        ],
    }, //
    { // 页面模块
        "route"     : "home",
        "file_path" : "pages/home/home.view",
        "title"     : "主页",
        "file"      : [
            {
                "js": [
                    "pages/home/home_kw.js",
                    "pages/home/home.js",
                ],
                "css": [
                    "pages/home/home.css",
                ],
            },
        ],
    }, //
    { // 页面模块-搜索辅助跳转
        "route"     : "search",
        "file_path" : "pages/search/search.view",
        "title"     : "搜索 ",
        "file"      : [
            {
                "js": [
                    "pages/search/search.js",
                ],
                "css": [
                    "pages/search/search.css",
                ],
            },
        ],
    }, //
    { // 页面模块-文档预览
        "route"     : "docs",
        "file_path" : "pages/docs/docs.view",
        "title"     : "文档预览 ",
        "file"      : [
            {
                "js": [
                    "pages/docs/docs.js",
                ],
                "css": [
                    "pages/docs/docs.css",
                ],
            },
        ],
    }, //

    //
];

