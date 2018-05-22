const express = require("express");
const sql = require("mssql")
const sqlConfig = require("../config/sqlserverConfig")
const util = require('./util')
let router = express.Router();
//管理员修改用户的权限
//获取全部用户信息
router.get('/users', function (req, res) {
    sql.connect(sqlConfig.constr).then(function () {
        //获取用户
        new sql.Request().query('select * from [User]')
            .then(record => {
                res.json(record);
                sql.close();
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '查询用户信息失败',
                    err: err
                })
            })
    }).catch(err => {
        if (err) {
            res.json({
                success: false,
                msg: '连接数据库失败'
            })
            sql.close();
        }
    })
})
//获取单个用户信息
router.get('/user', function (req, res) {
    let username = req.query.username;
    util.checkUsername(username, function (exist) {
        if (exist) {
            //用户存在，查询信息
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`select * from [User] where 用户名='${username}'`)
                    .then(record => {
                        res.json({
                            success: true,
                            data: record.recordset
                        });
                        sql.close();
                    }).catch(err => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: '查询失败'
                            })

                        }
                        sql.close();
                    })
            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: '连接数据库失败',
                        err: err
                    })
                }
            })
        } else {
            //用户不存在
            res.json({
                success: false,
                msg: '用户不存在'
            })
        }
    })
})
//添加用户
router.post('/adduser', function (req, res) {
    let userInfo = req.body;
    //添加用户必须包括全部信息
    util.checkUsername(userInfo.username, function (exist) {
        if (exist) {
            res.json({
                success: false,
                msg: '用户名已存在'
            })
        } else { //用户不存在，可以注册,且校验工作前端已完成
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`insert into [User] values('${userInfo.username}','${userInfo.password}','${userInfo.isAdmin}','${userInfo.isSeller}','0')`)
                    .then(function (record) {
                        sql.close();
                        if (record.rowsAffected[0] == 1) {
                            res.json({
                                success: true,
                                msg: '添加用户成功'
                            })
                        } else {
                            res.json({
                                success: false,
                                msg: '添加用户失败'
                            })
                        }
                    }).catch(err => {
                        if (err) {
                            sql.close();
                            throw err;

                        }
                    })
            }).catch(err => {
                if (err) {
                    res.json(err);
                    sql.close();
                }
            })
        }
    })
})
//删除用户
router.post('/deleteuser', function (req, res) {
    let username = req.body.username;
    util.checkUsername(username, function (exist) {
        if (exist) {
            //用户存在，可以删除
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`delete from [User] where 用户名='${username}'`)
                    .then(
                        function () {
                            //把所有和此用户相关的物品删除
                            //删除相关订单，防止修改用户名之后订单异常
                            new sql.Request().query(`delete from [Order] where username='${username}'`)
                                .then(function () {
                                    //删除用户的购物车信息,防止用户更名之后购物车异常
                                    new sql.Request().query(`delete from [Cart] where 用户名='${username}'`)
                                        .then(function () {
                                            //删除购物车商家的商品，防止添加近订单后支付异常
                                            new sql.Request().query(`delete from [Cart] where 商家='${username}'`)
                                                .then(function () {
                                                    // 把卖家删除后相关订单中的物品删除，防止支付错误
                                                    new sql.Request().query(`delete from [OrderThing] where seller='${username}'`)
                                                        .then(function () {
                                                            // 把商家删除后的相关商品删除，防止获取信息错误
                                                            new sql.Request().query(`delete from [Thing] where 商家='${username}'`)
                                                                .then(function () {
                                                                    res.json({
                                                                        success: true,
                                                                        msg: '删除用户成功'
                                                                    })
                                                                    sql.close();
                                                                })
                                                        })
                                                })
                                        })
                                })
                        }
                    )
            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: err.message

                    })
                }
                sql.close();
            })
        } else {
            //用户不存在
            res.json({
                success: false,
                msg: '用户不存在'
            })
        }
    })
})
//修改用户信息
router.post('/updateuser', function (req, res) {
    let userInfo = req.body;
    //必须包含所有信息+原来用户名
    if (userInfo.currentName == userInfo.username) {
        //用户名不变
        sql.connect(sqlConfig.constr).then(function () {
            new sql.Request().query(`update [User] set 用户名='${userInfo.username}',密码='${userInfo.password}',管理员='${userInfo.isAdmin}',商家='${userInfo.isSeller}',余额='${userInfo.leftmoney}' where 用户名='${userInfo.currentName}'`)
                .then(function (record) {
                    if (record.rowsAffected[0] == 1) {
                        res.json({
                            success: true,
                            msg: '修改信息成功',
                            userinfo: userInfo
                        })

                    } else {
                        res.json({
                            success: false,
                            msg: '修改信息失败',
                            userinfo: userInfo
                        })
                    }
                    sql.close();
                })
        }).catch(err => {
            if (err) {
                res.json({
                    msg: '连接数据库失败',
                    success: false,
                    err: err
                })
                sql.close();
            }
        })
    } else {
        util.checkUsername(userInfo.username, function (exist) {
            if (!exist) {
                sql.connect(sqlConfig.constr).then(function () {
                    new sql.Request().query(`update [User] set 用户名='${userInfo.username}',密码='${userInfo.password}',管理员='${userInfo.isAdmin}',商家='${userInfo.isSeller}',余额='${userInfo.leftmoney}' where 用户名='${userInfo.currentName}'`)
                        .then(function (record) {
                            if (record.rowsAffected[0] == 1) {
                                new sql.Request().query(`update Thing set 商家='${userInfo.username}' where 商家='${userInfo.currentName}'`)
                                    //修改thing表
                                    .then(
                                        function () { //修改 订单物品表
                                            new sql.Request().query(`update OrderThing set seller='${userInfo.username}' where seller='${userInfo.currentName}'`)
                                                .then(function () {
                                                    //修改购物车
                                                    new sql.Request().query(`update OrderThing set seller='${userInfo.username}' where seller='${userInfo.currentName}'`)
                                                        .then(function () {
                                                            //修改购物车
                                                            new sql.Request().query(`update Cart set 用户名='${userInfo.username}' where 用户名='${userInfo.currentName}'`)
                                                                .then(function () {
                                                                    new sql.Request().query(`update Cart set 商家='${userInfo.username}' where 商家='${userInfo.currentName}'`)
                                                                        .then(function () {
                                                                            new sql.Request().query(`update [Order] set username='${userInfo.username}' where username='${userInfo.currentName}'`)
                                                                                .then(function () {
                                                                                    res.json({
                                                                                        success: true,
                                                                                        msg: '修改成功'
                                                                                    })
                                                                                    sql.close();
                                                                                })
                                                                        })
                                                                })
                                                        })
                                                })
                                        }
                                    ).catch(err => {
                                        res.json({
                                            success: false,
                                            msg: '修改失败' + err.message

                                        })
                                        sql.close();
                                    })


                            } else {
                                res.json({
                                    success: false,
                                    msg: '修改信息失败',
                                    userinfo: userInfo
                                })
                                sql.close();
                            }

                        })
                }).catch(err => {
                    if (err) {
                        res.json({
                            msg: '连接数据库失败',
                            success: false,
                            err: err
                        })
                        sql.close();
                    }
                })
            } else { //用户名不存在
                res.json({
                    success: false,
                    msg: '修改的用户名已存在，修改失败'
                })

            }
        })
    }

})
//成为卖家
router.post('/beseller', function (req, res) {
    let username = req.body.username;
    util.checkUsername(username, function (exist) {
        if (exist) {
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`update [User] set 商家='true' where 用户名='${username}'`)
                    .then(function (record) {
                        if (record.rowsAffected[0] == 1) {
                            res.json({
                                success: true,
                                msg: '已经成为商家'
                            })
                            sql.close()
                        } else {
                            res.json({
                                success: false,
                                msg: '未能成为商家'
                            })
                            sql.close()
                        }
                    }).catch(err => {
                        res.json({
                            success: false,
                            msg: err.message
                        })
                        sql.close()
                    })
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '连接数据库错误:' + err.message
                })
                sql.close()
            })
        } else {
            res.json({
                success: false,
                msg: '用户不存在'
            })

        }
    })
})

router.post('/setMoney', function (req, res) {
    let money = req.body.money;
    let username = req.body.username;
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query(`update [User] set 余额='${money}' where 用户名='${username}'`)
            .then(record => {
                if (record.rowsAffected[0] == 1) {
                    res.json({
                        success: true,
                        msg: '充值成功'
                    })
                    sql.close();
                } else {
                    res.json({
                        success: false,
                        msg: '充值失败'
                    })
                    sql.close();
                }
            })
    }).catch(err => {
        res.json({
            success: false,
            msg: '连接数据库错误' + err.message
        })
        sql.close();
    })
})
module.exports = router;