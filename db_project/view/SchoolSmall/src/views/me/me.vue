<template>
    <div class="me">
        <header class="header">
            <div class="control">
                <div @click="editUser">
                    <Icon type="gear-a"></Icon>
                </div>
                <div @click="logout">
                    <Icon type="log-out"></Icon>
                </div>
            </div>
            <div class="userinfo">
                <img :src="userinfo.avatar" class="avatar">
                <p class="username">{{userinfo.username}}</p>
                <div class="admin">
                    <Icon type="android-person"></Icon>
                    <span v-if="userinfo.isAdmin">管理员</span>
                    <span v-else-if="userinfo.isSeller&&!userinfo.isAdmin">商家</span>
                    <span v-else>普通用户</span>
                </div>
                <div class="left-money" @click="openAddMoney">
                    <Icon type="social-yen-outline"></Icon>
                    <span>余额</span>
                    <span>{{userinfo.leftmoney}} </span>
                </div>
            </div>
        </header>
        <main>
            <ul class="menu">
                <li class="menu-item" @click="userManager" v-show="this.userinfo.isAdmin">
                    <Icon type="ios-people-outline"></Icon>
                    <p>用户管理</p>
                </li>
                <li class="menu-item" @click="thingManager" v-show="this.userinfo.isAdmin||this.userinfo.isSeller">
                    <Icon type="ios-infinite-outline"></Icon>
                    <p>商品管理</p>
                </li>
                <li class="menu-item" @click="beSeller" v-show="!this.userinfo.isSeller">
                    <Icon type="ios-personadd-outline"></Icon>
                    <p>成为卖家</p>
                </li>
                <li class="menu-item" @click="myOrder">
                    <Icon type="ios-list-outline"></Icon>
                    <p>我的订单</p>
                </li>
            </ul>
        </main>
        <Modal v-model="modal_updateuser" width="360">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span>修改用户信息</span>
            </p>
            <div>
                <Form ref="updateForm" :model="updateForm" label-position="left" :label-width="80" :rules="rule">
                    <Form-item label="用户名" prop="username">
                        <Input v-model="updateForm.username"></Input>
                    </Form-item>
                    <Form-item label="密码" prop="password">
                        <Input v-model="updateForm.password"></Input>
                    </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button type="success" @click="updateUser('updateForm')">确定</Button>
            </div>
        </Modal>
        <Modal v-model="modal_beseller" width="360">
            <div>
                <p style="text-alignm:center;color:#ed3f14">想知道生命的意义吗?想……真正的活着吗?!</p>
            </div>
            <div slot="footer">
                <Button type="error" @click="yestobeSeller">确定</Button>
                <Button type="success" @click="cancle">取消</Button>
            </div>
        </Modal>
        <Modal v-model="modal_addmoney" width="360">
            <p slot="header" style="text-align:center">
                <Icon type="information-circled"></Icon>
                <span>充值金币</span>
            </p>
            <div>
                <Input v-model="addmoney" placeholder="输入金额"></Input>
            </div>
            <div slot="footer">
                <Button type="error" @click="addMoney">确定</Button>
                <Button type="success" @click="cancle">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import util from '../../util.js'
export default {
    data() {
        return {
            userinfo: {
                username: '',
                avatar: 'https://avatars1.githubusercontent.com/u/15075816?v=3&s=460',
                isAdmin: false,
                isSeller: false
            },
            updateForm: {
                username: '',
                password: '',
            },
            rule: {
                username: [{ required: true, message: '用户名呢？', trigger: 'blur' }],
                password: [{ required: true, message: '密码呢？', trigger: 'blur' },
                { min: 3, max: 15, message: '密码3-15位', trigger: 'blur' }],
            },
            modal_updateuser: false,
            modal_beseller: false,
            modal_addmoney: false,
            addmoney: 0,
        }
    },
    created() {
        this.getUserInfo();

    },
    methods: {
        getUserInfo() {
            //获取用户信息
            let user = util.readFromLocal();

            if (user.username) {//用户名存在，即用户已经登录,判断该用户名是否有效
                this.$http.get(util.getUser, {
                    params: {
                        username: user.username
                    }
                }).then(res => {
                    if (res.data.success) {

                        if (res.data.data[0]['用户名'] = user.username) {
                            this.userinfo.username = res.data.data[0]['用户名'];
                            this.userinfo.isAdmin = res.data.data[0]['管理员'];
                            this.userinfo.isSeller = res.data.data[0]['商家'];
                            this.userinfo.leftmoney = res.data.data[0]['余额'];
                            util.saveToLocal(this.userinfo);
                        } else {
                            this.$Message.error('没有当前用户！');
                            this.$router.push('/register')
                        }
                    } else {
                        this.$Message.error('没有当前用户！');
                        this.$router.push('/register')
                    }

                }).catch(err => {
                    this.$Message.error(err.message);
                })
            } else {
                this.$Message.error('去登陆！！');
                this.$router.push('/login')
            }
        },
        userManager() {
            //先判断权限
            if (this.userinfo.isAdmin) {
                this.$router.push('/usermanager');
            } else {
                this.$Notice.error({
                    title: '权限不足',
                    desc: '你不是管理员'
                })
            }

        },
        thingManager() {
            if (this.userinfo.isAdmin || this.userinfo.isSeller) {
                this.$router.push('/thingmanager');
            } else {
                this.$Notice.error({
                    title: '权限不足',
                    desc: '你不是管理员或商家'
                })
            }
        },
        editUser() {
            //修改用户信息
            this.modal_updateuser = true;

        },
        updateUser(name) {
            let form = {};
            form.username = this.updateForm.username;
            form.password = this.updateForm.password;
            form.isAdmin = this.userinfo.isAdmin;
            form.isSeller = this.userinfo.isSeller;
            form.currentName = this.userinfo.username;
            form.leftmoney = this.userinfo.leftmoney;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$http.post(util.updateUser, form).then(res => {

                        if (res.data.success) {
                            this.$Message.success(res.data.msg+' 请重新登录');

                            this.$refs[name].resetFields();
                            this.modal_updateuser = false;
                            //修改成功，冲新登录
                            util.logOut()
                            this.$router.push('/login');
                        } else {
                            this.$Message.warning(res.data.msg);

                        }

                    }).catch(err => {
                        console.log(err);
                        this.$Message.error(err.message);

                    })

                } else {
                    this.$Message.error('表单验证失败!');
                }
            })
        },
        logout() {
            //登出
            util.logOut();
            this.$router.push('/login');
        },
        beSeller() {
            this.modal_beseller = true;
        },
        myOrder() {
            this.$router.push({
                name: 'Order',

                params: {
                    leftmoney: this.userinfo.leftmoney
                }

            });
        },
        cancle() {
            this.modal_beseller = false;
            this.modal_addmoney = false;
            this.modal_updateuser = false;
        },
        yestobeSeller() {
            this.$http.post(util.beSeller, {
                username: this.userinfo.username
            }).then(res => {
                if (res.data.success) {
                    this.$Message.success(res.data.msg)
                    this.modal_beseller = false;
                    this.getUserInfo();
                } else {
                    this.$Message.error(res.data.msg)
                }
            }).catch(err => {
                this.$Message.error(err.message)
            })
        },
        openAddMoney() {
            this.modal_addmoney = true;
        },
        addMoney() {
            let money = this.addmoney;
            let passmoney = this.userinfo.leftmoney;
            let testM = /^[0-9]*$/;
            if (!testM.test(money)) {
                this.$Message.error('请输入数字');
                return;
            } else {
                //设置金额
                let m = parseFloat(money) + parseFloat(passmoney);
                this.$http.post(util.setMoney, {
                    money: m,
                    username: this.userinfo.username
                }).then(res => {
                    if (res.data.success) {
                        this.$Message.success(res.data.msg);
                        this.getUserInfo()
                        this.modal_addmoney = false;
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                }).catch(err => {
                    this.$Message.error(err.message);
                })
                this.modal_addmoney = false;
            }
        }
    }
}
</script>
<style lang="scss">
.me {
    width: 100%;
    height: 100vh;
    background: rgb(250, 250, 250);
    .header {
        width: 100%;
        padding: 0 0 2rem 0;
        background-image: -webkit-linear-gradient(to right, #3091f2, deepskyblue, lightblue);
        background-image: linear-gradient(to right, #3091f2, deepskyblue, lightblue);

        .control {
            height: 3rem;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            i {
                font-size: 1.5rem;
                color: #fff;
                padding: 0.5rem;
            }
        }
        .userinfo {
            display: flex;
            align-items: center;
            padding: 0 0 0 2rem;
            position: relative;
            .avatar {
                width: 4.5rem;
                height: 4.5rem;
                border-radius: 50%;
                border: 1px solid #fff;
            }
            .username {
                font-size: 1.4rem;
                color: #fff;
                margin-left: 1rem;
            }
            .admin {
                color: #ed3f14;
                margin-left: 1rem;
                i {
                    font-size: 1.2rem;
                }
            }
            .left-money {
                height: 1.4rem;
                padding: 0 0.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 6rem;
                background-image: -webkit-linear-gradient(to right, rgb(243, 176, 21), rgb(255, 88, 2));
                background-image: linear-gradient(to right, rgb(243, 176, 21), rgb(255, 88, 2));
                border-radius: 20px 0 0 20px;
                position: absolute;
                color: #fff;
                right: 0;
                transition: .3s ease;
                &:active {
                    background-image: -webkit-linear-gradient(to bottom, rgb(243, 176, 21), rgb(255, 88, 2));
                    background-image: linear-gradient(to bottom, rgb(243, 176, 21), rgb(255, 88, 2));
                    color: #eee;
                }
            }
        }
    }
    main {
        .menu {
            .menu-item {
                display: flex;
                align-items: center;
                background: #fff;
                padding: 1rem;
                margin: 1rem 0;
                font-size: 1.1rem;
                transition: .3s linear;
                &:active {
                    background: #ccc;
                    color: #fff;
                }
                p {
                    margin-left: 1rem;
                }
                i {
                    font-size: 1.3rem;
                    color: blueviolet;
                }
            }
        }
    }
}
</style>
