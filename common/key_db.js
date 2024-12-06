// 键值对 indexed DB

// 连接数据库，获取表对象
let KeyDB; // 数据库
function init_KeyDB(){
    try{
        // 连接数据库
        KeyDB = new Dexie(app_class+"KeyDBContent");
        // 声明 表+表字段
        KeyDB.version(1).stores({
            key_db: `
            key_id,
            user_id,
            key,
            value
        `
        });
    }catch (e){
        view.notice_txt("DB数据库未能正确识别！<br/>请刷新页面或重启程序", 3000);
    }
}

// 读
function get_KeyDB(key, user_id){
    let DB = KeyDB.key_db;
    return DB.where({key: key, user_id: user_id}).toArray().then((res)=>{
        view.log("查询完成list=", res);
        return res;
    });
}

// 写
function update_KeyDB(key_id, key, user_id, value){
    let DB = KeyDB.key_db;
    let data;
    view.log("update_KeyDB=", [key_id, key, user_id, value]);
    if (!key_id) { // add
        return DB.where({key: key, user_id: user_id}).toArray().then((res)=>{
            if (res.length>0){
                key_id = res[res.length-1].key_id*1; // 取自己，则更新id最大的数据
                //
                data = {
                    key_id: key_id,
                    key: key,
                    user_id: user_id,
                    value: value,
                };
                // 目标表 插入/更新数据
                return DB.bulkPut([data]).then((res)=>{
                    // console.log("成功插入数据3=", res, data);
                    return [res, key_id];
                });
            }else{ // 查询全部
                DB.toArray().then((res)=>{
                    if (res.length>0){
                        key_id = res[res.length-1].key_id*1+1; // 取最后一条数据+1，设置自增主键值
                    }else{
                        key_id = 1; // 从请开始
                    }
                    //
                    data = {
                        key_id: key_id,
                        key: key,
                        user_id: user_id,
                        value: value,
                    };
                    // 目标表 插入/更新数据
                    return DB.bulkPut([data]).then((res)=>{
                        // console.log("成功插入数据1=", res, data);
                        return [res, key_id];
                    });
                });
            }
        });
    }else {
        data = {
            key_id: key_id,
            key: key,
            user_id: user_id,
            value: value,
        };
        // 目标表 插入/更新数据
        return DB.bulkPut([data]).then((res)=>{
            // console.log("成功插入数据2=", res, data);
            return [res, key_id];
        });
    }
}

// del
function del_KeyDB(key_id, key, user_id){
    let DB = KeyDB.key_db;
    return DB.where({key_id: key_id, key: key, user_id: user_id}).delete().then((res)=>{
        view.log("删除数据num=", res);
        return res;
    });
}
