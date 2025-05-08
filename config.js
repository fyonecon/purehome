/*自定义配置页面的一些全局参数*/
/*
* 1）页面生命周期（index.html--config.js等插件--depend.js--公共js/css文件--解析路由--page_init.js--pages.html、pages.js--start_page()函数 ）。
* 2）不依赖node，但需依赖服务端环境，或者需要CDN环境。
* 3）一般运行到start_page()函数会花费900ms左右。
* */
"use strict";

const debug = false; // 调试模式，统一打印日志，true & false
const block_wechat = true; // 是否禁止在微信中打开，true & false

// 框架渲染的必要参数
const route_404       = "?route=404";   // 404
const page_time       = "cache=" + files_version;

// API
const api_url         = "http://"+window.location.host+"/";  // api主地址
const log_url         = "";  // log主地址
let api_port = ""; // 端口
const assets_file_dir_name = window.location.host==="fyonecon.github.io"?"/purehome/":"/"; // 中间路由文件路径，/
const assets_html_dir_name = window.location.host==="fyonecon.github.io"?"/purehome/":"/"; // 中间路由文件路径，/
const assets_html_index_name = "index.html"; // 索引文件。默认：""或"index.html"
const white_local_key = "";

// 白名单host或refer域名
const app_url = {
    'check_url': "any", // 是否开启白名单url检测，"refer"开启refer检测，"host"开启host检测，"any"不检测
    'jump_url': 'https://www.bing.com/?msg=black-host', // 遇到黑名单refer/host的落地地址
    'white_url': [ // 仅检测N级域名开头，不包括http/ws协议和url路径。
        '127.0.0.1', '0.0.0.0', '192.168.', // C
        '172.16.', '172.17.','172.18.','172.19.','172.20.','172.21.','172.22.','172.23.','172.24.','172.25.','172.26.','172.27.','172.28.','172.29.','172.30.','172.31.', // B
        '10.', // A
        'purehome.','datathink.','github.io', // domain
    ],
};

// 自定义
// App验证参数
const app_class = "PureHome_"; // 必须为string，且必须唯一，推荐使用英文
const app_name = "PureHome"; // 推荐使用英文
const app_version = "5.5.1"; // 格式 1.0.0
const app_email = "";

// 登录用户使用的验证参数
let login_timeout = 30*24*60*60*1000; // 30天过期
let login_token = "";
let login_id = "";
let login_pwd = "";
let login_name = "";
let login_level = 0;
let login_level_name = "（未知等级）";
let login_nickname = "（未登录）";
