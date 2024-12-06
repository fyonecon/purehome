// 先注册ID，才能调用watch

let watch_input_ids = []; // 同时监测页面的多个input_id
let input_doing = 1; // 判断用户输入框是否已经输入完成。 1直接完成输入，2预选词输入完成，-1开始输入，0词预选状态。1和2都是输入完成，请区分具体数值。

// 注册要监听的input id
function register_input_id(input_id){
    let input_object = document.getElementById(input_id);
    watch_input_ids.push(input_id);
    view.log("register_input_id:", {"now-ID":input_id, "all-ID":watch_input_ids});

    input_object.addEventListener('compositionstart',function(e){
        input_doing = -1;
    },false);
    input_object.addEventListener('input',function(e){
        if (input_doing === -1){ // 词预选状态
            input_doing = 0;
        } else if (input_doing === 1 || input_doing === 2) { // 直接输入状态，顺便初始化input_doing
            input_doing = 1;
        } else {
            input_doing = 0;
        }
    },false);
    input_object.addEventListener('compositionend',function(e){
        if (input_doing === 0){ // 预选词已确定时触发
            input_doing = 2;
        }else if (input_doing === 1) { // 输入完成时触发
            input_doing = 1;
        }else {
            input_doing = 0;
        }
    },false);
}

// 监听input输入框输入事件Enter及其之后的操作
// // 监听Enter按键
//     watch_input_enter("input_id", function (enter_state, the_input_id, the_input_doing){
//         view.show_loading(200);
//         if (enter_state === 1){ // 条件满足
//             //
//         }
//         else if (enter_state === 0){ // input内容为空
//             //
//         }
//         else{ // 其他非法情况
//             view.log("Enter其他非法情况：", enter_state);
//         }
//     });
function watch_input_enter(call_func){
    //
    let input_id = "";
    let db_click_time = (new Date()).getTime();
    document.onkeyup = function(event) { // 按Enter
        let now_click_time = (new Date()).getTime();
        let _key = event.key;
        if (_key === "Enter") {

            // 拦截多次点击
            let click_time = now_click_time - db_click_time;
            if (click_time <= 100) {
                db_click_time = 0;
                try {
                    call_func(-1, "", input_doing);
                }catch (e){}
                return;
            } else {
                db_click_time = (new Date()).getTime();
            }

            // 拦截有弹窗时的Enter
            if ($(".div-input_confirm").length > 0){
                view.log("拦截有对话弹窗时的Enter", $(".div-input_confirm").length);
                try {
                    call_func(-2, "", input_doing);
                }catch (e){}
                return;
            }

            // 拦截非聚焦时
            let len_focus = 0;
            watch_input_ids.forEach(the_id=>{
                if ($("#"+the_id).is(":focus")){
                    input_id = the_id;
                    len_focus = len_focus + 1;
                    view.log("watch_input_ids=focus=", the_id, len_focus);
                }else{
                    view.log("watch_input_ids=blur=", the_id, len_focus);
                }
            });
            if (len_focus === 0){
                input_id = "";
                len_focus = 0;
                try {
                    call_func(-3, "", input_doing);
                }catch (e){}
                view.log("非聚焦input_id=", input_id, len_focus);
                return;
            }

            // 内容不能为空
            let _input = document.getElementById(input_id).value;
            if (!_input.trim()) {
                try {
                    call_func(0, input_id, input_doing);
                }catch (e){}
                return;
            }

            // 判断输入框是否已经完成输入，避免词还没选择完就触发enter键搜索
            if (input_doing === 1){
                view.log("输入词完成状态触发enter键搜索："+input_doing);
                // 输出状态判断完成，执行
                try {
                    call_func(1, input_id, input_doing);
                }catch (e){}
            }else if (input_doing === 2) {
                view.log("连续输入词预选状态不触发enter键搜索："+input_doing);
                input_doing = 1; // 不输入就初始化输入状态值
            }else {
                view.log("未知输入状态1："+input_doing);
            }
        }else{
            if (input_doing === 2){
                input_doing = 1;
            }else {
                view.log("未知输入状态2："+input_doing);
            }
        }
    };
}
