<template>
    <div class="login-wrap">
        <div class="blur"></div>
        <div class="mask"></div>
    
        <div class="main">
            <div class="logo">
                <h1>
                    <Icon type="outlet"></Icon> 小商场</h1>
            </div>
            <Form ref="loginForm" :model="loginForm" class="login-form" :rules="loginRule">
                <Form-item prop="username">
                    <Input v-model="loginForm.username" placeholder="请输入用户名" class="input"></Input>
                </Form-item>
                <Form-item prop="password">
                    <Input type="password" v-model="loginForm.password" placeholder="请输入密码" class="input"></Input>
                </Form-item>
                <Button type="primary" :long="true" @click="login('loginForm')">登录</Button>
            </Form>
            <div class="other">
                <a href="javascript:;" class="skip-login" @click="goHome">跳过登陆</a>
                <a href="javascript:;" class="go-register" @click="goRegister">新用户注册</a>
            </div>
    
            <span class="bottom-msg">登录即代表阅读并同意
                <a href="#!">服务条款</a>
            </span>
        </div>
    
    </div>
</template>
<script>
import apis from '../../util.js'
export default {
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRule: {
                username: [
                    {
                        required: true, trigger: 'blur', message: '用户名不能为空'
                    }
                ],
                password: [
                    { required: true, trigger: 'blur', message: '密码不能为空' },
                    { min: 3, max: 15, message: '请输入3-15位密码', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {

    },
    created() {

    },
    beforeRouteEnter(to, from, next) {
        if (apis.readFromLocal().username) {//只要localstorage存在用户id就是登录
            next('/home')//去首页
        }
        next()
    },
    methods: {
        login(name) {
            let _this = this;
            this.$refs[name].validate(function (valid) {
                if (valid) {//登录
                    let form = _this.loginForm;
                    _this.$http.post(apis.login, form).then(res => {
                        let data = res.data;
                        let user = {}

                        if (data.success) {
                            user.username = data.user['用户名'];
                            user.isAdmin = data.user['管理员'];
                            user.isSeller = data.user['商家'];
                            _this.$Message.success('登录成功');
                            apis.saveToLocal(user);
                            setTimeout(() => {
                                _this.$router.push('/home');//跳转到home
                            }, 1000)
                        } else {
                            _this.$Message.error(data.msg);
                        }
                    }).catch(err => {
                        // _this.$Notice.error({
                        //     title: '登录失败',
                        //     desc: err.message
                        // });
                        console.log(err);
                    })

                }
            })
        },
        goRegister() {
            this.$router.push('/register');
        },
        goHome() {
            this.$router.push('/home');
        }
    }
}
</script>
<style lang="scss">
.login-wrap {
    .blur {
        background: url('../../assets/back.jpg') no-repeat;
        background-size: cover;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 0;
    }
    .mask {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
    }
    .main {
        height: 100vh;
        position: relative;
        display: flex;
        padding: 1.5rem;
        flex-direction: column;
        .logo {
            margin-top: 5rem;
            h1 {
                color: #fff;
                font-weight: normal;
                font-size: 1.2rem;
            }
        }
        .login-form {
            margin-top: 3rem;
            .input {
                input {
                    background: transparent;
                    color: #fff;
                    padding: 1rem 0.5rem;
                }
            }
        }
        .other {
            display: flex;
            justify-content: space-between;
            margin-top: 1rem;
            a {
                color: #fff;
            }
        }

        .bottom-msg {
            color: #fff;
            align-self: center;
            margin-top: 14.5rem;
        }
    }
}
</style>