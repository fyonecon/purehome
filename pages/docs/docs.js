
// txt
function docs_preview_txt(doc_url, doc_name){
    $(".docs-name").html("正在加载文档...");
    $.ajax({ // 利用ajax的get请求获取文本内容
        url: doc_url + "#cache="+view.time_date("YmdHi"),
        async: true,
        success: function (data) {
            let txt = "文档："+doc_name;
            $(".docs-name").html(txt);
            view.title(txt);
            if (view.string_include_string(doc_name, ".tud")>0){ // 包含加密
                $(".docs-preview").html(view.unicode_to_string(data));
            }else{ // 原始文档
                $(".docs-preview").html(data);
            }
            //
            $(".docs-name").addClass("hide");
        },
        error: function (error) {
            let txt = "缺失文档："+doc_name;
            $(".docs-name").html(txt);
            view.title(txt);
            $(".docs-preview").html(error);
        }
    });
}

function start_page(info) {
    let doc_name = view.get_url_param("", "name");
    if (doc_name.length>=3 && doc_name.length<=1200){
        docs_preview_txt(cdn_page_file+"static/docs/txt_unicode/"+doc_name, doc_name);
    }else{
        let txt = "缺失文档："+doc_name;
        $(".docs-name").html(txt);
        $(".docs-preview").html(txt);
    }
}