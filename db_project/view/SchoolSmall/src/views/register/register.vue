<template>
    <div class="register-wrap">
        <div class="blur"></div>
        <div class="mask"></div>
    
        <div class="main">
            <div class="logo">
                <h1>注册</h1>
            </div>
            <Form ref="registerForm" :model="registerForm" class="register-form" :rules="registerRule">
                <Form-item prop="username">
                    <Input v-model="registerForm.username" placeholder="请输入用户名" class="input"></Input>
                </Form-item>
                <Form-item prop="password">
                    <Input type="password" v-model="registerForm.password" placeholder="请输入密码" class="input"></Input>
                </Form-item>
                <Form-item prop="repassword">
                    <Input type="password" v-model="registerForm.repassword" placeholder="请重复输入密码" class="input"></Input>
                </Form-item>
                <Button type="primary" :long="true" @click="register('registerForm')">注册</Button>
            </Form>
            <a href="javascript:;" class="go-login" @click="goLogin">登录</a>
            <span class="bottom-msg">登录即代表阅读并同意<a href="#!">服务条款</a></span>
        </div>
    
    </div>
</template>
<script>
import apis from '../../util.js'
export default {
    data() {
        const validateRepass = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请再次输入密码'))
            } else if (value != this.registerForm.password) {
                callback(new Error('两次密码输入不一致'))
            } else {
                callback();
            }
        }
        return {
            registerForm: {
                username: '',
                password: '',
                repassword: ''
            },
            registerRule: {
                username: [
                    {
                        required: true, trigger: 'blur', message: '用户名不能为空'
                    }
                ],
                password: [
                    { required: true, trigger: 'blur', message: '密码不能为空' },
                    { min: 3, max: 15, message: '请输入3-15位密码', trigger: 'blur' }
                ],
                repassword: [
                    { validator: validateRepass, trigger: 'blur' }
                ]
            }
        }
    },
    computed: {

    },
    methods: {
        register(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {//登录
                    console.log('ok')
                    let form = this.registerForm;
                    this.$http.post(apis.register,form).then(res=>{
                        let data=res.data;
                        if(data.success){
                            this.$Message.success('注册成功');
                            setTimeout(()=>{
                                 this.$router.push('/home');//跳转到home，并记录登录信息
                            },1000)
                        }else{
                            this.$Message.error(data.msg);
                        }
                    }).catch(err=>{
                         this.$Notice.error({
                            title: '注册失败',
                            desc: err.message
                        });
                    })
                    
                }
            })
        },
        goLogin() {
            this.$router.push('/login')
        }
    }
}
</script>
<style lang="scss">
.register-wrap {
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
            }
        }
        .register-form {
            margin-top: 3rem;
            .input {
                input {
                    background: transparent;
                    color: #fff;
                    padding: 1rem 0.5rem;
                }
            }
        }
        .go-login {
            align-self: flex-end;
            display: block;
            margin-top: 1rem;
        }
        .bottom-msg {
            color: #fff;
            align-self: center;
            margin-top: 13rem;
        }
    }
}
</style>