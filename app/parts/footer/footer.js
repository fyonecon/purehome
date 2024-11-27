

function do_footer(){
    if (!view.is_wails()){
        $(".footer-content").removeClass("hide");
    }
}

// start
function start_footer(footer_file){
    view.write_html(footer_file+"footer.html", "footer-dom",  function (){
        do_footer();
    });
}