// run_drop_zone(是否可以是文件夹 true/false，获取文件的数量 1/all, 显示的提示信息)
// 矛点：
// <div class="drop-box">
//     <input type="file" id="drop-zone" class="drop-zone select-none" multiple />
//     <div id="drop-zone-msg" class="drop-zone-msg"></div>
// </div>
// 多文件上传：run_drop_zone(true, "all", "将文件、文件夹拖拽到此处", function (error_msg, files){if (error_msg){view.notice_txt("报错："+error_msg);}else{}});
// 单文件上传：run_drop_zone(false, 1, "请将目标文件拖拽到此处", function (error_msg, files){if (error_msg){view.notice_txt("报错："+error_msg);}else{}});
function run_drop_zone(dir_state, file_num, msg, call_func){
    let files = []; // 文件集合
    let count = 0; // 文件数量

    // 拖拽区域上传文件
    const dropZone = $("#drop-zone");
    const dropZoneMsg = $("#drop-zone-msg");
    //
    if (!msg){msg="将文件、文件夹拖拽到此处";}
    dropZoneMsg.html(msg);
    dropZone.bind("dragenter", function (e) {
        dropZoneMsg.html('<img class="drop-zone-plus" src="./static/img/plus.png" alt="+" />');
    })
    dropZone.bind("dragleave", function (e) {
        dropZoneMsg.html('<img class="drop-zone-plus" src="./static/img/plus.png" alt="+" />');
    })
    $(document).bind("dragover", function (e) {
        e.preventDefault();
        return false
    })
    $(document).bind("drop", function (e) {
        e.preventDefault();
        dropZoneMsg.html(msg);
        return false
    })
    dropZone.bind('change', function (e) { // input
        view.show_loading("long");
        files = Array.from(e.target.files).reverse(); // 新的在前，旧的在后
        try {
            call_func("", files); // 最终文件结果
            // console.log("click=", files);
        }catch (e) {
            view.hide_loading();
            console.error("必须要有回调函数-click：call_func(error_msg, files)");
        }
        // init
        files = [];
        count = 0;
    });

    dropZone.bind("drop", function (e) {
        view.show_loading("long");
        const items = e.originalEvent.dataTransfer.items;
        //
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            if (item.kind === "file") {
                let entry = item.webkitGetAsEntry();
                if (!dir_state){ // 不允许是文件夹
                    if (entry.isDirectory) {
                        view.hide_loading();
                        try {
                            call_func("不允许上传文件夹", []);
                        }catch (e) {
                            console.error("必须要有回调函数：call_func(error_msg, files)");
                        }
                        break;
                    }
                }
                //递归解析文件夹
                getCount(entry);
                setTimeout(() => {
                    getFilesFromEntry(entry)
                }, 400);
            }
            //
            // console.log("11=", items.length, i);
        }
    });
    // 递归解析文件夹
    function getCount(entry) {
        if (entry.isFile) {
            entry.file(
                file => {
                    count++
                },
                err => {
                    view.hide_loading();
                    console.log(err);
                }
            );
        } else {
            const entryReader = entry.createReader()
            entryReader.readEntries(
                (results) => {
                    results.forEach(result => {
                        getCount(result);
                    })
                },
                (error) => {
                    view.hide_loading();
                    console.log(error);
                }
            );
        }
    }
    // 获取文件夹或文件的结构
    function getFilesFromEntry(entry) {
        if (entry.isFile) {
            entry.file(
                file => {
                    file.filePath = entry.fullPath.slice(1)
                    files.unshift(file); // 最新的在前面
                    // console.log("22=", files.length, count);
                    if (files.length === count) {
                        view.hide_loading();
                        // console.log("拖拽上传文件信息：", files);
                        if (!file_num || file_num === "all"){ // 全部文件
                            try {
                                call_func("", files); // 最终文件结果
                                // console.log("drop=", files);
                            }catch (e) {
                                console.error("必须要有回调函数-drop：call_func(error_msg, files)");
                            }
                        }
                        else{ // 后几位的值，只取最新的
                            try {
                                call_func("", files.slice(0, file_num*1));
                            }catch (e) {
                                console.error("必须要有回调函数：call_func(error_msg, files)");
                            }
                        }
                        // init
                        files = [];
                        count = 0;
                    }
                },
                err => {
                    view.hide_loading();
                    console.log(err);
                }
            )
        } else {
            const entryReader = entry.createReader()
            entryReader.readEntries(
                (results) => {
                    results.forEach(result => {
                        getFilesFromEntry(result);
                    })
                },
                (error) => {
                    view.hide_loading();
                    console.log(error);
                }
            );
        }
    }
}

// CSS
// <style>
//     #drop-zone {
//     width: 100%;
//     max-width: 270px;
//     padding: 10px 10px;
//     height: 120px;
//     line-height: 26px;
//     text-align: center;
//     margin-left: auto;
//     margin-right: auto;
//     border: 1px solid black;
//     background-color: lavender;
//     font-size: 16px;
//     letter-spacing: 2px;
//     color: dodgerblue;
//     border-radius: 5px;
// }
//     #drop-zone-msg{
//     margin-top: 30px;
// }
// </style>

// 调用实例
// run_drop_zone(true, "all", "请将目标文件、文件夹拖拽到<br/>这里", function (error_msg, files){
//     if (error_msg){
//         console.log("上传文件的报错信息：", error_msg);
//     }else{
//          let dom = "";
//          let formData = new FormData();
//         const dropZoneList = $("#drop-zone-list");
//         //
//         for (let i=0; i<files.length; i++){
//             let file = files[i];
//             // 文件信息
//             let filename = file.name;
//             let filepath = file.filePath; filepath = filepath?filepath:filename;
//             let size = (file.size/1024).toFixed(2); // KB
//             let type = file.type;
//             dom += '<div>'+filepath+'，'+type+'</div>';
//             formData.append(encodeURIComponent(filepath), file);
//             // 读取文件流，回显
//             let reader = new FileReader();
//             reader.readAsDataURL(file);
//             reader.onload = function (e) {
//                 console.log("reader-file=", e.target.result); // base64，回显
//             };
//             reader.onerror = function (){
//                 console.log("文件流载入失败");
//             };
//         }
//         //
//         dropZoneList.html(dom);
//         // 提交POST文件
//         // let api = "";
//         // let xml = new XMLHttpRequest();
//         // xml.open("post", api, false);
//         // xml.send(formData);
//     }
// });