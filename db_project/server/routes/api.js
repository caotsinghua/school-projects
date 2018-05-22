const express = require("express");
const sql = require("mssql")
const sqlConfig = require("../config/sqlserverConfig")
let util = require("./util")
let router = express.Router();


//登录api
router.post('/login', function (req, res) {
    let loginMsg = req.body;
    //校验工作前端完成（接受到的值不为空）
    sql.connect(sqlConfig.constr).then(() => {
        new sql.Request()
            .query(`select * from [User] where 用户名='${loginMsg.username}' and 密码='${loginMsg.password}'`).then(record => {
                if (record.recordset.length < 1) {
                    res.json({
                        success: false,
                        msg: '请检查用户名或密码'
                    })
                } else {
                    res.json({
                        success: true,
                        msg: '登录成功',
                        user: record.recordset[0]
                    })
                }
                sql.close();
            }).catch(err => {
                if (err) {
                    console.log('查询出错');
                    sql.close();
                }
            })

    }).catch(err => {
        res.json(err);
        sql.close();
    })
})
//注册api
router.post('/register', function (req, res) {
    let registerInfo = req.body;
    util.checkUsername(registerInfo.username, function (exist) {
        if (exist) {
            res.json({
                success: false,
                msg: '用户名已存在'
            })
        } else { //用户不存在，可以注册,且校验工作前端已完成
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`insert into [User] values('${registerInfo.username}','${registerInfo.password}','0','0','0')`)
                    .then(function (record) {
                        sql.close();
                        if (record.rowsAffected[0] == 1) {
                            res.json({
                                success: true,
                                msg: '注册成功'
                            })
                        } else {
                            res.json({
                                success: false,
                                msg: '注册失败'
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
//获取全部商品信息
router.get('/things', function (req, res) {
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query('select * from [Thing]')
            .then(record => {
                res.json(record);
                sql.close();
            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: '获取商品信息失败'
                    })
                    sql.close();
                }
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
//获取单个商品信息
router.get('/getthing', function (req, res) {
    let thingId = req.query.id;
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query(`select * from Thing where id='${thingId}'`)
            .then(function (record) {
                res.json({
                    success: true,
                    record: record.recordset
                })
                sql.close();
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '获取商品信息失败'
                })
                sql.close();
            })
    }).catch(err => {
        res.json({
            success: false,
            msg: '连接数据库失败'
        })
    })
})
router.get('/getthingByType', function (req, res) {
    let thingType = req.query.type;
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query(`select * from Thing where 类别='${thingType}'`)
            .then(function (record) {
                res.json(record);
                sql.close();
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '获取商品信息失败'
                })
                sql.close();
            })
    }).catch(err => {
        res.json({
            success: false,
            msg: '连接数据库失败'
        })
    })
})
router.get('/getthingByName', function (req, res) {
    let username = req.query.username;
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query(`select * from Thing where 商家='${username}'`)
            .then(function (record) {
                res.json(record);
                sql.close();
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '获取商品信息失败'
                })
                sql.close();
            })
    }).catch(err => {
        res.json({
            success: false,
            msg: '连接数据库失败'
        })
    })
})
//添加单个商品信息
router.post('/addthing', function (req, res) {
    let thingInfo = req.body;
    //表单格式
    // let ex={
    //     id:theid,
    //     name:'',
    //     price:'',
    //     seller:'',
    //     img:'',
    //     tags:''//必须以空格分开,
    //     type:''
    // }
    util.checkThing(thingInfo.id, function (exist) {
        if (exist) {
            res.json({
                success: false,
                msg: '商品id已存在'
            })

        } else {
            //商品id不存在，可以添加信息
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`insert into Thing values('${thingInfo.id}','${thingInfo.name}','${thingInfo.price}','${thingInfo.seller}','${thingInfo.img}','${thingInfo.tags}','${thingInfo.type}')`)
                    .then(record => {
                        if (record.rowsAffected[0] == 1) { //受影响行数为1，添加一个商品成功
                            res.json({
                                success: true,
                                msg: '添加商品成功',
                                thing: thingInfo
                            })
                        } else {
                            res.json({
                                success: false,
                                msg: '添加商品失败'
                            })
                        }
                        sql.close();
                    }).catch(err => {
                        res.json({
                            success: false,
                            msg: err.message
                        })
                        sql.close();
                    })
            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: '连接数据库失败',
                        err: err
                    })
                    sql.close();
                }
            })
        }
    })
})
router.post('/updatething', function (req, res) {
    let thingInfo = req.body;
    //表单格式
    // let ex={
    //     id:theid,
    //     name:'',
    //     price:'',
    //     seller:'',
    //     img:'',
    //     tags:''//必须以空格分开,
    //     type:''
    // }
    util.checkThing(thingInfo.id, function (exist) {
        if (exist) { //商品存在
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`update Thing set 商品名称='${thingInfo.name}',价格='${thingInfo.price}',商家='${thingInfo.seller}',图片地址='${thingInfo.img}',tags='${thingInfo.tags}',类别='${thingInfo.type}' where id='${thingInfo.id}'`)
                    .then(record => {
                        if (record.rowsAffected[0] == 1) { //受影响行数为1，添加一个商品成功
                            res.json({
                                success: true,
                                msg: '修改商品成功',
                                thing: thingInfo
                            })
                        } else {
                            res.json({
                                success: false,
                                msg: '修改商品失败'
                            })
                        }
                        sql.close();
                    }).catch(err => {
                        res.json({
                            success: false,
                            msg: err.message
                        })
                        sql.close();
                    })
            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: '连接数据库失败',
                        err: err
                    })
                    sql.close();
                }
            })

        } else {
            //商品id不存在，
            res.json({
                success: false,
                msg: '要修改的数据不存在'
            })
        }
    })
})
//删除商品
router.post('/deletething', function (req, res) {
    let thingId = req.body.id;
    util.checkThing(thingId, function (exist) {
        if (exist) {
            //商品存在，可以删除
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`delete from Thing where id='${thingId}'`)
                    .then(function () {
                        new sql.Request().query(`delete from OrderThing where id='${thingId}'`)
                            .then(function () {
                                new sql.Request().query(`delete from [Cart] where id='${thingId}'`)
                                    .then(function () {
                                        res.json({
                                            success:true,
                                            msg:'删除成功'
                                        })
                                        sql.close();
                                    })
                            })
                    }).catch(err => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: '查询失败'+err.message
                            })
                        }
                    })
            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: '连接数据库失败'
                    })
                }
            })
        } else {
            res.json({
                success: false,
                msg: '商品不存在,删除失败'
            })
        }
    })
})

// 获取购物车信息
router.get('/cart', function (req, res) {
    //需要用户名
    let username = req.query.username;
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query(`select * from Cart where 用户名='${username}'`)
            .then(record => {
                res.json({
                    success: true,
                    record: record.recordset
                })
                sql.close();
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '查询失败 ' + err.message
                })
                sql.close();
            })
    }).catch(err => {
        res.json({
            success: false,
            msg: '连接数据库失败'
        })
        sql.close();
    })
})
//加入购物车
router.post('/tocart', function (req, res) {
    let item = req.body;
    util.checkCart(item.id, item.username, function (exist, num) {
        if (exist) {
            //已存在，数量加一
            num++;
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`update Cart set 数量=${num} where id='${item.id}' and 用户名='${item.username}'`)
                    .then(record => {
                        if (record.rowsAffected[0] >= 1) {
                            res.json({
                                success: true,
                                msg: '数量+1'
                            })
                        } else {
                            res.json({
                                success: false,
                                msg: '添加到购物车失败'
                            })
                        }
                        sql.close();
                    }).catch(err => {
                        res.json({
                            success: false,
                            msg: err.message
                        })
                        sql.close();
                    })
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '连接数据库失败'
                })
                sql.close();
            })

        } else {
            //不存在，添加到数据库
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`insert into Cart values('${item.id}','${item.name}','${item.price}','${item.num}','${item.username}','${item.img}','${item.seller}')`)
                    .then(record => {
                        if (record.rowsAffected[0] >= 1) {
                            res.json({
                                success: true,
                                msg: '添加到购物车成功'
                            })
                        } else {
                            res.json({
                                success: false,
                                msg: '添加到购物车失败'
                            })
                        }
                        sql.close();
                    }).catch(err => {
                        res.json({
                            success: false,
                            msg: err.message
                        })
                        sql.close();
                    })
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '连接数据库失败'
                })
                sql.close();
            })
        }
    })
})
// 从购物车中删除
router.post('/deletecart', function (req, res) {
    //必须id和用户名都一致才删除
    let deleInfo = req.body;
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query(`delete from Cart where id= '${deleInfo.id}' and 用户名='${deleInfo.username}'`)
            .then(record => {
                if (record.rowsAffected[0] == 1) {
                    res.json({
                        success: true,
                        msg: '删除成功'
                    })
                    sql.close();
                }
            }).catch(err => {
                res.json({
                    success: false,
                    msg: err.message
                })
                sql.close();
            })
    }).catch(err => {
        res.json({
            success: false,
            msg: err.message
        })
        sql.close();
    })
})

//根据用户名查询订单
router.get('/getOrder', function (req, res) {
    let username = req.query.username;
    sql.connect(sqlConfig.constr).then(function () {
        new sql.Request().query(`select * from [Order] where username='${username}'`)
            .then(function (record) {
                res.json({
                    success: true,
                    record: record.recordset
                })
                sql.close();
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '查询错误' + err.message
                })
                sql.close();
            })
    }).catch(err => {
        res.json({
            success: false,
            msg: '连接数据库失败' + err.message
        })
        sql.close();
    })
})

//根据订单id查询订单
router.get('/getOrderById', function (req, res) {
    let ordernum = req.query.ordernum;
    util.checkOrder(ordernum, function (exist) {
        if (exist) {
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`select * from OrderThing where ordernum=${ordernum}`)
                    .then(function (record) {
                        res.json({
                            success: true,
                            record: record.recordset
                        })
                        sql.close();
                    }).catch(err => {
                        res.json({
                            success: false,
                            msg: '查询错误' + err.message
                        })
                        sql.close();
                    })
            }).catch(err => {
                res.json({
                    success: false,
                    msg: '连接数据库失败' + err.message
                })
                sql.close();
            })
        } else {
            res.json({
                success: false,
                msg: '订单不存在！'
            })
        }
    })
})

function addOrderItems(orderInfo, callback) {
    let ok = false;
    orderInfo.orderthings.forEach(item => {
        new sql.Request().query(`insert into [OrderThing] values('${item.id}','${item.seller}','${item.name}','${orderInfo.ordernum}','${item.price}','${item.num}')`)
            .then(rec => {
                ok = true;
            }).catch(err => {
                ok = false;
                console.log(err.message)
                sql.close();
            })
    })

    setTimeout(function () { //延迟执行解决异步问题
        callback(ok)
        sql.close();
    }, 50);
}
router.post('/addOrder', function (req, res) {
    let orderInfo = req.body;
    util.checkOrder(orderInfo.ordernum, function (exist) {
        if (!exist) {
            //不存在订单号，添加
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`insert into [Order] values('${orderInfo.ordernum}','${orderInfo.username}','0')`)
                    .then(function (record) {
                        if (record.rowsAffected[0] == 1) { //创建了一个订单号
                            addOrderItems(orderInfo, function (ok) {
                                if (ok) {
                                    res.json({
                                        success: true,
                                        msg: '成功'
                                    })
                                } else {
                                    res.json({
                                        success: false,
                                        msg: '添加出错'
                                    })
                                }
                            })


                        } else { //失败直接退出
                            res.json({
                                success: false,
                                msg: '添加订单失败'
                            })
                            sql.close();
                            return;
                        }
                    }).catch(err => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: '数据库查询失败' + err.message
                            })
                            sql.close();
                        }

                    })

            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: '连接数据库失败' + err.message
                    })
                    sql.close();
                }
            })
        } else {
            res.json({
                success: false,
                msg: '订单号已存在，提交失败'
            })
        }
    })
})

router.post('/finishOrder', function (req, res) {
    let orderInfo = req.body;
    util.checkOrder(orderInfo.ordernum, function (exist) {
        if (exist) {
            //不存在订单号，添加
            sql.connect(sqlConfig.constr).then(function () {
                new sql.Request().query(`update [Order] set finished='1' where ordernum='${orderInfo.ordernum}'`)
                    .then(function (record) {
                        if (record.rowsAffected[0] == 1) {
                            res.json({
                                success: true,
                                msg: '订单完成'
                            })
                            sql.close();
                        } else {
                            res.json({
                                success: false,
                                msg: '订单修改出错'
                            })
                            sql.close();
                        }
                    }).catch(err => {
                        if (err) {
                            res.json({
                                success: false,
                                msg: '数据库查询失败' + err.message
                            })
                            sql.close();
                        }

                    })

            }).catch(err => {
                if (err) {
                    res.json({
                        success: false,
                        msg: '连接数据库失败' + err.message
                    })
                    sql.close();
                }
            })
        } else {
            res.json({
                success: false,
                msg: '订单号不存在，提交失败'
            })
        }
    })
})
module.exports = router;