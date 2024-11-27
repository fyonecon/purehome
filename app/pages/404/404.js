/*
* 局部模块js
* */
"use strict";

function start_page(info) {
    view.log(info);
    let error_url = view.get_url_param("", "error_url");
    $(".show-error_url").text(error_url?error_url:"-");
    view.load_img("img-404", cdn_page_file+"static/img/");
}
