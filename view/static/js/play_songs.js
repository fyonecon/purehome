// 播放歌单

// <div class="div-play-songs select-none hide">
//     <code class="div-play-songs-info break">0/0</code>
//     <div class="div-play-songs-icon div-play-songs-icon-before_btn click" title="⬅️"></div>
//     <div class="div-play-songs-icon div-play-songs-icon-play_btn click" title="▶️"></div>
//     <div class="div-play-songs-icon div-play-songs-icon-next_btn click" title="➡️"></div>
//     <div class="clear"></div>
//     <div id="play-songs"></div>
// </div>

// host: "172.20.10.3:34100"
// song_name: "Alan walker-Play（KF remix）.mp3"
// song_path: "/Users/xxx/Music/网易云音乐/Alan walker-Play（KF remix）.mp3"
// song_src: "http://172.20.10.3:34100/share_file?route=share_file&show_path=%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%2FAlan%20walker-Play%EF%BC%88KF…"
//
// Object Prototype
const play_songs_dom_id = "play-songs";
let play_state_key = app_class+"songs_"+"play_state";
let play_mp3_num = 1;
let play_song_name = "";
let play_song_name_show_state = 0;
let play_song_calc = 0;
let play_btn_timer = 0; // 防止多次点击
const play_songs_func = {
    set_list_song: function (songs_src_array_info, song_class, init_state){ // 设置歌单
        let that = this;
        // 初始化
        that.song_stop(song_class);
        view.set_data(play_state_key, "OFF");
        if (init_state === "init"){
            that.set_that_song("");
            that.set_song_time("");
            view.log("初始化歌单");
        }else{
            view.log("更新歌单");
        }
        //
        songs_src_array_info = songs_src_array_info.slice(0, 2000); // 限制最大数量，防止存储溢出: [min, max)
        for (let i=0; i<songs_src_array_info.length; i++){
            songs_src_array_info[i] = JSON.stringify(songs_src_array_info[i]); // JSON转成string值
            if (i === songs_src_array_info.length-1){
                view.set_data(app_class+"songs_"+"list_song", songs_src_array_info.join("@#_song_#@"));
                break;
            }
        }
    },
    get_list_song: function (){ // 获取歌单
        let list = view.get_data(app_class+"songs_"+"list_song");
        if (list){
            let songs_src_array_info = list.split("@#_song_#@");
            return new Promise(resolve => {
                for (let i=0; i<songs_src_array_info.length; i++){
                    songs_src_array_info[i] = JSON.parse(songs_src_array_info[i]); // string转成JSON值
                    if (i === songs_src_array_info.length-1){
                        resolve(songs_src_array_info);
                    }
                }
            })
        }else{
            return new Promise(resolve => {
                resolve([]);
            });
        }
    },
    set_that_song: function (that_song_src_info){ // 设置正在播放的歌
        return view.set_data(app_class+"songs_"+"that_song", JSON.stringify(that_song_src_info));
    },
    get_that_song: function (){ // 获取正在播放的歌
        try{
            return JSON.parse(view.get_data(app_class+"songs_"+"that_song"));
        }catch (e){
            return {
                host: "",
                song_name: "",
                song_path: "",
                song_src: "",
            };
        }
    },
    get_song_info: function (that_dom){ // 从dom对象获取当前歌曲的信息
        try {
            return {
                host: that_dom.attr("data-host").replaceAll("/", ""),
                song_name: that_dom.attr("data-last_name"),
                song_path: that_dom.attr("data-path"),
                song_src: that_dom.attr("data-file_url"),
            }
        }catch (e){
            return {
                host: "",
                song_name: "",
                song_path: "",
                song_src: "",
            };
        }
    },
    set_song_time: function (that_song_time) { // 设置歌曲当前播放的进度
        return view.set_data(app_class+"songs_"+"play_time", that_song_time+"");
    },
    get_song_time: function () { // 获取歌曲当前播放的进度
        return view.get_data(app_class+"songs_"+"play_time")*1;
    },
    song_list_active: function (song_class){ // 在列表中选中正在播放的歌曲
        let that = this;
        //
        let now_src_info = that.get_that_song(); // 读取歌曲地址
        if (song_class){
            let dom = $("."+song_class);
            for (let f=0; f<dom.length; f++){
                if (now_src_info.song_name === dom.eq(f).attr("data-last_name")){
                    $("."+song_class).eq(f).addClass("play-song-active");
                    $(".div-play-songs-info").html(now_src_info.song_name).attr("title", now_src_info.song_name).attr("data-src", now_src_info.song_src).attr("data-name", now_src_info.song_name);
                    let play_songs_state = view.get_data(play_state_key);
                    if (view.is_wails()){
                        if (play_songs_state === "OFF"){
                            $("."+song_class).eq(f).siblings(".item-play").html('<i class="fa-duotone fa-play"></i>');
                        }else{
                            $("."+song_class).eq(f).siblings(".item-play").html('<i class="fa-solid fa-stop"></i>');
                        }
                    }
                    else{
                        if (play_songs_state === "OFF"){
                            $("."+song_class).eq(f).siblings(".item-play").html('<i class="fa-duotone fa-play"></i>');
                        }else{
                            $("."+song_class).eq(f).siblings(".item-play").html('<i class="fa-solid fa-stop"></i>');
                        }
                    }
                    break;
                }
            }
        }
    },
    song_bar_init: function (){ // 初始化歌曲横条
        let that = this;
        // 初始化
        let now_src_info = that.get_that_song(); // 读取歌曲地址
        if (now_src_info.song_name){
            $(".div-play-songs-box").removeClass("hide");
            $(".div-play-songs").removeClass("hide");
            that.song_list_active("item-name");
            $(".div-play-songs-info").html(now_src_info.song_name).attr("title", now_src_info.song_name).attr("data-src", now_src_info.song_src).attr("data-name", now_src_info.song_name);
        }else {
            $(".div-play-songs-box").addClass("hide");
            $(".div-play-songs").addClass("hide");
            $(".muyu-div").animate({
                "bottom": "105px",
            });
        }
    },
    song_play: function (song_class){ // 播放
        let that = this;

        // 清空定时器
        clearInterval(mp3_info_timer);
        clearTimeout(play_btn_timer);

        //
        let play_songs_state = view.get_data(play_state_key);
        if (play_songs_state === "OFF"){
            that.song_stop("item-name");
            return;
        }

        // 播放
        that.get_list_song().then(list_song=>{
            if (list_song.length >0){
                // 初始化
                $(".div-play-songs-icon-play_btn").html('<i class="fa-solid fa-stop"></i>');
                $(".div-play-songs").addClass("div-play-songs-animation");
                $(".play-song-active").siblings(".item-play").html('<i class="fa-duotone fa-play"></i>');
                $(".play-song-active").removeClass("play-song-active");
                $(".div-play-songs-box").removeClass("hide");
                $(".div-play-songs").removeClass("hide");
                //
                let now_src_info = that.get_that_song(); // 读取歌曲地址
                let has_now_src_info = false;
                new Promise(resolve => {
                    for (let i=0; i<list_song.length; i++){
                        if (list_song[i].song_name === now_src_info.song_name){ // 列表有数据
                            // 数组中存在目标数据
                            has_now_src_info = true;
                            resolve(true);
                            break;
                        }
                        if (i === list_song.length-1 && list_song[i].song_name !== now_src_info.song_name){ // 列表始终无数据
                            resolve(false);
                        }
                    }
                }).then(state=>{
                    that.song_list_active(song_class);
                    that.song_bar_init();
                    // 处理播放
                    if (state && now_src_info && has_now_src_info){ // 记录中有数据，并且属于当前播放列表，否则从新播放列表开始播放
                        // 处理播放地址
                        that.check_song_src_ip(now_src_info.song_src).then(new_song_src=>{
                            $(".div-play-songs-info").html(now_src_info.song_name).attr("title", now_src_info.song_name).attr("data-src", now_src_info.song_src).attr("data-name", now_src_info.song_name);
                            // init
                            play_mp3_num = 1;
                            play_song_name = now_src_info.song_name;
                            // 播放参数
                            let params = {
                                clear_dom: true,
                                src: new_song_src, // 何时取决于浏览器所支持的
                                display: "none",
                                volume: 0.8,
                                loop: false,
                                autoplay: false,
                            }
                            view.play_mp3(play_songs_dom_id, params, function (dom, end_state){
                                if (play_mp3_num === 1){ // 防止view.play_mp3组建多次运行
                                    if (play_song_calc <= 2000){
                                        if (end_state === 1 || end_state === 0){ // 1-ended 0-error
                                            that.song_play_next(song_class);
                                        }else{
                                            view.set_data(play_state_key, "OFF");
                                            that.song_stop("item-name");
                                            // console.log("超范围的值:", end_state);
                                        }
                                    }else{
                                        view.set_data(play_state_key, "OFF");
                                        that.song_stop("item-name");
                                        console.log("Max Calc");
                                    }
                                    play_song_calc++;
                                }else { // 跳过无效点击
                                    // console.log("jump=", play_mp3_num, now_src_info.song_name);
                                }
                                play_mp3_num++;
                            }, function (audio){
                                let current = that.get_song_time();
                                if (current){
                                    audio.currentTime = parseFloat(current);
                                }else{
                                    audio.currentTime = 0;
                                }
                                audio.play();
                            }, function (audio){ // 周期200ms
                                let duration = audio.duration; // s
                                let current = audio.currentTime; // s
                                that.set_song_time(current); // update
                                //
                                play_song_name_show_state++;
                                if (play_song_name_show_state <= 10){ // 2s=500=4
                                    $(".div-play-songs-info").html(play_song_name);
                                }else if (play_song_name_show_state <= 30){ // 4s=500=12
                                    $(".div-play-songs-info").html(view.seconds_to_minutes(Math.floor(current), "m:i")+"/"+view.seconds_to_minutes(Math.floor(duration), "m:i"));
                                }else{
                                    play_song_name_show_state = 0; // init
                                }
                            });
                        });
                    }else{ // 无数据就默认播放第一个
                        that.set_that_song(list_song[0]); // 设置新的歌曲地址
                        that.set_song_time(""); // 还原歌曲时间
                        that.song_play(song_class);
                    }
                });
            }else{
                view.log("Null Songs");
                view.notice_txt("Null Play-List", 3000);
                that.song_stop(song_class);
            }
        });

    },
    song_stop: function (song_class){ // 暂停
        let that = this;
        $(".div-play-songs-icon-play_btn").html('<i class="fa-duotone fa-play"></i>');
        $(".play-song-active").siblings(".item-play").html('<i class="fa-duotone fa-play"></i>');
        $(".div-play-songs").removeClass("div-play-songs-animation");
        // 清空定时器
        clearInterval(mp3_info_timer);
        clearTimeout(play_btn_timer);
        //
        that.song_bar_init();
        //
        view.set_data(play_state_key, "OFF");
        view.stop_mp3(play_songs_dom_id);
    },
    song_play_new: function (that_song_info){ // 直接播放某一首歌
        let that = this;
        let play_songs_state = view.get_data(play_state_key);
        play_song_calc = 0;
        // 播放
        if (play_songs_func.get_that_song().song_path === that_song_info.song_path){ // 是同一首歌，就执行暂停/播放
            if (play_songs_state === "OFF"){
                view.set_data(play_state_key, "ON");
                play_songs_func.song_play("item-name");
            }else{
                view.set_data(play_state_key, "OFF");
                play_songs_func.song_stop("item-name");
            }
        }else{ // 不是同一首歌，就直接更新当前正在播放的歌曲，不变更原有播放列表
            update_play_list("item-name", "update");
            play_songs_func.set_that_song(that_song_info);
            //
            view.set_data(play_state_key, "ON");
            play_songs_func.song_play("item-name");
        }
    },
    song_play_next: function (song_class){ // 下一首
        let that = this;
        $(".div-play-songs-icon-play_btn").html('<i class="fa-duotone fa-play"></i>');

        // 当前正在播放的
        let now_src_info = that.get_that_song();
        // 清空定时器
        clearInterval(mp3_info_timer);
        clearTimeout(play_btn_timer);
        // 还原歌曲时间
        that.set_song_time("");

        // 设置下一首歌曲
        let next_src_info = "";
        that.get_list_song().then(new_list=>{
            if (now_src_info){
                new_list.forEach((the_src_info, i)=>{
                    if (now_src_info.song_name === new_list[i].song_name){
                        next_src_info = new_list[i+1];
                    }else{
                        if (i === new_list.length-1 && !next_src_info){
                            next_src_info = new_list[0];
                        }
                    }
                });
            }else{
                next_src_info = new_list[0];
            }
            // 播放
            play_btn_timer = setTimeout(function (){
                that.set_that_song(next_src_info); // 设置新的歌曲地址
                that.song_play(song_class);
            }, 500);
        });

    },
    song_play_before: function (song_class){ // 上一首
        let that = this;
        $(".div-play-songs-icon-play_btn").html('<i class="fa-duotone fa-play"></i>');

        // 当前正在播放的
        let now_src_info = that.get_that_song();
        // 清空定时器
        clearTimeout(play_btn_timer);
        clearInterval(mp3_info_timer);
        // 还原歌曲时间
        that.set_song_time("");

        // 设置上一首歌
        let before_src_info = "";
        that.get_list_song().then(new_list=>{
            if (now_src_info){
                new_list.forEach((the_src_info, i)=>{
                    if (now_src_info.song_name === new_list[i].song_name){
                        if (new_list.length >= 2){
                            if (i===0){
                                before_src_info = new_list[new_list.length-1]; // 从最后一个循环
                            }else{
                                before_src_info = new_list[i-1];
                            }
                        }else{
                            before_src_info = new_list[0];
                        }
                    }else{
                        if (i === new_list.length-1 && !before_src_info){
                            before_src_info = new_list[new_list.length-1];
                        }
                    }
                });
            }else{
                before_src_info = new_list[0];
            }
            // 播放
            play_btn_timer = setTimeout(function (){
                that.set_that_song(before_src_info); // 设置新的歌曲地址
                that.song_play(song_class);
            }, 500);
        });
    },
    check_song_src_ip: function (song_src){ // 处理song地址IP，解决本地切换IP时音乐播放停止的情况
        return new Promise((resolve, reject)=>{
            if (view.is_wails()){
                js_call_go.LocalIPv4().then(local_ip=>{ // 获取本地IP
                    js_call_go.WebServerPort().then(port=>{
                        local_ip = local_ip + ":" + port;
                        if (view.string_include_string(song_src, local_ip) === -1){ // 不存在
                            console.log("wails IP发生了变化，自动尝试修正文件地址数据");
                            let the_song_src = song_src.replaceAll("http://", "").replaceAll("https://", "");
                            try {
                                let old_ip = the_song_src.split("/")[0];
                                let old_param = the_song_src.substring(old_ip.length);
                                let local_song_src = "http://"+local_ip+""+old_param;
                                view.ping_url(local_song_src, function (url_state){ // 本地IP优先
                                    // console.log("Ping新参数：", [song_src, local_ip, old_ip, old_param, local_song_src, url_state]);
                                    if (url_state){
                                        return resolve(local_song_src);
                                    }else{
                                        return resolve(song_src);
                                    }
                                });
                            }catch (e){
                                return resolve(song_src);
                            }
                        }else{ // 存在
                            return resolve(song_src);
                        }
                    });
                });
            }else{ // web下返回原地址，不做处理
                return resolve(song_src);
            }
        });
    },
};
// 清除播放列表(只清除当前播放列表即可)
function clear_play_list(){
    play_songs_func.song_stop("item-name");
    // view.set_data(app_class+"songs_"+"list_song", "");
    view.set_data(app_class+"songs_"+"that_song", "")
    view.set_data(play_state_key, "OFF");
    view.set_data(app_class+"songs_"+"play_time", "");
    $(".div-play-songs-box").addClass("hide");
    $(".div-play-songs").addClass("hide");
}

// 更新播放列表
function update_play_list(song_class, init_state){
    let host2 = $(".div-play-songs-icon-add_play_list_btn").attr("data-host2");
    // 清空
    clearInterval(mp3_info_timer);
    play_songs_func.set_song_time("");
    // 读取页面数据
    read_page_songs(host2).then(songs_src_array=>{
        if (songs_src_array.length>1){
            // 展示播放横条
            $(".div-play-songs-box").removeClass("hide");
            $(".div-play-songs").removeClass("hide");
            //
            play_songs_func.set_list_song(songs_src_array, song_class, init_state); // 初始化
            setTimeout(function (){
                view.set_data(play_state_key, "ON");
                play_songs_func.song_play(song_class)
            }, 200);
        }
    });
}
// 展示播放类标按钮
function show_play_list_btn(host2){
    read_page_songs(host2).then(songs_src_array=>{
        if (songs_src_array.length>1){
            $(".play-songs-update_list").removeClass("hide");
            $(".div-play-songs-icon-add_play_list_btn").attr("data-host2", host2);
            play_songs_func.song_list_active("item-name");
        }else{
            $(".play-songs-update_list").addClass("hide");
        }
    });
}
// 从页面读取列表
function read_page_songs(host2){
    // 处理歌曲
    let songs_src_array = [];
    let file_dom = $(".list-files-item");
    return new Promise(resolve => {
        for (let i=0; i<file_dom.length; i++){ // 获取全部歌曲
            let that_file_dom = file_dom.eq(i);
            let name = that_file_dom.attr("data-last_name");
            if (view.is_audio(name)){
                let src = that_file_dom.find(".item-name").attr("data-file_url");
                let path = that_file_dom.attr("data-value");
                songs_src_array.push({
                    "song_name": name,
                    "song_src": src,
                    "song_path": path,
                    "host": host2.replaceAll("/", ""),
                });
            }
            if (i === file_dom.length-1){
                resolve(songs_src_array);
            }
        }
    });
}

// =========================================

// 更新播放列表
$(document).on("click", ".div-play-songs-icon-add_play_list_btn", function (){
    let that = $(this);
    play_song_calc = 0;
    play_songs_func.get_list_song().then(list=>{
        if (list.length>1){
            view.alert_confirm("⚠️", "Update Play-List？", function (state){
                if (state){
                    view.log("OK");
                    update_play_list("item-name", "init");
                }else{
                    view.log("取消");
                }
            })
        }else{ // 无数据就直接更新
            update_play_list("item-name", "init");
        }
    });
});
// 播放/暂停
$(document).on("click", ".div-play-songs-icon-play_btn", function (){
    let that = $(this);
    let play_songs_state = view.get_data(play_state_key);
    play_song_calc = 0;
    // 切换播放
    if (play_songs_state === "OFF"){
        view.set_data(play_state_key, "ON");
        play_songs_func.song_play("item-name");
    }else{
        view.set_data(play_state_key, "OFF");
        play_songs_func.song_stop("item-name");
    }
});
// 上一首
$(document).on("click", ".div-play-songs-icon-before_btn", function (){
    let that = $(this);
    play_song_calc = 0;
    view.set_data(play_state_key, "ON");
    play_songs_func.song_play_before("item-name");
});
// 下一首
$(document).on("click", ".div-play-songs-icon-next_btn", function (){
    let that = $(this);
    play_song_calc = 0;
    view.set_data(play_state_key, "ON");
    play_songs_func.song_play_next("item-name");
});
// 直接播放某一首歌
$(document).on("click", ".item-play", function (){
    let that = $(this);
    let that_song_info = play_songs_func.get_song_info(that.siblings(".item-file"));
    if (!that_song_info.song_path){ // 兼容lan
        that_song_info = play_songs_func.get_song_info(that.siblings(".item-lan-file"));
    }
    play_songs_func.song_play_new(that_song_info);
});
