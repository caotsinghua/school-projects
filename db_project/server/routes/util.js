const sql = require('mssql');
const sqlConfig = require('../config/sqlserverConfig')
let util = {}

util.checkUsername = function (username,callback) { //用户名是否存在
    let userExist=false;
    sql.connect(sqlConfig.constr).then(() => {
        new sql.Request().query(`select * from [User] where 用户名='${username}'`).then(data => {
            sql.close();
            if (data.recordset.length > 0) {
                userExist=true;//用户已存在
            } else {
                userExist=false;
            }
            callback(userExist);//回调函数
        }).catch(err => {
            if (err) {
                console.log(err);
                sql.close();
            }
        })
    }).catch(err => {
        sql.close();
        throw err;
    })
   
}
util.checkThing= function (id,callback) { //商品id是否存在
    let exist=false;
    sql.connect(sqlConfig.constr).then(() => {
        new sql.Request().query(`select * from Thing where id='${id}'`).then(data => {
            sql.close();
            if (data.recordset.length > 0) {
                exist=true;//shangp 已存在
            } else {
                exist=false;
            }
            callback(exist);//回调函数
        }).catch(err => {

            if (err) {//查询出错
                console.log(err);
                sql.close();
            }
        })
    }).catch(err => {
        sql.close();
        throw err;
    })
   
}
util.checkCart= function (id,username,callback) { //购物车商品id+username是否存在
    let exist=false;
    let num=0;
    sql.connect(sqlConfig.constr).then(() => {
        new sql.Request().query(`select * from Cart where id='${id}' and 用户名='${username}'`).then(data => {
            sql.close();
            if (data.recordset.length > 0) {
                exist=true;//shangp 已存在
                num=data.recordset[0]['数量'];
            } else {
                exist=false;
                num=0;
            }
            callback(exist,num);//回调函数
        }).catch(err => {

            if (err) {//查询出错
                console.log(err);
                sql.close();
            }
        })
    }).catch(err => {
        sql.close();
        throw err;
    })
   
}
util.checkOrder= function (id,callback) { //商品id是否存在
    let exist=false;
    sql.connect(sqlConfig.constr).then(() => {
        new sql.Request().query(`select * from [Order] where ordernum='${id}'`).then(data => {
            sql.close();
            if (data.recordset.length > 0) {
                exist=true;//shangp 已存在
            } else {
                exist=false;
            }
            callback(exist);//回调函数
        }).catch(err => {

            if (err) {//查询出错
                console.log(err);
                sql.close();
            }
        })
    }).catch(err => {
        sql.close();
        throw err;
    })
   
}
module.exports = util;