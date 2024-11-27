
let play_songs_box_mouseleave_timer = 0;
$(document).on("mouseenter", ".div-play-songs", function (){ // 展开
    let that = $(this);
    clearTimeout(play_songs_box_mouseleave_timer);
    that.animate({
        "width": "268px",
    });
    $(".div-play-songs-box").animate({
        "width": "280px",
    });
});
$(document).on("mouseleave", ".div-play-songs", function (){ // 缩小
    let that = $(this);
    clearTimeout(play_songs_box_mouseleave_timer);
    play_songs_box_mouseleave_timer = setTimeout(function (){
        that.animate({
            "width": "171px",
        });
        $(".div-play-songs-box").animate({
            "width": "180px",
        });
    }, 1200);
});
$(document).on("click", ".div-play-songs-info", function (){ // 查看详情
    let that = $(this);
    let song_name = that.attr("title");
    view.notice_txt(song_name, 3000);
});

// 运行组件内部函数
function run_parts_play_songs(route){
    let play_songs_state = view.get_data(play_state_key);
    if (view.is_wails()){
        play_songs_func.song_bar_init();
        if (play_songs_state === "ON"){
            view.log("开始播放音乐");
            $(".div-play-songs").removeClass("hide")
            play_songs_func.song_play("item-name");
        }else {
            play_songs_func.song_stop("item-name");
        }
    }else{ // web不可自动播放
        play_songs_func.song_bar_init();
        if (play_songs_state === "ON"){
            view.log("开始播放音乐");
            $(".div-play-songs").removeClass("hide")
            play_songs_func.song_play("item-name");
        }
    }
}