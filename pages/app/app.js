"use strict";

// 国际化
const app_lang = {
    "zh": {
        "about": "替代浏览器主页 & 局域网跨设备分享文件。",
        "dl": "（下载）",
        "home": "多种搜索引擎，还有你收藏的网址标签",
        "lan": "局域网跨设备“文件/文件夹/粘贴板”共享",
        "setting": "内置了一些“个性化项、使用帮助、安全选项”等",
        'mac_install_title': 'Mac平台软件安装帮助，安装软件过程中如果遇到“软件已损坏”，请参考如下：',
        'mac_install_txt': '1.1 在Mac的终端输入命令行：<span class="yellow">sudo spctl --master-disable</span><br/>' +
            '1.2 然后输入你的Mac锁屏密码，回车确认。<br/>' +
            '1.3 打开设置----隐私与安全----安全----勾选“任何来源”。<br/>' +
            '2. 安装PureHome到Mac的应用文件夹里。<br/>' +
            '3.1 在Mac终端输入命令行：<span class="yellow">sudo xattr -r -d com.apple.quarantine /Applications/PureHome.app</span><br/>' +
            '3.2 然后输入你的Mac锁屏密码，回车确认。<br/>' +
            '4. OK了。',
    },
    "en":{
        "about": "Replace Browser Homepage & Sharing Files Across Devices In Your LAN Network.",
        "dl": " (Download)",
        "home": "Multiple search engines, as well as your favorite URL tags",
        "lan": 'Sharing of "Files/Folders/Pasteboard" across devices in a local network',
        "setting": 'Built in some" personalization items, usage help, security options ", etc.',
        'mac_install_title': 'Mac platform software installation help. If you encounter "software damage" during the software installation process, please refer to the following:',
        'mac_install_txt': '1.1 On the Mac terminal, enter the command line:<span class="yellow">sudo spctl --master-disable</span><br/>' +
            '1.2 Then enter your Mac lock screen password and press enter to confirm.<br/>' +
            '1.3 Open Settings ->Privacy and Security ->Security ->Check "Any Source".<br/>' +
            '2. Install PureHome into the Mac applications folder.<br/>' +
            '3.1 Enter the command line on the Mac terminal:<span class="yellow">sudo xattr -r -d com.apple.quarantine /Applications/PureHome.app</span><br/>' +
            '3.2 Then enter your Mac lock screen password and press enter to confirm.<br/>' +
            '4. OK.',
    },
    "jp":{
        "about": "ブラウザホーム&ローカルエリアネットワークを代替してデバイス間でファイルを共有する。",
        "dl": " （ダウンロード）",
        "home": "複数の検索エンジン、そしてあなたが所蔵するURLラベル",
        "lan": 'LANクロスデバイス「ファイル/フォルダ/ペーストボード」共有',
        "setting": '個人化されたアイテム、ヘルプの使用、セキュリティオプションなどが組み込まれている',
        'mac_install_title': 'Macプラットフォームソフトウェアのインストールヘルプ。ソフトウェアのインストール中に「ソフトウェアが破損している」場合は、次のように参照してください：',
        'mac_install_txt': '1.1 Macの端末にコマンドラインを入力する：<span class="yellow">sudo spctl --master-disable</span><br/>' +
            '1.2 そしてあなたのMacロック画面のパスワードを入力して、車に戻って確認します。<br/>' +
            '1.3 「設定を開く」--プライバシーとセキュリティ--セキュリティ--「任意のソース」をチェックします。<br/>' +
            '2. MacのアプリケーションフォルダにPureHomeをインストールする。<br/>' +
            '3.1 Mac端末にコマンドラインを入力する：<span class="yellow">sudo xattr -r -d com.apple.quarantine /Applications/PureHome.app</span><br/>' +
            '3.2 そしてあなたのMacロック画面のパスワードを入力して、車に戻って確認します。<br/>' +
            '4. OKしました。',
    },
};

//
$(document).on("click", ".app-click", function (){
    let home_href = "";
    if (view.is_wails()){
        home_href = "./";
    }else if (view.is_local_ipv4()){
        home_href = "./";
    }else{ //web
        home_href = "../";
    }
    view.window_open(home_href, "_self");
});
$(document).on("click", ".lang-btn-zh", function (){
    set_app_lang("zh");
    view.notice_txt("中文");
});
$(document).on("click", ".lang-btn-en", function (){
    set_app_lang("en");
    view.notice_txt("English");
});
$(document).on("click", ".lang-btn-jp", function (){
    set_app_lang("jp");
    view.notice_txt("日本語");
});


// 设置语言
function set_app_lang(lang){
    // txt
    // <span class="lang app-lang_"></span>
    // $(".app-lang_").html(app_lang[lang][""]);
    $(".app-lang_about").html(app_lang[lang]["about"]);
    $(".app-lang_dl").html(app_lang[lang]["dl"]);
    $(".app-lang_home").html(app_lang[lang]["home"]);
    $(".app-lang_lan").html(app_lang[lang]["lan"]);
    $(".app-lang_setting").html(app_lang[lang]["setting"]);
    $(".app-lang_mac_install_title").html(app_lang[lang]["mac_install_title"]);
    $(".app-lang_mac_install_txt").html(app_lang[lang]["mac_install_txt"]);
    // img
    let img_dir = cdn_page_file + "static/app/"+lang+"/";
    let img = $(".img-show");
    for (let i=0; i<img.length; i++){
        let the_img = img.eq(i);
        let img_name = the_img.attr("data-img");
        setTimeout(function (){
            the_img.attr("src", img_dir+img_name);
        }, i*400);
    }
}

function start_page(info) {

    // 默认语言
    let lang = "zh";
    if (lang_eq === 0 || lang_eq === 2){
        lang = "zh";
    }
    else if (lang_eq === 1){
        lang = "en";
    }
    else if (lang_eq === 3){
        lang = "jp";
    }
    else{
        lang = "en";
    }
    set_app_lang(lang);

    // 版权
    $(".app-name").html(app_name + " v" + app_version);
    $(".app-box-item-div-rights").html(app_name+".cc");

}
