
// 获取映射函数
let go_func;
if (view.is_wails()){
    try {
        go_func = window.go.main.App.JSCallGo;
        view.log("js调用go函数的映射名单：", [window.go.main.App.JSCallGo("Test", "2023", "2024", "2025")]);
    }catch (e) {
        view.notice_txt("window.JSCallGo映射函数不存在！", 3000);
    }
}else{
    view.log("web环境");
}

// 映射函数的实现方法
// go_func(必要映射的函数名（string）, 必要参数1（string）, 必要参数2（string）, 必要参数3（string）)
const js_call_go = {
    Test: function (txt){
        return go_func("Test", txt+"", "", "");
    },
    WebServerHost: function (){ // 内网访问地址
        return go_func("WebServerHost", "", "", "");
    },
    WebServerWideHost: function (){ // 内网、局域网访问地址
        return go_func("WebServerWideHost", "", "", "");
    },
    WebServerCallGoHost: function (){ // 内网WebCallGo函数api访问地址（针对子程序的远程数据访问）。结尾无/
        return go_func("WebServerCallGoHost", "", "", "");
    },
    WebServerGetFileHost: function (){ // 内网 大文件/访问地址。/结尾
        return go_func("WebServerGetFileHost", "", "", "");
    },
    WebServerLoadHTMLHost: function (){ // 内网/局域网/广域网 html/访问地址。/结尾
        return go_func("WebServerLoadHTMLHost", "", "", "");
    },
    WebServerLoadHTMLWideHost: function (){ // 内网/局域网/广域网 html/访问地址。/结尾
        if (view.is_wails()){
            return go_func("WebServerLoadHTMLWideHost", "", "", "");
        }else{
            return new Promise(resolve => {
                resolve(window.location.host+assets_html_dir_name);
            });
        }
    },
    WebServerShareFileHost: function (){ // 内网/局域网/广域网 分享文件及其资源，结尾无/
        return go_func("WebServerShareFileHost", "", "", "");
    },
    WebServerShareFileWideHost: function (){ // 内网/局域网/广域网 分享文件及其资源，结尾无/
        if (view.is_wails()){
            return go_func("WebServerShareFileWideHost", "", "", "");
        }else{
            return new Promise(resolve => {
                resolve(window.location.host+"/");
            });
        }
    },
    WebServerUploadFilesHost: function (){ // 内网上传文件及其资源，/结尾
        return go_func("WebServerUploadFilesHost", "", "", "");
    },
    OpenURL: function (url, browser_name){ // browserName = "firefox" "msedge" "chrome" "safari"
        return go_func("OpenURL", url+"", browser_name+"", "");
    },
    ReadLocalFileList: function (dir){ // 读取文件或文件夹列表
        // console.log("读目录=", dir)
        if (view.is_wails()){
            return go_func("ReadLocalFileList", dir, "", "");
        }else{

        }
    },
    CreateLocalDir: function (dir){ // 创建文件夹
        return go_func("CreateLocalDir", dir, "", "");
    },
    RenameLocalFile: function (file, new_file){ // 重命名文件
        return go_func("RenameLocalFile", file, new_file+"", "");
    },
    RenameLocalDir: function (dir, new_dir){ // 重命名文件夹
        return go_func("RenameLocalDir", dir, new_dir+"", "");
    },
    DelLocalFile: function (file){ // 删除一个文件
        return go_func("DelLocalFile", file, "", "");
    },
    DelLocalDir: function (dir, null_content_dir){ // 删除文件夹、删除文件夹及其下面的所有文件
        if (null_content_dir === 1 || null_content_dir === true){
            null_content_dir ="true";
        }
        return go_func("DelLocalDir", dir, null_content_dir+"", "");
    },
    OpenFinder: function (dir){ // 打开文件夹管理器/打开finder
        return go_func("OpenFinder", dir, "", "");
    },
    GetLocalFilesDir: function (){ // 获取本地保存文件的文件夹
        if (view.is_wails()){
            return go_func("GetLocalFilesDir", "", "", "");
        }else{
            return new Promise((resolve, reject)=>{
                /*开始-请求数据*/
                $.ajax({
                    url: api_url + "read_dir",
                    type: "POST",
                    dataType: "json",
                    async: true,
                    data: { // 字典数据
                        app_class: app_class,
                        app_version: app_version,
                        login_name: login_name,
                        login_token: login_token,
                        login_id: view.base64_encode(login_id),
                        //
                        tip: "0",
                        show_path: "",
                        token: "",
                    },
                    success: function(back, status){
                        const data = view.string_to_json(back);
                        // 解析json
                        if (data.state === 0){ // 无数据或参数不全
                            resolve(data.content.local_dir);
                        }else if (data.state === 1){ // 接口数据成功
                            resolve(data.content.local_dir);
                        }else {
                            let txt = data.msg+"("+ data.state +")";
                            console.error(txt);
                            resolve("");
                        }
                    },
                    error: function (xhr) {
                        console.error(xhr);
                        resolve("");
                    }
                });
                /*结束-请求数据*/
            });
        }
    },
    WebServerLanShareFile: function (state){ // 是否开启局域网文件共享，"1" || "true"
        return go_func("WebServerLanShareFile", state+"", "", "");
    },
    WebServerLanShareDir: function (state){ // 是否开启局域网文件夹共享，"1" || "true"
        return go_func("WebServerLanShareDir", state+"", "", "");
    },
    GetRootDirWhiteKey: function (){
        if (view.is_wails()){
            return go_func("GetRootDirWhiteKey", "", "", "");
        }else{
            return new Promise(resolve => {
                resolve("");
            });
        }
    }

};

// 调用举例
// js_call_go.Test("333").then(msg=>{
//     console.log("JSCallGo-Test：", msg);
// });
// js_call_go.GetOS().then(info=>{
//     console.log("JSCallGo-GetOS：", info);
// });